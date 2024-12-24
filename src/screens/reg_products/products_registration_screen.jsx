import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons"; // Biblioteca de ícones
import { styles } from "./products_registration_screen.js";
import Button from "../../components/button/button.jsx";
import { COLORS } from "../../constants/theme.js";
import api from "../../constants/api.js";
import { useNavigation } from "@react-navigation/native";
import { useAuth, AuthProvider } from "../../context/AuthContext.jsx"; // Importa o AuthContext
import { Picker } from "@react-native-picker/picker";

function ProductsRegistrationScreen() {
  const { companyId } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  // Buscar categorias no banco de dados
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get(`/categories/${companyId}`);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error.message);
      }
    }
    if (companyId) fetchCategories();
  }, [companyId]);

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
      console.error("Erro ao buscar produto:", error.message);
      Alert.alert("Erro", "Falha ao buscar o produto.");
    }
  };

  const handleCreateProduct = async () => {
    if (!name || !price || !quantity || !selectedCategory) {
      Alert.alert("Erro", "Todos os campos devem ser preenchidos.");
      return;
    }

    try {
      const response = await api.post("/products", {
        name,
        price,
        stock: quantity,
        categoryId: selectedCategory,
        company_id: companyId,
      });

      if (response.data?.product) {
        Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
        setName("");
        setPrice("");
        setQuantity("");
        setSelectedCategory("");
      }
    } catch (error) {
      console.error("Erro ao criar produto:", error.message);
      Alert.alert("Erro", "Não foi possível cadastrar o produto.");
    }
  };

  return (
    <AuthProvider>
      <View style={styles.container}>
        {/* Botão Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cadastro de Produtos</Text>
        </View>

        {/* Campo de Busca */}
        <View style={styles.containerInput}>
          <View style={styles.inputWithIcon}>
            <MaterialIcons name="search" size={24} color={COLORS.gray3} />
            <TextInput
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
        <View style={[styles.containerInput, styles.pickerContainer]}>
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
            <TextInput
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
              <TextInput
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
              <TextInput
                placeholder="Quantidade Estoque"
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
      </View>
    </AuthProvider>
  );
}

export default ProductsRegistrationScreen;
