import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Icon, BodyText, Loader } from "../../../components";
import ScreenLoader from "#components/Loader/ScreenLoader";

const AddressElement = ({
  leftLabel,
  title,
  txtType,
  icon,
  onPress,
  type,
  leftLabelTop,
  addressListState,
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10,
      width: "100%",
      paddingTop: 20,
    }}
  >
    <View style={{ flex: 0.4 }}>
      <Text style={txtType == "bold" ? styles.leftBoldText : styles.leftText}>
        {leftLabel}
      </Text>
    </View>
    <TouchableOpacity
      style={{ flex: 0.6, flexDirection: "row", alignItems: "center" }}
      onPress={onPress}
    >
      {addressListState?.isFetching ? (
        <View style={{ flex: 1 }}>
          <ScreenLoader />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {leftLabelTop && (
            <BodyText align="right" style={styles.rightBoldTextAnother}>
              {leftLabelTop}
            </BodyText>
          )}
          <BodyText
            style={!leftLabelTop ? { marginTop: 3 } : {}}
            numberOfLines={3}
            theme="large"
            align="right"
          >
            {title}
          </BodyText>
        </View>
      )}

      {type !== "return" && (
        <View style={styles.arrowContainer}>
          <Icon size="medium-small" icon="chevron-right" />
        </View>
      )}
    </TouchableOpacity>
  </View>
);

export default AddressElement;
