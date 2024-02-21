import React from "react";
import { View, Image, Text } from "react-native";
import { Heading } from "#components";
import { styles } from "./styles";
import { Fonts } from "#themes";

const renderImage = (screenDetails) => {
  return (
    <View style={styles.imgContainer}>
      <Image
        style={styles.imgElement}
        source={{ uri: screenDetails?.Product.ProductImages[0]?.urlImage }}
        resizeMode="cover"
      />
    </View>
  );
};
const ProductDetails = ({ screenDetails }) => (
  <View style={styles.topContainer}>
    <View style={styles.imgsContainer}>{renderImage(screenDetails)}</View>
    <View style={styles.textsContainer}>
      <Heading type="h6" numberLines={1}>
        {screenDetails.title}
      </Heading>
      <Text
        style={{
          fontFamily: Fonts.family.semiBold,
          fontSize: Fonts.size.h6,
          color: "#00BDAA",
        }}
      >
        ${screenDetails.initialPrice}
      </Text>
    </View>
  </View>
);

export default ProductDetails;
