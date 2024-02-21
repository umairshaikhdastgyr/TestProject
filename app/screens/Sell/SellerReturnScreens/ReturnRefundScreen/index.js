import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import ProductDetail from "../ReturnRequestScreen/product-detail";
import {
  getReturnReason,
  returnOrderUpdate as returnOrderUpdateApi,
  setRefundAmount,
  getOrders,
} from "#modules/Orders/actions";
import { useActions } from "#utils";
import { selectOrderData } from "#modules/Orders/selectors";
import usePrevious from "#utils/usePrevious";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { Colors, Fonts } from "#themes";
import { FooterAction, Heading, SweetAlert, Label } from "#components";
import RadioButton from "#components/RadioButton";
import ConfirmAlert from "../ReturnDeclineScreen/confirmAlert";
import { postBuyerDetail as postBuyerDetailApi } from "#modules/User/actions";
import { selectUserData } from "#modules/User/selectors";
import BorderElement from "../../OldOrderStatusScreen/ShippingStatus/border-element";
import { updateConversationVisiblity } from "#modules/Chat/actions";
import { selectChatData } from "#modules/Chat/selectors";
import Input from "#components/InputText";
import fonts from "#themes/fonts";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 35;
const styles = StyleSheet.create({
  transaction_label: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
    lineHeight: 18,
  },
  order_detail_link: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#313334",
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  horizontal_line: {
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    width: width - 40,
    marginVertical: 25,
  },
  detail_text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
    lineHeight: 18,
    marginHorizontal: 20,
    textAlign: "center",
  },
  text_head: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    color: "#313334",
    lineHeight: 18,
    marginHorizontal: 20,
    fontWeight: "600",
    // textAlign: 'center',
  },
  text_head_container: {
    width,
    marginVertical: 32,
  },
  activeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.active,
    backgroundColor: Colors.active,
    marginRight: 12,
  },
  reason_conatiner: {
    flexDirection: "row",
    width: width - 40,
  },
  reason_detail_conatiner: {
    flexDirection: "row",
    width: width - 40,
    marginTop: 12,
    backgroundColor: "#EDEDED",
    padding: 10,
  },
  reason_container_text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    fontWeight: "600",
    color: "#313334",
    lineHeight: 18,
  },
  reason_detail_text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#767676",
  },
  contentItemConainer: {
    width: CARD_WIDTH,
    // borderWidth: 2,
    // borderColor: '#00BDAA',
    height: 236,
    borderRadius: 8,
    flexDirection: "column",
    margin: 7.5,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { height: 0, width: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  contentItemHeader: {
    paddingVertical: 12,
    backgroundColor: "#00BDAA",
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  itemHeaderText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
  },
  contentIconContainer: {
    paddingVertical: 15,
    alignItems: "center",
  },
  iconStyle: {
    width: 24,
    height: 28.06,
  },
  itemDetailContainer: {
    paddingHorizontal: 10,
  },
  itemDetailText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#969696",
    fontWeight: "500",
    lineHeight: 18,
    textAlign: "center",
  },
  buttonContainer: {
    marginHorizontal: 20,
    flex: 1,
    marginTop: 40,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { height: 0, width: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  screenHeaderLabel: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    color: "#313334",
    fontWeight: "bold",
    lineHeight: 18,
    marginBottom: 10,
    // textAlign: 'center',
  },
  "section-container": {
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  "header-title-count": {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputText: {
    fontSize: 15,
    color: "#000000",
    fontFamily: Fonts.family.regular,
    borderBottomWidth: 1,
    borderBottomColor: "#B9B9B9",
    padding: 0,
    margin: 0,
  },
});

const REFUND_TYPE = [
  { text: "Full Refund", value: "full" },
  { text: "Partial Refund", value: "partial" },
];
const ReturnRefundScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const sellerName = route?.params?.sellerName ?? null;
  const post = route?.params?.post ?? null;
  const screen = route?.params?.screen ?? null;
  const chatItem = route?.params?.chatItem ?? null;
  const orderObj = route?.params?.orderObj ?? null;
  const claimRequestId = route?.params?.claimRequestId ?? null;
  const storeName = route?.params?.storeName;

  const { returnOrderUpdate, returnReason, refundAmount } = useSelector(
    selectOrderData()
  );
  const actions = useActions({
    returnOrderUpdateApi,
    postBuyerDetailApi,
    setRefundAmount,
    getOrders,
    updateConversationVisiblity,
  });

  const { postBuyerDetail } = useSelector(selectUserData());
  const getOrderList = () => {
    const dataToSend = {};
    dataToSend.addRequests = true;
    dataToSend.postId = orderObj?.postId;
    dataToSend.sellerId = orderObj?.sellerId;
    dataToSend.sort = "createdAt-desc";
    dataToSend.page = 1;
    dataToSend.perPage = 5;
    dataToSend.buyerId = orderObj?.buyerId;
    actions.getOrders(dataToSend);
  };

  const [reason, setReason] = useState("");
  const [sellerComment, setSellerComment] = useState("");
  const [refundType, setRefundType] = useState("full");

  const buyerId = orderObj?.buyerId;
  // const refundAmount2 = returnRequest?.data?.refundedValue;
  useEffect(() => {
    actions.postBuyerDetailApi({
      userId: buyerId,
    });
    if (orderObj?.unshippedInfo?.availableRefund) {
      actions.setRefundAmount(
        parseFloat(
          orderObj?.unshippedInfo?.availableRefund ||
            orderObj?.partialInfo?.availableRefund
        )
      );
    } else if (orderObj?.partialInfo?.availableRefund) {
      actions.setRefundAmount(
        parseFloat(
          orderObj?.unshippedInfo?.availableRefund ||
            orderObj?.partialInfo?.availableRefund
        )
      );
    } else if (orderObj?.availableRefund) {
      actions.setRefundAmount(parseFloat(orderObj?.availableRefund));
    } else {
      actions.setRefundAmount(
        parseFloat(
          orderObj?.unshippedInfo?.availableRefund ||
            orderObj?.partialInfo?.availableRefund
        )
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(getReturnReason({ action: "reasonsRefund" }));
    }, [dispatch])
  );

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

  const [showAlert, setShowAlert] = useState(false);
  const { chatInfo } = useSelector(selectChatData());
  const updateConversationVisibility = () => {
    const arrayObj = Object.entries(chatInfo);
    const convObj = arrayObj.find(
      (conversation) =>
        conversation[1].post.id === chatItem.post.id &&
        conversation[1].receiver.userId === chatItem.receiver.userId
    );
    const conversationId = convObj[0];
    actions.updateConversationVisiblity({
      conversationId,
      status: "return_requested",
    });
  };

  const prevReturnOrderUpdate = usePrevious(returnOrderUpdate);
  useFocusEffect(
    useCallback(() => {
      if (refundAmount == 0 || isNaN(refundAmount)) {
        if (orderObj?.unshippedInfo?.availableRefund) {
          actions.setRefundAmount(
            parseFloat(
              orderObj?.unshippedInfo?.availableRefund ||
                orderObj?.partialInfo?.availableRefund
            )
          );
        } else if (orderObj?.partialInfo?.availableRefund) {
          actions.setRefundAmount(
            parseFloat(
              orderObj?.unshippedInfo?.availableRefund ||
                orderObj?.partialInfo?.availableRefund
            )
          );
        } else if (orderObj?.availableRefund) {
          actions.setRefundAmount(parseFloat(orderObj?.availableRefund));
        } else {
          actions.setRefundAmount(
            parseFloat(
              orderObj?.unshippedInfo?.availableRefund ||
                orderObj?.partialInfo?.availableRefund
            )
          );
        }
        setRefundType("full");
      }
      if (
        orderObj?.partialInfo?.availableRefund == refundAmount ||
        orderObj?.unshippedInfo?.availableRefund == refundAmount
      ) {
        setRefundType("full");
      }
      if (
        returnOrderUpdate.data &&
        prevReturnOrderUpdate &&
        !prevReturnOrderUpdate.data
      ) {
        updateConversationVisibility();
        getOrderList();
        setShowAlert(true);
      }
      if (
        returnOrderUpdate.errorMsg &&
        prevReturnOrderUpdate &&
        !prevReturnOrderUpdate.errorMsg
      ) {
        setAlertContent({
          title: "Oops...",
          message: returnOrderUpdate.errorMsg,
          type: "error",
          visible: true,
        });
      }
    }, [refundAmount])
  );

  const goToOrderStatusScreen = () => {
    setShowAlert(false);
    navigation.navigate("OrderStatus", {
      orderData: orderObj,
      type: "SELLER",
      chatItem,
      orderId: orderObj?.id,
    });
  };

  const reasonList = returnReason?.data?.data;
  // const [refundAmount, setRefundAmount] = useState(parseFloat(orderObj?.priceAccepted));
  useEffect(() => {
    if (refundType === "full") {
      setRefundAmount(
        parseFloat(
          orderObj?.unshippedInfo?.availableRefund ||
            orderObj?.partialInfo?.availableRefund
        )
      );
    } else {
      setRefundAmount(
        parseFloat(
          orderObj?.unshippedInfo?.availableRefund ||
            orderObj?.partialInfo?.availableRefund
        ) - parseFloat(orderObj?.paymentFee)
      );
    }
  }, [refundType]);

  useEffect(() => {
    if (!refundAmount && orderObj?.partialInfo?.availableRefund == 0) {
      setAlertContent({
        title: "Insufficient Funds",
        message:
          "There are insufficient funds to issue a refund for this order.",
        type: "error",
        visible: true,
      });
    }
  }, [refundAmount]);

  const handleConfirmation = () => {
    Alert.alert(
      "Refund issued",
      `You want to refund ${orderObj?.buyerInfo?.name} for ${post.title}`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "destructive",
        },
        { text: "Continue", onPress: () => onSendIssueRefund() },
      ]
    );
  };

  const onSendIssueRefund = async () => {
    const params = claimRequestId
      ? {
          statusCode: "refundednoreturned",
          refundReason: reason,
          refundedComment: sellerComment.trim(),
          claimRequestId: claimRequestId,
          refundPartial: refundType === "partial",
        }
      : {
          statusCode: "refundednoreturned",
          refundReason: reason,
          refundedComment: sellerComment.trim(),
          refundPartial: refundType === "partial",
        };

    params.refundValue = refundAmount;

    const { id } = orderObj;

    await actions.returnOrderUpdateApi({
      params,
      orderId: id,
      action: "refundRequest",
    });
    setAlertContent({
      title: "Refund successfully issued!",
      message: `You’ve successfully refunded ${orderObj?.buyerInfo?.name} for ${post.title}`,
      type: "success",
      visible: true,
    });
    setTimeout(() => {
      actions.postBuyerDetailApi({
        userId: buyerId,
      });
      navigation.goBack();
    }, 1500);
  };

  const handleRefundAmountType = (val) => {
    setRefundType(val.value);
    if (val.value === "full") {
      actions.setRefundAmount(
        parseFloat(
          orderObj?.unshippedInfo?.availableRefund ||
            orderObj?.partialInfo?.availableRefund
        )
      );
    }
    if (val.value === "partial") {
      navigation.navigate("PartailRefundAmount", {
        sellerName,
        post,
        chatItem,
        priceAccepted:
          orderObj?.unshippedInfo?.availableRefund ||
          orderObj?.partialInfo?.availableRefund ||
          refundAmount ||
          orderObj?.availableRefund,
        goBackHandler: () => {
          actions.setRefundAmount(
            parseFloat(
              orderObj?.unshippedInfo?.availableRefund ||
                orderObj?.partialInfo?.availableRefund
            )
          );
          setRefundType("full");
        },
      });
      return;
    }
  };

  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          extraHeight={120}
        >
          <ProductDetail
            sellerName={storeName ? storeName : sellerName}
            postDetail={post}
          />
          <TouchableOpacity onPress={goToOrderStatusScreen}>
            <Label
              size="medium"
              style={{
                textDecorationLine: "underline",
                fontFamily: fonts.family.semiBold,
              }}
            >
              View Order Detail
            </Label>
          </TouchableOpacity>
          <View
            style={{ paddingHorizontal: 20, marginBottom: 30, marginTop: 20 }}
          >
            <BorderElement
              title={`$${parseFloat(refundAmount).toFixed(2)}`}
              leftLabel="Refund Amount"
              topBorder={1}
              txtLeftType="bold"
            />
          </View>

          <View style={{ paddingHorizontal: 20, width }}>
            <Label bold style={{ marginBottom: 10 }} size="large">
              Select Refund Type
            </Label>
            <>
              {REFUND_TYPE.map((item, i) => (
                <RadioButton
                  key={`reason-${i}`}
                  isActive={refundType === item.value}
                  label={item.text}
                  onPress={() => handleRefundAmountType(item)}
                  type="decline"
                />
              ))}
            </>
          </View>
          <View style={styles.horizontal_line} />
          <View style={{ paddingHorizontal: 20, width }}>
            <Label bold style={{ marginBottom: 10 }} size="large">
              Select Refund Reason
            </Label>
            <>
              {reasonList?.map((item, i) => {
                const label = item.code.split("_").join(" ").toLowerCase();
                return (
                  <RadioButton
                    key={`reason-${i}`}
                    isActive={reason === item.value}
                    label={label[0].toUpperCase() + label.slice(1)}
                    onPress={() => setReason(item.value)}
                    type="decline"
                  />
                );
              })}
            </>
          </View>
          <View style={styles.horizontal_line} />
          <View style={[styles["section-container"], { width }]}>
            <View style={styles["header-title-count"]}>
              <Heading type="bodyText" bold>
                Add an explanation if necessary
              </Heading>
              <Heading type="bodyText" theme="inactive">
                {sellerComment.trim().length}
                /1500
              </Heading>
            </View>
            <Input
              placeholder="Type Here"
              fullWidth
              textAlign="left"
              value={sellerComment}
              onChangeText={(value) => setSellerComment(value)}
              maxLength={500}
              multiline
              numberOfLines={5}
              newstyle={styles.inputText}
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
          </View>
        </KeyboardAwareScrollView>
        <FooterAction
          mainButtonProperties={{
            label: "Issue Refund",
            //    subLabel: 'RETURN OPTIONS',
            disabled: reason === "" || !refundAmount,
            onPress: handleConfirmation,
          }}
        />
      </SafeAreaView>
      {returnOrderUpdate.isFetching && <ScreenLoader />}
      <ConfirmAlert
        isVisible={showAlert}
        message={`You’ve successfully refunded ${postBuyerDetail?.data?.name} for ${post?.title}`}
        prButtonText="Done"
        title="Refund successfully issued!"
        onMainButtonPress={() => {
          setShowAlert(false);
          // getOrderList();
          screen === "orderstatus"
            ? navigation.navigate("ExploreMain")
            : navigation.navigate("NotificationScreen");
        }}
        onTouchOutside={() => {
          setShowAlert(false);
        }}
        messageStyle={{
          lineHeight: 18,
        }}
      />
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible}
        onTouchOutside={onAlertModalTouchOutside}
        onDone={onAlertModalTouchOutside}
      />
      {returnReason.isFetching && <ScreenLoader />}
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default ReturnRefundScreen;
