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

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleLogin = () => {
    const formErrors = validateForm({ email, password });
    setErrors(formErrors);

    if (!formErrors.email && !formErrors.password) {
      Alert.alert("Login bem-sucedido!", `Bem-vindo, ${email}`);
    } else {
      Alert.alert("Erro", "Por favor, corrija os erros antes de continuar.");
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
