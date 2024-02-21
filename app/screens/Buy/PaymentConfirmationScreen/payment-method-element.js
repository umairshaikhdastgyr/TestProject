import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import styles from "./styles";
import { Fonts } from "../../../themes";
import { Icon, BodyText } from "../../../components";

const PaymentMethodElement = ({
  leftLabel,
  title,
  txtType,
  icon,
  onPress,
  type,
}) => {
  icon = icon?.toLowerCase() ;
return(
  <View
    style={[
      {
        flexDirection: "row",
        marginTop: 10,
        width: "100%",
        alignItems: "flex-start",
        paddingVertical: 20,
      },
      type !== "return" &&
        type !== "return_ind" && {
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderColor: "#E8E8E8",
        },
    ]}
  >
    <View style={styles.leftContainer}>
      <Text style={txtType === "bold" ? styles.leftBoldText : styles.leftText}>
        {leftLabel}
      </Text>
    </View>
    <TouchableOpacity style={styles.rightContainer} onPress={onPress}>
      <View style={styles.rightContentIcon}>
        {(icon === "visa" || icon === "mastercard" || icon === "discover"  || icon === "amex" || icon === "paypal") ? (
          <FontAwesome
            style={{ top: -3 }}
            color="#3F5AA9"
            size={23}
            name={`cc-${icon}`}
          />
        ) : icon === "google_pay" ? (
          <MaterialCommunityIcons style={{ top: -3 }} size={23} name="google" />
        ) : ( icon?
          <FontAwesome
            style={{ top: -3 }}
            color="#3F5AA9"
            size={23}
            name={`credit-card`}
          />:null
        )}
      </View>
      <View style={styles.rightContentText}>
        <BodyText
          theme="large"
          bold
          align="right"
          numberOfLines={1}
          style={[styles.titleText]}
        >
          {title}
        </BodyText>
      </View>
      {type !== "return_ind" && (
        <View style={styles.arrowContainer}>
          <Icon size="medium-small" icon="chevron-right" />
        </View>
      )}
    </TouchableOpacity>
  </View>
);
      }

export default PaymentMethodElement;
