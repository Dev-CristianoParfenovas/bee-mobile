import { Image, TextInput, View, Text, TouchableOpacity } from "react-native";
import icons from "../../constants/icons.js";
import { styles } from "./account.style.js";
import Button from "../../components/button/button.jsx";

function Account() {
  return (
    <View style={styles.container}>
      <View style={styles.containerlogo}>
        <Image source={icons.logobee} style={styles.beelogin} />
      </View>
      <View>
        <View style={styles.containerInput}>
          <TextInput placeholder="Nome" style={styles.input} />
        </View>
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

        <Button text="Criar Conta" />
      </View>
      <View style={styles.footer}>
        <Text style={styles.textfooter}>Já tenho conta. </Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Fazer login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Account;
