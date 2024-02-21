import React from "react";
import { View, Text, StyleSheet } from "react-native";
// import styles from './styles';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Icon } from "#components";
// import { styles } from '#components/NormalButton/styles';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import fonts from "#themes/fonts";

const styles = StyleSheet.create({
  leftText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 15,
    // fontWeight: '600',
    color: "#313334",
    // textAlign: 'center',
  },
  rightText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
  },
  appleIcon: {
    width: 19,
    height: 22,
    marginLeft: 5,
  },
  rightContentIcon: {
    marginRight: 5,
  },
});
const BorderElement = ({
  leftLabel,
  title,
  txtType,
  icon,
  onPress,
  topBorder,
  txtLeftType,
  numberOfLines,
  textAlignRight,
  titleTop,
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: titleTop?"flex-start":'center',
      width: "100%",
      paddingVertical: 22,
      borderColor: "#E8E8E8",
      borderBottomWidth: 1,
      // borderLeftColor: 'white',
      // borderRightColor: 'white',
      borderTopWidth: topBorder,
    }}
  >
    <View style={{ flex: 0.45 }}>
      <Text style={[styles.leftText, txtLeftType && { fontWeight: "600" }]}>
        {leftLabel}
      </Text>
    </View>
    <View
      style={{ flex: 0.55, flexDirection: "row", alignItems: "center" }}
      onPress={onPress}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {icon && (
          <View style={styles.rightContentIcon}>
            {(icon === "visa" || icon === "mastercard" || icon === "discover"  || icon === "amex" || icon === "paypal") ? (
              <FontAwesome
                style={{ top: -3 }}
                color="#3F5AA9"
                size={23}
                name={`cc-${icon}`}
              />
            ) : icon === "google_pay" ? (
              <MaterialCommunityIcons
                style={{ top: 0 }}
                size={20}
                name="google"
              />
            ) : (
              <FontAwesome
            style={{ top: -3 }}
            color="#3F5AA9"
            size={23}
            name={`credit-card`}
          />
            )}
          </View>
        )}
        <View style={{ flexDirection: "column" }}>
          {titleTop && (
            <Text
              style={[
                styles.rightText,
               { fontFamily: fonts.family.semiBold },
                textAlignRight && { textAlign: "right" },
              ]}
              numberOfLines={numberOfLines || 1}
            >
              {titleTop}
            </Text>
          )}
          <Text
            style={[
              styles.rightText,
              txtType && { fontFamily: fonts.family.semiBold },
              textAlignRight && { textAlign: "right" },
            ]}
            numberOfLines={numberOfLines || 1}
          >
            {title}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

export default BorderElement;
