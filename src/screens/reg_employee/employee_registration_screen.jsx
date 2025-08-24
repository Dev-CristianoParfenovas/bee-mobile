import { FontAwesome, MaterialIcons } from "@expo/vector-icons"; // Biblioteca de ícones
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/button/button.jsx";
import TextBox from "../../components/textbox/textbox.jsx";
import api from "../../constants/api.js";
import { default as icons, default as images } from "../../constants/icons.js";
import { COLORS } from "../../constants/theme.js";
import { AuthProvider, useAuth } from "../../context/AuthContext"; // Importa o AuthContext
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "../../utils/validators.js";
import { styles } from "./employee_registration_screen.js";

function EmployeeRegistrationScreen(props) {
  const { companyId } = useAuth(); // Acessa o company_id do AuthContext
  console.log("Company ID do Emplooyee registration:", companyId); // Deve exibir o ID no console
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const navigation = useNavigation(); // Hook para acessar a navegação
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const limparCampos = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  //Busca funcionários Cadastrados
  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado.");
        setLoadingEmployees(false);
        return;
      }

      const response = await api.get("/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmployees(response.data); // Ajuste caso a API retorne algo tipo response.data.data
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      Alert.alert("Erro", "Não foi possível carregar os funcionários.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Abrir modal e carregar funcionários
  const handleOpenModal = () => {
    setModalVisible(true);
    fetchEmployees();
  };

  // Preencher formulário com os dados do funcionário selecionado
  const handleSelectEmployee = (employee) => {
    setName(employee.name);
    setEmail(employee.email);
    setPhone(employee.phone || "");
    setPassword("");
    // Password não é carregada
    setModalVisible(false);
  };

  const handleCreateEmployee = async () => {
    // Valida os campos de entrada
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    const emailError = validateEmail(email);
    const passwordError = password ? validatePassword(password) : ""; // valida só se houver senha

    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
      password: passwordError,
    });

    if (!nameError && !emailError && !passwordError && !phoneError) {
      if (!companyId) {
        Alert.alert("Erro", "ID da empresa não está definido.");
        return;
      }

      setLoading(true);

      try {
        // Monta payload dinâmico
        const payload = {
          name,
          email,
          phone,
          company_id: companyId,
        };

        // Só envia senha se tiver valor
        if (password) {
          payload.password = password;
        }

        console.log("Enviando dados para API:", payload);

        const response = await api.post("/employees", payload);

        console.log("Status da resposta:", response.status);
        console.log("Dados da resposta:", response.data);

        const { data } = response;

        if (data?.employee) {
          console.log("Funcionário criado ou atualizado:", data.employee);
          Alert.alert("Sucesso", `Funcionário registrado com sucesso!`);

          // Limpa os campos do formulário após o cadastro com sucesso
          setName("");
          setEmail("");
          setPhone("");
          setPassword("");
          setErrors({
            name: "",
            email: "",
            phone: "",
            password: "",
          });
        } else {
          console.error("Estrutura inesperada na resposta:", data);
          Alert.alert(
            "Erro",
            "A resposta da API não contém os dados esperados do funcionário."
          );
        }
      } catch (error) {
        console.error(
          "Erro ao criar funcionário:",
          error.response?.data || error.message
        );

        const errorMessage =
          error.response?.data?.message || "Erro desconhecido.";
        Alert.alert("Erro", errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Erro", "Por favor, corrija os erros antes de continuar.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      limparCampos();
    }, []) // <-- dependências da função, se houver
  );

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

        {/* Cabeçalho com título */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cadastro de Funcionário</Text>
        </View>

        {/* Marca d'água */}
        <Image
          source={images.beelogin}
          style={styles.watermark}
          resizeMode="contain"
          opacity={0.1} // Ajuste para o efeito de marca d'águ  a
        />

        <View style={styles.containerlogo}>
          <Image source={icons.logobee} style={styles.beelogin} />
        </View>

        <View style={styles.formContainer}>
          {/* Campo Nome */}
          <View style={styles.containerInput}>
            <View style={styles.inputWithIcon}>
              <MaterialIcons name="person" size={24} color={COLORS.gray3} />
              <TextBox
                placeholder="Nome/Razão Social"
                placeholderTextColor={COLORS.gray3} // Cor do texto placeholder
                style={[styles.input, errors.name ? styles.inputError : null]}
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

          {/*Campo Email*/}
          <View style={styles.containerInput}>
            <View style={styles.inputWithIcon}>
              <MaterialIcons name="email" size={24} color={COLORS.gray3} />
              <TextBox
                placeholder="E-mail"
                isPassword={false}
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={[styles.input, errors.email ? styles.inputError : null]}
                autoCapitalize="none" // Começa com letra minúscula
                keyboardType="email-address" // Teclado específico para e-mail
              />
            </View>
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>
          {/*Campo Telefone*/}
          <View style={styles.containerInput}>
            <View style={styles.inputWithIcon}>
              <MaterialIcons name="phone" size={24} color={COLORS.gray3} />
              <TextBox
                placeholder="Telefone"
                placeholderTextColor={COLORS.gray3} // Cor do texto placeholder
                style={[styles.input, errors.phone ? styles.inputError : null]}
                value={phone}
                onChangeText={(text) => setPhone(text)}
                maskType="phone"
              />
            </View>
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
          </View>
          {/*Campo Senha*/}
          <View style={styles.containerInput}>
            <View style={styles.inputWithIcon}>
              <FontAwesome name="lock" size={24} color={COLORS.gray3} />
              <TextBox
                placeholder={password ? "Senha" : "Digite para alterar a senha"}
                isPassword={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={[
                  styles.input,
                  errors.password ? styles.inputError : null,
                ]}
              />
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          <Button
            text="Criar Conta / Editar"
            onPress={handleCreateEmployee}
            loading={loading}
            disabled={loading}
            style={styles.buttonCreate}
          />
          {/* Botão ver funcionários */}
          <Button
            style={styles.buttonVerFuncionarios}
            text="Ver Funcionários"
            onPress={handleOpenModal}
          />
        </View>
      </View>
      {/* Modal fora do container */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Funcionários Cadastrados</Text>

            {loadingEmployees ? (
              <Text>Carregando...</Text>
            ) : (
              <ScrollView>
                {employees.map((emp) => (
                  <TouchableOpacity
                    key={emp.id_employee}
                    style={styles.modalItem}
                    onPress={() => handleSelectEmployee(emp)}
                  >
                    <Text style={styles.modalText}>
                      {emp.name} - {emp.email}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <Button text="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </AuthProvider>
  );
}

export default EmployeeRegistrationScreen;
