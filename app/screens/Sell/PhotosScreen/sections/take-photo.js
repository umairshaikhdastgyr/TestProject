import React, { useState, useEffect, useRef } from "react";

import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Linking,
  Dimensions,
  Platform,
} from "react-native";
import { RNCamera } from "react-native-camera";
import RNFS from "react-native-fs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { BodyText, Link, Icon } from "#components";
import { flex } from "#styles/utilities";
import { addPhotoToList, removePhotoFromList } from "#modules/Sell/actions";
import { useActions } from "#utils";
import Icons from "#assets/icons/bottom-navigation";
import HomitagDraggableFlatList from "../components/draggable-flatlist";
import { useRoute } from "@react-navigation/native";

const { height } = Dimensions.get("window");
const DESIRED_RATIO = "16:9";
const TakePhoto = ({
  picsSelected,
  setPicSelected,
  setActiveTab,
  navigation,
  handleConfirmActionLocal,
  maxPhoto,
}) => {
  const route = useRoute();
  const cameraRef = useRef(null);

  const actions = useActions({ addPhotoToList, removePhotoFromList });

  const [cameraActive, setCameraActive] = useState(false);
  const [overActive, setOverActive] = useState(true);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const screen = route?.params?.screen ?? null;
  /* Effects */
  useEffect(() => {
    setTimeout(() => {
      setCameraActive(true);
    }, 500);
  }, []);

  const [camRatio, setCamRatio] = useState(DESIRED_RATIO);

  const takePicture = async () => {
    if (cameraRef.current && picsSelected.length <= maxPhoto - 1) {
      const options = {
        width: 500,
        fixOrientation: true,
        forceUpOrientation: true,
      };
      const data = await cameraRef.current.takePictureAsync(options);
      const photoBase64 = await RNFS.readFile(data?.uri, "base64");
      if (screen === "return") {
        const returnLabelImage = `data:image/jpeg;base64,${photoBase64}`;
        setPicSelected([
          {
            type: "selected-photo",
            image: returnLabelImage,
            uri: data?.uri,
            ext: "jpeg",
          },
        ]);
      } else {
        setPicSelected([
          ...picsSelected,
          ...[
            {
              type: "taken-photo",
              image: photoBase64,
              uri: data?.uri,
              ext: "jpeg",
            },
          ],
        ]);
      }
    }
  };

  const activateCamera = async () => {
    setOverActive(false);
    if (Platform.OS === "android" && cameraRef.current) {
      const ratios = await cameraRef.current.getSupportedRatiosAsync();
      //See if the current device has your desired ratio, otherwise get the maximum supported one
      // Usually the last element of "ratios" is the maximum supported ratio
      const ratio =
        ratios.find((r) => r === DESIRED_RATIO) || ratios[ratios.length - 1];

      setCamRatio(ratio);
    }
  };

  const statusCameraChange = (event) => {
    if (event.cameraStatus === "NOT_AUTHORIZED") {
      setOverActive(false);
    }
  };

  const goToSettings = () => {
    Linking.openSettings();
  };

  const [showFlashType, setShowFlashType] = useState(false);
  const [flashType, setFlashType] = useState("off");

  const removePic = (index) => {
    const deleteItem = picsSelected[index];
    const filteredItems = picsSelected
      .slice(0, index)
      .concat(picsSelected.slice(index + 1, picsSelected.length));
    setPicSelected(filteredItems);

    if (deleteItem?.savIndex || deleteItem?.savIndex === 0) {
      actions.removePhotoFromList({ index: deleteItem?.savIndex });
    }
  };

  const cameraNotAuthorized = () => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
      }}
    >
      <BodyText theme="inactive" align="center" onPress={goToSettings}>
        Camera access was not granted. Please go to your{" "}
        <Link>phone settings</Link> and allow camera access
      </BodyText>
    </View>
  );

  return (
    <View
      onLayout={(event) => {
        var { x, y, width, height } = event.nativeEvent.layout;
        setImageHeight(height);
        setImageWidth(width);
      }}
      style={styles.container}
    >
      <View style={styles.cameraContainer}>
        {cameraActive === true ? (
          <RNCamera
            ref={cameraRef}
            style={[
              styles.preview,
              { height: imageHeight - 220, width: imageWidth },
            ]}
            type={RNCamera.Constants.Type.back}
            flashMode={flashType}
            captureAudio={false}
            onCameraReady={activateCamera}
            // You can only get the supported ratios when the camera is mounted
            onStatusChange={statusCameraChange}
            androidCameraPermissionOptions={{
              title: "Permission to use camera",
              message: "We need your permission to use your camera",
              buttonPositive: "Ok",
              buttonNegative: "Cancel",
            }}
            notAuthorizedView={cameraNotAuthorized()}
          >
            <View
              style={{
                backgroundColor: "rgba(0,0,0, 0.4 )",
                paddingHorizontal: 20,
                height: 40,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  right: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {showFlashType && (
                    <View style={{ flexDirection: "row", marginRight: 10 }}>
                      <TouchableOpacity
                        onPress={() => {
                          setShowFlashType(false);
                          setFlashType("auto");
                        }}
                        style={{ paddingHorizontal: 10 }}
                      >
                        <Text
                          style={[
                            styles.flasTypeText,
                            flashType === "auto" && { color: "#e0b000" },
                          ]}
                        >
                          auto
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowFlashType(false);
                          setFlashType("on");
                        }}
                        style={{ paddingHorizontal: 10 }}
                      >
                        <Text
                          style={[
                            styles.flasTypeText,
                            flashType === "on" && { color: "#e0b000" },
                          ]}
                        >
                          on
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowFlashType(false);
                          setFlashType("off");
                        }}
                        style={{ paddingHorizontal: 10 }}
                      >
                        <Text
                          style={[
                            styles.flasTypeText,
                            flashType === "off" && { color: "#e0b000" },
                          ]}
                        >
                          off
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <TouchableOpacity
                    style={{ paddingHorizontal: 10 }}
                    onPress={() => setShowFlashType(!showFlashType)}
                  >
                    <Ionicons
                      style={{
                        textAlign: "center",
                        width: 45,
                        shadowOpacity: 0.7,
                        textShadowRadius: 4,
                        textShadowOffset: { width: 2, height: 2 },
                      }}
                      name={flashType === "off" ? "ios-flash-off" : "ios-flash"}
                      size={27}
                      color={flashType === "on" ? "#e0b000" : "#FFFFFF"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleConfirmActionLocal()}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 30,
                }}
              >
                <Ionicons
                  style={
                    Platform.OS === "android" && {
                      textAlign: "center",
                      width: 15,
                      shadowOpacity: 0.7,
                      textShadowRadius: 4,
                      textShadowOffset: { width: 2, height: 2 },
                    }
                  }
                  name="ios-close"
                  size={35}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <View />
          </RNCamera>
        ) : (
          <View style={[styles.preview, { backgroundColor: "#FFF" }]} />
        )}
        {overActive === true && (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              position: "absolute",
              zIndex: 2,
            }}
          />
        )}
      </View>
      <View style={styles.listContainer}>
        <HomitagDraggableFlatList
          data={picsSelected}
          navigation={navigation}
          removePic={removePic}
          setPicSelected={setPicSelected}
        />
      </View>
      <View style={styles.takeBtnContainer}>
        <TouchableOpacity
          style={[
            styles.mainIcon,
            {
              height: 50,
              width: 50,
              backgroundColor: "#FFF",
              borderColor: "#00BDAA",
              borderWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("photo-library")}
        >
          <Icon icon="gallery_active" style={{ width: 25, height: 16.1 }} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={picsSelected?.length == 10}
          style={[
            styles.mainIcon,
            {
              opacity: picsSelected?.length == 10 ? 0.5 : 1,
              height: 80,
              width: 80,
            },
          ]}
          onPress={() => takePicture()}
        >
          <Image source={Icons.sellmain_active} style={styles.iconActive} />
        </TouchableOpacity>
        <View style={{ opacity: picsSelected?.length == 0 ? 0.5 : 1 }}>
          <TouchableOpacity
            disabled={picsSelected?.length == 0}
            onPress={handleConfirmActionLocal}
            style={[
              {
                height: 50,
                width: 50,
                borderRadius: 50,
                marginBottom: 16,
                backgroundColor: "#FFF",
                borderColor: "#00BDAA",
                borderWidth: 2,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Feather
              name="check"
              size={28}
              color="#00BDAA"
              style={{ marginTop: 6 }}
            />
          </TouchableOpacity>
          <View
            style={{
              position: "absolute",
              bottom: -5,
              width: 50,
              flex: 1,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                fontFamily: "Montserrat-Regular",
              }}
            >
              DONE
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  cameraContainer: {
    overflow: "hidden",
    width: "100%",
    flex: 1,
  },
  preview: {
    flex: 1,
    backgroundColor: "#FFF",
    position: "absolute",
  },
  flasTypeText: {
    fontWeight: "500",
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
  },
  listContainer: {
    height: 100,
    justifyContent: "center",
    marginLeft: 10,
  },
  scrollPhotos: {
    alignItems: "center",
  },
  takePhotoContainer: {
    flex: 1,
  },
  photoLibraryContainer: {
    flex: 1,
  },
  takeBtnContainer: {
    ...flex.directionRow,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  photoButtonContainer: {
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "#CECECE",
    ...flex.alignItemsCenter,
    ...flex.justifyContentCenter,
  },
  iconActive: {
    width: 36,
    height: 31,
    tintColor: "#ffffff",
  },
  mainIcon: {
    backgroundColor: "#00BDAA",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    textAlign: "center",
    paddingHorizontal: 24,
    marginTop: 10,
  },
});

export default TakePhoto;
