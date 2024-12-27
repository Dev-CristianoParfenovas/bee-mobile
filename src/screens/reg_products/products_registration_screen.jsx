import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons"; // Biblioteca de ícones
import { styles } from "./products_registration_screen.js";
import Button from "../../components/button/button.jsx";
import { COLORS } from "../../constants/theme.js";
import api from "../../constants/api.js";
import { useNavigation } from "@react-navigation/native";
import { useAuth, AuthProvider } from "../../context/AuthContext.jsx"; // Importa o AuthContext
import { Picker } from "@react-native-picker/picker";
import getStoredData from "../../utils/getStoredData"; // Importa o utilitário de AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextBox from "../../components/textbox/textbox.jsx";

function ProductsRegistrationScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [userToken, setUserToken] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [products, setProducts] = useState([]); // Estado para armazenar os produtos
  const navigation = useNavigation();

  // Função para buscar categorias
  const fetchCategories = async (token, companyId) => {
    try {
      const url = `/categories/${companyId}`;
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
    }
  };

  // Função para salvar dados no AsyncStorage
  const storeUserData = async (token, companyId) => {
    try {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("companyId", companyId);
      console.log("Dados salvos com sucesso:", { token, companyId });
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  // Função para recuperar dados do AsyncStorage
  const initialize = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const companyId = await AsyncStorage.getItem("companyId");
      console.log("Dados recuperados:", { token, companyId });

      setUserToken(token); // Atualiza o estado do token
      setCompanyId(companyId); // Atualiza o estado do companyId
    } catch (error) {
      console.error("Erro ao recuperar dados:", error);
    }
  };

  // Função para buscar produtos
  // Função para buscar produtos
  const fetchProducts = async (token, companyId) => {
    try {
      const response = await api.get(`/products/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    }
  };

  // Função para recuperar dados do AsyncStorage
  const getStoredData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const companyId = await AsyncStorage.getItem("companyId");
      return { token, companyId };
    } catch (error) {
      console.error("Erro ao buscar dados no AsyncStorage:", error.message);
      return { token: null, companyId: null };
    }
  };

  // Função de inicialização
  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const companyId = await AsyncStorage.getItem("companyId");

        if (!token || !companyId) {
          Alert.alert("Erro", "Usuário ou empresa não autenticados.");
          navigation.navigate("Login");
          return;
        }

        setUserToken(token);
        setCompanyId(companyId);
        fetchCategories(token, companyId);
        fetchProducts(token, companyId);
      } catch (error) {
        console.error("Erro na inicialização:", error);
        Alert.alert("Erro", "Falha ao carregar dados iniciais.");
      }
    };

    initialize();
  }, []);

  // Função de pesquisa de produto
  const handleSearchProduct = async () => {
    try {
      const response = await api.get(`/products/${companyId}?search=${search}`);
      const product = response.data.product;
      if (product) {
        setName(product.name);
        setPrice(product.price);
        setQuantity(product.stock);
        setSelectedCategory(product.categoryId);
      } else {
        Alert.alert("Produto não encontrado");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao buscar o produto.");
    }
  };

  // Função de cadastro de produto
  const handleCreateProduct = async () => {
    if (!name || !price || !quantity || !selectedCategory) {
      Alert.alert("Erro", "Todos os campos devem ser preenchidos.");
      return;
    }

    if (isNaN(Number(price)) || isNaN(Number(quantity))) {
      Alert.alert("Erro", "Preço e quantidade devem ser números válidos.");
      return;
    }

    if (!companyId) {
      Alert.alert("Erro", "ID da empresa não está definido.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return;
      }

      const formattedPrice = parseFloat(price.replace(",", "."));
      const formattedQuantity = Number(quantity); // Garantir que 'quantity' seja um número

      const payload = {
        name,
        price: formattedPrice,
        stock: formattedQuantity, // Passar a quantidade como número
        category_id: selectedCategory,
        company_id: companyId,
      };

      console.log("Dados enviados para a API:", payload);

      const response = await api.post("/products", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Resposta da API:", response.data);

      // Exibe a mensagem de sucesso
      Alert.alert("Sucesso", response.data.message);

      // Limpa os campos após sucesso
      setName(""); // Limpar campo nome
      setPrice(""); // Limpar campo preço
      setQuantity(""); // Limpar campo quantidade
      setSelectedCategory(""); // Limpar seleção de categoria
    } catch (error) {
      console.error("Erro na requisição:", error);

      // Tratar o erro com status 409 para duplicidade
      if (error.response && error.response.status === 409) {
        Alert.alert(
          "Erro",
          "Já existe um produto com este nome para esta empresa."
        );
      } else {
        const errorMessage =
          error?.response?.data?.message ||
          "Não foi possível cadastrar o produto.";
        Alert.alert("Erro", errorMessage);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro de Produtos</Text>
      </View>

      {/* Campo de Busca */}
      <View style={styles.containerInput}>
        <View style={styles.inputWithIcon}>
          <MaterialIcons name="search" size={24} color={COLORS.gray3} />
          <TextBox
            placeholder="Buscar Produto"
            placeholderTextColor={COLORS.gray3}
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
        </View>
        <Button text="Buscar" onPress={handleSearchProduct} />
      </View>

      {/* Picker de Categorias */}
      <View style={styles.containerInput}>
        <Text style={styles.textpicker}>Selecione uma Categoria:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione uma Categoria" value="" />
            {categories.map((category) => (
              <Picker.Item
                key={category.id}
                label={category.name}
                value={category.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Campos Nome, Preço e Estoque */}
      <View style={styles.containerInput}>
        <View style={styles.inputWithIcon}>
          <MaterialIcons name="inventory" size={24} color={COLORS.gray3} />
          <TextBox
            placeholder="Nome do Produto"
            placeholderTextColor={COLORS.gray3}
            value={name}
            onChangeText={setName}
            style={[styles.input, errors.name ? styles.inputError : null]}
          />
        </View>
        <View style={styles.containerRow}>
          <View style={[styles.inputWithIcon, styles.inputHalf]}>
            <MaterialIcons name="attach-money" size={24} color={COLORS.gray3} />
            <TextBox
              placeholder="Preço"
              placeholderTextColor={COLORS.gray3}
              value={price}
              onChangeText={setPrice}
              style={[styles.input, errors.price ? styles.inputError : null]}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputWithIcon, styles.inputHalf]}>
            <FontAwesome name="cube" size={24} color={COLORS.gray3} />
            <TextBox
              placeholder="Estoque"
              placeholderTextColor={COLORS.gray3}
              value={quantity}
              onChangeText={setQuantity}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <Button text="Cadastrar Produto" onPress={handleCreateProduct} />

      {/* Lista de Produtos */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDetails}>
              Preço: R$ {item.price} | Estoque:{" "}
              {item.quantity ?? "Indisponível"}
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveProduct(item.id)}
            >
              <MaterialIcons name="delete" size={24} color={COLORS.red} />
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default ProductsRegistrationScreen;
