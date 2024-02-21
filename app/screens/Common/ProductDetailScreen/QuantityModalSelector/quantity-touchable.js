import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { margins } from "#styles/utilities";
import { Fonts } from "#themes";

const QuantityTouchable = ({
  availableQuantity,
  value,
  onChooseQuantity,
  isSelected,
  afterPressCallback,
}) => {
  const handlePress = () => {
    if (value === "+") {
      onChooseQuantity("6");
    } else {
      onChooseQuantity(value);
    }

    afterPressCallback();
  };

  if (availableQuantity < parseInt(value, 10)) {
    return null;
  }

  if (value === "+" && availableQuantity <= 5) {
    return null;
  }

  return (
    <TouchableOpacity onPressIn={()=>{
    }} onPress={handlePress} style={{ marginBottom: 24 }}>
      <View
        style={[
          styles.quantityTouchable,
          isSelected ? styles.quantityTouchableSelected : "",
        ]}
      >
        <Text
          style={[styles.countText, isSelected ? styles.countTextSelected : ""]}
        >
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  quantityTouchable: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    width: 30,
    height: 30,
  },
  quantityTouchableSelected: {
    backgroundColor: "#00BDAA",
    borderColor: "#00BDAA",
  },
  countText: {
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.regular,
    color: "black",
  },
  countTextSelected: {
    color: "white",
  },
});

export default QuantityTouchable;
