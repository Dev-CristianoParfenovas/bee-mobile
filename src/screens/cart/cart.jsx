import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import icons from "../../constants/icons.js";
import { styles } from "./cart.style.js";
import { products } from "../../constants/dados.js";

function Cart() {
  // Estado para gerenciar os produtos no carrinho
  const [cartItems, setCartItems] = useState(
    products.map((product) => ({ ...product, quantity: 1 }))
  );

  // Função para incrementar a quantidade
  const incrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Função para decrementar a quantidade
  const decrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Função para remover o item do carrinho
  const removeItem = (id) => {
    Alert.alert("Remover item", "Deseja realmente remover este item?", [
      { text: "Cancelar" },
      {
        text: "Remover",
        onPress: () => {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== id)
          );
        },
      },
    ]);
  };

  // Calcular o valor total do carrinho
  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );

  return (
    <View style={styles.container}>
      {/* Banner no topo */}
      <View style={styles.banner}>
        <View style={styles.containerbanner}>
          <Text style={styles.text}>Carrinho</Text>
        </View>
      </View>

      {/* FlatList de Produtos */}
      <View style={styles.containerproducts}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Imagem do produto */}
              <Image source={{ uri: item.image }} style={styles.image} />

              {/* Detalhes do produto */}
              <View style={styles.details}>
                {/* Nome do produto */}
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>

                {/* Preço total do produto (quantidade * preço unitário) */}
                <Text style={styles.price}>
                  R${" "}
                  {(
                    parseFloat(item.price.replace("R$", "").replace(",", ".")) *
                    item.quantity
                  ).toFixed(2)}
                </Text>

                {/* Controles de quantidade */}
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.btnSmall}
                    onPress={() => decrementQuantity(item.id)}
                  >
                    <Text style={styles.btnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.btnSmall}
                    onPress={() => incrementQuantity(item.id)}
                  >
                    <Text style={styles.btnText}>+</Text>
                  </TouchableOpacity>

                  {/* Botão de remover */}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      {/* Total */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalValue}>R$ {calculateTotal().toFixed(2)}</Text>
      </View>
    </View>
  );
}

export default Cart;
