import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
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
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  /* const fetchProducts = async (token, companyId) => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Verifique a estrutura da resposta da API
      console.log(response.data); // Verifique o que está sendo retornado

      const updatedProducts = response.data?.products || []; // Garantir que 'products' seja um array, mesmo que undefined
      console.log(updatedProducts); // Verifique se o array de produtos está sendo atualizado corretamente

      setProducts(updatedProducts); // Atualiza a lista com os novos produtos
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível carregar os produtos."
      );
    } finally {
      setLoading(false);
    }
  };*/

  const fetchProducts = async (token, companyId) => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Adiciona o produto atualizado na primeira posição
      //const updatedProduct = response.data.products; // Supondo que a resposta contenha os produtos
      // setProducts([updatedProduct[0], ...products]);
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível carregar os produtos."
      );
    } finally {
      setLoading(false);
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
      const response = await api.get(
        `/products/${companyId}?search=${search}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      const product = response.data.product;

      if (product) {
        setName(product.name);
        setPrice(product.price.toString().replace(".", ","));
        setQuantity(product.stock.toString());
        setSelectedCategory(product.categoryId);
        setSelectedProductId(product.id);
      } else {
        Alert.alert("Produto não encontrado.");
        setName("");
        setPrice("");
        setQuantity("");
        setSelectedCategory("");
        setSelectedProductId(null);
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Falha ao buscar o produto."
      );
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
      const formattedQuantity = Number(quantity);

      const payload = {
        id: selectedProductId || null, // Se não houver ID, será enviado `null`
        name,
        price: formattedPrice,
        stock: formattedQuantity,
        category_id: selectedCategory,
        company_id: companyId,
      };

      const response = await api.post("/products", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Sucesso", response.data.message);

      // Limpa os campos após sucesso
      setSelectedProductId(null);
      setName("");
      setPrice("");
      setQuantity("");
      setSelectedCategory("");

      // Atualiza a lista de produtos
      fetchProducts(token, companyId);
    } catch (error) {
      console.error("Erro na requisição:", error);

      const errorMessage =
        error?.response?.data?.message ||
        "Não foi possível cadastrar o produto.";
      Alert.alert("Erro", errorMessage);
    }
  };

  // Função confirmRemove
  const confirmRemove = (productId) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir este produto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => handleRemoveProduct(productId),
        },
      ]
    );
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return;
      }

      const companyId = await AsyncStorage.getItem("companyId");
      if (!companyId) {
        Alert.alert("Erro", "ID da empresa não encontrado.");
        return;
      }

      const response = await api.delete(
        `/products/${productId}?companyId=${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Sucesso", response.data.message);
        fetchProducts(token, companyId); // Atualiza a lista de produtos
      } else {
        throw new Error("Erro ao excluir produto");
      }
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      Alert.alert(
        "Erro",
        "Não foi possível remover o produto. Tente novamente."
      );
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
            onfocus={false}
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
            onfocus={true}
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
              maskType="money"
              onfocus={false}
              placeholder="Preço"
              placeholderTextColor={COLORS.gray3}
              value={price}
              onChangeText={(text) => setPrice(text)}
              style={[styles.input, errors.price ? styles.inputError : null]}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputWithIcon, styles.inputHalf]}>
            <FontAwesome name="cube" size={24} color={COLORS.gray3} />
            <TextBox
              onfocus={false}
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
      {/* Lista de Produtos */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => (item ? item.id.toString() : "")} // Verificação de 'item'
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            // Verificação adicional para garantir que o item existe
            if (!item || !item.id) return null; // Não renderiza o item se não houver um 'id' válido

            return (
              <View style={styles.productCard}>
                {/* Nome do Produto */}
                <Text style={styles.productName}>{item.name}</Text>

                {/* Detalhes do Produto */}
                <Text style={styles.productDetails}>
                  Preço: R$ {item.price} | Estoque:{" "}
                  {item.quantity > 0 ? item.quantity : "Sem estoque"}
                </Text>

                {/* Botões de Ação */}
                <View style={styles.buttonsContainer}>
                  {/* Botão Selecionar */}
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedProductId(item.id);
                      setName(item.name);
                      setPrice(item.price);
                      setQuantity(item.quantity?.toString() || "0");
                      setSelectedCategory(item.category_id ?? null);
                    }}
                    style={styles.selecionarButton}
                    accessibilityLabel={`Selecionar produto ${item.name}`}
                  >
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color={COLORS.gray3}
                    />
                    <Text style={styles.selecionarButtonText}>Selecionar</Text>
                  </TouchableOpacity>

                  {/* Botão Remover */}
                  <TouchableOpacity
                    style={styles.removeButtonContainer}
                    onPress={() => confirmRemove(item.id)}
                    accessibilityLabel={`Remover produto ${item.name}`}
                  >
                    <MaterialIcons name="delete" size={24} color={COLORS.red} />
                    <Text style={styles.removeButtonText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 20 }} // Evita que o último item fique colado no rodapé
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  );
}

export default ProductsRegistrationScreen;
