import React, { Component } from "react";
import {
  Text,
  Keyboard,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import LottieView from "lottie-react-native";

import { Button } from "#components";

import { Colors, Fonts, Metrics } from "#themes";

export const styles = StyleSheet.create({
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    width: '85%',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalTouchContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  titleText: {
    fontFamily: Fonts.family.semiBold,
    color: "#313334",
    fontWeight: "600",
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center",
  },
  msgText: {
    fontFamily: Fonts.family.Regular,
    color: "#313334",
    fontWeight: "400",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  chatSellerLbl: {
    fontFamily: Fonts.family.Regular,
    color: "#00BDAA",
    fontWeight: "600",
    fontSize: 13,
    // marginBottom: 20,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

const ConfirmAlert = ({
  title,
  isVisible,
  onTouchOutside,
  messageStyle,
  message,
  prButtonText,
  secButtonText,
  onMainButtonPress,
  iconWidth,
}) => {
  let sourceImg = "";
  let widthImg = iconWidth || 150;
  sourceImg = require("#assets/lottie/success.json");
  widthImg = 150;
  return (
    <Modal visible={isVisible} transparent onDismiss={onTouchOutside}>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1,backgroundColor:'#00000060' }}>
        <View style={styles.modalContainer}>
          <View activeOpacity={0.9} style={styles.modalTouchContainer}>
            <LottieView
              source={sourceImg}
              style={{ width: widthImg, height: 110}}
              autoPlay
              loop={false}
            />
            {title && <Text style={styles.titleText}>{title}</Text>}
            <Text style={[styles.msgText, messageStyle]}>{message}</Text>
          </View>

          <View style={{width:'100%',alignItems:'center'}}>
            {prButtonText && (
              <Button
                label={prButtonText}
                theme="primary"
                size="large"
                fullWidth
                onPress={onMainButtonPress}
              />
            )}
            <View style={{ marginTop: 20 }} />
            {secButtonText && (
              <Button
                label={secButtonText}
                theme="secondary"
                size="large"
                fullWidth
                onPress={onTouchOutside}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmAlert;
