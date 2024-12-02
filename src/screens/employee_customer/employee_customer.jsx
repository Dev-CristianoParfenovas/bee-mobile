import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Button from "../../components/button/button.jsx";
import { styles } from "./employee_customer.style.js";
import images from "../../constants/icons.js";

function EmployeeCustomer(props) {
  const [employee, setEmployee] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customers = [
    { id: "1", name: "Transportes Sinivaldo Express", phone: "123456789" },
    { id: "2", name: "Cristiano Mendes da Silva", phone: "987654321" },
    { id: "3", name: "Juca Bala", phone: "567890123" },
  ];

  // Filtra clientes com base na busca
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Marca d'água */}
      <Image
        source={images.beelogin}
        style={styles.watermark}
        resizeMode="contain"
        opacity={0.1}
      />
      <View style={styles.banner}>
        <View style={styles.containerbanner}>
          <Text style={styles.text}>Funcionário / Cliente</Text>
        </View>
      </View>

      <View style={styles.containerfunc}>
        {/* Picker de Funcionário */}
        <Text style={styles.title}>Funcionário:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={employee}
            style={styles.picker}
            onValueChange={(itemValue) => setEmployee(itemValue)}
          >
            <Picker.Item label="Selecione o funcionário" value="" />
            <Picker.Item label="João" value="João" />
            <Picker.Item label="Pedro" value="Pedro" />
            <Picker.Item label="José" value="José" />
            <Picker.Item label="Carlos" value="Carlos" />
            <Picker.Item label="Ana" value="Ana" />
            <Picker.Item label="Márcia" value="Márcia" />
          </Picker>
        </View>

        {/* Campo de busca */}
        <Text style={styles.title}>Buscar por:</Text>
        <View style={styles.containerInput}>
          <TextInput
            placeholder="Nome / Telefone / Placa"
            style={styles.input}
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>

        {/* Lista de clientes filtrados */}
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.customerCard,
                selectedCustomer?.id === item.id && styles.selectedCustomerCard,
              ]}
              onPress={() => setSelectedCustomer(item)}
            >
              <Text style={styles.customerName}>{item.name}</Text>
              <Text style={styles.customerPhone}>{item.phone}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Botão */}
      <View style={styles.containerbtn}>
        <Button
          text="Acessar vendas"
          onPress={() =>
            props.navigation.navigate("products", {
              employee,
              customer: selectedCustomer,
            })
          }
          disabled={!selectedCustomer || !employee} // Desabilita o botão se não houver seleção
        />
      </View>
    </View>
  );
}

export default EmployeeCustomer;
