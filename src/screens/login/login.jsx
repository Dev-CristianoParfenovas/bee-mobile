import { useState } from "react";
import { Image, View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import icons from "../../constants/icons.js";
import { styles } from "./login.style.js";
import Button from "../../components/button/button.jsx";
import { validateForm } from "../../utils/validators.js";
import { COLORS } from "../../constants/theme.js";
import TextBox from "../../components/textbox/textbox.jsx";
import images from "../../constants/icons.js";
import api from "../../constants/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Login(props) {
  // const { setIsAuthenticated } = useAuth(); // Atualiza o estado de autenticação
  const { login } = useAuth(); // Contexto do usuário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    const formErrors = validateForm({ email, password });
    setErrors(formErrors);

    // Validação de campos
    if (formErrors.email || formErrors.password) {
      Alert.alert("Erro", "Por favor, corrija os erros antes de continuar.");
      return;
    }

    try {
      console.log("Dados enviados para login:", { email, password });

      // Envia a requisição para login
      const response = await api.post("/employee/login", { email, password });

      console.log("Resposta da API:", response.data);

      // Extrai o token e dados do funcionário
      const { token, employee } = response.data;

      // Verifica se a resposta contém os dados necessários
      if (
        token &&
        employee?.is_admin !== undefined &&
        employee?.name &&
        employee?.companyId !== undefined
      ) {
        // Salva os dados do login no AsyncStorage
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("companyId", employee.companyId.toString());

        // Teste para garantir que o AsyncStorage foi salvo corretamente
        const storedToken = await AsyncStorage.getItem("userToken");
        const storedCompanyId = await AsyncStorage.getItem("companyId");
        console.log("Token armazenado:", storedToken);
        console.log("CompanyId armazenado:", storedCompanyId);

        // Realiza o login (essa parte pode ser ajustada conforme o seu fluxo)
        await login(
          token,
          employee.name,
          employee.companyId,
          employee.is_admin
        );

        // Exibe uma mensagem de sucesso
        Alert.alert("Login bem-sucedido!", `Bem-vindo, ${employee.name}`);
      } else {
        throw new Error("Dados de login incompletos na resposta da API");
      }
    } catch (error) {
      console.error(
        "Erro ao fazer login:",
        error.response?.data || error.message
      );

      // Exibe mensagem de erro
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Ocorreu um erro desconhecido.";

      Alert.alert("Erro", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {/* Marca d'água */}
      <Image
        source={images.beelogin}
        style={styles.watermark}
        resizeMode="contain"
        opacity={0.1}
      />
      <View style={styles.containerlogo}>
        <Image source={icons.logobee} style={styles.beelogin} />
      </View>
      <View>
        {/* Campo Email */}
        <View style={styles.containerInput}>
          <View style={styles.inputWithIcon}>
            <MaterialIcons name="email" size={24} color={COLORS.gray3} />
            <TextBox
              placeholder="E-mail"
              isPassword={false}
              value={email}
              onChangeText={setEmail}
              style={[styles.input, errors.email ? styles.inputError : null]}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {/* Campo Senha */}
        <View style={styles.containerInput}>
          <View style={styles.inputWithIcon}>
            <FontAwesome name="lock" size={24} color={COLORS.gray3} />
            <TextBox
              placeholder="Senha"
              isPassword={true}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, errors.password ? styles.inputError : null]}
              autoCapitalize="none"
            />
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        {/* Botão de Login */}
        <Button text="Acessar" onPress={handleLogin} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.textfooter}>Não tem conta? </Text>
        <TouchableOpacity onPress={() => props.navigation.navigate("account")}>
          <Text style={styles.footerLink}>Criar agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Login;
