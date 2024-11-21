import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import icons from "../../constants/icons.js";
import { styles } from "./products.style.js";
import { products } from "../../constants/dados.js";

function Products() {
  const handlePress = (item) => {
    alert(`Você clicou no produto: ${item.name}`);
  };
  return (
    <View style={styles.container}>
      {/* Banner no topo */}
      <View style={styles.banner}>
        <View style={styles.containerbanner}>
          <Text style={styles.text}>Produtos</Text>
        </View>
      </View>

      {/* FlatList de Produtos */}
      <View style={styles.containerproducts}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePress(item)} // Função ao clicar no item
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.price}>R$ {item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

export default Products;
