import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Text,
} from "react-native";
import { FooterAction, ItemSellObj, Toast } from "#components";
import ScreenLoader from "#components/Loader/ScreenLoader";
import {
  safeAreaViewWhite,
  safeAreaNotchHelper,
  paddings,
} from "#styles/utilities";
import { selectUserData } from "#modules/User/selectors";
import {
  getUserInfo,
  getAddressList,
  getPaymentCards,
} from "#modules/User/actions";
import { selectOrderData } from "#modules/Orders/selectors";
import { clearOrder, createOffer, offerAction } from "#modules/Orders/actions";
import { useActions } from "#utils";
import usePrevious from "#utils/usePrevious";
import PriceElement from "./price-element";
import { Colors, Fonts } from "#themes";
import useCheckNetworkInfo from "../../../hooks/useCheckNetworkInfo";

const { height } = Dimensions.get("window");

const OfferBuyScreen = ({ navigation, route }) => {
  const { internetAvailable } = useCheckNetworkInfo();

  const screenDetails = route?.params?.data;
  const isCounter = route?.params?.counter ?? false;
  const quantitySelected = route?.params?.quantitySelected ?? 1;
  const item = {};

  /* Selectors */
  const { order, ordersList } = useSelector(selectOrderData());
  const {
    information: userInfo,
    addressListState,
    paymentMethodDefault,
  } = useSelector(selectUserData());
  const { userProductDetail } = useSelector(selectUserData());
  const prevOrder = usePrevious(order);

  const dispatch = useDispatch();
  /* Actions */
  const actions = useActions({
    createOffer,
    getUserInfo,
    offerAction,
    getAddressList,
    getPaymentCards,
  });

  const [offerValue, setOfferValue] = useState("");
  const [titleText] = useState(() =>
    route.name !== "MakeOfferScreen"
      ? "Buy now"
      : route?.params?.title ?? "Make Offer"
  );
  const [nextOption, setNextOption] = useState("payment"); // payment, delivery, offer, counter
  const [bottomText, setBottomText] = useState("");
  const [offerBtDisabled, setOfferBtDisabled] = useState(false);
  const [toastError, setToastError] = useState({
    isVisible: false,
    message: "",
  });
  const [sellerDetails, setSellerDetails] = useState({});
  const [errOfferPriceErr, setErrOfferPriceErr] = useState(null);
  const [offerDisabled, setOfferDisabled] = useState(false);

  const _isVehicle = () => {
    if (screenDetails?.customProperties?.category?.name === "Vehicles") {
      return true;
    }
    return false;
  };

  useEffect(() => {
    actions.getAddressList();
    actions.getPaymentCards({ userId: userInfo.id, type: "card" });
  }, [userInfo]);

  useEffect(() => {
    if (screenDetails?.id) {
      if (screenDetails.isNegotiable) {
        setBottomText("Negotiable");
        setOfferDisabled(false);
      } else {
        setBottomText("Non-Negotiable");
        setOfferValue(
          (parseFloat(screenDetails.initialPrice) * quantitySelected).toFixed(2)
        );
        setOfferDisabled(true);
      }

      actions.getUserInfo({
        userId: screenDetails.userId,
        params: { light: true },
      });

      const payments = [];

      for (let i = 0; i < screenDetails.PaymentMethods.length; i++) {
        if (
          Object.keys(screenDetails.PaymentMethods[i].customProperties)
            .length === 0
        ) {
          payments.push(screenDetails.PaymentMethods[i]);
        } else {
          for (let j = 0; j < screenDetails.DeliveryMethods.length; j++) {
            if (
              parseInt(screenDetails.initialPrice, 10) >=
                screenDetails.PaymentMethods[i].customProperties[
                  screenDetails.DeliveryMethods[j].code
                ].rangeAvailable[0] &&
              parseInt(screenDetails.initialPrice, 10) <=
                screenDetails.PaymentMethods[i].customProperties[
                  screenDetails.DeliveryMethods[j].code
                ].rangeAvailable[1]
            ) {
              payments.push(screenDetails.PaymentMethods[i]);
              break;
            }
          }
        }
      }

      if (
        payments.length === 1 &&
        payments[0].code === "payinperson" &&
        screenDetails.DeliveryMethods.length === 1 &&
        screenDetails.DeliveryMethods[0].code === "pickup"
      ) {
        setNextOption("offer");
        return;
      }

      if (
        payments.find(
          (payment) =>
            payment.code === "inapp" &&
            screenDetails.DeliveryMethods.length === 1 &&
            screenDetails.DeliveryMethods[0].code === "pickup"
        )
      ) {
        setNextOption("payment");
        return;
      }

      if (isCounter) {
        setNextOption("counter");
        setBottomText("");
        return;
      }

      setNextOption("delivery");
    }
  }, [screenDetails]);

  useEffect(() => {
    if (userProductDetail?.data?.id === screenDetails?.userId) {
      setSellerDetails(userProductDetail.data);
    }
  }, [userProductDetail]);

  useEffect(() => {
    if (order?.id && prevOrder && !prevOrder?.id) {
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
      item.receiver.userId = sellerDetails?.id;
      item.datetime = null;
      item.badgeCount = 0;
      item.post = {};
      item.post.id = screenDetails?.id;
      item.post.title = screenDetails.Product.title;
      if (screenDetails?.Product.ProductImages[0]) {
        item.post.urlImage = screenDetails?.Product.ProductImages[0].urlImage;
      } else {
        item.post.urlImage = "";
      }

      const offerData = {};
      offerData.offeredValue = offerValue;
      offerData.requireMessage = true;
      dispatch(clearOrder());

      navigation.navigate("ChatScreen", {
        item,
        screenDetails,
        offerData,
        action: "ProductDetail",
      });
    }
  }, [order]);

  const _verifyUserHasDefaultAddress = () => {
    const defaultAddress = addressListState?.data?.filter(
      (address) => address.default === true
    )[0];

    if (defaultAddress) {
      return true;
    }
    return false;
  };

  const _verifyUserHasDefaultPaymentMethod = () => {
    const defaultPayment = paymentMethodDefault.default;

    if (defaultPayment) {
      return true;
    }
    return false;
  };

  /**
   * @description Return true if item has multiple delivery methods
   * @returns Boolean
   */
  const _hasMultipleDeliveryMethods = () => {
    if (screenDetails?.DeliveryMethods.length > 1) {
      return true;
    }
    return false;
  };

  const _isItemPickup = () => {
    if (
      screenDetails &&
      screenDetails?.DeliveryMethods?.find((deliveryMethod) =>
        deliveryMethod?.code.includes("pickup")
      )
    ) {
      return true;
    }
    return false;
  };

  /**
   * @description Verify if item distance is less than $miles
   * @param { Number } miles Distance to compare
   * @returns Boolean
   */
  const _isItemCloserThan = (miles = 0) => {
    if (Math.round(screenDetails?.distance) <= miles) {
      return true;
    }
    return false;
  };

  const pressAction = () => {
    switch (nextOption) {
      case "payment":
        navigation.navigate("PaymentScreen", {
          data: { screenDetails, offerValue },
          quantitySelected,
        });
        break;
      case "delivery":
        if (_hasMultipleDeliveryMethods() && _isItemCloserThan(10)) {
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
          item.receiver.userId = sellerDetails?.id;
          item.datetime = null;
          item.badgeCount = 0;
          item.post = {};
          item.post.id = screenDetails?.id;
          item.post.title = screenDetails.Product.title;
          if (screenDetails?.Product.ProductImages[0]) {
            item.post.urlImage =
              screenDetails?.Product.ProductImages[0].urlImage;
          } else {
            item.post.urlImage = "";
          }

          const offerData = {};
          offerData.offeredValue = offerValue;
          offerData.requireMessage = true;
          navigation.navigate("DeliverySelector", {
            item,
            data: { ...screenDetails, offerValue },
          });
          return;
        }

        if (
          _verifyUserHasDefaultAddress() &&
          _verifyUserHasDefaultPaymentMethod()
        ) {
          navigation.navigate("PaymentConfirmationScreen", {
            quantitySelected,
            from: "BuyNowScreen",
            data: {
              ...screenDetails,
              offerValue: screenDetails.buyNowAction
                ? parseFloat(screenDetails.initialPrice)
                : !offerValue || offerValue === 0
                ? parseFloat(screenDetails.initialPrice)
                : offerValue,
            },
            address: addressListState?.data?.filter(
              (address) => address.default === true
            )[0],
          });
          return;
        }

        if (_verifyUserHasDefaultAddress()) {
          navigation.navigate("PaymentScreen", {
            quantitySelected,
            data: { ...screenDetails, offerValue },
            address: addressListState?.data?.filter(
              (address) => address.default === true
            )[0],
          });
          return;
        }

        navigation.navigate("ShippingInfo", {
          quantitySelected,
          data: { ...screenDetails, offerValue },
        });
        break;
      case "offer":
        setOfferBtDisabled(true);
        const offerData = {};
        offerData.params = {};
        offerData.params.postId = screenDetails?.id;
        offerData.params.price = offerValue;
        offerData.params.buyerId = userInfo?.id;
        offerData.params.deliveryMethodSelected = {};
        offerData.params.deliveryMethodSelected.type = "pickup";
        offerData.params.paymentMethodSelected = {};
        offerData.params.paymentMethodSelected.type = "inperson";
        actions.createOffer(offerData);
        break;
      case "counter":
        setOfferBtDisabled(true);
        actions.offerAction({
          orderId: ordersList.data[0]?.id,
          counterOffer: offerValue,
          action: "counter",
          user: {
            id: userInfo?.id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
          },
          post: {
            title: screenDetails.Product.title,
          },
        });
        break;
    }
  };

  let subLabel = "MAKE OFFER";
  if (nextOption === "payment") {
    subLabel = "PAYMENT METHOD";
  } else if (nextOption === "delivery") {
    subLabel = "DELIVERY METHOD";
  } else if (nextOption === "counter") {
    subLabel = "";
  }

  const calculateMinPrice = () => {
    const shipping = screenDetails?.DeliveryMethods?.filter(
      (method) => method?.code !== "pickup"
    ).pop();

    let shippingCost = 0;

    if (shipping?.code === "homitagshipping") {
      const provider =
        shipping?.DeliveryMethodPerPost?.customProperties?.optionsAvailable
          ?.find((option) => option?.selected)
          ?.providers?.find((provider) => provider?.selected);
      shippingCost = provider?.cost ?? 0;
    } else if (shipping?.code === "shipindependently") {
      shippingCost =
        shipping?.DeliveryMethodPerPost?.customProperties?.shippingCost;
    }

    const initialPrice = Number(screenDetails?.initialPrice);

    const minProfit = 0.03 * initialPrice;
    const fee = 0.1 * initialPrice;
    let minPrice = initialPrice - minProfit - fee;

    if (shippingCost) {
      const numShippingCost = Number(shippingCost);
      const finalMinimum = initialPrice - minProfit - fee;
      return finalMinimum;
    } else {
      return minPrice;
    }
  };

  const renderBottomText = () => {
    if (!_isVehicle()) {
      let textToShow =
        titleText === "Make Counter"
          ? "The buyer have 24 hours to accept your order"
          : `The seller have 24 hours to accept your order ${
              _isItemPickup() ? "when you pay within the app" : ""
            }`;
      return (
        <Text
          style={{
            textAlign: "center",
            color: Colors.gray,
            fontFamily: Fonts.family.regular,
            fontSize: 13,
            ...paddings["p-4"],
          }}
        >
          {textToShow}
        </Text>
      );
    }
  };

  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <Toast
          isVisible={internetAvailable === false}
          message="Please, check your internet connection."
        />
        <Toast isVisible={toastError.isVisible} message={toastError.message} />
        <KeyboardAvoidingView
          style={{ flex: 1, minHeight: height - 150 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View>
                {screenDetails?.id && (
                  <ItemSellObj screenDetails={screenDetails} />
                )}

                <PriceElement
                  titleText={titleText}
                  bottomText={bottomText}
                  value={offerValue}
                  changeListener={setOfferValue}
                  offerDisabled={offerDisabled}
                  errOfferPriceErr={errOfferPriceErr}
                  setErrOfferPriceErr={setErrOfferPriceErr}
                  minPrice={calculateMinPrice()}
                />
              </View>
              {renderBottomText()}
            </View>
          </TouchableWithoutFeedback>
          <FooterAction
            mainButtonProperties={{
              label: "Next",
              subLabel,
              disabled:
                offerValue === "" ||
                offerBtDisabled ||
                errOfferPriceErr ||
                parseFloat(offerValue) === 0,
              onPress: () => {
                pressAction();
              },
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
      {order.isFetching && <ScreenLoader />}
    </>
  );
};

export default OfferBuyScreen;
