import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrder as updateOrderApi } from "#services/apiOrders";
import {
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Heading,
  FooterAction,
  SweetAlert,
  InputText,
  Label,
} from "#components";
import { RadioButton } from "./RadioButton";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import styles from "./styles";
import BuyNowSuccessAlert from "#screens/Buy/PaymentConfirmationScreen/buynowSuccessAlert";

import { selectUserData } from "#modules/User/selectors";
import { selectOrderData } from "#modules/Orders/selectors";
import {
  createOffer,
  setPaymentDefault,
  getOrders,
  offerAction,
  getOrderById,
} from "#modules/Orders/actions";
import { getUserInfo } from "#modules/User/actions";
import { useActions } from "#utils";
import ProductDetail from "./product-detail";
import ScreenLoader from "#components/Loader/ScreenLoader";

import usePrevious from "#utils/usePrevious";
import { updatePostStatus } from "#modules/Sell/actions";
const reasonData = {
  BUYER: [
    { text: "Changed my mind", value: "changed_my_mind" },
    {
      text: "Found same item at lower price",
      value: "found_same_item_cheaper",
    },
    { text: "Ordered by mistake", value: "ordered_by_mistake" },
    {
      text: "Need to change shipping or billing address",
      value: "need_change_shipping_address",
    },
    { text: "Price too high", value: "price_too_high" },
    { text: "Would not arrive on time", value: "would_not_arrive_on_time" },
    { text: "Other reason", value: "other_reason" },
  ],
  SELLER: [
    { text: "Changed my mind", value: "changed_my_mind" },
    { text: "Price Error", value: "price_error" },
    {
      text: "Undeliverable Shipping Address",
      value: "undeliverable_shipping_address",
    },
    { text: "Item dmaged", value: "item_damaged" },
    { text: "Out of Stock", value: "out_of_stock" },
    { text: "Unable to ship", value: "unable_to_ship" },
    { text: "Buyer Cancelled", value: "buyer_cancelled" },
    { text: "Other reason", value: "other_reason" },
  ],
};

const { height, width } = Dimensions.get("window");

