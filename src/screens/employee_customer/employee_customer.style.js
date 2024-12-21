import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/theme.js";

export const styles = StyleSheet.create({
  banner: {
    height: 120, // Proporção do banner na tela
    backgroundColor: COLORS.bluebtn,
    justifyContent: "center",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  containerbanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    textAlign: "center",
    marginTop: 55,
    fontWeight: "bold",
    paddingLeft: 35,
    paddingRight: 125,
  },
  watermark: {
    position: "absolute",
    width: 350, // Largura desejada para o logo
    height: 350, // Altura desejada para o logo
    alignSelf: "center", // Centraliza horizontalmente
    top: "40%", // Ajusta a posição vertical
  },
  backButton: {
    marginTop: 55,
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
  containerbanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    top: "10%",
  },
  /* pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10, // Arredondar as bordas
    marginBottom: 16,
    overflow: "hidden", // Garantir que o conteúdo dentro respeite as bordas arredondadas
    width: "100%",
    height: 56,
  },*/
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
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
    padding: 15,
  },

  customerCard: {
    padding: 15,
    backgroundColor: COLORS.gray5,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  selectedCustomerCard: {
    borderColor: COLORS.bluebtn,
    borderWidth: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  customerPhone: {
    fontSize: 14,
    color: COLORS.gray,
  },
});
