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
import { debounce } from "lodash"; // Para debounce, instale lodash (npm install lodash)
import { MaterialIcons, FontAwesome } from "@expo/vector-icons"; // Biblioteca de ícones
import { styles } from "./products_registration_screen.js";
import Button from "../../components/button/button.jsx";
import ButtonSearch from "../../components/button_search/button_search.jsx";
import { COLORS } from "../../constants/theme.js";
import api from "../../constants/api.js";
import { useNavigation } from "@react-navigation/native";
import { useAuth, AuthProvider } from "../../context/AuthContext.jsx"; // Importa o AuthContext
import { Picker } from "@react-native-picker/picker";
import getStoredData from "../../utils/getStoredData"; // Importa o utilitário de AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextBox from "../../components/textbox/textbox.jsx";
import * as ImagePicker from "expo-image-picker"; // Importa o ImagePicker

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
  const [productsList, setProductsList] = useState([]); // Estado para armazenar os produtos encontrados
  const navigation = useNavigation();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

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

  //Função para retornar a lista completa de produtos
  const resetProductsList = async () => {
    setSearch(""); // Limpa o campo de pesquisa
    setProductsList([]); // Limpa a lista filtrada
    fetchProducts(userToken, companyId); // Recarrega a lista completa de produtos
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

  const fetchProducts = async (token, companyId) => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Dados recebidos:", response.data);

      // Verifica se a resposta é um array e coloca o primeiro item (produto mais recente) no topo
      if (Array.isArray(response.data)) {
        const updatedProducts = [response.data[0], ...response.data.slice(1)];
        setProducts(updatedProducts); // Atualiza a lista de produtos
      } else {
        // Caso a resposta seja um objeto, verifique o campo de produtos (ajuste conforme necessário)
        const updatedProducts = [
          response.data.products[0],
          ...response.data.products.slice(1),
        ];
        setProducts(updatedProducts);
      }
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

  // Função para capturar imagem da câmera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "A permissão para usar a câmera é necessária."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri); // Armazena a URI da imagem tirada
    }
  };

  // Função para selecionar uma imagem da galeria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "A permissão para acessar a galeria é necessária."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri); // Armazena a URI da imagem selecionada
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

  // Função para buscar produtos com debounce
  const handleSearchProduct = debounce(async () => {
    if (!search.trim()) return; // Não faz a requisição se a busca estiver vazia

    try {
      const response = await api.get(
        `/products/${companyId}?search=${search}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      console.log("Resposta da API: ", response.data);

      const products = response.data; // Verifique se os produtos estão diretamente no `response.data`

      if (products && products.length > 0) {
        setProducts(products); // Atualiza a lista de produtos
      } else {
        setProducts([]); // Se não encontrar produtos, limpa a lista
        Alert.alert("Produto não encontrado.");
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Falha ao buscar o produto."
      );
    }
  }, 500); // Debounce de 500ms

  // Atualiza o estado de pesquisa conforme o usuário digita
  const handleChangeSearch = (text) => {
    setSearch(text);
    handleSearchProduct(); // Chama a função de busca com debounce
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

      if (imageUri) {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("image", {
          uri: imageUri,
          name: `product_image.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await api.post("/products", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Resposta completa da API:", response.data);
      Alert.alert("Sucesso", response.data.message);

      // Atualiza a lista de produtos após a criação

      fetchProducts(token, companyId); // Forçar nova requisição para buscar todos os produtos
      // Atualizando a lista de produtos
      /* setProducts((prevProducts) => {
          // Se o produto já existir na lista, substituímos
          const updatedProducts = prevProducts.filter((item) => item.id !== id);
          return [id, ...updatedProducts];
        });*/
      // Limpa os campos após sucesso
      setSelectedProductId(null);
      setName("");
      setPrice("");
      setQuantity("");
      setSelectedCategory("");
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
  //FUNÇÃO REMOVER PRODUTO
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
        fetchProducts(token, companyId); // Forçar nova requisição para buscar todos os produtos
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
        <View style={styles.containerbtnSearch}>
          <ButtonSearch text="Buscar" onPress={handleChangeSearch} />
          <ButtonSearch text="Voltar lista" onPress={resetProductsList} />
        </View>
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

      {/* Botão para selecionar imagem */}
      <View style={styles.imagePickerContainer}>
        <ButtonSearch
          text=" Galeria"
          onPress={pickImage}
          icon="image" // Passando o ícone de imagem
          iconColor="#fff" // Cor do ícone, caso queira customizar
          style={styles.imageButton}
        />

        <ButtonSearch
          text=" Tirar Foto"
          onPress={takePhoto}
          icon="camera" // Passando o ícone de imagem
          iconColor="#fff" // Cor do ícone, caso queira customizar
          style={styles.imageButton}
        />
      </View>

      {/* Exibe a imagem selecionada ou capturada */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

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
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          } // Verificação de 'item'
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
