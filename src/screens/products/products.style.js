import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/theme.js";

export const styles = StyleSheet.create({
  beelogin: {
    width: 200,
    height: 200,
  },
  containerlogo: {
    alignItems: "center",
    paddingTop: 55,
  },
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
  containerproducts: {
    flex: 1, // Ocupa o espaço restante
    padding: 20,
    marginTop: 20,
    backgroundColor: COLORS.background, // Cor de fundo (se necessário)
  },

  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    textAlign: "center",
    marginTop: 35,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: "#555",
  },
});
