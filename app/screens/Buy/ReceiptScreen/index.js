import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import RNFS from "react-native-fs";
import {
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  BackHandler,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { FooterAction, SweetAlert } from "#components";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import BorderElement from "./border-element";
import { selectUserData } from "#modules/User/selectors";
import { selectOrderData } from "#modules/Orders/selectors";
import {
  createOffer,
  setPaymentDefault,
  getCardDetail,
} from "#modules/Orders/actions";
import { getUserInfo } from "#modules/User/actions";
import { useActions } from "#utils";
import ProductDetail from "./product-detail";
import ItemElement from "./item-element";
import usePrevious from "#utils/usePrevious";
import config from "#config";
import FileViewer from "react-native-file-viewer";
import ScreenLoader from "#components/Loader/ScreenLoader";

const { API_URL } = config;

const { height } = Dimensions.get("window");

const ReceiptScreen = ({ navigation, route }) => {
  /* Selectors */
  const { cardDetail } = useSelector(selectOrderData());
  const { userProductDetail } = useSelector(selectUserData());
  /* Actions */
  const actions = useActions({
    createOffer,
    getUserInfo,
    setPaymentDefault,
    getCardDetail,
  });

  const screenDetails = route?.params?.data;
  const userType = route?.params?.type;
  const [receiptDownloading, setReceiptDownloading] = useState(false);
  const [receiptStatus, setReceiptStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });
  const orderData = route?.params?.orderData ?? null;
  const quantitySelected = route?.params?.quantitySelected ?? 1;
  const recRef = useRef();
  const pickupDlryMethod =
    orderData && orderData.deliveryMethod.type === "pickup";
  const inPerson = orderData && orderData.paymentMethod.type === "inperson";
  const type = `${pickupDlryMethod ? "Pick up" : "Shipping"} ${
    inPerson ? "in person " : "in app"
  }`;
  const {
    paymentMethod,
    deliveryMethod,
    priceAccepted,
    paymentFee,
    shippingValue,
    totalPaid,
    orderID,
    createdAt,
    orderStatus,
    sellerShare,
    quantity,
    tax,
    ReturnRequests,
    cancelStatus,
  } = orderData && orderData;

  switch (paymentMethod.type) {
    case "applepay":
      break;
    case "creditcard":
      break;
    case "inperson":
      break;
    default:
      break;
  }

  const getPaymentProps = () => {
    switch (paymentMethod.type) {
      case "googlePay":
        return {
          paymentMethodText: "GOOGLE PAY",
          pIcon: "google_pay",
        };

      case "applePay":
        return {
          paymentMethodText: "APPLE PAY",
          pIcon: "apple_pay",
        };

      case "googlepay":
        return {
          paymentMethodText: "GOOGLE PAY",
          pIcon: "google_pay",
        };

      case "applepay":
        return {
          paymentMethodText: "APPLE PAY",
          pIcon: "apple_pay",
        };

      case "creditcard":
        return {
          paymentMethodText: cardTitle,
          pIcon: "credit-card",
        };

      default:
        return {
          paymentMethodText: "",
          pIcon: "",
        };
    }
  };

  const goToBack = () => {
    const from = route?.params?.from ?? null;
    if (!from) {
      navigation.goBack();
    } else {
      navigation.navigate("ChatScreen");
    }
  };

  useEffect(() => {
    actions.getCardDetail({
      cardId:
        orderData?.paymentMethod?.stripeToken || orderData?.paymentMethod?.id,
      userId: orderData?.buyerId,
    });
  }, []);

  const [cardTitle, setCardTitle] = useState("CARD");

  const prevCardDetail = usePrevious(cardDetail);
  useEffect(() => {
    if (cardDetail.data && !prevCardDetail?.data) {
      setCardTitle(`**** ${cardDetail.data.last4}`);
    }
  }, [cardDetail, prevCardDetail]);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ goToBack });
      const handleBackButton = () => {
        goToBack();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackButton
      );
      return () => subscription.remove();
    }, [])
  );
  const { paymentMethodText, pIcon } = getPaymentProps();

  const onAlertModalTouchOutside = () => {
    setReceiptStatus({
      title: "",
      visible: false,
      message: "",
      type: "",
    });
  };
  const checkAndroidPermission = async () => {
    try {
      const permission = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
  };
  const downloadFile = async () => {
    if (Platform.OS === "android") {
      await checkAndroidPermission();
    }

    setReceiptDownloading(true);
    const filePath = `${RNFS.DocumentDirectoryPath}/${orderData.orderID}.pdf`;

    const { jobId, promise: downloadResult } = RNFS.downloadFile({
      fromUrl: `${API_URL}/orders/orders/${orderData.id}/receipt?type=pdf`,
      method: "GET",
      headers: {
        "x-api-key": config.ApiKey,
      },

      toFile: filePath,
    });

    downloadResult
      .then((resp) => {
        const options = {
          fromUrl: `${API_URL}/orders/orders/${orderData.id}/receipt?type=pdf`,
          toFile: filePath,
        };
        RNFS.downloadFile(options)
          .promise.then(() => FileViewer.open(filePath))
          .then((res) => {
            setReceiptDownloading(false);
          })
          .catch(setReceiptDownloading(false));
      })
      .catch((E) => {
        setReceiptDownloading(false);
        console.log(E);
      });
    setReceiptStatus({
      message: `Receipt downloaded to download directory as ${orderData.orderID}.pdf`,
      title: "Downloaded",
      type: "success",
      visible: true,
    });
  };
  const deliverType = deliveryMethod.type;

  const getShippingCost = () => {
    if (userType === "BUYER") {
      if (deliveryMethod.freeOption && deliveryMethod.freeOption === true) {
        return 0;
      }
      return shippingValue;
    }
    if (deliveryMethod.type === "shipindependently") {
      return shippingValue;
    }
    return -shippingValue;
  };

  const formatValue = (value) => {
    if (value >= 0) {
      return `$${Number(value).toFixed(2)}`;
    }
    return `-$${Math.abs(value).toFixed(2)}`;
  };

  const getShippingAddress = () => {
    const address = `${deliveryMethod?.addressline1}${
      deliveryMethod?.addressline2 && ", " + deliveryMethod?.addressline2
    }\n${deliveryMethod?.city && "" + deliveryMethod?.city}${
      deliveryMethod?.state && ", " + deliveryMethod?.state
    }${deliveryMethod?.zipcode && " " + deliveryMethod?.zipcode} `;

    return address;
  };

  const getTotalPaid = () => {
    const amount = quantitySelected
      ? Number(totalPaid * quantitySelected)
      : Number(totalPaid);

    if (deliveryMethod.type === "shipindependently" && userType === "SELLER") {
      return amount - Number(shippingValue);
    }
    return amount;
  };
  //  const { postId,paymentMethod,deliveryMethod,priceAccepted,paymentFee,totalPaid } = orderData;
  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        {receiptDownloading && <ScreenLoader />}
        <ScrollView
          style={{ flex: 1, minHeight: height - 150 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View ref={recRef} style={{ backgroundColor: "#fff" }}>
              <View style={{ marginHorizontal: 20, alignItems: "center" }}>
                {screenDetails.id && (
                  <ProductDetail
                    screenDetails={orderData}
                    userProductDetail={userProductDetail}
                  />
                )}
                {deliveryMethod.type !== "pickup" && (
                  <BorderElement
                    rightTopName={deliveryMethod.buyerName}
                    title={getShippingAddress()}
                    leftLabel="Ship to"
                    topBorder={0}
                    numberOfLines={2}
                  />
                )}

                <BorderElement
                  txtType="bold"
                  title={paymentMethodText || ""}
                  leftLabel="Payment Method"
                  topBorder={0}
                  icon={
                    cardDetail?.data?.brand
                      ? cardDetail?.data?.brand.toLowerCase()
                      : pIcon
                  }
                />

                <View
                  style={{
                    borderBottomWidth: 1,
                    //   borderTopWidth: 1,
                    borderColor: "#E8E8E8",
                    paddingTop: 17,
                    paddingBottom: 7,
                    marginBottom: 25,
                  }}
                >
                  {userType === "BUYER" ? (
                    <ItemElement
                      leftLabel="Item Price"
                      rightLabel={`$${
                        priceAccepted
                          ? parseFloat(priceAccepted).toFixed(2)
                          : "0.00"
                      }`}
                    />
                  ) : deliverType !== "pickup" ||
                    orderStatus === "transactioncomplete" ? (
                    <ItemElement
                      leftLabel="Purchase Price"
                      rightLabel={`$${
                        totalPaid ? getTotalPaid().toFixed(2) : "0.00"
                      }`}
                    />
                  ) : (
                    <ItemElement
                      leftLabel="Item Price"
                      rightLabel={`$${
                        priceAccepted
                          ? parseFloat(priceAccepted).toFixed(2)
                          : "0.00"
                      }`}
                    />
                  )}

                  {deliverType !== "pickup" && (
                    <ItemElement
                      leftLabel="Shipping"
                      rightLabel={
                        parseFloat(getShippingCost()) !== 0
                          ? formatValue(getShippingCost())
                          : "Free"
                      }
                    />
                  )}

                  {
                    <ItemElement
                      leftLabel="Sales Tax"
                      rightLabel={`$${parseFloat(tax).toFixed(2)}`}
                    />
                  }

                  {userType !== "BUYER" && (
                    <ItemElement
                      leftLabel="Service Fee"
                      rightLabel={
                        paymentFee
                          ? deliverType !== "pickup" ||
                            orderStatus === "transactioncomplete"
                            ? `-$${(parseFloat(paymentFee) * -1).toFixed(2)}`
                            : `$${(parseFloat(paymentFee) * 1).toFixed(2)}`
                          : "0.00"
                      }
                    />
                  )}

                  {userType !== "BUYER" && (
                    <ItemElement
                      leftLabel="Processing Fee"
                      rightLabel={
                        orderData?.shippedAt
                          ? orderData?.stripeChargeFee
                            ? `-$${parseFloat(
                                orderData?.stripeChargeFee
                              ).toFixed(2)}`
                            : "0.00"
                          : orderData?.partialInfo?.stripeChargeFee
                          ? `-$${parseFloat(
                              orderData?.partialInfo?.stripeChargeFee
                            ).toFixed(2)}`
                          : "0.00"
                      }
                    />
                  )}

                  {userType === "BUYER" ? (
                    <ItemElement
                      leftLabel={
                        ReturnRequests?.[0]?.returnStatus == "returned" ||
                        ReturnRequests?.[0]?.returnStatus == "refundedreturned"
                          ? "Total refunded"
                          : ReturnRequests?.[0]?.returnDeclineReason ==
                            "returnprocessedcustomerrefunded"
                          ? "Total refunded"
                          : deliverType !== "pickup"
                          ? "Total you paid"
                          : "Total you owe"
                      }
                      rightLabel={`$${
                        cancelStatus == "cancelled"
                          ? "0.00"
                          : totalPaid * 1
                          ? (parseFloat(totalPaid) * 1).toFixed(2)
                          : "0.00"
                      }`}
                      txtType="bold"
                    />
                  ) : deliverType !== "pickup" ||
                    orderStatus === "transactioncomplete" ? (
                    <ItemElement
                      leftLabel="Total you earn"
                      rightLabel={`$${
                        sellerShare ? Number(sellerShare).toFixed(2) : "0.00"
                      }`}
                      txtType="bold"
                    />
                  ) : (
                    <ItemElement
                      leftLabel="Buyer Offer"
                      rightLabel={`$${
                        totalPaid ? parseFloat(totalPaid).toFixed(2) : "0.00"
                      }`}
                      txtType="bold"
                    />
                  )}
                </View>
                {pickupDlryMethod && (
                  <ItemElement leftLabel={type} txtType="bold" />
                )}
              </View>
              <View
                style={{
                  backgroundColor: "#F5F5F5",
                  paddingHorizontal: 20,
                  paddingBottom: 5,
                  paddingTop: 20,
                  marginTop: 0,
                  marginBottom: 50,
                }}
              >
                <ItemElement
                  leftLabel="Order ID:"
                  txtType="bold"
                  rightLabel={orderID}
                  float="left"
                />
                <ItemElement
                  leftLabel="Date Purchased:"
                  txtType="bold"
                  float="left"
                  rightLabel={moment(createdAt).format("MM/DD/YYYY")}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
      <FooterAction
        mainButtonProperties={{
          label: "Download",
          onPress: downloadFile,
          disabled: receiptDownloading,
        }}
      />
      <SweetAlert
        title={receiptStatus.title}
        message={receiptStatus.message}
        type={receiptStatus.type}
        dialogVisible={receiptStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default ReceiptScreen;
