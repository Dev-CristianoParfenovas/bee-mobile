import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./payment.style.js";
import images from "../../constants/icons.js";
import { useNavigation } from "@react-navigation/native";
import ButtonPayment from "../../components/button_payment/button_payment.jsx";
import { useRoute } from "@react-navigation/native";
import api from "../../constants/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Payment = () => {
  const navigation = useNavigation(); // Hook para acessar a navegação
  const { companyId } = useAuth(); // Acesse o companyId do contexto de autenticação
  const [authToken, setAuthToken] = useState(null);
  // Pega os parâmetros da navegação
  const route = useRoute();
  const { customer, cartItems } = route.params || {}; // Recebe os itens do carrinho

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

    if (!customer || !customer.id_client) {
      Alert.alert("Erro", "Os dados do cliente não estão disponíveis.");
      return;
    }

    try {
      const saleData = cartItems.map((item) => ({
        company_id: companyId,
        product_id: item.id,
        id_client: customer.id_client,
        employee_id: 1, // Substituir pelo ID dinâmico, se necessário
        quantity: item.quantity,
        total_price: item.quantity * item.price,
        sale_date: new Date(),
        tipovenda: 1,
      }));

      console.log("Enviando dados da venda:", saleData);

      const response = await api.post(`/sales/${companyId}`, saleData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log("Resposta da API:", response);

      if (response.status === 201) {
        Alert.alert("Venda finalizada!", "A venda foi registrada com sucesso.");
        navigation.navigate("ConfirmacaoPagamento", { saleData });
      }
    } catch (error) {
      if (error.response) {
        console.error("Erro na resposta da API:", error.response.data);
        Alert.alert(
          "Erro",
          error.response.data.message || "Houve um problema."
        );
      } else if (error.request) {
        console.error("Erro na requisição:", error.request);
        Alert.alert("Erro", "Nenhuma resposta do servidor.");
      } else {
        console.error("Erro desconhecido:", error.message);
        Alert.alert("Erro", "Algo deu errado. Tente novamente.");
      }
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
                  {item.quantity}x {item.name}
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
