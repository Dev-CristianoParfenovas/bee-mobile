import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import icons from "../../constants/icons.js";
import { styles } from "./employee_customer.style.js";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import Button from "../../components/button/button.jsx";

function EmployeeCustomer() {
  const [employee, setEmployee] = useState("");

  // Supondo que customers seja uma lista pré-definida de clientes
  const customers = [
    { id: "1", name: "Transportes Sinivaldo Express" },
    { id: "2", name: "Cristiano Mendes da Silva" },
    { id: "3", name: "Juca Bala" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.containerbanner}>
          <Text style={styles.text}>Funcionário / Cliente</Text>
        </View>
      </View>
      <View style={styles.containerfunc}>
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
        <Text style={styles.title}>Buscar por:</Text>
        <View style={styles.containerInput}>
          <TextInput
            placeholder="Nome / Telefone / Placa"
            style={styles.input}
          />
        </View>
      </View>
      <View style={styles.containerbtn}>
        <Button text="Acessar vendas" />
      </View>
    </View>
  );
}

export default EmployeeCustomer;
