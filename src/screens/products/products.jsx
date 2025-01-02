import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./products.style.js";
import { products } from "../../constants/dados.js";
import { useNavigation } from "@react-navigation/native";
import TextBox from "../../components/textbox/textbox.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../constants/api.js";

function Products(props) {
  const { userName } = useAuth();
  const { authToken, companyId } = useAuth();
  const [cartCount, setCartCount] = useState(0); // Contador do carrinho
  const [searchText, setSearchText] = useState(""); //Para pesquisa de produtos
  const [loading, setLoading] = useState(false);
  // const [companyId, setCompanyId] = useState(null);
  const [products, setProducts] = useState([]); // Estado para armazenar os produtos
  const [filteredProducts, setFilteredProducts] = useState([]);

  const navigation = useNavigation(); // Hook para acessar a navegação

  // Função para buscar os produtos da API
  const fetchProducts = async () => {
    if (!authToken || !companyId) {
      console.warn("Token ou Company ID ausente.");
      return;
    }

    try {
      setLoading(true); // Inicia o indicador de carregamento
      const response = await api.get(`/products/${companyId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const productsData = response.data;

      console.log("Produtos recebidos:", productsData);

      // Atualiza o estado com os produtos recebidos
      setProducts(productsData);
      setFilteredProducts(productsData); // Inicialmente exibe todos os produtos
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false); // Finaliza o indicador de carregamento
    }
  };

  useEffect(() => {
    console.log("Auth Token:", authToken);
    console.log("Company ID:", companyId);
    fetchProducts();
  }, [authToken, companyId]);

  // Função para quando o item for clicado
  const handlePress = (item) => {
    Alert.alert("Produto", `Você clicou no produto: ${item.name}`);
  };

  // Função para atualizar os produtos com base na pesquisa
  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Função para adicionar ao carrinho
  const addToCart = (item) => {
    setCartCount(cartCount + 1);
    Alert.alert("Carrinho", `${item.name} foi adicionado ao carrinho!`, [
      {
        text: "Ir para o carrinho",
        onPress: () => props.navigation.navigate("Carrinho"),
      },
      {
        text: "Continuar comprando",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Banner no topo */}
      <View style={styles.banner}>
        <View style={styles.containerbanner}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            // style={styles.backButton}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.text}>{userName}</Text>

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

      {/* Campo de Pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextBox
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Lista de Produtos */}
      <View style={styles.containerproducts}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
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
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color="white"
                    />
                    <Text style={styles.addToCartText}>Adicionar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

export default Products;
