import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/theme.js";

export const styles = StyleSheet.create({
  beelogin: {
    width: 200,
    height: 200,
  },
  containerlogo: {
    alignItems: "center",
    paddingTop: 1,
    paddingBottom: 35,
  },
  container: {
    flex: 1,
    paddingTop: 55,
    justifyContent: "flex-start", // Alinha os elementos no topo
    paddingHorizontal: 20,
    backgroundColor: COLORS.blueprincipal,
  },
  watermark: {
    position: "absolute",
    width: 350, // Largura desejada para o logo
    height: 350, // Altura desejada para o logo
    alignSelf: "center", // Centraliza horizontalmente
    top: "46%", // Ajusta a posição vertical
  },

  containerInput: {
    marginBottom: 20,
    justifyContent: "center",
    padding: 2,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
  },
  inputError: {
    borderColor: "red", // Borda vermelha para campos com erro
  },
  errorText: {
    color: COLORS.yellowbee, // Texto vermelho
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 8,
  },
  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 40,
    left: 10,
    padding: 10,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 5,
  },
  header: {
    alignItems: "center",
    marginTop: 45,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white, // Altere para a cor desejada
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputHalf: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerContainer: {
    marginBottom: 20,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    overflow: "hidden", // Garante que o conteúdo respeite o arredondamento
  },

  picker: {
    height: 56,
    color: COLORS.black,
  },
  textpicker: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.white,
    paddingLeft: 3,
  },

  productCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: "100%", // Garante que o TouchableOpacity ocupe toda a largura disponível
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  productDetails: {
    fontSize: 14,
    color: COLORS.gray3,
    marginVertical: 4,
  },
  productDetailsContainer: {
    flexDirection: "row", // Alinha ícone e texto horizontalmente
    alignItems: "center", // Alinha verticalmente o ícone e o texto
    width: "100%", // Garante que o container ocupe toda a largura disponível
  },
  selecionarButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 5,
    // backgroundColor: COLORS.blueprincipal, // Exemplo de cor de fundo
    borderRadius: 5,
  },
  selecionarButtonText: {
    flexDirection: "row",
    color: COLORS.black,
    marginLeft: 8,
  },

  removeButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", // Garante que o botão de remover fique à direita
    alignItems: "center",
    marginRight: 12, // Ajuste o valor conforme necessário para o espaçamento à direita
  },

  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8, // Espaço entre os botões
    paddingVertical: 8,
    paddingHorizontal: 1,
    //  backgroundColor: COLORS.red, // Exemplo de cor de fundo
    borderRadius: 5,
  },

  removeButtonText: {
    color: COLORS.red,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
  },
  containerbtnSearch: {
    flexDirection: "row",
    justifyContent: "space-between", // Isso distribui os botões com o máximo de espaço entre eles
    width: "100%", // Garantir que o container ocupe toda a largura disponível
  },

  imagePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: COLORS.bluebtn,
    padding: 10,
    borderRadius: 5,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});
