import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Text,
  Image,
  Keyboard,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import ProductDetail from "../OldOrderStatusScreen/product-detail";
import {
  getOrderById,
  getReturnOrder,
  raiseDispute,
} from "#modules/Orders/actions";
import { useActions } from "#utils";
import { Colors } from "#themes";
import { SweetDialog, SweetAlert, Icon, FooterAction } from "#components";
import {
  setClaimPhotoList,
  removeClaimPhotoFromList,
} from "#modules/User/actions";

import fonts from "#themes/fonts";
import colors from "#themes/colors";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import Ionicons2 from "react-native-vector-icons/Ionicons";
import DocumentPicker from "react-native-document-picker";
import ImageResizer from "@bam.tech/react-native-image-resizer";

import { selectUserData } from "#modules/User/selectors";
import { removeClaimImage, uploadClaimImage } from "#services/apiUsers";

const { width } = Dimensions.get("window");

const ClaimDisputeScreen = ({ navigation, route }) => {
  const screenDetails = route?.params?.screenDetails ?? null;
  const userProductDetail = route?.params?.userProductDetail ?? null;
  const orderData = route?.params?.orderData ?? null;
  const chatItem = route?.params?.chatItem ?? null;

  const {
    information: userInfo,
    postBuyerDetail,
    claimPhotosList,
  } = useSelector(selectUserData());

  const [disputeScreen, setdisputeScreen] = useState(false);
  const [disputeRequestText, setDisputeRequestText] = useState("");
  const [disputeSuccess, showDisputeSuccess] = useState(false);

  const [raiseDisputeLoading, setraiseDisputeLoading] = useState(false);

  const actions = useActions({
    getOrderById,
    getReturnOrder,
    raiseDispute,
    setClaimPhotoList,
    removeClaimPhotoFromList,
  });

  useEffect(() => {
    // actions.getReturnOrder({ returnId });
  }, []);

  const goToOrderStatusScreen = () => {
    // setShowAlert(false);
    navigation.navigate("OrderStatus", {
      orderData: orderData,
      type: "SELLER",
      chatItem,
      orderId: orderData?.id,
      screenName: 'ClaimDispute'
    });
    showDisputeSuccess(false);
  };

  const pickFIle = async () => {
    try {
      let resizeImage = null;
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (Platform.OS === "ios") {
        resizeImage = await ImageResizer.createResizedImage(
          res.uri,
          720,
          1280,
          "JPEG",
          60
        );
      } else if (Platform.OS === "android") {
        resizeImage = { uri: res.uri };
      }

      const resp = await uploadClaimImage(
        resizeImage.uri,
        orderData.buyerId,
        orderData.id
      );
      if (resp.data) {
        if (claimPhotosList && claimPhotosList.length) {
          actions.setClaimPhotoList([...claimPhotosList, { ...resp.data }]);
        } else {
          actions.setClaimPhotoList([{ ...resp.data }]);
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <ScrollView
          contentContainerStyle={{ justifyContent: "space-between" }}
          style={{ flex: 1 }}
        >
          <View>
            {screenDetails?.id && (
              <ProductDetail
                screenDetails={screenDetails}
                userProductDetail={userProductDetail}
              />
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 15,
                marginTop: 25,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.family.bold,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Claim Status:
              </Text>
              <Text
                onPress={() => {
                  setdisputeScreen(false);
                  // showOrderClaimHistory(orderData);
                  // setCancellationRequestModal(false);
                  // setDeniedScreen(false);
                }}
                style={{
                  fontFamily: fonts.family.semiBold,
                  fontSize: 11,
                  color: colors.green,
                  marginLeft: 10,
                  textDecorationLine: "underline",
                  textAlign: "center",
                }}
              >
                BUYER FILED CLAIM
              </Text>
            </View>

            <>
              <Text
                style={{
                  fontFamily: fonts.family.semiBold,
                  fontSize: 15,
                  textAlign: "left",
                  marginTop: 20,
                  marginLeft: 20,
                }}
              >
                Explaination
              </Text>
              <TextInput
                placeholder="Add Comment Here"
                style={{
                  width: "100%",
                  height: 100,
                  paddingRight: 20,
                  fontFamily: "Montserrat-SemiBold",
                  fontSize: 16,
                  marginHorizontal: 20,
                  padding: 0,
                  borderBottomColor: "#96969660",
                  borderBottomWidth: 1,
                }}
                numberOfLines={5}
                multiline={true}
                value={disputeRequestText}
                onChangeText={(text) => {
                  setDisputeRequestText(text);
                }}
                returnKeyType="done"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                blurOnSubmit
              />
              {claimPhotosList && claimPhotosList.length ? (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 20,
                    marginLeft: 18,
                    marginBottom: 10,
                  }}
                >
                  {claimPhotosList.map((img, ind) => {
                    return (
                      <View>
                        <Ionicons
                          onPress={() => {
                            actions.removeClaimPhotoFromList(img.Key);
                          }}
                          style={{
                            position: "absolute",
                            right: 5,
                            top: -8,
                            zIndex: 10,
                            backgroundColor: "#fff",
                            borderRadius: 10,
                          }}
                          name="close"
                          size={20}
                          color={"#000"}
                        />
                        <Image
                          source={{ uri: img.url }}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 10,
                            marginRight: 15,
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 15,
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setdisputeScreen(false);
                    navigation.navigate("ClaimPhotos", {
                      order: orderData,
                    });
                  }}
                  style={{
                    flexDirection: "row",
                    marginRight: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    borderColor: colors.active,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 7.5,
                  }}
                >
                  <Ionicons2
                    size={20}
                    name="camera-outline"
                    color={colors.active}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.family.regular,
                      color: colors.active,
                      fontSize: 12,
                      marginLeft: 5,
                    }}
                  >
                    ATTACH CAMERA
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setdisputeScreen(false);
                    pickFIle();
                  }}
                  style={{
                    flexDirection: "row",
                    marginLeft: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    borderColor: colors.active,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 7.5,
                  }}
                >
                  <Ionicons2 size={20} name="add" color={colors.active} />
                  <Text
                    style={{
                      fontFamily: fonts.family.regular,
                      color: colors.active,
                      fontSize: 12,
                      marginLeft: 5,
                    }}
                  >
                    ATTACH DOCS
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          </View>
        </ScrollView>
        <FooterAction
          mainButtonProperties={{
            label: "Submit Dispute",
            disabled:
              disputeRequestText &&
              disputeRequestText.trim() &&
              disputeRequestText.trim() != ""
                ? false
                : true,
            onPress: () => {
              setraiseDisputeLoading(true);
              actions.raiseDispute({
                orderId: orderData.id,
                claimId:
                  orderData?.ClaimRequests?.[
                    orderData?.ClaimRequests?.length - 1 || 0
                  ]?.id,
                params: {
                  comment: disputeRequestText,
                  destination: "homitag",
                  images: claimPhotosList,
                  nextStatus: "disputed",
                  origin: "seller",
                },
              });
              setraiseDisputeLoading(false);
              showDisputeSuccess(true);
            },
            showLoading: raiseDisputeLoading,
          }}
        />
      </SafeAreaView>
      <SweetAlert
        title={`You've successfully disputed the claim sent by ${
          orderData.buyerInfo.name
        } for ${
          screenDetails.title
            ? screenDetails.title
            : orderData?.productInfo?.title
        }`}
        message={
          "Homitag will reach out to you by email to address the situation."
        }
        type={"success"}
        dialogVisible={disputeSuccess}
        onTouchOutside={() => {
          goToOrderStatusScreen();
        }}
        onDone={() => {
          goToOrderStatusScreen();
        }}
        iconWidth={120}
      />
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default ClaimDisputeScreen;
