import { Text, TouchableOpacity } from "react-native";
import { styles } from "./button_payment.style.js";

function ButtonPayment(props) {
  return (
    <TouchableOpacity style={styles.btnpayment} onPress={props.onPress}>
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
}

export default ButtonPayment;
