import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./payment.style.js";
import images from "../../constants/icons.js";
import { useNavigation } from "@react-navigation/native";

const items = [
  { id: "1", name: "Produto A", quantity: 2, price: 50 },
  { id: "2", name: "Produto B", quantity: 1, price: 100 },
];

const Payment = () => {
  const subtotal = items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
  const tax = 0.1 * subtotal; // Exemplo: 10% de taxas
  const total = subtotal + tax;

  const navigation = useNavigation(); // Hook para acessar a navegação

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

      {/* Resumo do Pedido */}
      <View style={styles.orderSummary}>
        <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.quantity}x {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                R$ {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          )}
        />
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>R$ {subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Taxas:</Text>
          <Text style={styles.value}>R$ {tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Botão de Confirmar Pagamento */}
      <View style={styles.containerbtn}>
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentButtonText}>Confirmar Pagamento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;
