import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  Image,
  PermissionsAndroid,
} from "react-native";
// import Pdf from 'react-native-pdf';
import moment from "moment";
import * as Progress from "react-native-progress";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import Config from "#config";
import { CachedImage, FooterAction, Heading, SweetAlert } from "#components";
import { safeAreaNotchHelper } from "#styles/utilities";
import ScreenLoader from "#components/Loader/ScreenLoader";
import usePrevious from "#utils/usePrevious";
import { getOrderById } from "#modules/Orders/actions";
import { selectOrderData } from "#modules/Orders/selectors";
import { useActions } from "#utils";

const { width, height } = Dimensions.get("window");
const { API_URL } = Config;

const TrackItempScreen = ({ navigation, route }) => {
  const handleCloseActionLocal = () => {
    navigation.navigate("OrderStatus");
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleCloseAction: handleCloseActionLocal });
    }, [])
  );

  const actions = useActions({
    getOrderById,
  });
  const orderData = route?.params?.orderData ?? null;
  const [indicator, setIndicator] = useState(false);
  const [imageFile, setImageFile] = useState({});

  const { orderDetail } = useSelector(selectOrderData());

  const prevOrderDetail = usePrevious(orderDetail);

  useFocusEffect(
    useCallback(() => {
      if (orderDetail.data && prevOrderDetail && !prevOrderDetail.data) {
        const blobBase64 = `data:image/${orderDetail.data.labelExtension.toLowerCase()};base64,${
          orderDetail.data.labelData
        }`;

        setImageFile({ uri: blobBase64 });
      }
    }, [orderDetail])
  );

  const styles = StyleSheet.create({
    dataContainer: {
      flex: 1,
      alignItems: "center",
      paddingTop: 20,
    },
    estText: {
      fontFamily: "Montserrat-Regular",
      fontSize: 15,
      fontWeight: "bold",
      color: "#313334",
    },
    estDate: {
      fontFamily: "Montserrat-Regular",
      fontSize: 13,
      // fontWeight: 'bold',
      color: "#313334",
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

  useEffect(() => {
    // actions.getPackingSlip({ orderId: 'cb2b3a5c-0f5e-4d4c-a800-e3b150624c55', type: 'pdf' });
    actions.getOrderById({ orderId: orderData.id });
  }, []);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingTop: 30,
            flexGrow: 1,
          }}
        >
          <View style={{ marginBottom: 30 }}>
            <Text>
              <Text style={styles.estText}> Estimated Delivery:</Text>{" "}
              <Text style={styles.estDate}>
                {moment(new Date(orderData.deliverBy)).format("MM/DD/YYYY")}
              </Text>
            </Text>
          </View>
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
                    height: 550,
                    transform: [{ rotate: "90deg" }],
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
        </ScrollView>
      </SafeAreaView>

      <SafeAreaView style={safeAreaNotchHelper} />
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible}
        onTouchOutside={onAlertModalTouchOutside}
      />
      {orderDetail.isFetching && <ScreenLoader />}
    </>
  );
};

export default TrackItempScreen;
