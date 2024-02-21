import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Heading,
  FooterAction,
  ItemSellObj,
  ButtonWithTitle,
} from "#components";

import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import styles from "./styles";

import { selectUserData } from "#modules/User/selectors";
import { getPaymentCards, getAddressList } from "#modules/User/actions";

import { clearOrder, createOffer } from "#modules/Orders/actions";
import { selectOrderData } from "#modules/Orders/selectors";

const OfferBuyScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const {
    information: userInfo,
    addressListState,
    paymentMethodDefault,
    userProductDetail,
  } = useSelector(selectUserData());

  const { order } = useSelector(selectOrderData());

  const buyNowAction = route?.params?.buyNowAction ?? false;
  const quantitySelected = route?.params?.quantitySelected ?? 1;
  const screenDetails = route?.params?.data;
  const [pickupText, setPickupText] = useState("");
  const [shipText, setShipText] = useState("");
  const [optionPickupIsSelected, setOptionPickupIsSelected] = useState(false);
  const [optionShippingIsSelected, setOptionShippingIsSelected] =
    useState(false);

  useEffect(() => {
    dispatch(clearOrder());
  }, [dispatch]);

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

  const selectPickupOptionAction = () => {
    setOptionPickupIsSelected(true);
    setOptionShippingIsSelected(false);
  };

  const selectShippingOptionAction = () => {
    setOptionShippingIsSelected(true);
    setOptionPickupIsSelected(false);
  };

  const makeOffer = () => {
    const offerData = {};
    offerData.params = {};
    offerData.params.postId = screenDetails?.id;
    offerData.params.price = screenDetails?.offerValue;
    offerData.params.buyerId = userInfo?.id;
    offerData.params.deliveryMethodSelected = {};
    offerData.params.deliveryMethodSelected.type = "pickup";
    offerData.params.paymentMethodSelected = {};
    offerData.params.paymentMethodSelected.type = "inperson";
    dispatch(
      createOffer({
        ...offerData,
      })
    );
  };

  const [sellerDetails, setSellerDetails] = useState({});

  useEffect(() => {
    if (userProductDetail?.data?.id === screenDetails?.userId) {
      setSellerDetails(userProductDetail.data);
    }
  }, [screenDetails, userProductDetail]);

  useEffect(() => {
    if (order?.id) {
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
      offerData.offeredValue = screenDetails?.offerValue;
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

  const handleNextButton = () => {
    if (optionPickupIsSelected) {
      makeOffer();
      return;
    }

    if (
      _verifyUserHasDefaultAddress() &&
      _verifyUserHasDefaultPaymentMethod()
    ) {
      navigation.navigate("PaymentConfirmationScreen", {
        data: screenDetails,
        from: "DeliverySelector",
        address: addressListState?.data?.filter(
          (address) => address.default === true
        )[0],
        quantitySelected,
      });
      return;
    }

    if (_verifyUserHasDefaultAddress()) {
      navigation.navigate("PaymentScreen", {
        data: screenDetails,
        from: "DeliverySelector",
        address: addressListState?.data?.filter(
          (address) => address.default === true
        )[0],
        quantitySelected,
      });
      return;
    }

    navigation.navigate("ShippingInfo", {
      data: screenDetails,
      buyNowAction,
      from: "DeliverySelector",
      quantitySelected,
    });
  };

  useEffect(() => {
    dispatch(getPaymentCards({ userId: userInfo.id, type: "card" }));
    dispatch(getAddressList());
  }, [dispatch, userInfo.id]);

  useEffect(() => {
    if (screenDetails && screenDetails.id) {
      setPickupText(
        `In person\n${parseInt(screenDetails.distance, 10)}mi away`
      );

      const deliveryData = screenDetails.DeliveryMethods.find(
        (deliveryMethod) => deliveryMethod.code !== "pickup"
      );

      let free = false;
      let shipCost = "";

      if (deliveryData) {
        if (
          deliveryData.DeliveryMethodPerPost?.customProperties &&
          deliveryData.DeliveryMethodPerPost?.customProperties.freeOption &&
          deliveryData.DeliveryMethodPerPost?.customProperties.freeOption
            .valueSelected
        ) {
          free = true;
        }
        if (
          deliveryData.DeliveryMethodPerPost?.customProperties &&
          deliveryData.DeliveryMethodPerPost?.customProperties.shippingCost
        ) {
          shipCost =
            `$${deliveryData.DeliveryMethodPerPost?.customProperties.shippingCost}`
              ? parseFloat(
                  deliveryData.DeliveryMethodPerPost?.customProperties
                    .shippingCost
                ).toFixed(2)
              : "0.00";
        }
      }
      setShipText(free ? "Free Shipping" : shipCost);
    }
  }, [screenDetails]);

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={{ flex: 1 }}>
            {screenDetails.id && <ItemSellObj screenDetails={screenDetails} />}
            <Heading
              type="regular"
              style={{ fontSize: 13, textAlign: "center", marginBottom: 45 }}
            >
              Please select a delivery method
            </Heading>
            <View style={styles.buttonsContainer}>
              <ButtonWithTitle
                label="Pick Up"
                icon="user"
                innerText={pickupText}
                buttonPressed={selectPickupOptionAction}
                active={optionPickupIsSelected}
              />
              <ButtonWithTitle
                label="Shipping"
                icon="shipping"
                innerText={shipText}
                buttonPressed={selectShippingOptionAction}
                active={optionShippingIsSelected}
              />
            </View>
            <View style={styles.bottomContainer}>
              {optionPickupIsSelected && (
                <Heading
                  type="regular"
                  style={{
                    fontSize: 13,
                    textAlign: "center",
                    marginBottom: 24,
                    color: "#969696",
                  }}
                >
                  Pick Up method selected.
                </Heading>
              )}
              {optionShippingIsSelected && (
                <Heading
                  type="regular"
                  style={{
                    fontSize: 13,
                    textAlign: "center",
                    marginBottom: 25,
                    color: "#969696",
                  }}
                >
                  Shipping method selected.
                </Heading>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
        <FooterAction
          mainButtonProperties={{
            label: "Next",
            sublabel: optionPickupIsSelected
              ? "PAYMENT METHOD"
              : optionShippingIsSelected
              ? "SHIPPING INFO"
              : "PAYMENT METHOD",
            disabled: !(optionPickupIsSelected || optionShippingIsSelected),
            onPress: () => {
              handleNextButton();
            },
          }}
        />
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default OfferBuyScreen;
