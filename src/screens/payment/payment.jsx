import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
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

const Payment = () => {
  const navigation = useNavigation(); // Hook para acessar a navegação
  const { companyId } = useAuth(); // Acesse o companyId do contexto de autenticação
  const { authToken } = useAuth();
  const { employeeId } = useAuth();
  const { clearCart } = useCart(); // Acesse a função clearCart do contexto

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

    // Permite a venda sem cliente, mas verifica se foi inserido
    const customerId = customer ? customer.id_client : null;
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

    try {
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

      const response = await api.post(`/sales/${companyId}`, saleData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log("Resposta da API:", response);
      if (response.status === 201) {
        Alert.alert("Venda finalizada!", "A venda foi registrada com sucesso.");

        // Limpar o cliente e o carrinho após a venda ser finalizada
        clearCart(); // Limpar o carrinho no contexto

        // Limpar o cliente e o carrinho após a venda ser finalizada
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
