import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/theme.js";

export const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.black, // Cor do texto digitado
    fontSize: FONT_SIZE.md,
    padding: 1,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 40, // Deixa o container arredondado
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,

    height: 50,
    width: 350,
  },
  // Estilo para erros
  inputError: {
    borderColor: "red", // Borda vermelha para inputs com erro
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 5, // Espaço para o ícone
  },
});
