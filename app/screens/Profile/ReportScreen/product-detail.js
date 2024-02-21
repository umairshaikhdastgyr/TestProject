import React from "react";
import { View, Image } from "react-native";
import { Heading, BodyText } from "#components";
import styles from "./styles";

const ProductDetail = ({ screenDetails, userProductDetail }) => {
  return (
    <View style={styles.topContainer}>
      <View style={styles.imgsContainer}>
        <View style={styles.imgContainer}>
          <Image
            style={styles.imgElement}
            source={{
              uri:
                screenDetails?.Product?.ProductImages &&
                screenDetails?.Product?.ProductImages[0]?.urlImage,
            }}
            resizeMode="cover"
          />
        </View>
      </View>
      <View style={styles.textsContainer}>
        <Heading
          type="h6"
          numberLines={1}
          style={{
            fontFamily: "Montserrat-Regular",
            fontWeight: "600",
            fontSize: 18,
            color: "#313334",
          }}
        >
          {screenDetails?.title}
        </Heading>
        <BodyText
          theme="medium"
          bold
          numberOfLines={1}
          style={[styles.titleText]}
        >
          {userProductDetail?.data?.name}
        </BodyText>
      </View>
    </View>
  );
};

export default ProductDetail;
