import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import api from "../../constants/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { styles } from "./saledetailscreen.js";
import { ScrollView } from "react-native-gesture-handler";

// Função para formatar datas
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function SalesDetailScreen({ route }) {
  const {
    saleGroupId,
    employeeName,
    clientName,
    vehicleModel,
    vehiclePlate,
    startDate,
    endDate,
  } = route.params;

  const [loadingSalesDetail, setLoadingSalesDetail] = useState(false);
  const [products, setProducts] = useState([]);
  const [logoUri, setLogoUri] = useState(null);
  const [logoBase64, setLogoBase64] = useState(null);

  const { authToken, userName } = useAuth();
  const navigation = useNavigation();
  const companyName = userName || "Minha Empresa";

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  useEffect(() => {
    if (saleGroupId) fetchProducts();
    loadLogo();
  }, [saleGroupId]);

  // Carrega logo salva no AsyncStorage
  const loadLogo = async () => {
    const storedLogo = await AsyncStorage.getItem("companyLogo");
    if (storedLogo) {
      setLogoUri(storedLogo);
      const base64 = await FileSystem.readAsStringAsync(storedLogo, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setLogoBase64(`data:image/jpeg;base64,${base64}`);
    }
  };

  // Buscar produtos da venda
  const fetchProducts = async () => {
    setLoadingSalesDetail(true);
    try {
      const response = await api.get(`/sales/products-by-sale/${saleGroupId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const items = response.data?.data ?? response.data ?? [];
      setProducts(items);
    } catch (error) {
      console.error("Erro ao buscar produtos da venda:", error);
    } finally {
      setLoadingSalesDetail(false);
    }
  };

  const totalGeral = products.reduce(
    (acc, item) => acc + Number(item.total_price ?? 0),
    0
  );

  // Função para escolher logo apenas da galeria
  const pickLogo = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão para acessar a galeria é necessária!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        let selectedUri = result.assets[0].uri;

        // Redimensionar e comprimir
        const manipResult = await ImageManipulator.manipulateAsync(
          selectedUri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        selectedUri = manipResult.uri;

        // Salvar URI e base64
        setLogoUri(selectedUri);
        await AsyncStorage.setItem("companyLogo", selectedUri);

        const base64 = await FileSystem.readAsStringAsync(selectedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setLogoBase64(`data:image/jpeg;base64,${base64}`);

        alert("Logo salva com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao escolher logo:", error);
      alert("Não foi possível selecionar a logo.");
    }
  };

  const handleGeneratePDF = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #fff; color: #333; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { max-height: 80px; width: auto; display: block; margin: 0 auto 10px auto; }
            .header h1 { color: #2e3192; margin: 0; font-size: 24px; }
            .info { margin: 6px 0; font-size: 14px; }
            .divider { border-top: 2px solid #2e3192; margin: 15px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 13px; }
            th { background-color: #f0f0f0; }
            .total { text-align: right; font-size: 16px; margin-top: 20px; font-weight: bold; color: #2e3192; }
          </style>
        </head>
        <body>
          <div class="header">
            ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" />` : ""}
            <h1>${companyName}</h1>
          </div>

          <div class="info"><strong>Funcionário:</strong> ${
            employeeName || "N/A"
          }</div>
          <div class="info"><strong>Cliente:</strong> ${
            clientName || "N/A"
          }</div>
          <div class="info"><strong>Veículo:</strong> ${
            vehiclePlate || "N/A"
          } - ${vehicleModel || "N/A"}</div>
          <div class="info"><strong>Período:</strong> ${formattedStartDate} até ${formattedEndDate}</div>

          <div class="divider"></div>

          <h2>Produtos da Venda</h2>
          <table>
            <tr>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Preço Unitário</th>
              <th>Total</th>
            </tr>
            ${products
              .map(
                (p) => `
              <tr>
                <td>${p.product_name}</td>
                <td>${p.quantity}</td>
                <td>R$ ${Number(p.unit_price).toFixed(2)}</td>
                <td>R$ ${Number(p.total_price).toFixed(2)}</td>
              </tr>`
              )
              .join("")}
          </table>

          <div class="total">Total da Venda: R$ ${totalGeral.toFixed(2)}</div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, paddingVertical: 8 }}>
      <Text style={{ fontWeight: "bold" }}>{item.product_name}</Text>
      <Text>Quantidade: {item.quantity}</Text>
      <Text>Preço: R$ {Number(item.unit_price).toFixed(2)}</Text>
      <Text>Total: R$ {Number(item.total_price).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.containerbanner}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <Icon style={styles.icone} name="chart-bar" size={24} color="#FFF" />
        <Text style={styles.text}> Detalhe de Vendas</Text>
      </View>

      {loadingSalesDetail ? (
        <View style={styles.carregandoTela}>
          <ActivityIndicator size="large" color="#2e3192" />
          <Text style={styles.textCarregando}>Carregando...</Text>
        </View>
      ) : (
        <>
          <View style={styles.contentContainer}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.containerdados}>
                <Text style={{ fontWeight: "bold" }}>
                  Empresa: {companyName || "N/A"}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Funcionário: {employeeName || "N/A"}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Cliente: {clientName || "N/A"}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Veículo: {vehiclePlate || "N/A"} - {vehicleModel || "N/A"}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Período: {new Date(startDate).toLocaleDateString("pt-BR")} até{" "}
                  {new Date(endDate).toLocaleDateString("pt-BR")}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => pickLogo(false)}
                    style={styles.buttonLogo}
                  >
                    <Text style={styles.buttonText}>Inserir Logotipo</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.containerproducts}>
                <FlatList
                  data={products}
                  keyExtractor={(item, index) => String(index)}
                  renderItem={renderItem}
                  scrollEnabled={false}
                />
              </View>
            </ScrollView>
          </View>

          <View style={styles.footer}>
            <Text style={styles.totalVenda}>
              Total da Venda: R$ {totalGeral.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.buttonPDF}
              onPress={handleGeneratePDF}
            >
              <Text style={styles.buttonPDFText}>Gerar PDF</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
