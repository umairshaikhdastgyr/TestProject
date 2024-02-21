import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Icon } from "#components";
import { styles } from "./styles";
const Item = ({ title, content, id, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("HelpBuying", { qa: { title, content, id } })
      }
    >
      <View style={styles.mainItemContainer}>
        <Text style={styles.itemText}>{title}</Text>
      </View>
      <Icon icon="chevron-right" color="grey" style={styles.rightIcon} />
    </TouchableOpacity>
  );
};

export default Item;
