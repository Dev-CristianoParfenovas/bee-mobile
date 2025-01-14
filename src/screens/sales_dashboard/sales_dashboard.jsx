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
  const [selectedClient, setSelectedClient] = useState("all");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientsError, setClientsError] = useState(false);
  const [sales, setSales] = useState([]);
  const { userName, companyId, authToken, employeeId } = useAuth();
  const navigation = useNavigation();

  const fetchEmployees = async () => {
    try {
      const response = await api.get(`/employees/${companyId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Erro ao buscar funcionários: ", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get(`/clients/${companyId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.data && Array.isArray(response.data.data)) {
        setClients(response.data.data);
        setClientsError(false);
      } else {
        setClientsError(true);
        console.error(
          "Clientes não encontrados, formato inesperado:",
          response.data
        );
      }
    } catch (error) {
      setClientsError(true);
      console.error("Erro ao buscar clientes: ", error);
    }
  };

  const calculateTotalSalesByEmployee = (sales) => {
    const salesByEmployee = {};

    if (!employees || employees.length === 0) {
      console.warn("Lista de funcionários está vazia ou não carregada.");
      return [];
    }

    sales.forEach((sale) => {
      const { employee_id, total_price } = sale;

      // Inicializa o registro para o funcionário, se não existir
      if (!salesByEmployee[employee_id]) {
        console.log("Verificando dados de funcionário para ID:", employee_id);
        const employee = employees.find((emp) => emp.id === employee_id); // Busca o nome do funcionário
        console.log("Funcionário encontrado:", employee);
        salesByEmployee[employee_id] = {
          employeeId: employee_id,
          name: employee?.name || `Funcionário ${employee_id}`, // Usa o nome real ou um placeholder
          totalSales: 0,
        };
      }

      // Soma o total de vendas, convertendo `total_price` para número
      salesByEmployee[employee_id].totalSales += parseFloat(total_price) || 0;
    });

    return Object.values(salesByEmployee);
  };

  const fetchSales = async () => {
    try {
      let startOfDay = new Date(startDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      let endOfDay = new Date(endDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      let url = `/sales/${companyId}/date-range?startDate=${startOfDay.toISOString()}&endDate=${endOfDay.toISOString()}`;

      // Faz a requisição
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data && Array.isArray(response.data)) {
        // Log dos dados recebidos da API
        console.log("Dados recebidos da API:", response.data);

        // Aplica o filtro de vendas
        const filteredSales = response.data.filter((sale) => {
          // Filtro por empregado
          if (
            selectedEmployee !== "all" &&
            parseInt(sale.employee_id) !== parseInt(selectedEmployee) // Garante que os valores sejam comparados como números
          ) {
            return false;
          }

          // Filtro por cliente
          if (
            selectedClient !== "all" &&
            parseInt(sale.client_id) !== parseInt(selectedClient) // Garante que os valores sejam comparados como números
          ) {
            return false;
          }
          return true;
        });

        console.log("Vendas filtradas:", filteredSales);

        // Calcula o total de vendas por funcionário
        const salesData = calculateTotalSalesByEmployee(filteredSales);
        console.log("SalesData após cálculo:", salesData);

        setFilteredData(salesData);
      } else {
        console.warn("Resposta da API de vendas não contém dados válidos.");
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchClients();
    fetchSales();
  }, [selectedEmployee, selectedClient, startDate, endDate]);

  return (
    <View style={styles.container}>
      <Image
        source={images.beelogin}
        style={styles.watermark}
        resizeMode="contain"
        opacity={0.1}
      />
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

      <Text style={styles.sectionTitle}>Filtrar por Funcionário</Text>
      <View style={styles.containerfunc}>
        <Picker
          selectedValue={selectedEmployee}
          onValueChange={(itemValue) => setSelectedEmployee(itemValue)}
        >
          <Picker.Item key="all" label="Todos" value="all" />
          {employees.map((employee) => (
            <Picker.Item
              key={`employee-${employee.id}`} // Usando uma chave única para cada item
              label={employee.name}
              value={employee.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.sectionTitle}>Filtrar por Cliente</Text>
      <View style={styles.containerfunc}>
        <Picker
          selectedValue={selectedClient}
          onValueChange={(itemValue) => setSelectedClient(itemValue)}
        >
          <Picker.Item key="all" label="Todos" value="all" />
          {clientsError ? (
            <Picker.Item
              key="error"
              label="Erro ao carregar clientes"
              value=""
            />
          ) : (
            clients.map((client) => (
              <Picker.Item
                key={`client-${client.id}`} // Usando uma chave única para cada item
                label={client.name}
                value={client.id}
              />
            ))
          )}
        </Picker>
      </View>

      {selectedClient !== "all" && (
        <Text style={styles.selectedEmployeeText}>
          Cliente Selecionado:{" "}
          {clients.find((c) => c.id === selectedClient)?.name || "Desconhecido"}
        </Text>
      )}

      <View style={styles.dateFilters}>
        <View style={styles.datePicker}>
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text
              style={styles.customButtonText}
            >{`Data Inicial: ${startDate.toLocaleDateString()}`}</Text>
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

        <View style={styles.datePicker}>
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text
              style={styles.customButtonText}
            >{`Data Final: ${endDate.toLocaleDateString()}`}</Text>
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

        <View style={styles.filterButtonContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={fetchSales}>
            <Text style={styles.filterButtonText}>Aplicar Filtro</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.orderSummary}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.employeeId.toString()}
          renderItem={({ item }) => (
            console.log("Item:", item), // Verifique o conteúdo de item
            (
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {item.name || "Nome não disponível"}
                </Text>
                <Text style={styles.itemPrice}>
                  R$ {item.totalSales.toFixed(2)}
                </Text>
              </View>
            )
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>
              Nenhum funcionário ou cliente encontrado para o período
              selecionado.
            </Text>
          )}
        />
      </View>
    </View>
  );
};

export default SalesDashboard;
