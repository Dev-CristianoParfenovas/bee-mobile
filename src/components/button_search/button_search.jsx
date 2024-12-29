import { Text, TouchableOpacity } from "react-native";
import { styles } from "./button_search.style.js";

function ButtonSearch(props) {
  return (
    <TouchableOpacity style={styles.btnSearch} onPress={props.onPress}>
      <Text style={styles.textSearch}>{props.text}</Text>
    </TouchableOpacity>
  );
}

export default ButtonSearch;
