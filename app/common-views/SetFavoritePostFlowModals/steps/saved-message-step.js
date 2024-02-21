import React from "react";

import { StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
import { BodyText } from "#components";

const SavedMessageStep = ({ closeModal, albumSelectedInfo }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={closeModal}>
      <Image
        source={require("#assets/icons/check-special.png")}
        style={styles.icon}
      />
      <BodyText style={styles.text} size="medium">
        Saved to {albumSelectedInfo.name}
      </BodyText>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: width - 60,
    height: 267,
    borderRadius: 5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
  icon: {
    width: 58,
    height: 58,
    marginBottom: 24,
  },
});

export default SavedMessageStep;
