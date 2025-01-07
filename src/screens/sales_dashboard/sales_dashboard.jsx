import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "./sales_dashboard.style.js";
import images from "../../constants/icons.js";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../constants/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const SalesDashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [employees, setEmployees] = useState([]); // Lista de funcionários
  const [sales, setSales] = useState([]); // Adicionado o estado de vendas
  const { userName, companyId, authToken, employeeId } = useAuth(); // authToken já está vindo do contexto
  const navigation = useNavigation();

  console.log("Funcionários: ", userName);

  // Função para buscar funcionários
  const fetchEmployees = async () => {
    try {
      console.log("Company ID:", companyId);
      const response = await api.get(`/employees/${companyId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Adiciona o token no cabeçalho
        },
      });
      setEmployees(response.data); // Atualiza a lista de funcionários
    } catch (error) {
      console.error("Erro ao buscar funcionários: ", error);
    }
  };

  // Função para buscar vendas com filtro
  // Função para buscar vendas com o filtro de funcionário
  const fetchSales = async () => {
    try {
      // Ajusta as datas de início e fim
      let startOfDay = new Date(startDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      let endOfDay = new Date(endDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      // Adiciona o companyId à URL da requisição
      let url = `/sales?companyId=${companyId}&startDate=${startOfDay.toISOString()}&endDate=${endOfDay.toISOString()}`;

      // Se o funcionário não for "Todos", adiciona o filtro de employeeId
      if (selectedEmployee && selectedEmployee !== "all") {
        url += `&employeeId=${selectedEmployee}`;
      } else if (employeeId) {
        // Se o funcionário não for selecionado, usa o employeeId do contexto
        url += `&employeeId=${employeeId}`;
      }

      console.log("Requisição para URL:", url); // Verifique se o `companyId` está sendo adicionado corretamente

      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log("Dados retornados da API:", response.data);

      // Atualiza o estado com os dados de vendas
      setSales(response.data);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    }
  };

  // Chama a função fetchSales sempre que selectedEmployee, startDate ou endDate mudarem
  useEffect(() => {
    fetchEmployees();
    fetchSales();
  }, [selectedEmployee, startDate, endDate]);

  return (
    <View style={styles.container}>
      {/* Marca d'água */}
      <Image
        source={images.beelogin}
        style={styles.watermark}
        resizeMode="contain"
        opacity={0.1}
      />

      {/* Banner */}
      <View style={styles.containerbanner}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <Icon style={styles.icone} name="chart-bar" size={24} color="#FFF" />
        <Text style={styles.text}> Painel de Vendas</Text>
      </View>

      {/* Picker para selecionar funcionário */}
      <Text style={styles.sectionTitle}>Filtrar por Funcionário</Text>
      <View style={styles.containerfunc}>
        <Picker
          selectedValue={selectedEmployee}
          onValueChange={(itemValue) => {
            console.log("Valor selecionado no Picker:", itemValue);
            setSelectedEmployee(itemValue);
          }}
        >
          <Picker.Item label="Todos" value="all" />
          {employees.map((employee) => (
            <Picker.Item
              key={employee.id || employee.name}
              label={employee.name}
              value={employee.id}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.dateFilters}>
        {/* Filtro por Data Inicial */}
        <View style={styles.datePicker}>
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.customButtonText}>
              {`Data Inicial: ${startDate.toLocaleDateString()}`}
            </Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* Filtro por Data Final */}
        <View style={styles.datePicker}>
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.customButtonText}>
              {`Data Final: ${endDate.toLocaleDateString()}`}
            </Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* Botão para Aplicar o Filtro */}
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={fetchSales}>
            <Text style={styles.filterButtonText}>Aplicar Filtro</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FlatList com resumo de vendas */}
      <View style={styles.orderSummary}>
        <FlatList
          data={filteredData} // Usa os dados filtrados
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                R$ {item.totalSales.toFixed(2)}
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>
              Nenhum funcionário encontrado para o período selecionado.
            </Text>
          )}
        />
      </View>
    </View>
  );
};

export default SalesDashboard;
