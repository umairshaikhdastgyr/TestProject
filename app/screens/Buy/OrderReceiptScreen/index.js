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
import { FooterAction, Loader, SweetAlert } from "#components";
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
import { currencyFormatter } from "#utils";
import FileViewer from "react-native-file-viewer";
import ScreenLoader from "#components/Loader/ScreenLoader";

const { API_URL } = config;

const { height } = Dimensions.get("window");

const OrderReceiptScreen = ({ navigation, route }) => {
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
  const storeName = route?.params?.storeName;
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

  const calculationType = orderData?.shippedAt
    ? "shippedInfo"
    : "unshippedInfo";
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
                {screenDetails.id ? (
                  <ProductDetail
                    screenDetails={orderData}
                    userProductDetail={userProductDetail}
                    storeName={storeName}
                  />
                ) : null}
                {deliveryMethod.type !== "pickup" ? (
                  <BorderElement
                    rightTopName={deliveryMethod.buyerName}
                    title={getShippingAddress()}
                    leftLabel="Ship to"
                    topBorder={0}
                    numberOfLines={2}
                  />
                ) : null}
                {userType === "BUYER" ? (
                  <BorderElement
                    txtType="bold"
                    title={
                      orderData?.paymentMethod?.last4
                        ? `**** ${orderData?.paymentMethod?.last4}`
                        : orderData?.paymentMethod?.type
                    }
                    leftLabel="Payment Method"
                    topBorder={0}
                    icon={
                      orderData?.paymentMethod?.last4
                        ? orderData?.paymentMethod?.brand?.toLowerCase()
                        : orderData?.paymentMethod?.type
                    }
                  />
                ) : null}

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
                    <>
                      {orderData?.quantity > 1 ? (
                        <ItemElement
                          leftLabel={`Item Price (${currencyFormatter.format(
                            orderData?.calculationValues?.[calculationType]
                              ?.itemPrice
                          )} x ${orderData?.quantity} QTY)`}
                          rightLabel={`${currencyFormatter.format(
                            orderData?.calculationValues?.[calculationType]
                              ?.itemPrice * orderData?.quantity
                          )}`}
                        />
                      ) : (
                        <ItemElement
                          leftLabel="Item Price"
                          rightLabel={`${currencyFormatter.format(
                            orderData?.calculationValues?.[calculationType]
                              ?.itemPrice
                          )}`}
                        />
                      )}
                    </>
                  ) : deliverType !== "pickup" ||
                    orderStatus === "transactioncomplete" ? (
                    <ItemElement
                      leftLabel="Purchase Price"
                      rightLabel={`${currencyFormatter.format(
                        orderData?.calculationValues?.[calculationType]
                          ?.purchasePrice
                      )}`}
                    />
                  ) : (
                    <>
                      <ItemElement
                        leftLabel="Purchase Price"
                        rightLabel={`${currencyFormatter.format(
                          orderData?.calculationValues?.[calculationType]
                            ?.purchasePrice
                        )}`}
                      />
                    </>
                  )}

                  {deliverType !== "pickup" ? (
                    <ItemElement
                      leftLabel="Shipping"
                      rightLabel={
                        parseFloat(getShippingCost()) !== 0
                          ? `${currencyFormatter.format(
                              orderData?.calculationValues?.[calculationType]
                                ?.shippingFee
                            )}`
                          : "FREE"
                      }
                    />
                  ) : null}

                  {orderData?.calculationValues?.[calculationType]?.salesTax &&
                  (orderData?.cancelStatus !== "cancelled" ||
                    orderData?.order_status !== "pending") ? (
                    <ItemElement
                      leftLabel="Sales Tax"
                      rightLabel={`${currencyFormatter.format(
                        orderData?.calculationValues?.[calculationType]
                          ?.salesTax
                      )}`}
                    />
                  ) : userType === "BUYER" &&
                    orderData?.calculationValues?.[calculationType]?.salesTax &&
                    orderData?.cancelStatus === "cancelled" &&
                    orderData?.order_status === "pending" ? (
                    <ItemElement
                      leftLabel="Sales Tax"
                      rightLabel={`${currencyFormatter.format(
                        orderData?.calculationValues?.[calculationType]
                          ?.salesTax
                      )}`}
                    />
                  ) : null}

                  {userType !== "BUYER" &&
                  (orderData?.cancelStatus !== "cancelled" ||
                    orderData?.order_status !== "pending") ? (
                    <ItemElement
                      leftLabel="Service Fee"
                      rightLabel={`${currencyFormatter.format(
                        orderData?.calculationValues?.[calculationType]
                          ?.serviceFee
                      )}`}
                    />
                  ) : null}

                  {userType !== "BUYER" &&
                  (orderData?.cancelStatus !== "cancelled" ||
                    orderData?.order_status !== "pending") ? (
                    <ItemElement
                      leftLabel="Processing Fee"
                      rightLabel={`${currencyFormatter.format(
                        orderData?.calculationValues?.[calculationType]
                          ?.processingFee
                      )}`}
                    />
                  ) : null}
                  {userType === "BUYER" ? (
                    <>
                      <ItemElement
                        leftLabel={"Total you paid"}
                        rightLabel={
                          orderData?.cancelStatus !== "cancelled" ||
                          orderData?.order_status !== "pending"
                            ? `${currencyFormatter.format(
                                orderData?.calculationValues?.[calculationType]
                                  ?.totalPaid
                              )}`
                            : `${currencyFormatter.format(0.0)}`
                        }
                        txtType="bold"
                      />
                      {orderData?.calculationValues?.[calculationType]
                        ?.totalRefunded &&
                      (orderData?.cancelStatus !== "cancelled" ||
                        orderData?.order_status !== "pending") ? (
                        <ItemElement
                          txtType="bold"
                          leftLabel="Total Refunded"
                          textColor="red"
                          rightLabel={`${currencyFormatter.format(
                            orderData?.calculationValues?.[calculationType]
                              ?.totalRefunded
                          )}`}
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      {orderData?.calculationValues?.[calculationType]
                        ?.totalRefunded &&
                      (orderData?.cancelStatus !== "cancelled" ||
                        orderData?.order_status !== "pending") ? (
                        <ItemElement
                          txtType="bold"
                          leftLabel="Total Refunded"
                          textColor="red"
                          rightLabel={`-${currencyFormatter.format(
                            orderData?.calculationValues?.[calculationType]
                              ?.totalRefunded
                          )}`}
                        />
                      ) : null}
                      <ItemElement
                        leftLabel={"Total you earn"}
                        rightLabel={
                          orderData?.cancelStatus !== "cancelled" ||
                          orderData?.order_status !== "pending"
                            ? `${currencyFormatter.format(
                                orderData?.calculationValues?.[calculationType]
                                  ?.totalEarned
                              )}`
                            : `${currencyFormatter.format(0.0)}`
                        }
                        txtType="bold"
                      />
                    </>
                  )}
                </View>
                {/* {pickupDlryMethod && (
                  <ItemElement leftLabel={type} txtType="bold" />
                )} */}
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

export default OrderReceiptScreen;
