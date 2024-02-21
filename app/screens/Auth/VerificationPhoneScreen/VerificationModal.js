import React from "react";
import {
  Modal,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Metrics, Fonts, Colors } from "#themes";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  mainContainer: {
    width: Metrics.width - 60,
    height: Metrics.height / 3,
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    width: 50,
    height: 45,
    resizeMode: "contain",
    marginBottom: 10,
  },
  blackText: {
    fontSize: Fonts.size.large,
    fontFamily: Fonts.family.medium,
    color: Colors.black,
    textAlign: "center",
  },
});

export const VerificationModal = ({ onDismiss, visible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => console.info("Modal has been closed.")}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={onDismiss}
        activeOpacity={1}
      >
        <View style={styles.mainContainer}>
          <Image
            source={require("../../../assets/icons/check-special.png")}
            style={styles.checkIcon}
          />
          <Text style={styles.blackText}>
            {"Verification ran successfully.\nStart buying or selling!"}
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