const CancelExchangeScreen = ({ navigation, route }) => {
  /* Selectors */
  const { order, ordersList } = useSelector(selectOrderData());
  const prevOrder = usePrevious(order);
  const { information: userInfo, userProductDetail } = useSelector(
    selectUserData()
  );

  const directlyCancel = route?.params?.directlyCancel ?? false;
  const storeName = route?.params?.storeName ?? undefined;
  /* Actions */
  const actions = useActions({
    createOffer,
    getUserInfo,
    setPaymentDefault,
    offerAction,
    getOrders,
    getOrderById,
  });
  const screenDetails = route?.params?.data;
  const [alertStatus, setAlertStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });
  const type = route?.params?.type ?? null;
  const chatItem = route?.params?.chatItem ?? null;
  const onAlertModalTouchOutside = async () => {
    setAlertStatus({
      title: "",
      visible: false,
      message: "",
      type: "",
    });

    if (directlyCancel) {
      const updateOrderResult = await updateOrderApi({
        orderId: ordersList.data[0]?.id,
        params: {
          orderStatus: "transactioncancelled",
        },
      });
    }

    navigation.navigate("ExploreMain");
  };
  const [reason, setReason] = useState("");
  const [reasonDesc, setReasonDesc] = useState("");

  const goToOrderStatus = () => {
    navigation.goBack();
  };

  const cancelAction = () => {
    const payload = {};
    payload.orderId = ordersList.data[0]?.id;
    payload.action = "cancel";
    payload.userId = userInfo.id;
    payload.cancelReason = reason;
    // payload.cancelStatus = 'requested';
    payload.comment = reasonDesc === "" ? "-" : reasonDesc;

    actions.offerAction(payload);
  };
  // here H
  useEffect(() => {
    const dataToSend = {};
    dataToSend.postId = chatItem.post.id;
    dataToSend.sellerId = chatItem.sellerId;
    dataToSend.sort = "createdAt-desc";
    dataToSend.page = 1;
    dataToSend.perPage = 5;
    if (chatItem.sellerId === chatItem.receiver.userId) {
      dataToSend.buyerId = userInfo.id;
    } else {
      dataToSend.buyerId = chatItem.receiver.userId;
    }
    actions.getOrders(dataToSend);
  }, []);

  useEffect(() => {
    if (order.success && prevOrder && !prevOrder.success) {
      setAlertStatus({
        title: "",
        visible: true,
        message: "You successfully cancelled",
        type: "success",
      });
      const dataToSend = {};
      dataToSend.postId = chatItem.post.id;
      dataToSend.sellerId = chatItem.sellerId;
      dataToSend.sort = "createdAt-desc";
      dataToSend.page = 1;
      dataToSend.perPage = 5;
      if (chatItem.sellerId === chatItem.receiver.userId) {
        dataToSend.buyerId = userInfo.id;
      } else {
        dataToSend.buyerId = chatItem.receiver.userId;
      }
      actions.getOrders(dataToSend);
    }

    if (order.errorMsg && prevOrder && !prevOrder.errorMsg) {
      setAlertStatus({
        title: "Oops",
        visible: true,
        message: order.errorMsg,
        type: "error",
      });
    }
  }, [order]);

  const [inputStyle, setDialogStyle] = useState({});

  useEffect(() => {
    const _keyboardDidShow = () => {
      setDialogStyle({ marginBottom: 300 });
    };

    const _keyboardDidHide = () => {
      setDialogStyle({});
    };

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      _keyboardDidShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      _keyboardDidHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        <KeyboardAwareScrollView
          extraHeight={120}
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <>
              <View style={{ marginHorizontal: 20, alignItems: "center" }}>
                {screenDetails.id && (
                  <ProductDetail
                    screenDetails={screenDetails}
                    userProductDetail={userProductDetail}
                    storeName={storeName}
                  />
                )}
              </View>

              <View style={styles.reasonContainer}>
                <Label bold size="large">
                  Please select a cancellation reason
                </Label>
                <Label size="medium" style={{ marginTop: 10, lineHeight: 18 }}>
                  It’s up to the seller to agree or deny the cancellation
                  request. If the seller agrees and the order has not shipped,
                  you will be refunded.
                </Label>
                {reasonData[type]?.map((item) => (
                  <RadioButton
                    isActive={reason === item.value}
                    label={item.text}
                    onPress={() => setReason(item.value)}
                  />
                ))}
              </View>

              <View style={[styles["section-container"], inputStyle]}>
                <View style={styles["header-title-count"]}>
                  <Heading type="bodyText" bold>
                    Add a Comment:
                  </Heading>
                  <Heading type="bodyText">
                    {reasonDesc.length}
                    /500
                  </Heading>
                </View>

                <InputText
                  placeholder="Type Here"
                  fullWidth
                  textAlign="left"
                  value={reasonDesc}
                  onChangeText={(value) => setReasonDesc(value)}
                  maxLength={500}
                  returnKeyType="done"
                  multiline
                  numberOfLines={6}
                  style={{ fontSize: 15 }}
                />
              </View>
            </>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <FooterAction
        mainButtonProperties={{
          label: directlyCancel ? "Cancel Order" : "Submit Request",
          onPress: cancelAction,
          disabled: reason === "" || reasonDesc == "",
        }}
      />

      {
        <BuyNowSuccessAlert
          dialogVisible={alertStatus.type == "success"}
          onDone={onAlertModalTouchOutside}
          onTouchOutside={onAlertModalTouchOutside}
          onCTAClick={() => {}}
          goTo={() => {
            goToOrderStatus();
            actions.getOrderById({ orderId: ordersList.data[0].id });
          }}
          orderData={ordersList?.data?.[0]}
          screenDetails={
            screenDetails?.Product?.ProductImages &&
            screenDetails?.Product?.ProductImages[0]?.urlImage
          }
          module={"cancelrequest"}
          directlyCancel={directlyCancel}
        />
      }
      <SweetAlert
        title={alertStatus.title}
        message={alertStatus.message}
        type={alertStatus.type}
        dialogVisible={alertStatus.visible && alertStatus.type != "success"}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
      <SafeAreaView style={safeAreaNotchHelper} />
      {order.isFetching && <ScreenLoader />}
    </>
  );
};

export default CancelExchangeScreen;
