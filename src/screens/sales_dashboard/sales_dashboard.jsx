import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "./sales_dashboard.style.js";
import images from "../../constants/icons.js";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const employees = [
  { id: "1", name: "João", totalSales: 300, salesDate: "2024-12-13" },
  { id: "2", name: "Maria", totalSales: 450, salesDate: "2024-12-13" },
  { id: "3", name: "Carlos", totalSales: 200, salesDate: "2024-12-12" },
];

const SalesDashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [filteredData, setFilteredData] = useState(employees);

  const navigation = useNavigation();

  // Atualiza os dados filtrados sempre que o filtro muda
  useEffect(() => {
    const newFilteredData = employees.filter((employee) => {
      const employeeSalesDate = new Date(employee.salesDate);
      return (
        (selectedEmployee === "all" || employee.id === selectedEmployee) &&
        employeeSalesDate >= startDate &&
        employeeSalesDate <= endDate
      );
    });

    setFilteredData(newFilteredData);
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
          onValueChange={(itemValue) => setSelectedEmployee(itemValue)}
        >
          <Picker.Item label="Todos" value="all" />
          {employees.map((employee) => (
            <Picker.Item
              key={employee.id}
              label={employee.name}
              value={employee.id}
            />
          ))}
        </Picker>
      </View>

      {/* Filtro por data */}
      <View style={styles.dateFilters}>
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
      </View>

      {/* FlatList com resumo de vendas */}
      <View style={styles.orderSummary}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
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
