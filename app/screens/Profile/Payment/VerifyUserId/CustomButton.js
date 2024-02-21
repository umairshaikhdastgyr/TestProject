import React from "react";
import {
  Text,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";

export const CustomButton = ({ handleOnPress, buttonTitle, moreStyles, textStyles, disabled }) => {
  return (
    <TouchableOpacity
      disabled={disabled ? disabled : false}
      onPress={() => handleOnPress()}
      style={[styles.cancel_button,  moreStyles ]}
    >
      <Text style={[styles.photos_header_text,  textStyles ]}>
        {buttonTitle}
      </Text>
    </TouchableOpacity>
  );
};
