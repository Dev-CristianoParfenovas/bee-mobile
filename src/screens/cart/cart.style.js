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
    padding: 10, // Mantém o padding uniforme
    paddingLeft: 0, // Remove padding na esquerda, se necessário
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
    borderRadius: 8,
    marginLeft: 0, // Reduz a margem para posicionar mais à esquerda
    marginRight: 15,
    alignSelf: "center", // Centraliza verticalmente no card
  },
  details: {
    flex: 1,
    flexDirection: "column", // Organização vertical
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: COLORS.blueprincipal,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quantityControls: {
    flexDirection: "row", // Organização horizontal
    alignItems: "center",
    justifyContent: "flex-start", // Alinha à esquerda
    gap: 10, // Espaçamento entre os itens
  },
  btnSmall: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.gray6,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: COLORS.black,
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
  },
  quantity: {
    marginHorizontal: 5,
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    position: "absolute", // Posiciona o botão fora do fluxo natural
    right: 10, // Distância da borda direita
    top: "50%", // Centraliza verticalmente no card
    transform: [{ translateY: -15 }], // Ajuste para centralização precisa
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  containerproducts: {
    flex: 1,
    padding: 5,
    marginTop: 5,
    backgroundColor: COLORS.gray5,
  },
  totalContainer: {
    flexDirection: "row", // Alinha o texto do total e o valor horizontalmente
    justifyContent: "space-between", // Espaça os elementos uniformemente
    alignItems: "center", // Centraliza verticalmente
    padding: 20, // Espaçamento interno
    backgroundColor: "#f7f7f7", // Fundo sutil para destacar o total
    borderTopWidth: 1, // Linha separadora no topo
    borderColor: "#ddd", // Cor da linha
  },
  totalText: {
    fontSize: 18, // Tamanho do texto
    fontWeight: "bold", // Destaque para o texto "Total"
    color: "#333", // Cor do texto
  },
  totalValue: {
    fontSize: 20, // Tamanho maior para destacar o valor
    fontWeight: "bold", // Deixa o valor mais chamativo
    color: "#007AFF", // Azul para destacar o valor
  },
});
