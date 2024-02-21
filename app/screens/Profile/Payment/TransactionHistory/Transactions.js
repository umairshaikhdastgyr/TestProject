import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CachedImage } from "#components";
import colors from "#themes/colors";
import fonts from "#themes/fonts";
import moment from "moment";
import { currencyFormatter } from "#utils";
import icons from "#assets/icons";

const Transactions = ({ item, index }) => {
  return (
    <View
      key={"trans_" + index}
      style={{
        width: "100%",
        borderBottomWidth: 0.7,
        borderBottomColor: "#E8E8E8",
        paddingBottom: 10,
        marginTop: 10,
        flexDirection: "row",
      }}
    >
      {item?.type == "boost" ? (
        <CachedImage
          source={icons.boost_image}
          style={style.boost_icon}
          resizeMode={"contain"}
        />
      ) : (
        <View
          style={{
            alignItems: "flex-start",
            overflow: "hidden",
          }}
        >
          <CachedImage
            source={{
              uri: item?.productImage,
            }}
            style={{
              width: 50,
              height: 50,
              borderWidth: 1,
              borderColor: "#DADADA",
              borderRadius: 4,
            }}
            resizeMode={"contain"}
          />
        </View>
      )}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingLeft: 15,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#313334",
            fontFamily: fonts.family.semiBold,
            marginBottom: 4,
          }}
        >
          {item.type == "boost"
            ? "Boost purchased"
            : item.type == "buy"
            ? item.status == "failed"
              ? "Item purchased (Refund)"
              : "Item purchased"
            : item.type == "sell"
            ? item.status == "failed"
              ? "Item Sold (Refund)"
              : "Item Sold"
            : "Other"}
        </Text>
        <Text
          style={{
            color: "#313334",
            fontSize: 14,
            fontFamily: fonts.family.regular,
          }}
        >
          {moment(item.createdAt).format("MMM DD, YYYY")}
        </Text>
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{
            color:
              item.type == "buy"
                ? item.status == "failed"
                  ? colors.green
                  : colors.red
                : item.type == "sell"
                ? item.status == "failed"
                  ? colors.red
                  : colors.green
                : "#313334",
            fontSize: 16,
            fontFamily: fonts.family.regular,
          }}
        >
          {item?.balance === undefined
            ? `${currencyFormatter.format(parseFloat(0.0).toFixed(2))}`
            : `${currencyFormatter.format(
                parseFloat(item?.balance / 100).toFixed(2)
              )}`}
        </Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  boost_icon: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});

export default Transactions;
