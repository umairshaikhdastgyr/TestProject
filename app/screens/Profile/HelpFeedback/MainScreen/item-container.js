import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";
import Item from "./item";

const ItemContainer = ({ Contents, name, index, navigation, searchText }) => {
  const filteredData = Contents
    ? Contents?.filter(qst =>
        searchText
          ? qst.title.toLowerCase().includes(searchText.toLowerCase())
          : true
      )
    : [];
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.title__text}>{name && name.toUpperCase()}</Text>

      {filteredData.length == 0 && (
        <Text style={styles.title__text}>Not matches</Text>
      )}

      {filteredData.map(item => (
        <Item {...item} navigation={navigation} />
      ))}
    </View>
  );
};

export default ItemContainer;
