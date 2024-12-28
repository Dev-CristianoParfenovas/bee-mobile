import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./textbox.style";
import { COLORS } from "../../constants/theme";
import { MaterialIcons } from "@expo/vector-icons"; // Biblioteca de ícones
import { TextInputMask } from "react-native-masked-text"; // Máscara para inputs

function TextBox(props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(props.isPassword);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const renderInput = () => {
    if (props.maskType === "phone") {
      return (
        <TextInputMask
          type="cel-phone"
          options={{
            maskType: "BRL", // Máscara brasileira
            withDDD: true, // Inclui o DDD
            dddMask: "(99) ", // Formato do DDD
          }}
          style={styles.input}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor || COLORS.gray3}
          value={props.value}
          onChangeText={props.onChangeText}
          keyboardType="phone-pad"
        />
      );
    } else if (props.maskType === "money") {
      return (
        <TextInputMask
          type="money"
          options={{
            precision: 2,
            separator: ".", // Define o separador decimal
            delimiter: ".", // Define o delimitador de milhares
            unit: "", // Remove o prefixo
            suffixUnit: "", // Remove o sufixo
          }}
          style={styles.input}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor || COLORS.gray3}
          value={props.value}
          onChangeText={props.onChangeText}
          keyboardType="numeric"
        />
      );
    }
    return (
      <TextInput
        style={styles.input}
        onFocus={props.onFocus}
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor || COLORS.gray3}
        secureTextEntry={props.isPassword && isPasswordVisible}
        value={props.value}
        onChangeText={props.onChangeText}
        autoCapitalize={props.autoCapitalize || "none"}
        keyboardType={props.keyboardType || "default"}
      />
    );
  };

  return (
    <View style={[styles.container, props.style]}>
      {renderInput()}
      {props.isPassword && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <MaterialIcons
            name={isPasswordVisible ? "visibility-off" : "visibility"}
            size={24}
            color={COLORS.gray3}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default TextBox;
