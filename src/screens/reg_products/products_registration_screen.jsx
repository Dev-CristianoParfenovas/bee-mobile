import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { debounce } from "lodash"; // Para debounce, instale lodash (npm install lodash)
import { MaterialIcons, FontAwesome } from "@expo/vector-icons"; // Biblioteca de ícones
import { styles } from "./products_registration_screen.js";
import Button from "../../components/button/button.jsx";
import ButtonSearch from "../../components/button_search/button_search.jsx";
import { COLORS } from "../../constants/theme.js";
import api from "../../constants/api.js";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth, AuthProvider } from "../../context/AuthContext.jsx"; // Importa o AuthContext
import { Picker } from "@react-native-picker/picker";
import getStoredData from "../../utils/getStoredData"; // Importa o utilitário de AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextBox from "../../components/textbox/textbox.jsx";
import * as ImagePicker from "expo-image-picker"; // Importa o ImagePicker
import { useCameraPermission } from "../../context/CameraPermissionContext.jsx";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import * as FileSystem from "expo-file-system";
import ImageLoadingView from "../../components/img/imageloadingview.js";

function ProductsRegistrationScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [barcode, setBarcode] = useState("");
  const [aliquota, setAliquota] = useState("");
  const [ncm, setNcm] = useState("");
  const [cfop, setCfop] = useState("");
  const [cst, setCst] = useState("");
  const [csosn, setCsosn] = useState("");
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
  const [isScannerActive, setIsScannerActive] = useState(false);
  const { hasPermission, requestPermission, isLoading } = useCameraPermission();
  const [scannedCode, setScannedCode] = useState();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Token inválido:", e);
      return null;
    }
  };

  // Função para limpar os campos
  const limpaCampos = () => {
    setSelectedProductId(null);
    setName("");
    setPrice("");
    setBarcode("");
    setScannedCode("");
    setNcm("");
    setAliquota("");
    setCfop("");
    setCst("");
    setCsosn("");
    setQuantity("");
    setSelectedCategory("");
    setImageUri(null);
  };

  // Função pra limpar da memoria  qdo tira foto pro produto
  const clearImageCache = async () => {
    try {
      const cacheDirectory = `${FileSystem.cacheDirectory}ImagePicker`;

      // NOVO: Verifica se o diretório existe antes de tentar ler
      const dirInfo = await FileSystem.getInfoAsync(cacheDirectory);

      if (dirInfo.exists && dirInfo.isDirectory) {
        console.log("Limpando cache do ImagePicker...");
        await FileSystem.deleteAsync(cacheDirectory, { idempotent: true });
      } else {
        console.log(
          "Diretório de cache do ImagePicker não existe. Nada para limpar."
        );
      }
    } catch (e) {
      console.error("Erro ao limpar cache do ImagePicker:", e);
    }
  };
  // Função para buscar categorias
  const fetchCategories = async (token) => {
    try {
      const url = "/categories";
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // response.data.data deve ser um array ou undefined
      const categorias = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setCategories(categorias);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
      console.error("Erro ao carregar categorias:", error);
      setCategories([]); // Garante que a tela não quebre
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
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("companyId", companyId);
      console.log("Dados salvos com sucesso:", { token, companyId });
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  // Função para recuperar dados do AsyncStorage
  const initialize = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const companyId = await AsyncStorage.getItem("companyId");
      console.log("Dados recuperados:", { token, companyId });

      setUserToken(token); // Atualiza o estado do token
      setCompanyId(companyId); // Atualiza o estado do companyId
    } catch (error) {
      console.error("Erro ao recuperar dados:", error);
    }
  };

  // Função para buscar produtos
  const fetchProducts = async (token) => {
    setProductsLoading(true);

    // Decodificar token e verificar payload
    const decoded = decodeJWT(token);
    console.log("Payload do token:", decoded);

    if (!decoded?.company_id) {
      console.warn(
        "Token não contém company_id. Pode ser token antigo ou inválido."
      );
    }

    try {
      const response = await api.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Dados recebidos:", response.data);

      const products = Array.isArray(response.data)
        ? response.data
        : response.data.data; // ajuste conforme resposta da API

      if (products && products.length > 0) {
        setProducts(products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível carregar os produtos."
      );
    } finally {
      setProductsLoading(false);
    }
  };

  // Função para capturar imagem da câmera
  const takePhoto = async () => {
    try {
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
        quality: 0.5,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        console.log("Imagem capturada URI:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Ocorreu um erro ao tirar a foto:", error);
      Alert.alert("Erro", "Ocorreu um erro inesperado ao tirar a foto.");
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

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      console.log("Imagem selecionada URI:", result.assets[0].uri);
    }
  };

  // Função de inicialização
  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const storedCompanyId = await AsyncStorage.getItem("companyId"); // Renomeado para evitar conflito

        if (!token || !storedCompanyId) {
          Alert.alert("Erro", "Usuário ou empresa não autenticados.");
          navigation.navigate("Login");
          return;
        }

        setUserToken(token);
        setCompanyId(storedCompanyId); // Use o nome renomeado aqui

        // Remova a chamada a fetchProducts daqui se o segundo useEffect já lida com isso.
        // Ou mantenha aqui se quiser que ele carregue na inicialização e o segundo seja apenas para refreshes.
        // Se ambos chamam, o segundo useEffect pode ser simplificado para depender de refreshProducts apenas.
        await fetchCategories(token, storedCompanyId); // Assumindo que você tem fetchCategories
        await fetchProducts(token, storedCompanyId); // Chama fetchProducts para carregar a lista inicial
      } catch (error) {
        console.error("Erro na inicialização:", error);
        Alert.alert("Erro", "Falha ao carregar dados iniciais.");
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    // Este useEffect só deve ser chamado se houver uma razão para "refrescar" a lista
    // Fora da inicialização. Se você já chamou fetchProducts no primeiro useEffect,
    // e handleCreateProduct também chama, talvez este segundo possa ser mais específico.
    if (userToken && companyId && refreshProducts) {
      // Adicione 'refreshProducts' como uma dependência real
      fetchProducts(userToken, companyId);
    }
  }, [refreshProducts, userToken, companyId]);

  // Função para buscar produtos com debounce
  const handleSearchProduct = debounce(async () => {
    if (!search.trim()) return; // Não faz a requisição se a busca estiver vazia

    console.log("Search normal:", search);
    console.log("Search trim:", search.trim());

    try {
      const response = await api.get(`/products?search=${search}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

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

  const handleCreateProduct = async () => {
    if (loading) return; // ⚠️ impede múltiplos cliques

    if (!name || !price || !quantity || !selectedCategory) {
      Alert.alert("Erro", "Todos os campos devem ser preenchidos.");
      return;
    }

    // 1. INÍCIO: Ativa o estado de carregamento e desabilita o botão
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return;
      }

      const formattedPrice = parseFloat(price.replace(",", "."));
      const formattedQuantity = Number(quantity);

      // Primeira requisição para criar o produto, sem a imagem.
      // O id é null para indicar uma nova criação.
      const productPayload = {
        id: null, // Correctly set to null for new product creation
        name,
        price: formattedPrice,
        barcode,
        ncm,
        aliquota,
        cfop,
        cst,
        csosn,
        stock: formattedQuantity, // Note: backend expects 'stock', not 'quantity' if you're sending this
        category_id: selectedCategory,
        company_id: companyId,
      };

      const productResponse = await api.post("/products", productPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdProduct = productResponse.data.data || productResponse.data;
      const productId = createdProduct.product?.id;
      console.log("Produto criado:", createdProduct);

      if (!productId) {
        Alert.alert("Erro", "ID do produto criado não foi retornado.");
        return;
      }

      // Não precisamos de imageUrl = null aqui, pois não vamos atualizar products com ela

      if (imageUri) {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1].toLowerCase();

        const getMimeType = (ext) => {
          if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
          if (ext === "png") return "image/png";
          if (ext === "webp") return "image/webp";
          return `image/${ext}`;
        };

        let uri = imageUri;
        if (Platform.OS === "android" && !uri.startsWith("file://")) {
          uri = "file://" + uri;
        }

        console.log("Image URI antes do upload:", uri);

        const imageFormData = new FormData();
        // O backend espera o 'product_id' e o 'company_id' como string.
        imageFormData.append("product_id", String(productId));
        imageFormData.append("company_id", String(companyId));
        imageFormData.append("image", {
          uri,
          name: `product_image.${fileType}`,
          type: getMimeType(fileType),
        });

        // Debug: listar tudo que está no FormData antes de enviar
        for (let pair of imageFormData.entries()) {
          console.log(pair[0], pair[1]);
        }

        const imageResponse = await api.post("/images", imageFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Importante para FormData
          },
        });

        console.log("Resposta upload imagem:", imageResponse.data);

        // Não há necessidade de 'imageUrl = imageResponse.data.image_url;'
        // Nem de fazer um 'api.put' para products com image_url
        // Pois a imagem já foi associada via 'images' table.
      }

      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      fetchProducts(token, companyId); // Atualiza a lista de produtos

      // Limpar campos
      setSelectedProductId(null);
      setName("");
      setPrice("");
      setBarcode("");
      setNcm("");
      setAliquota("");
      setCfop("");
      setCst("");
      setCsosn("");
      setQuantity("");
      setSelectedCategory("");
      setImageUri(null);
      await clearImageCache();
    } catch (error) {
      console.error("Erro no cadastro do produto:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível cadastrar o produto."
      );
    } finally {
      // 2. FIM: Desativa o estado de carregamento
      setLoading(false);
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
  /* const handleRemoveProduct = async (productId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return;
      }

      const companyId = await AsyncStorage.getItem("companyId");
      if (!companyId) {
        Alert.alert("Erro", "ID da empresa não encontrado.");
        return;
      }

      const response = await api.delete(`/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert("Sucesso", response.data.message);
        setRefreshProducts((prev) => !prev);
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
  };*/

  const handleRemoveProduct = async (productId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return;
      }

      const companyId = await AsyncStorage.getItem("companyId");
      if (!companyId) {
        Alert.alert("Erro", "ID da empresa não encontrado.");
        return;
      }

      const response = await api.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        Alert.alert("Sucesso", response.data.message);
        setRefreshProducts((prev) => !prev);
        fetchProducts(token, companyId); // Atualiza lista de produtos
      } else if (response.status === 404) {
        Alert.alert("Aviso", "Produto não encontrado ou já foi excluído.");
        setRefreshProducts((prev) => !prev);
        fetchProducts(token, companyId);
      } else {
        throw new Error("Erro ao excluir produto");
      }
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.error ||
          "Não foi possível remover o produto. Tente novamente."
      );
    }
  };

  // Função para solicitar permissão da câmera
  const handleOpenScanner = async () => {
    if (isLoading) {
      return; // Aguarda enquanto as permissões estão sendo carregadas
    }

    if (hasPermission) {
      setIsCameraOpen(true); // Abre a câmera
      setIsScannerActive(true); // Ativa o scanner
      console.log("Scanner ativado.");
    } else {
      await requestPermission(); // Solicita permissão novamente
      if (!hasPermission) {
        Alert.alert(
          "Permissão Negada",
          "É necessário conceder permissão para acessar a câmera."
        );
      }
    }
  };

  // Função chamada após escanear o código de barras
  const handleBarCodeScanned = ({ data }) => {
    console.log("Código escaneado:", data); // Log para verificar o valor escaneado
    setIsScannerActive(false); // Desativa o scanner após leitura
    setScannedCode(data); // Atualiza o código escaneado no estado
    setIsCameraOpen(false); // Fecha a câmera
    Alert.alert(
      "Código Escaneado",
      `O código escaneado foi: ${data}`,
      [{ text: "OK", onPress: () => setIsScannerActive(false) }],
      { cancelable: false }
    );
  };

  // Verifica o estado de carregamento da permissão
  if (isLoading) {
    return <Text>Carregando permissões...</Text>;
  }

  useEffect(() => {
    console.log("hasPermission:", hasPermission); // Verifique se o estado está sendo atualizado corretamente
  }, [hasPermission]);

  useFocusEffect(
    useCallback(() => {
      // Quando a tela ganha foco, limpa os campos do formulário
      setSelectedProductId(null);
      setName("");
      setPrice("");
      setBarcode("");
      setScannedCode("");
      setNcm("");
      setAliquota("");
      setCfop("");
      setCst("");
      setCsosn("");
      setQuantity("");
      setSelectedCategory("");
      setImageUri(null);

      if (!userToken || !companyId) {
        console.warn("Token ou CompanyId indefinido no foco da tela");
        return;
      }

      fetchProducts(userToken, companyId);
      fetchCategories(userToken, companyId);
    }, [userToken, companyId])
  );

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

      {/* ScrollView com o conteúdo acima do botão Cadastrar Produto */}
      <ScrollView>
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
            <ButtonSearch
              text="Voltar lista"
              onPress={() => {
                limpaCampos();
                resetProductsList(); // aqui você volta para a lista
              }}
            />
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
            icon="image"
            iconColor="#fff"
            style={styles.imageButton}
          />
          <ButtonSearch
            text=" Tirar Foto"
            onPress={takePhoto}
            icon="camera"
            iconColor="#fff"
            style={styles.imageButton}
          />
        </View>

        {/* Exibe a imagem selecionada ou capturada */}
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        {/* Campos Nome, Preço e Estoque */}

        <View style={styles.containerInput}>
          {isCameraOpen ? (
            <>
              {console.log("Camera Open: ", isCameraOpen)}
              {Platform.OS === "android" && <StatusBar hidden />}

              <CameraView
                style={styles.camera}
                facing="back"
                //onBarCodeScanned={handleBarCodeScanned} // Passando a função diretamente}}
                onBarcodeScanned={({ data }) => {
                  console.log(data);
                  setScannedCode(data);
                  setBarcode(data);
                  setIsScannerActive(false);
                  setIsCameraOpen(false);
                }}
                barCodeScannerSettings={{
                  barCodeTypes: [
                    "ean13",
                    "qr",
                    "upce",
                    "code128",
                    "ean8",
                    "pdf417",
                  ], // Tipos de código de barras e QR suportados
                }}
              >
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setIsCameraOpen(false);
                    setIsScannerActive(false);
                  }}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </CameraView>
            </>
          ) : (
            <View style={styles.inputWithIcon}>
              <TouchableOpacity
                onPress={() => {
                  handleOpenScanner();
                }}
              >
                <Text style={styles.cameraIcon}>📷</Text>
              </TouchableOpacity>

              <TextBox
                placeholder="Código de Barras"
                placeholderTextColor="#888"
                style={styles.input}
                value={barcode}
                onChangeText={(text) => setBarcode(text)} // Sincroniza o estado com o TextBox
                //editable={false} // Campo somente leitura após escanear
              />
            </View>
          )}

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
              <MaterialIcons
                name="attach-money"
                size={24}
                color={COLORS.gray3}
              />
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
          {/* tributção*/}
          <View style={styles.containerRowTrib}>
            <Text style={styles.containerAliqTrib}>Aliquota</Text>
            <Text style={styles.containerNcmTrib}>NCM</Text>
            <Text style={styles.containerCfopTrib}>CFOP</Text>
          </View>

          <View style={styles.containerRowTrib}>
            <View style={[styles.inputWithIcon, styles.inputHalfTrib]}>
              <TextBox
                maskType="money"
                onfocus={false}
                leftIcon="percent"
                placeholder="Alíq."
                placeholderTextColor={COLORS.gray3}
                value={aliquota}
                onChangeText={(text) => setAliquota(text)}
                style={[styles.input, , styles.fontTrib]}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputWithIcon, styles.inputHalfTrib]}>
              <TextBox
                onfocus={false}
                leftIcon="note"
                fontSize={12}
                placeholder="Ncm"
                placeholderTextColor={COLORS.gray3}
                value={ncm}
                onChangeText={(text) => setNcm(text)}
                style={[styles.input, styles.fontTrib]}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputWithIcon, styles.inputHalfTrib]}>
              <TextBox
                onfocus={false}
                leftIcon="receipt"
                placeholder="Cfop"
                placeholderTextColor={COLORS.gray3}
                value={cfop}
                onChangeText={(text) => setCfop(text)}
                style={[styles.input, , styles.fontTrib]}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={styles.containerRowTrib}>
            <Text style={styles.containerCstTrib}>CST</Text>
            <Text style={styles.containerCsosnTrib}>CSOSN</Text>
          </View>
          <View style={styles.containerRow}>
            <View style={[styles.inputWithIcon, styles.inputHalf]}>
              <MaterialIcons
                name="description"
                size={24}
                color={COLORS.gray3}
              />
              <TextBox
                // maskType="money"
                onfocus={false}
                placeholder="CST"
                placeholderTextColor={COLORS.gray3}
                value={cst}
                onChangeText={(text) => setCst(text)}
                style={[styles.input, errors.price ? styles.inputError : null]}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputWithIcon, styles.inputHalf]}>
              <MaterialIcons name="settings" size={24} color={COLORS.gray3} />
              <TextBox
                onfocus={false}
                placeholder="CSOSN"
                placeholderTextColor={COLORS.gray3}
                value={csosn}
                onChangeText={setCsosn}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão Cadastrar Produto */}
      <View style={styles.bottomButtonContainer}>
        <Button
          text="Cadastrar Produto"
          onPress={handleCreateProduct}
          loading={loading}
        />
      </View>

      {/* FlatList de Produtos */}

      {productsLoading ? ( // Renderiza o spinner GRANDE da lista
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
            marginTop: 20,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary || "#007bff"} />
          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              color: COLORS.text || "#333",
            }}
          >
            Carregando produtos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (!item || !item.id) return null;

            return (
              <View style={styles.productCard}>
                <ImageLoadingView imageUrl={item.image_url} imageSize={100} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDetails}>
                  Preço: R$ {item.price} | Estoque:{" "}
                  {item.quantity > 0 ? item.quantity : "Sem estoque"}
                </Text>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedProductId(item.id);
                      setName(item.name);
                      setPrice(item.price);
                      setBarcode(item.barcode);
                      setAliquota(item.aliquota);
                      setNcm(item.ncm);
                      setCfop(item.cfop);
                      setCst(item.cst);
                      setCsosn(item.csosn);
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
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  );
}

export default ProductsRegistrationScreen;

/*const payload = {
        id: selectedProductId || null, // Se não houver ID, será enviado `null`
        name,
        price: formattedPrice,
        barcode,
        ncm,
        aliquota,
        cfop,
        cst,
        csosn,
        stock: formattedQuantity,
        category_id: selectedCategory,
        company_id: companyId,
      };

      console.log("Payload antes de enviar para a API:", payload);

      if (imageUri) {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("image", {
          uri: imageUri,
          name: `product_image.${fileType}`,
          type: `image/${fileType}`,
        });
      }*/

/* {
          id: selectedProductId || "",
          name,
          price: parseFloat(price.replace(",", ".")),
          barcode,
          ncm,
          aliquota,
          cfop,
          cst,
          csosn,
          stock: Number(quantity),
          category_id: selectedCategory,
          company_id: companyId,
          uri: imageUri,
        },*/
