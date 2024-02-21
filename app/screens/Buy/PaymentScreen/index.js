import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { SafeAreaView, View, ScrollView, Platform } from "react-native";
import { Heading, FooterAction, Toast } from "#components";
import stripe from "tipsi-stripe";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import styles from "./styles";
import PaymentMethodTile from "./payment-method-tile";
import { useActions } from "#utils";
import usePrevious from "#utils/usePrevious";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { createOffer, setPaymentDefault } from "#modules/Orders/actions";
import { getPaymentCards } from "#modules/User/actions";
import { userSelector } from "#modules/User/selectors";
import { selectOrderData } from "#modules/Orders/selectors";

const PaymentScreen = ({ navigation, route }) => {
  /* Selectors */
  const {
    user: {
      information: { id },
      paymentCardList,
      userProductDetail,
      updatePaymentMethodState,
    },
  } = useSelector(userSelector);
  const { order, paymentDefault } = useSelector(selectOrderData());

  const dispatch = useDispatch();
  const prevOrder = usePrevious(order);

  /* Actions */
  const actions = useActions({ createOffer, setPaymentDefault });
  const offerValue = route?.params?.offerValue ?? 0;
  const quantitySelected = route?.params?.quantitySelected ?? 1;
  const address = route?.params?.address ?? null;
  const screen = route?.params?.screen ?? "default";
  const fromScreen = route?.params?.from ?? false;

  const [screenDetails, setScreenDetails] = useState({});
  const [sellerDetails, setSellerDetails] = useState({});
  const [cardList, setCardList] = useState([]);
  const [googleDefault, setGoogleDefault] = useState(true);
  const [toastMessage, setToastMessage] = useState({
    message: "",
    isVisible: false,
  });

  const makeOffer = () => {
    const offerData = {};
    offerData.params = {};
    offerData.params.postId = screenDetails.id;
    offerData.params.price =
      offerValue === 0 ? parseFloat(screenDetails.initialPrice) : offerValue;
    offerData.params.buyerId = id;
    offerData.params.deliveryMethodSelected = {};
    offerData.params.deliveryMethodSelected.type = "pickup";
    offerData.params.paymentMethodSelected = {};
    offerData.params.paymentMethodSelected.type = "inperson";
    actions.createOffer(offerData);
  };

  /**
   * @description Checks if device has support for native pay
   * @returns Boolean
   */
  const deviceHasNativePaySupport = () => {
    if (stripe.deviceSupportsNativePay()) {
      return true;
    }
    return false;
  };

  const nativePay = async () => {
    const paymentMethod =
      Platform.OS === "android" ? "Google pay" : "Apple pay";

    if (deviceHasNativePaySupport()) {
      actions.setPaymentDefault({
        ...paymentDefault,
        state: paymentMethod === "Google pay" ? "googlePay" : "applePay",
        selectedCard: { id: null },
        title: paymentMethod === "Google pay" ? "Google pay" : "Apple pay",
        icon: paymentMethod === "Google pay" ? "google_pay" : "apple_pay",
      });
      pressAction();
      return;
    }
    setToastMessage({
      message: "Sorry, device does not support this type of payment method.",
      isVisible: true,
    });
  };

  const pressAction = () => {
    if (screen === "returnLabel") {
      navigation.navigate("ReturnConfirmation");
      return;
    }
    if (paymentDefault.state === "payInPerson") {
      makeOffer();
      return;
    }
    navigation.navigate("PaymentConfirmationScreen", {
      data: screenDetails,
      address,
      quantitySelected,
    });
  };

  useEffect(() => {
    setScreenDetails(route?.params?.data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (updatePaymentMethodState?.isFetching) {
        return;
      }
      // dispatch(getPaymentCards({ userId: id, type: "card" }));
    }, [])
  );

  useEffect(() => {
    if (!paymentCardList?.isFetching) {
      setCardList(paymentCardList?.data?.data);
      check(paymentCardList?.data?.data);
      return;
    }
    setCardList([]);
  }, [paymentCardList?.data]);

  const check = (array) => {
    for (let i = 0; i < array?.length; i++) {
      if (array[i]?.metadata?.isDefault == "true") {
        setGoogleDefault(false);
        break;
      } else {
        setGoogleDefault(true);
      }
    }
  };

  // useEffect(() => {
  //   check();
  // }, [paymentCardList?.data]);

  useEffect(() => {
    if (userProductDetail?.data?.id === screenDetails?.userId) {
      setSellerDetails(userProductDetail?.data);
    }
  }, [userProductDetail, screenDetails]);

  useFocusEffect(
    useCallback(() => {
      if (order.id && prevOrder && !prevOrder.id) {
        const item = {};

        item.id = null;
        if (sellerDetails.firstName) {
          item.title = `${sellerDetails.firstName} ${sellerDetails.lastName}`;
        }
        item.message = "";
        item.sellerId = screenDetails.userId;
        item.sellerFirstName = sellerDetails.firstName;
        item.sellerLastName = sellerDetails.lastName;
        item.urlImage = sellerDetails.profilepictureurl;
        item.receiver = {};
        item.receiver.firstName = sellerDetails.firstName;
        item.receiver.lastName = sellerDetails.lastName;
        item.receiver.pictureUrl = sellerDetails.profilepictureurl;
        item.receiver.userId = sellerDetails.id;
        item.datetime = null;
        item.badgeCount = 0;
        item.post = {};
        item.post.id = screenDetails.id;
        item.post.title = screenDetails.Product.title;
        item.post.urlImage = screenDetails?.Product.ProductImages[0]?.urlImage;
        const offerData = {};
        offerData.offeredValue =
          offerValue === 0
            ? parseFloat(screenDetails.initialPrice)
            : offerValue;
        offerData.requireMessage = true;
        
        navigation.navigate("ChatScreen", {
          item,
          screenDetails,
          offerData,
          action: "ProductDetail",
        });
      }

      if (order.errorMsg && prevOrder && !prevOrder.errorMsg) {
        setToastMessage({
          message:
            order.errorMsg === "Duplicated Order"
              ? "You've already made the offer."
              : `${order.errorMsg}`,
          isVisible: true,
        });
      }
    }, [order])
  );

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        {paymentCardList?.isFetching && <ScreenLoader />}
        <Toast
          autoHideMs={3000}
          message={toastMessage.message}
          isVisible={toastMessage.isVisible}
        />
        <ScrollView style={styles.bodyContainer}>
          {fromScreen == "ShippingInfo" ? (
            <View style={styles.labelContainer}>
              <Heading
                type="regular"
                style={{
                  fontSize: 13,
                  textAlign: "left",
                  marginTop: 25,
                  marginBottom: 20,
                  color: "#313334",
                }}
              >
                Set up a default payment to skip this step next time
              </Heading>
            </View>
          ) : null}

          {Platform.OS === "ios" ? (
            <PaymentMethodTile
              onPress={() => nativePay()}
              title="Apple pay"
              icon="apple_pay"
              type="no-default"
              tile="applePay"
              googleDefault={googleDefault}
            />
          ) : (
            <PaymentMethodTile
              onPress={() => nativePay()}
              title="Google pay"
              icon="apple_pay"
              type="no-default"
              tile="googlePay"
              googleDefault={googleDefault}
            />
          )}

          <View style={{ flex: 1 }}>
            {cardList?.map((item) => (
              <PaymentMethodTile
                onPress={() => {
                  actions.setPaymentDefault({
                    ...paymentDefault,
                    selectedCard: item,
                    state: item?.id,
                    default: "card",
                    icon: "credit-card",
                    title: `**** ${item?.last4}`,
                  });
                  pressAction();
                }}
                item={item}
                title={`**** ${item?.last4}`}
                icon={
                  item?.brand.toLowerCase()
                    ? item?.brand.toLowerCase()
                    : "credit-card"
                }
                type="no-default"
                tile={item?.id}
              />
            ))}

            <PaymentMethodTile
              onPress={() =>
                navigation.navigate("PaymentCreateScreen", {
                  fromScreen: screen === "returnLabel" ? screen : "payment",
                })
              }
              title="Add a credit/debit card"
              icon="credit-card"
              type="no-default"
              showSideArrow={true}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      {order?.isFetching && <ScreenLoader />}
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default PaymentScreen;
