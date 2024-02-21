import React, { useState, useEffect, useRef, useCallback } from "react";
import RNFS from "react-native-fs";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
  ScrollView,
} from "react-native";
// import Pdf from 'react-native-pdf';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import * as Progress from "react-native-progress";
import { CachedImage, FooterAction, Heading, SweetAlert } from "#components";
import { flex, safeAreaNotchHelper, style } from "#styles/utilities";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const decode = ({ base64Data, imageType }) => {
  const img = {};
  img.extension = imageType.toLowerCase();
  img.base64Data = base64Data;
  img.src = `data:image/${img.extension};base64,${base64Data}`;
  img.uri = "";

  return img;
};

const ShippingLabelScreen = ({ navigation, route }) => {
  const handleCloseActionLocal = () => {
    navigation.navigate("OrderStatus");
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleCloseAction: handleCloseActionLocal });
    }, [])
  );

  const base64Data = route?.params?.base64Data ?? null;
  const buyerDetail = route?.params?.buyerDetail ?? null;
  const provider = route?.params?.provider ?? null;
  const imageType = route?.params?.imageType ?? null;
  const orderData = route?.params?.orderData ?? null;

  const styles = StyleSheet.create({
    dataContainer: {
      flex: 1,
      alignItems: "center",
      paddingTop: 20,
    },
    rotateImageups: {
      // width: height - 400,
      //  marginLeft: 60,
      marginTop: 90,
      height: width - 70,
      width: height - 300,
      transform: [{ rotate: "90deg" }],
      // backgroundColor: 'red',
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      shadowColor: "black",
      shadowOffset: { height: 0, width: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },

    bottomContainer: {
      flex: 1,
      justifyContent: "flex-end",
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    dwdButtonContainerups: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    dwdButtonContainerusps: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    dwdButtonContainerfedex: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },

    dwdButtonTxt: {
      fontFamily: "Montserrat-Regular",
      fontSize: 10,
      fontWeight: "600",
      color: "#313334",
      textDecorationLine: "underline",
    },
  });

  const [imgSrc, setImgSrc] = useState(null);

  const [alertContent, setAlertContent] = useState({
    title: "",
    message: "",
    type: "success",
    visible: false,
  });

  const onAlertModalTouchOutside = () => {
    setAlertContent({
      title: "",
      message: "",
      type: "",
      visible: false,
    });
  };
  const checkAndroidPermission = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
      Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
  };
  const [downloadIndicater, setDownloadIndicator] = useState(false);

  const WriteBase64ToFile = async (img) => {
    setDownloadIndicator(true);
    if (Platform.OS === "android") {
      await checkAndroidPermission();
    }

    CameraRoll.save(img.uri, { type: "photo", album: "homitag" })
      .then(() => {
        setDownloadIndicator(false);
        setAlertContent({
          title: "",
          visible: true,
          message: `You've Successfully saved to ${
            Platform.OS === "android" ? "Gallery" : "Photos"
          }`,
          type: "success",
        });
      })
      .catch((err) => {
        setDownloadIndicator(false);
        setAlertContent({
          title: "Oops!",
          visible: true,
          message:
            "Sorry, permission denied. Please try again and allow Homitag to save.",
          type: "error",
        });
      });
  };

  const downloadNow = () => {
    WriteBase64ToFile(imageFile);
  };
  const [imageFile, setImageFile] = useState("");

  useEffect(() => {
    const baseData = decode({ base64Data, imageType });
    const rotate = provider === "fedex" || provider === "usps" ? -90 : 90;
    const path = `${RNFS.DocumentDirectoryPath}/FILE.${baseData.extension}`;

    RNFS.writeFile(path, baseData.base64Data, "base64").then((result) => {
      Image.getSize(baseData.src, (widthH, heightH) => {
        if (Platform.OS === "ios") {
          ImageResizer.createResizedImage(
            path,
            widthH,
            heightH,
            "PNG",
            100,
            rotate
          )
            .then((res) => {
              RNFS.readFile(res.uri, "base64").then((file) => {
                setImageFile({
                  imageData: `data:image/png;base64,${file}`,
                  ...res,
                });
              });
            })
            .catch((err) => console.log({ err }));
        } else if (Platform.OS === "android") {
          RNFS.readFile(path, "base64").then((file) => {
            setImageFile({
              imageData: `data:image/png;base64,${file}`,
              ...res,
            });
          });
        }
      });
    });

    setImgSrc(baseData);
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <Header /> */}

        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingTop: 20,
            flexGrow: 1,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              shadowColor: "black",
              shadowOffset: { height: 0, width: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              paddingHorizontal: 20,
              paddingTop: 20,
            }}
          >
            {imgSrc && (
              <>
                <CachedImage
                  source={{ uri: imageFile.imageData }}
                  style={{
                    width: width - 80,
                    height: 500,
                  }}
                  resizeMode="contain"
                  indicator={Progress.Pie}
                  indicatorProps={{
                    size: 30,
                    borderWidth: 0,
                    color: "#7471FF",
                    unfilledColor: "#FFF",
                  }}
                />
                {/* <Image
              resizeMode="stretch"
              style={{
                width: width - 40, height: 550,
              }}
              source={{ uri: imageFile.imageData }}
            /> */}
              </>
            )}
          </View>
          <View style={styles[`dwdButtonContainer${provider}`]}>
            <TouchableOpacity onPress={downloadNow}>
              <Text style={styles.dwdButtonTxt}>DOWNLOAD NOW</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <Heading
              type="inactive"
              style={{
                fontSize: 13,
                textAlign: "center",
                marginBottom: 30,
                color: "#969696",
              }}
            >
              We’ll send a copy of this to {buyerDetail?.data?.email} too.
            </Heading>
          </View>
        </ScrollView>
      </SafeAreaView>
      <FooterAction
        mainButtonProperties={{
          label: "Next",
          subLabel: "PACKING SLIP",
          onPress: () => {
            navigation.navigate("PackingSlip", {
              buyerDetail,
              provider,
              orderData,
            });
          },
        }}
      />
      <SafeAreaView style={safeAreaNotchHelper} />
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible}
        onTouchOutside={onAlertModalTouchOutside}
      />
      {downloadIndicater && <ScreenLoader />}
    </>
  );
};

export default ShippingLabelScreen;
