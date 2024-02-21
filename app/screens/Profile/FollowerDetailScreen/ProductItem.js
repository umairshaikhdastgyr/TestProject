import React from "react";

import { View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { Picture, BodyText, DetailText, Currency, Icon } from "#components";
import { get } from "lodash";
import { margins } from "#styles/utilities";
import { styles } from "./styles";

const ProductTile = ({ data, navigation, onPressLike }) => {
  const id = get(data, "id", null);
  const Product = get(data, "Product", null);
  const isFavorite = get(data, "isFavorite", false);
  const title = get(data, "title", "Undefined");
  const initialPrice = get(data, "initialPrice", 0);
  const DeliveryMethods = get(data, "DeliveryMethods", []);

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("ProductDetail", {
          postId: id,
          key: `PostDetail${id}`,
        })
      }
    >
      <View style={styles.tile}>
        <Picture
          source={Product?.ProductImages?.[0]?.urlImage ?? ""}
          type="product"
          style={styles.tile__picture}
        />
        <TouchableOpacity
          style={styles.tile__like}
          onPress={() => onPressLike(id)}
        >
          {isFavorite == false && <Icon icon="like-white" />}
          {isFavorite != false && <Icon icon="like-white" color="active" />}
        </TouchableOpacity>
        <View style={styles.tile__body}>
          <View style={styles.tile__info}>
            <BodyText style={margins["mb-1"]} numberOfLines={1}>
              {title}
            </BodyText>
          </View>
          <View style={styles.tile__price}>
            <Currency value={initialPrice} />
          </View>
        </View>
        <View style={styles.tile__shipping}>
          <DetailText numberOfLines={1}>
            {DeliveryMethods.map((delivery) => delivery.name).join(" + ")}
          </DetailText>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ProductTile;
