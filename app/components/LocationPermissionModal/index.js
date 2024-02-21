import React from "react";
import { View, Text, StyleSheet, Modal, Platform, Linking } from "react-native";
import Button from "#components/Button";
import { useNavigation } from "@react-navigation/native";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";

export const LocationPermissionModal = ({ isModalVisible }) => {
  const navigation = useNavigation();
  const handleAllowLocation = () => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      })
    ).then((res) => {
      if (res === RESULTS.BLOCKED) {
        Linking.openSettings();
      }
    });
  };
  return (
    <Modal animationType="slide" transparent={true} isVisible={isModalVisible}>
      <View style={styles.container}>
        <Text style={styles.enableLocationText}>Enable your location</Text>
        <Text style={styles.locationText}>
          If you've edited the location, please enable location permission.
        </Text>
        <Button
          label="Allow Location"
          size="large"
          fullWidth
          style={styles.buttonView}
          onPress={() => handleAllowLocation()}
        />
        <Button
          label="Go Back"
          size="large"
          fullWidth
          style={styles.buttonView}
          onPress={() => navigation.goBack()}
        />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 300,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    padding: 15,
  },
  enableLocationText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginVertical: 20,
  },
  buttonView: { marginTop: 20, width: "70%", alignSelf: "center" },
});
