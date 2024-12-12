import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/theme.js";

export const styles = StyleSheet.create({
  // Container Principal
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },

  // Banner
  banner: {
    height: 120,
    backgroundColor: COLORS.bluebtn,
    justifyContent: "center",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  containerbanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    top: "28%",
  },
  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
  },
  subtitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    textAlign: "center",
    marginTop: 32,
  },
  cartContainer: {
    position: "relative",
  },
  cartButton: {
    padding: 8,
  },
  cartBadge: {
    position: "absolute",
    top: -6, // Ajuste para alinhar melhor
    right: -6, // Posicionado no canto do botão
    backgroundColor: COLORS.red, // Cor de fundo visível
    borderRadius: 10, // Torna o badge circular
    minWidth: 20, // Largura mínima para acomodar o texto
    minHeight: 20, // Altura mínima
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4, // Margem interna para texto
  },
  cartBadgeText: {
    color: COLORS.white, // Texto branco para contraste
    fontSize: FONT_SIZE.sm, // Tamanho do texto
    fontWeight: "bold", // Negrito para destaque
  },

  // Produtos
  containerproducts: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  details: {
    alignItems: "center",
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 4,
  },
  price: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bluebtn,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    marginLeft: 8,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray5,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 35,
    fontSize: FONT_SIZE.md,
    color: "#333",
  },
});
