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
    marginBottom: 10,
    justifyContent: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: COLORS.blueprincipal,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  modalText: {
    fontSize: 16,
    color: COLORS.black,
  },
  formContainer: {
    marginBottom: 30, // espaço extra entre o último input + botão Criar Conta e o botão Ver Funcionários
  },
  buttonCreate: {
    marginBottom: 15, // distância do botão "Criar Conta" até "Ver Funcionários"
  },
  buttonVerFuncionarios: {
    // alignSelf: "center",
    marginTop: 2, // distância do botão "Criar Conta" até "Ver Funcionários"
  },
});
