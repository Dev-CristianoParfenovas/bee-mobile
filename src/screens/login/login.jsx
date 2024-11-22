import { Image, TextInput, View, Text, TouchableOpacity } from "react-native";
import icons from "../../constants/icons.js";
import { styles } from "./login.style.js";
import Button from "../../components/button/button.jsx";

function Login() {
  return (
    <View style={styles.container}>
      <View style={styles.containerlogo}>
        <Image source={icons.logobee} style={styles.beelogin} />
      </View>
      <View>
        <View style={styles.containerInput}>
          <TextInput placeholder="E-mail" style={styles.input} />
        </View>

        <View style={styles.containerInput}>
          <TextInput
            placeholder="Senha"
            style={styles.input}
            secureTextEntry={true}
          />
        </View>

        <Button text="Acessar" />
      </View>
      <View style={styles.footer}>
        <Text style={styles.textfooter}>Não tem conta. </Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Criar agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Login;
