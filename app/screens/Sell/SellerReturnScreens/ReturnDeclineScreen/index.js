import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import ProductDetail from "../ReturnRequestScreen/product-detail";
import {
  getReturnReason,
  returnOrderUpdate as returnOrderUpdateApi,
  getOrders,
  getOrderById,
} from "#modules/Orders/actions";
import { useActions } from "#utils";
import { selectOrderData } from "#modules/Orders/selectors";
import usePrevious from "#utils/usePrevious";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { Colors, Fonts } from "#themes";
import { FooterAction, Heading, SweetAlert } from "#components";
import RadioButton from "#components/RadioButton";
import ConfirmAlert from "./confirmAlert";
import { postBuyerDetail as postBuyerDetailApi } from "#modules/User/actions";
import { selectUserData } from "#modules/User/selectors";
import { updateConversationVisiblity } from "#modules/Chat/actions";
import { selectChatData } from "#modules/Chat/selectors";

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
    fontFamily: "Montserrat-SemiBold",
    fontSize: 12,
    color: "#000000",
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
    paddingBottom: 32,
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
    paddingBottom: 12,
    paddingLeft: 0,
    height: 75,
  },
});

const ReturnDeclineScreen = ({ navigation, route }) => {
  const sellerName = route?.params?.sellerName ?? null;
  const post = route?.params?.post ?? null;
  const orderData = route?.params?.orderData ?? null;
  const returnId = route?.params?.returnId ?? null;
  const chatItem = route?.params?.chatItem ?? null;

  const { returnRequest, returnOrderUpdate, returnReason } = useSelector(
    selectOrderData()
  );

  const actions = useActions({
    getReturnReason,
    returnOrderUpdateApi,
    postBuyerDetailApi,
    getOrders,
    updateConversationVisiblity,
    getOrderById,
  });

  const { postBuyerDetail } = useSelector(selectUserData());

  const [reason, setReason] = useState("");
  const [sellerComment, setSellerComment] = useState("");
  const buyerId = returnRequest?.data?.Order?.buyerId;
  useEffect(() => {
    actions.getReturnReason({ action: "reasonsDecline" });
    actions.postBuyerDetailApi({
      userId: buyerId,
    });
  }, []);

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
    let conversationId;
    const convObj = arrayObj?.find(
      (conversation) =>
        conversation[1]?.post?.id === chatItem?.post?.id &&
        conversation[1]?.receiver?.userId === chatItem?.receiver?.userId
    );
    if (convObj && convObj[0] != undefined) {
      conversationId = convObj[0];
    }
    actions.updateConversationVisiblity({
      conversationId,
      status: "return_requested",
    });
  };
  const getOrderList = () => {
    const dataToSend = {};
    dataToSend.addRequests = true;
    dataToSend.postId = returnRequest?.data?.Order?.postId;
    dataToSend.sellerId = returnRequest?.data?.Order?.sellerId;
    dataToSend.sort = "createdAt-desc";
    dataToSend.page = 1;
    dataToSend.perPage = 5;
    dataToSend.buyerId = returnRequest?.data?.Order?.buyerId;
    actions.getOrders(dataToSend);
  };

  const prevReturnOrderUpdate = usePrevious(returnOrderUpdate);
  useFocusEffect(
    useCallback(() => {
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
    }, [returnOrderUpdate])
  );
  const onSendSellerRequest = () => {
    const params = {
      statusCode: "declined",
      sellerComment,
      reasonDeclineValue: reason,
    };
    const { orderId } = returnRequest?.data;
    //  setShowAlert(true);
    actions.returnOrderUpdateApi({ params, orderId, action: "sellerRequest" });
  };
  const goToOrderStatusScreen = () => {
    const { orderId } = returnRequest?.data;
    actions.getOrderById({ orderId });
    setShowAlert(false);
    navigation.navigate("OrderStatus", {
      orderData: returnRequest?.data?.Order,
      type: "SELLER",
      chatItem,
      orderId: returnRequest?.data?.Order.id,
    });
  };

  const onActionSheetMore = () => {
    navigation.navigate("OrderReceipt", {
      data: post,
      orderData: orderData,
      type: "SELLER",
    });
  };

  const goToOrderDetailScreen = () => {
    navigation.navigate("ViewOrderDetails", {
      type: "SELLER",
      orderData: orderData,
      onViewReceipt: () => onActionSheetMore(),
    });
  };

  const declineReasonList = returnReason?.data?.data;
  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        >
          <ProductDetail sellerName={sellerName} postDetail={post} />
          <TouchableOpacity onPress={goToOrderDetailScreen}>
            <Text style={styles.order_detail_link}>View Order Detail</Text>
          </TouchableOpacity>

          <View style={styles.horizontal_line} />

          <View style={{ paddingHorizontal: 20, width }}>
            <Text style={styles.screenHeaderLabel}>Reason for Declining </Text>
            <>
              {declineReasonList?.map((item, i) => {
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
                Add a Comment
              </Heading>
              <Heading type="bodyText" theme="inactive">
                {sellerComment.length}
                /1500
              </Heading>
            </View>
            <TextInput
              placeholderTextColor={"#999999"}
              placeholder="Type Here"
              fullWidth
              textAlign="left"
              value={sellerComment}
              onChangeText={(value) => setSellerComment(value)}
              maxLength={1500}
              multiline
              numberOfLines={9}
              style={styles.inputText}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              returnKeyType="done"
              blurOnSubmit
            />
          </View>
        </KeyboardAwareScrollView>
        <FooterAction
          mainButtonProperties={{
            label: "Decline Return",
            disabled: reason === "" || sellerComment === "",
            onPress: onSendSellerRequest,
          }}
        />
      </SafeAreaView>
      {returnOrderUpdate.isFetching && <ScreenLoader />}
      <ConfirmAlert
        isVisible={showAlert}
        message={`You’ve successfully denied ${postBuyerDetail?.data?.name}’s return request.`}
        secButtonText="Done"
        title={null}
        prButtonText="Go to Order Status Page"
        // secButtonText="Done"
        onMainButtonPress={() => {
          setShowAlert(false);
          //   getOrderList();
          goToOrderStatusScreen();
        }}
        onTouchOutside={() => {
          setShowAlert(false);
          goToOrderStatusScreen();
        }}
        messageStyle={{
          fontWeight: "600",
          lineHeight: 25,
        }}
      />
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible}
        onTouchOutside={onAlertModalTouchOutside}
      />
      {returnReason.isFetching && <ScreenLoader />}
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default ReturnDeclineScreen;
