import { useState } from "react";
import { Image, View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons"; // Biblioteca de ícones
import icons from "../../constants/icons.js";
import { styles } from "./login.style.js";
import Button from "../../components/button/button.jsx";
import { validateForm } from "../../utils/validators.js";
import { COLORS } from "../../constants/theme.js";
import TextBox from "../../components/textbox/textbox.jsx";
import images from "../../constants/icons.js";
import api from "../../constants/api.js";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigation } from "@react-navigation/native";

function Login(props) {
  const { setIsAuthenticated } = useAuth(); // Atualiza o estado de autenticação
  const { login } = useUser(); // Contexto do usuário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigation = useNavigation(); // Obtém o objeto de navegação

  const handleLogin = async () => {
    const formErrors = validateForm({ email, password });
    setErrors(formErrors);

    if (formErrors.email || formErrors.password) {
      Alert.alert("Erro", "Por favor, corrija os erros antes de continuar.");
      return;
    }

    try {
      const response = await api.post("/employee/login", { email, password });

      console.log("Login bem-sucedido:", response.data);
      Alert.alert(
        "Login bem-sucedido!",
        `Bem-vindo, ${response.data.employee.name}`
      );

      // Atualiza os estados globais
      setIsAuthenticated(true); // Atualiza o estado de autenticação
      login(response.data.employee); // Salva os dados completos do usuário no contexto
      // Aqui, você deve garantir que o papel do usuário (role) também seja atualizado no contexto
      const userRole = response.data.employee.role; // Supondo que o papel seja retornado com o login
      setUserRole(userRole); // Atualize o papel do usuário

      // Navega para a tela do Drawer
      // navigation.navigate("DrawerScreen"); // Redireciona para a tela de Drawer
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Ocorreu um erro ao fazer login, verifique email e senha!";
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
        opacity={0.1} // Ajuste para o efeito de marca d'água
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

        {/* Campo Senha */}
        <View style={styles.containerInput}>
          <View style={styles.inputWithIcon}>
            <FontAwesome name="lock" size={24} color={COLORS.gray3} />
            <TextBox
              placeholder="Senha"
              isPassword={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={[styles.input, errors.password ? styles.inputError : null]}
              autoCapitalize="none" // Evita capitalização
              keyboardType="default"
            />
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        <Button text="Acessar" onPress={handleLogin} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.textfooter}>Não tem conta. </Text>
        <TouchableOpacity onPress={() => props.navigation.navigate("account")}>
          <Text style={styles.footerLink}>Criar agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Login;
