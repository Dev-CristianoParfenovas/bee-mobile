import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/theme.js";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  banner: {
    height: 110, // Altura fixa
    backgroundColor: COLORS.bluebtn,
    justifyContent: "center",
    // justifyContent: "space-between",
    position: "relative",
  },
  containerbanner: {
    flexDirection: "row", // Organiza os itens em linha
    alignItems: "center", // Centraliza verticalmente
    justifyContent: "center", // Centraliza o texto "Carrinho"
    height: "100%", // Garante que o container ocupe toda a altura do banner
    position: "relative", // Permite posicionar o botão do carrinho separadamente
    top: "30%",
    justifyContent: "space-between",
    padding: 12,
  },

  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
  },

  cartButton: {
    position: "absolute", // Permite posicionar o botão fora do fluxo principal
    right: 16, // Alinha o botão ao canto direito
    top: "72%", // Centraliza verticalmente
    transform: [{ translateY: -12 }], // Ajusta a posição vertical (metade do ícone, caso necessário)
    padding: 8,
    //  marginTop: 28,
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
    backgroundColor: COLORS.gray5,
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
    backgroundColor: COLORS.gray6,
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
  cartIconContainer: {
    position: "relative",
  },
  cartButton: {
    padding: 8,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});
