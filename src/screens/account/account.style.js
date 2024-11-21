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
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: COLORS.blueprincipal,
  },

  containerInput: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.gray5,
    padding: 12,
    borderRadius: 40,
    height: 50,
    width: 350,
  },
  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xl,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textfooter: {
    color: COLORS.white,
  },
  footerLink: {
    color: COLORS.yellowbee,
    paddingLeft: 2,
  },
});
