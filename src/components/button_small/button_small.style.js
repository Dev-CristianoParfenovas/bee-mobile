import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/theme.js";

export const styles = StyleSheet.create({
  btnSmall: {
    backgroundColor: COLORS.bluebtn,
    borderRadius: 10,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    height: 43,
    width: 43,
  },
  textSmall: {
    // Tamanho do texto dos botões menores
    color: COLORS.white,
    fontSize: FONT_SIZE.xl, // Ajuste para o texto dos botões pequenos
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  quantityText: {
    fontSize: 50,
    marginHorizontal: 10,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
});
