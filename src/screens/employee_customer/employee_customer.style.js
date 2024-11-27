import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/theme.js";

export const styles = StyleSheet.create({
  banner: {
    height: 110, // Proporção do banner na tela
    backgroundColor: COLORS.bluebtn,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  containerbanner: {
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    textAlign: "center",
    marginTop: 35,
  },
  watermark: {
    position: "absolute",
    width: 350, // Largura desejada para o logo
    height: 350, // Altura desejada para o logo
    alignSelf: "center", // Centraliza horizontalmente
    top: "40%", // Ajusta a posição vertical
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  containerfunc: {
    flex: 1,
    marginTop: 35,
    justifyContent: "flex-start",
    padding: 15,
    color: COLORS.gray5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10, // Arredondar as bordas
    marginBottom: 16,
    overflow: "hidden", // Garantir que o conteúdo dentro respeite as bordas arredondadas
    width: "100%",
    height: 56,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginStart: 5,
    marginBottom: 8,
  },
  containerInput: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.gray5,
    padding: 12,
    borderRadius: 10,
    height: 56,
    width: "100%",
  },
  containerbtn: {
    alignItems: "center",
    marginBottom: 25,
  },
});
