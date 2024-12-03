import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./textbox.style";
import { COLORS } from "../../constants/theme";
import { MaterialIcons } from "@expo/vector-icons"; // Biblioteca de ícones

function TextBox(props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(props.isPassword);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <View style={[styles.container, props.style]}>
      <TextInput
        style={styles.input}
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor || COLORS.gray3}
        secureTextEntry={props.isPassword && isPasswordVisible}
        value={props.value}
        onChangeText={props.onChangeText}
        autoCapitalize={props.autoCapitalize || "none"}
        keyboardType={props.keyboardType || "default"}
      />
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
