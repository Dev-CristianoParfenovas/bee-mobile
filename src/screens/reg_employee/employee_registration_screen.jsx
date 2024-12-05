import { useState } from "react";
import { Image, View, Text, Alert, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons"; // Biblioteca de ícones
import icons from "../../constants/icons.js";
import { styles } from "./employee_registration_screen.js";
import Button from "../../components/button/button.jsx";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../../utils/validators.js";
import { COLORS } from "../../constants/theme.js";
import TextBox from "../../components/textbox/textbox.jsx";
import images from "../../constants/icons.js";
import { useNavigation } from "@react-navigation/native";

function EmployeeRegistrationScreen(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [isAdmin, setIsAdmin] = useState(false); // Estado para administrador
  const navigation = useNavigation(); // Hook para acessar a navegação

  const handleCreateAccount = () => {
    // Realiza validação dos campos
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({ name: nameError, email: emailError, password: passwordError });

    // Checa se todos os campos estão válidos
    if (!nameError && !emailError && !passwordError) {
      Alert.alert(
        "Conta criada com sucesso!",
        `Bem-vindo, ${name}.\nStatus: ${isAdmin ? "Administrador" : "Usuário"}`
      );
    } else {
      Alert.alert("Erro", "Por favor, corrija os erros antes de continuar.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
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
        {/*Campo Senha*/}
        <View style={styles.containerInput}>
          <View style={styles.inputWithIcon}>
            <FontAwesome name="lock" size={24} color={COLORS.gray3} />
            <TextBox
              placeholder="Senha"
              isPassword={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={[styles.input, errors.password ? styles.inputError : null]}
            />
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        <Button text="Criar Conta" onPress={handleCreateAccount} />
      </View>
    </View>
  );
}

export default EmployeeRegistrationScreen;
