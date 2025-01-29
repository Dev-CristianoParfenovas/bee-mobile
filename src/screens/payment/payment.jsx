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
import QRCode from "react-native-qrcode-svg";

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

    // Verificar se o ID da empresa está presente
    if (!companyId) {
      Alert.alert("Erro", "O ID da empresa não foi fornecido.");
      return;
    }

    // Verificar se o token de autenticação está presente
    if (!authToken) {
      Alert.alert("Erro", "Token de autenticação não encontrado.");
      return;
    }

    // Verificar se o cliente está definido e se o ID está correto
    const customerId = customer?.id_client || null; // Encadeamento opcional para evitar erros
    if (customer && !customerId) {
      Alert.alert("Erro", "Os dados do cliente não estão disponíveis.");
      return;
    }

    // Verificar se há itens no carrinho
    if (!cartItems || cartItems.length === 0) {
      Alert.alert("Erro", "Não há produtos no carrinho.");
      return;
    }

    // Validar o ID do funcionário
    const validEmployeeId = parseInt(employeeId, 10);
    if (isNaN(validEmployeeId)) {
      Alert.alert("Erro", "ID do funcionário inválido.");
      return;
    }

    // Confirmar se o usuário deseja gerar o QR Code Pix
    Alert.alert(
      "Gerar Código Pix",
      "Deseja gerar um código Pix antes de finalizar a venda?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Gerar Pix",
          onPress: async () => {
            try {
              await generatePixCode(); // Gerar e exibir QR Code
            } catch (error) {
              console.error("Erro ao gerar o código Pix:", error);
              Alert.alert("Erro", "Falha ao gerar o QR Code Pix.");
              return;
            }
            // Após gerar o Pix, continua a finalização da venda
            await processSale(customerId, validEmployeeId);
          },
        },
        {
          text: "Finalizar sem Pix",
          onPress: async () => {
            // Continua com a finalização sem gerar Pix
            await processSale(customerId, validEmployeeId);
          },
        },
      ]
    );
  };

  const processSale = async (customerId, validEmployeeId) => {
    try {
      // Criar os dados da venda
      const saleData = cartItems.map((item) => {
        const productId = item.id;
        if (!productId) {
          throw new Error(`ID do produto inválido: ${JSON.stringify(item)}`);
        }

        let quantity = parseFloat(item.quantity);
        if (isNaN(quantity) || quantity <= 0) {
          throw new Error(`Quantidade inválida: ${item.quantity}`);
        }
        quantity = Math.round(quantity * 100) / 100; // Arredondar para 2 casas decimais

        const totalPrice = parseFloat(item.price);
        if (isNaN(totalPrice) || totalPrice <= 0) {
          throw new Error(`Preço total inválido: ${item.price}`);
        }

        return {
          company_id: companyId,
          product_id: productId,
          id_client: customerId, // Pode ser null caso o cliente não tenha sido inserido
          employee_id: validEmployeeId,
          quantity,
          total_price: totalPrice,
          sale_date: new Date().toISOString(),
          tipovenda: 1,
        };
      });

      console.log("Dados da venda prontos para envio:", saleData);

      // Enviar os dados para a API
      const response = await api.post(`/sales/${companyId}`, saleData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 201) {
        Alert.alert("Venda finalizada!", "A venda foi registrada com sucesso.");

        // Limpar o cliente e o carrinho após a venda ser finalizada
        clearCart();

        // Resetar a navegação
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
      if (error.response) {
        console.error("Erro na resposta da API:", error.response.data);
        Alert.alert(
          "Erro",
          error.response.data.message || "Erro ao processar a venda."
        );
      } else {
        console.error("Erro desconhecido:", error.message);
        Alert.alert(
          "Erro",
          error.message || "Algo deu errado. Tente novamente."
        );
      }
    }
    //};

    const phoneNumber = customer.phone.replace(/\D/g, ""); // Remove caracteres não numéricos
    const pixMessage = `Olá ${
      customer.name
    }, aqui está o código Pix para pagamento:\n\n${qrCodeData}\n\nTotal: R$ ${total.toFixed(
      2
    )}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      pixMessage
    )}`;

    Linking.openURL(whatsappUrl)
      .then(() => console.log("Abrindo WhatsApp..."))
      .catch((err) => console.error("Erro ao abrir o WhatsApp:", err));
  };

  const copyToClipboard = () => {
    Clipboard.setString(qrCodeData);
    Alert.alert(
      "Código Copiado",
      "O código Pix foi copiado para a área de transferência."
    );
  };

  // Função para enviar o código Pix pelo WhatsApp
  const sendPixToWhatsApp = () => {
    if (!customer || !customer.phone) {
      Alert.alert("Erro", "Número de telefone do cliente não disponível.");
      return;
    }

    if (!qrCodeData) {
      Alert.alert("Erro", "O código Pix ainda não foi gerado.");
      return;
    }

    const phoneNumber = customer.phone.replace(/\D/g, ""); // Remove caracteres não numéricos
    const pixMessage = `Olá ${
      customer.name
    }, aqui está o código Pix para pagamento:\n\n${qrCodeData}\n\nTotal: R$ ${total.toFixed(
      2
    )}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      pixMessage
    )}`;

    Linking.openURL(whatsappUrl)
      .then(() => console.log("Abrindo WhatsApp..."))
      .catch((err) => console.error("Erro ao abrir o WhatsApp:", err));
  };

  const generatePixCode = () => {
    try {
      const pixPayload = `00020101021126...5204000053039865802BR5913${
        customer.name
      }6010CIDADE6108${total.toFixed(2)}62070503***`;

      setQrCodeData(pixPayload.trim()); // Atualiza o estado do QR Code
      setShowQRCode(true); // Mostra o QR Code na tela
      sendPixToWhatsApp();

      Alert.alert("Código Pix Gerado", "Agora você pode enviar pelo WhatsApp.");
    } catch (error) {
      console.error("Erro ao gerar o código Pix:", error);
      Alert.alert("Erro", "Falha ao gerar o QR Code Pix.");
    }
  };

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
