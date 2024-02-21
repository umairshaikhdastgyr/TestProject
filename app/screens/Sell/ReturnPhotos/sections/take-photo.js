import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Linking,
  Platform,
} from "react-native";
import { RNCamera } from "react-native-camera";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { BodyText, Link, Icon, Heading } from "#components";
import SelectedPhoto from "../components/selected-photo";
import { flex } from "#styles/utilities";
import { selectSellData } from "#modules/Sell/selectors";
import { addPhotoToList } from "#modules/Sell/actions";
import {
  addClaimPhotoToList,
  removeClaimPhotoFromList,
  removeReturnPhotoFromList,
} from "#modules/User/actions";
import { useActions } from "#utils";
import { Metrics, Colors, Fonts } from "#themes";
import DraggableFlatList from "#components/DraggableList";
import Icons from "#assets/icons/bottom-navigation";
import { removeClaimImage, uploadClaimImage } from "#services/apiUsers";
import { selectUserData } from "#modules/User/selectors";

const TakePhoto = ({
  picsSelected,
  setPicSelected,
  setActiveTab,
  navigation,
  handleConfirmActionLocal,
  order,
  maxPhoto,
}) => {
  /* Selectors */

  /* Actions */
  const actions = useActions({ addPhotoToList, removeClaimPhotoFromList });
  const { claimPhotosList } = useSelector(selectUserData());
  const dispatch = useDispatch();
  const [cameraActive, setCameraActive] = useState(false);
  const [overActive, setOverActive] = useState(true);

  const cameraRef = useRef(null);

  /* Effects */
  useEffect(() => {
    setTimeout(() => {
      setCameraActive(true);
    }, 500);
  }, []);

  const takePicture = async () => {
    let resizeImage = null;
    if (cameraRef.current && picsSelected?.length <= maxPhoto - 1) {
      const options = {
        width: 500,
        quality: 0.5,
        fixOrientation: true,
        forceUpOrientation: true,
      };
      // const options = { quality: 0.5, base64: true, fixOrientation: true };
      const data = await cameraRef.current.takePictureAsync(options);
      if (Platform.OS === "ios") {
        resizeImage = await ImageResizer.createResizedImage(
          data.uri,
          720,
          1280,
          "JPEG",
          60
        );
      } else if (Platform.OS === "android") {
        resizeImage = {
          width: 720,
          height: 1280,
          name: data.uri,
          uri: data.uri,
        };
      }
      const imageData = {
        ETag: resizeImage?.width + resizeImage?.height,
        Key: resizeImage?.name,
        url: resizeImage?.uri,
      };
      setPicSelected(picsSelected.concat(imageData));
      const res = await uploadClaimImage(
        resizeImage.uri,
        order.buyerId,
        order.id
      );
      if (res.data) {
        // actions.addClaimPhotoToList(picsSelected.concat(res.data))
        dispatch(addClaimPhotoToList(res.data));
      }
      /*
      actions.addPhotoToList({
        type: 'taken-photo',
        image: data.base64,
      });
      */
    }
  };

  const activateCamera = () => {
    setOverActive(false);
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

  const removePic = async (key, ind) => {
    setPicSelected(picsSelected.filter((pic) => pic.Key !== key));
    const getKey = claimPhotosList[ind].Key;
    try {
      const res = await removeClaimImage(getKey);
      if (res.data) {
        actions.removeClaimPhotoFromList(getKey);
        dispatch(removeReturnPhotoFromList(getKey));
      }
    } catch (e) {}
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    const newData = [...picsSelected];
    const currIndex = newData.findIndex((currentItem) => item === currentItem);
    return (
      <TouchableOpacity delayLongPress={300} onLongPress={drag}>
        <SelectedPhoto
          key={index}
          data={item}
          isActive={isActive}
          index={currIndex}
          removePic={removePic}
        />
      </TouchableOpacity>
    );
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
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {cameraActive === false && (
          <View style={[styles.preview, { backgroundColor: "#FFF" }]} />
        )}
        {cameraActive === true && (
          <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={flashType}
            captureAudio={false}
            onCameraReady={activateCamera}
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
                  top: 7,
                  right: 0,
                  paddingHorizontal: 10,
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
                      name={flashType === "off" ? "ios-flash-off" : "ios-flash"}
                      size={25}
                      color={flashType === "on" ? "#e0b000" : "#adadad"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  position: "absolute",
                  top: 12,
                  left: 0,
                  paddingHorizontal: 20,
                }}
              >
                {/* <Ionicons name="ios-close" size={35} color="#fff" /> */}
                <Icon icon="close_grey" style={{ width: 25, height: 16.1 }} />
              </TouchableOpacity>
            </View>
          </RNCamera>
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
        {picsSelected.length === 0 && (
          <BodyText
            size="medium"
            theme="inactive"
            style={styles.emptyText}
            align="center"
          >
            Images will appear as you take them and select them from your photo
            library
          </BodyText>
        )}

        <DraggableFlatList
          data={picsSelected}
          horizontal
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({ data, from, to }) => {
            setPicSelected(data);
          }}
          showsHorizontalScrollIndicator={false}
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
              borderWidth: 3,
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
              // backgroundColor: 'red',
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
    width: "100%",
    flex: 1,
    backgroundColor: "#FFF",
  },
  flasTypeText: {
    fontWeight: "500",
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#adadad",
  },
  listContainer: {
    height: 100,
    justifyContent: "center",
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
