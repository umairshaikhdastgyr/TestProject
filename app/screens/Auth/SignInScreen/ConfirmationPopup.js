import { Fonts } from "#themes";
import colors from "#themes/colors";
import React from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const ConfirmationPopup = ({
  isVisible,
  title,
  description,
  onClose,
  primaryButtonText = "Delete",
  secondaryButtonText = "Cancel",
  onPressPrimaryButton,
  onPressSecondaryButton,
}) => {
  return (
    <Modal visible={isVisible} transparent onDismiss={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#00000060",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          <LottieView
            source={require("#assets/lottie/error.json")}
            style={{
              width: 150,
              height: 90,
              marginBottom: 0,
            }}
            autoPlay
            loop={false}
          />
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              paddingBottom: 3,
              borderBottomWidth: 1,
              borderBottomColor: "#F5F5F5",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.family.semiBold,
              }}
            >
              {title}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: Fonts.family.regular,
              paddingHorizontal: 18,
              paddingBottom: 10,
              textAlign: "center",
            }}
          >
            {description}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 20,
  },
  modalTouchContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontFamily: Fonts.family.semiBold,
    color: "#313334",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  msgText: {
    fontFamily: Fonts.family.semiBold,
    color: "#313334",
    fontWeight: "400",
    fontSize: 14,
    textAlign: "center",
  },
});

export default ConfirmationPopup;
