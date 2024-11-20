import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE } from "../../constants/theme.js";

export const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.bluebtn,
    borderRadius: 40,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 350,
  },
  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
  },
});
