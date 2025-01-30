import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./payment.style.js";
import images from "../../constants/icons.js";
import { useNavigation } from "@react-navigation/native";
import ButtonPayment from "../../components/button_payment/button_payment.jsx";
import { useRoute } from "@react-navigation/native";
import api from "../../constants/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import QRCode from "qrcode";
import { crc16ccitt } from "crc";

const Payment = () => {
  const navigation = useNavigation(); // Hook para acessar a navegação
  const { companyId } = useAuth(); // Acesse o companyId do contexto de autenticação
  const { authToken } = useAuth();
  const { employeeId } = useAuth();
  const { clearCart } = useCart(); // Acesse a função clearCart do contexto

  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");

  // Pega os parâmetros da navegação
  const route = useRoute();
  const { customer, cartItems } = route.params || {}; // Recebe os itens do carrinho
  console.log("employeeId na tela de pagamento:", employeeId);

  // Função para calcular subtotal (sem taxas)
  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      item.quantity *
        parseFloat(
          item.price.replace("R$", "").replace(",", ".").replace(" ", "")
        ),
    0
  );

  // O total será apenas o subtotal
  const total = subtotal;

  // Função para enviar a venda para a API
  const handleFinalizeSale = async () => {
    console.log("Finalizar Venda clicado");

    if (!companyId) {
      Alert.alert("Erro", "O ID da empresa não foi fornecido.");
      return;
    }

    if (!authToken) {
      Alert.alert("Erro", "Token de autenticação não encontrado.");
      return;
    }

    const customerId = customer?.id_client || null;
    if (customer && !customerId) {
      Alert.alert("Erro", "Os dados do cliente não estão disponíveis.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      Alert.alert("Erro", "Não há produtos no carrinho.");
      return;
    }

    const validEmployeeId = parseInt(employeeId, 10);
    if (isNaN(validEmployeeId)) {
      Alert.alert("Erro", "ID do funcionário inválido.");
      return;
    }

    Alert.alert(
      "Finalizar Venda",
      "Escolha uma opção para finalizar a venda:",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Finalizar com Pix",
          onPress: async () => {
            try {
              console.log("Gerando código Pix...");
              const pixCode = await generatePixCode(); // Gera o código Pix

              if (!pixCode) {
                throw new Error("Código Pix não gerado.");
              }

              console.log("Código Pix gerado:", pixCode);

              // Finaliza a venda COM Pix
              await processSale(customerId, validEmployeeId, pixCode);

              // Enviar código Pix via WhatsApp
              sendPixToWhatsApp(customer, pixCode, total);
            } catch (error) {
              console.error("Erro ao gerar o código Pix:", error);
              Alert.alert("Erro", "Falha ao gerar o QR Code Pix.");
            }
          },
        },
        {
          text: "Finalizar sem Pix",
          onPress: async () => {
            try {
              console.log("Finalizando venda sem Pix...");
              await processSale(customerId, validEmployeeId, null);
            } catch (error) {
              console.error("Erro ao finalizar a venda sem Pix:", error);
            }
          },
        },
      ]
    );
  };

  const processSale = async (customerId, validEmployeeId, pixCode = null) => {
    try {
      const saleData = cartItems.map((item) => ({
        company_id: companyId,
        product_id: item.id,
        id_client: customerId,
        employee_id: validEmployeeId,
        quantity: parseFloat(item.quantity) || 1,
        total_price: parseFloat(item.price) || 0,
        sale_date: new Date().toISOString(),
        tipovenda: pixCode ? 2 : 1, // Define o tipo de venda (1=Normal, 2=Pix)
      }));

      console.log("Enviando dados da venda:", saleData);

      const response = await api.post(`/sales/${companyId}`, saleData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 201) {
        Alert.alert("Venda finalizada!", "A venda foi registrada com sucesso.");
        clearCart();
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "DrawerScreen",
              params: {
                saleData,
                customer: null,
                cartItems: [],
                total: 0,
                subtotal: 0,
              },
            },
          ],
        });
      } else {
        Alert.alert("Erro", "Houve um problema ao registrar a venda.");
      }
    } catch (error) {
      console.error("Erro ao processar a venda:", error);
      Alert.alert("Erro", "Não foi possível concluir a venda.");
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(qrCodeData);
    Alert.alert(
      "Código Copiado",
      "O código Pix foi copiado para a área de transferência."
    );
  };

  const sendPixToWhatsApp = async (customer, qrCodeData, total) => {
    const phoneNumber = customer.phone.replace(/\D/g, "");

    // Primeira mensagem com explicação
    const message1 = `Olá ${
      customer.name
    }, segue o código Pix para pagamento.\n\nTotal: R$ ${total.toFixed(
      2
    )}\n\nCopie o código Pix na próxima mensagem.`;
    const whatsappUrl1 = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message1
    )}`;

    // Segunda mensagem com o código Pix
    const message2 = qrCodeData;
    const whatsappUrl2 = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message2
    )}`;

    try {
      // Envia a primeira mensagem
      await Linking.openURL(whatsappUrl1);
      setTimeout(async () => {
        // Aguarda um pequeno tempo e envia a segunda mensagem com o código Pix
        await Linking.openURL(whatsappUrl2);
      }, 3000); // Espera 3 segundos antes de enviar a segunda mensagem
    } catch (err) {
      console.error("Erro ao abrir o WhatsApp:", err);
    }
  };

  const generatePixCode = async () => {
    try {
      // 🔹 Dados do Pix
      const receiverName = customer.name.toUpperCase().substring(0, 25); // Nome do recebedor (máx. 25 caracteres)
      const value = total.toFixed(2).replace(".", ""); // Valor do pagamento (sem ponto)
      const city = "CIDADE".toUpperCase().substring(0, 15); // Cidade do recebedor (máx. 15 caracteres)
      const key = "chave_pix_recebedor"; // Chave Pix do recebedor
      const txid = "123456789"; // ID da transação (pode ser ***)

      // 🔹 Construção do Payload Pix (Padrão EMV)
      let pixPayload =
        "000201" + // Payload format indicator
        "010211" + // Merchant account information
        "26" +
        (
          "0014BR.GOV.BCB.PIX" +
          "01" +
          key.length.toString().padStart(2, "0") +
          key
        ).length
          .toString()
          .padStart(2, "0") +
        "0014BR.GOV.BCB.PIX" +
        "01" +
        key.length.toString().padStart(2, "0") +
        key +
        "52040000" + // MCC fixo
        "5303986" + // Moeda (986 = BRL)
        "54" +
        value.length.toString().padStart(2, "0") +
        value + // Valor do pagamento
        "5802BR" + // País (BR)
        "59" +
        receiverName.length.toString().padStart(2, "0") +
        receiverName + // Nome do recebedor
        "60" +
        city.length.toString().padStart(2, "0") +
        city + // Cidade do recebedor
        "62" +
        (txid.length + 4).toString().padStart(2, "0") +
        "05" +
        txid.length.toString().padStart(2, "0") +
        txid + // ID transação
        "6304"; // Checksum CRC16

      // 🔹 Cálculo correto do CRC16-CCITT
      const crc = calculateCRC16(pixPayload);
      pixPayload += crc; // Adiciona o CRC16 ao final

      // 🔹 Atualiza o estado com o QR Code gerado
      setQrCodeData(pixPayload);
      setShowQRCode(true);

      return pixPayload;
    } catch (error) {
      console.error("Erro ao gerar o código Pix:", error);
      Alert.alert("Erro", "Falha ao gerar o QR Code Pix.");
      return null;
    }
  };

  // 🔹 Função corrigida para calcular o CRC16-CCITT corretamente
  const calculateCRC16 = (payload) => {
    let crc = 0xffff;
    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
      }
    }
    return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
  };

  // Função separada para envio do Pix pelo WhatsApp
  /*const sendPixToWhatsApp = async (customer, qrCodeData, total) => {
    const phoneNumber = customer.phone.replace(/\D/g, "");

    // Primeira mensagem com explicação
    const message1 = `Olá ${
      customer.name
    }, segue o código Pix para pagamento.\n\nTotal: R$ ${total.toFixed(
      2
    )}\n\nCopie o código Pix na próxima mensagem.`;
    const whatsappUrl1 = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message1
    )}`;

    // Segunda mensagem apenas com o código Pix
    //const message2 = `Código Pix:\n${qrCodeData}`;
    const message2 = qrCodeData;
    const whatsappUrl2 = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message2
    )}`;

    try {
      // Envia a primeira mensagem
      await Linking.openURL(whatsappUrl1);
      setTimeout(async () => {
        // Aguarda um pequeno tempo e envia a segunda mensagem com o código Pix
        await Linking.openURL(whatsappUrl2);
      }, 3000); // Espera 3 segundos antes de enviar a segunda mensagem
    } catch (err) {
      console.error("Erro ao abrir o WhatsApp:", err);
    }
  };*/
  /* const generatePixCode = async () => {
    try {
      // Dados do pagamento Pix
      const receiverName = customer.name; // Nome do recebedor
      const value = total.toFixed(2); // Valor do pagamento
      const city = "CIDADE"; // Cidade do recebedor
      const key = "chave_pix_recebedor"; // Chave Pix do recebedor (pode ser CPF, CNPJ, e-mail, ou telefone)

      // Formatação do Payload Pix

      const pixPayload = `00020101021126140014BR.GOV.BCB.PIX0114${key}5204000053039865802BR5913${receiverName}6010${city}6108${value}62070503${key}6304`;
      // Exemplo de payload
      const payload = `00020101021126...5204000053039865802BR5913${receiverName}6010${city}6108${value}62070503`;

      // Para fins de exemplo, o código é uma string concatenada
      setQrCodeData(pixPayload.trim()); // Atualiza o estado com o QR Code gerado
      setShowQRCode(true); // Mostra o QR Code na tela

      return pixPayload; // Retorna o código Pix gerado
    } catch (error) {
      console.error("Erro ao gerar o código Pix:", error);
      Alert.alert("Erro", "Falha ao gerar o QR Code Pix.");
      return null;
    }
  };*/

  /*const generatePixCode = async () => {
    try {
      // Dados do pagamento Pix
      const receiverName = customer.name; // Nome do recebedor
      const value = total.toFixed(2); // Valor do pagamento
      const city = "CIDADE"; // Cidade do recebedor

      // Dados obrigatórios para o código Pix
      const pixPayload = `00020101021126...5204000053039865802BR5913${receiverName}6010${city}6108${value}62070503`;

      // Para fins de exemplo, o código é uma string concatenada
      // Você pode adicionar as informações conforme a necessidade, como CPF/CNPJ, nome da empresa, etc.

      setQrCodeData(pixPayload.trim()); // Atualiza o estado com o QR Code gerado
      setShowQRCode(true); // Mostra o QR Code na tela

      return pixPayload; // Retorna o código Pix gerado
    } catch (error) {
      console.error("Erro ao gerar o código Pix:", error);
      Alert.alert("Erro", "Falha ao gerar o QR Code Pix.");
      return null;
    }
  };*/

  return (
    <View style={styles.container}>
      {/* Marca d'água */}
      <Image
        source={images.beelogin}
        style={styles.watermark}
        resizeMode="contain"
        opacity={0.1} // Ajuste para o efeito de marca d'água
      />

      {/* Banner */}
      <View style={styles.banner}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>

        <Ionicons
          style={styles.icone}
          name="card-outline"
          size={24}
          color="#FFF"
        />
        <Text style={styles.text}>Pagamento</Text>
      </View>

      {/* Exibir Nome do Cliente apenas se definido */}
      {customer && (
        <View style={styles.customerBanner}>
          <Text style={styles.customerText}>Cliente: {customer.name}</Text>
        </View>
      )}

      {/* Resumo do Pedido */}
      <View style={styles.orderSummary}>
        <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
        <FlatList
          data={cartItems} // Usando os itens do carrinho
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <View style={styles.itemInfoContainer}>
                <Text style={styles.itemName}>
                  {item.quantity}x R${" "}
                  {parseFloat(
                    item.price.replace("R$", "").replace(",", ".")
                  ).toFixed(2)}{" "}
                  - {item.name}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                R${" "}
                {(
                  parseFloat(item.price.replace("R$", "").replace(",", ".")) *
                  item.quantity
                ).toFixed(2)}
              </Text>
            </View>
          )}
        />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.value}>R$ {subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Botão de Confirmar Pagamento */}
      <View style={styles.containerbtn}>
        <ButtonPayment
          text=" Finalizar Venda"
          icon="card-outline" // Passando o ícone de imagem
          iconColor="#fff" // Cor do ícone, caso queira customizar
          onPress={handleFinalizeSale}
          style={styles.paymentButton}
        />
      </View>
    </View>
  );
};

export default Payment;
