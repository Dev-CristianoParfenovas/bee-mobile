import { TextInput } from "react-native";
import { styles } from "./textbox.style";
import { COLORS } from "../../constants/theme";

function TextBox(props) {
  return (
    <>
      <TextInput
        style={styles.input} // Aceita estilos externos
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor || COLORS.gray3}
        secureTextEntry={props.isPassword}
        value={props.value} // Suporte ao valor controlado
        onChangeText={props.onChangeText} // Callback para texto
      />
    </>
  );
}
export default TextBox;
