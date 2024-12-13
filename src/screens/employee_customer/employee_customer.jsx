import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Button from "../../components/button/button.jsx";
import { styles } from "./employee_customer.style.js";
import { Ionicons } from "@expo/vector-icons";
import images from "../../constants/icons.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigation } from "@react-navigation/native";

function EmployeeCustomer(props) {
  const { userName } = useAuth();
  const [employee, setEmployee] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const navigation = useNavigation(); // Hook para acessar a navegação

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            // style={styles.backButton}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>

          <Text style={styles.text}>{userName}</Text>
        </View>
      </View>

      <View style={styles.containerfunc}>
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
            props.navigation.navigate("Produtos", {
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
