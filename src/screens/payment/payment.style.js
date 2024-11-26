import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/theme.js";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  banner: {
    height: 110,
    backgroundColor: COLORS.bluebtn,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  watermark: {
    position: "absolute",
    width: 350, // Largura desejada para o logo
    height: 350, // Altura desejada para o logo
    alignSelf: "center", // Centraliza horizontalmente
    top: "40%", // Ajusta a posição vertical
  },
  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 35,
  },
  icone: {
    marginTop: 35,
  },
  orderSummary: {
    padding: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  itemName: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
  },
  itemPrice: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  value: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  totalLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.black,
  },
  totalValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.black,
  },
  containerbtn: {
    marginTop: 30,
    alignItems: "center",
  },
  paymentButton: {
    backgroundColor: COLORS.bluebtn,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  paymentButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
  },
});
