import React, { useState, useEffect, useRef, useCallback } from "react";
import RNFS from "react-native-fs";
import RNFetchBlob from "rn-fetch-blob";
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
import * as Progress from "react-native-progress";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import Config from "#config";
import { CachedImage, FooterAction, Heading, SweetAlert } from "#components";
import { safeAreaNotchHelper } from "#styles/utilities";
import ScreenLoader from "#components/Loader/ScreenLoader";
import usePrevious from "#utils/usePrevious";
import { getPackingSlip } from "#modules/Orders/actions";
import { selectOrderData } from "#modules/Orders/selectors";
import { useActions } from "#utils";

const { width, height } = Dimensions.get("window");
const { API_URL } = Config;

const PackingSlipScreen = ({ navigation, route }) => {
  const handleCloseActionLocal = () => {
    navigation.navigate("OrderStatus");
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleCloseAction: handleCloseActionLocal });
    }, [])
  );

  const orderData = route?.params?.orderData ?? null;
  const [indicator, setIndicator] = useState(false);
  const [imageFile, setImageFile] = useState({});
  const downloadBlobFile = () => {
    setIndicator(true);
    const orderId = orderData.id;
    const type = "image";
    RNFetchBlob.fetch(
      "GET",
      `${API_URL}/orders/orders/${orderId}/packing?type=${type}`
    )
      // when response status code is 200
      .then((res) => {
        // the conversion is done in native code
        const data = res.base64();

        // const localFile = getLocalPath(url);
        const info = res.info();

        // const fileName = this.getFileName(info.headers['Content-Disposition']);
        const path = `${RNFS.DocumentDirectoryPath}/FILE.png`;
        RNFS.writeFile(path, data, "base64")
          .then(() => {
            setImageFile({
              imageData: `data:image/png;base64,${data}`,
              uri: path,
            });
            setIndicator(false);
          })
          .catch((error) => {
            setIndicator(false);
          });
      })
      // Status code is not 200
      .catch((errorMessage, statusCode) => {
        setIndicator(false);

        // this.setState({ loading: false });
      });
  };

  const { packingSlip } = useSelector(selectOrderData());

  const prevPackingSlip = usePrevious(packingSlip);

  useFocusEffect(
    useCallback(() => {
      if (packingSlip.data && prevPackingSlip && !prevPackingSlip.data) {
        const blobBase64 = `data:image/png;base64,${packingSlip.data}`;
        const path = `${RNFS.DocumentDirectoryPath}/FILE.pdf`;
        RNFS.writeFile(path, blobBase64, "base64")
          .then((res) => console.log({ res }))
          .catch((err) => console.log({ err }));
      }
    }, [packingSlip])
  );
  const buyerDetail = route?.params?.buyerDetail ?? null;
  const provider = route?.params?.provider ?? null;

  const styles = StyleSheet.create({
    dataContainer: {
      flex: 1,
      alignItems: "center",
      paddingTop: 20,
    },
    bottomContainer: {
      flex: 1,
      justifyContent: "flex-end",
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    dwdButtonContainer: {
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

  const WriteBase64ToFile = async (img) => {
    setIndicator(true);
    if (Platform.OS === "android") {
      await checkAndroidPermission();
    }

    CameraRoll.save(img.uri, { type: "photo", album: "homitag" })
      .then(() => {
        setIndicator(false);
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
        setIndicator(false);
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

  useEffect(() => {
    downloadBlobFile();
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
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
            {imageFile ? (
              <>
                <CachedImage
                  source={{ uri: imageFile.uri }}
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
              </>
            ) : null}
          </View>
          <View style={styles.dwdButtonContainer}>
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
              Please incliude this packing slip in your shipment. We’ll send a
              copy of this to {buyerDetail?.data?.email} too.
            </Heading>
          </View>
        </ScrollView>
      </SafeAreaView>
      <FooterAction
        mainButtonProperties={{
          label: "Next",
          subLabel: "DROP OFF INSTRUCTIONS",
          onPress: () => {
            // pressAction();
            navigation.navigate("DropOff", {
              // postDetail,
              provider,
              //   orderData
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
      {indicator && <ScreenLoader />}
    </>
  );
};

export default PackingSlipScreen;
