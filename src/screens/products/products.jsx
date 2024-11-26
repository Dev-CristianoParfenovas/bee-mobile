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
import { styles } from "./products.style.js";
import { products } from "../../constants/dados.js";

function Products() {
  const [cartCount, setCartCount] = useState(0); // Contador do carrinho

  // Função para quando o item for clicado
  const handlePress = (item) => {
    Alert.alert("Produto", `Você clicou no produto: ${item.name}`);
  };

  // Função para adicionar ao carrinho
  const addToCart = (item) => {
    setCartCount(cartCount + 1);
    Alert.alert("Carrinho", `${item.name} foi adicionado ao carrinho!`);
  };

  return (
    <View style={styles.container}>
      {/* Banner no topo */}
      <View style={styles.banner}>
        <View style={styles.containerbanner}>
          <Text style={styles.text}>Produtos</Text>

          {/* Botão do Carrinho com Indicador */}
          <View style={styles.cartContainer}>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => Alert.alert("Carrinho")}
            >
              <Ionicons name="cart-outline" size={30} color="white" />
            </TouchableOpacity>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.subtitle}>Explore nossos itens exclusivos</Text>
      </View>

      {/* Lista de Produtos */}
      <View style={styles.containerproducts}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePress(item)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.price}>R$ {item.price}</Text>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => addToCart(item)}
                >
                  <Ionicons name="add-circle-outline" size={20} color="white" />
                  <Text style={styles.addToCartText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

export default Products;
