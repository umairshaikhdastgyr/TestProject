import React from "react";
import { Text, View, Modal, Platform, Linking } from "react-native";
import { PERMISSIONS, request } from "react-native-permissions";
import { styles } from "./styles";
import { Colors } from "#themes";
import { CustomButton } from "./CustomButton";

const CameraAllowModal = ({
  isCameraAccess,
  setIsCameraAccess,
  setAllowCamera,
}) => {
  const handleAllowCameraPermission = () => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      })
    )
      .then(async(result) => {
        if (result === "granted") {
          setAllowCamera(true);
          setIsCameraAccess(!isCameraAccess);
          return;
        } else {
          await Linking.openSettings();
          setAllowCamera(false);
          return;
        }
      })
      .catch((reason) => console.log({ reason }));
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isCameraAccess}
      onRequestClose={() => {
        setIsCameraAccess(!isCameraAccess);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.stripe_camera_text}>
            connect.stripe.com wants to use your camera
          </Text>
          <CustomButton
            handleOnPress={() => handleAllowCameraPermission()}
            buttonTitle={"Allow"}
            moreStyles={{ backgroundColor: Colors.primary, width: "100%" }}
            textStyles={{ color: Colors.white }}
          />
          <CustomButton
            handleOnPress={() => {
              setAllowCamera(false);
              setIsCameraAccess(!isCameraAccess);
            }}
            buttonTitle={"Block"}
            moreStyles={{ marginVertical: 20, width: "100%" }}
            textStyles={{ color: Colors.primary }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CameraAllowModal;
