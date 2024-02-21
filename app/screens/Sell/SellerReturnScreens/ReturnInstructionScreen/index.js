import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import ProductDetail from "../ReturnRequestScreen/product-detail";
import {
  setReturnLabel,
  returnOrderUpdate as returnOrderUpdateApi,
  getOrders,
} from "#modules/Orders/actions";
import { useActions } from "#utils";
import { selectOrderData } from "#modules/Orders/selectors";
import usePrevious from "#utils/usePrevious";
import ScreenLoader from "#components/Loader/ScreenLoader";
import ConfirmAlert from "../ReturnDeclineScreen/confirmAlert";
import { FooterAction, Heading, SweetAlert } from "#components";
import { Colors, Fonts } from "#themes";
import { selectSellData } from "#modules/Sell/selectors";
import { getPaymentCards } from "#modules/User/actions";
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
  transaction_id: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
    color: "#313334",
    lineHeight: 18,
    fontWeight: "600",
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
  "section-container": {
    paddingHorizontal: 20,
    marginTop: 45,
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
    height: 95,
  },
  order_detail_link: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#313334",
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

const ReturnInstructionScreen = ({ navigation, route }) => {
  const sellerName = route?.params?.sellerName ?? null;
  const post = route?.params?.post ?? null;
  const chatItem = route?.params?.chatItem ?? null;

  const { returnRequest, orderDetail, returnLabel, returnOrderUpdate } =
    useSelector(selectOrderData());
  const [instruction, setInstruction] = useState("");

  const { photosList } = useSelector(selectSellData());

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
  const prevReturnOrderUpdate = usePrevious(returnOrderUpdate);
  const [isReturnUpdate, setIsReturnUpdate] = useState(false);
  const actions = useActions({
    setReturnLabel,
    returnOrderUpdateApi,
    getPaymentCards,
    getOrders,
    updateConversationVisiblity,
  });
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

  const { chatInfo } = useSelector(selectChatData());
  const updateConversationVisibility = () => {
    const arrayObj = Object.entries(chatInfo);
    const convObj = arrayObj.find(
      (conversation) =>
        conversation[1].post.id === chatItem.post.id &&
        conversation[1]?.receiver?.userId === chatItem?.receiver?.userId
    );
    const conversationId = convObj[0];
    actions.updateConversationVisiblity({
      conversationId,
      status: "return_requested",
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (
        isReturnUpdate &&
        returnOrderUpdate.data &&
        prevReturnOrderUpdate &&
        !prevReturnOrderUpdate.data
      ) {
        updateConversationVisibility();
        getOrderList();
        setIsReturnUpdate(false);
        setShowAlert(true);
        actions.setReturnLabel({
          deliveryType: "",
          trackingNumber: "",
          shippingCost: "",
          providerName: "",
          homitagReturnAddress: null,
          instruction: "",
          selectedCarrierItem: "",
        });
      }
      if (
        isReturnUpdate &&
        returnOrderUpdate.errorMsg &&
        prevReturnOrderUpdate &&
        !prevReturnOrderUpdate.errorMsg
      ) {
        setIsReturnUpdate(false);
        setAlertContent({
          title: "Oops...",
          message: returnOrderUpdate.errorMsg,
          type: "error",
          visible: true,
        });
      }
    }, [returnOrderUpdate])
  );
  // const { shipByBuyer } = returnRequest?.data?.returnReason;
  // const returnType = shipByBuyer ? 'return_ind' : 'return';

  const onSendSellerRequest = () => {
    //   const returnLabelImage = `data:image/${photosList[0].ext};base64,${photosList[0].image}`;
    const params = {
      statusCode: "labelShared",
      sellerComment: returnLabel?.instruction,
      labelData: {
        code: "shipindependently",
        carrier: returnLabel?.selectedCarrierItem,
        trackingId: returnLabel?.trackingNumber,
        labelData: photosList[0].image,
        otherCarrier: returnLabel?.provider,
        shippingCost: returnLabel?.shippingCost,
      },
    };
    const { orderId } = returnRequest?.data;
    setIsReturnUpdate(true);
    actions.returnOrderUpdateApi({ params, orderId, action: "sellerRequest" });
  };

  const goToOrderStatusScreen = ({ returnObj, seller, postItem, screen }) => {
    setShowAlert(false);
    navigation.navigate(screen || "OrderStatus", {
      orderData: returnRequest?.data?.Order,
      type: "SELLER",
      chatItem,
      returnObj,
      seller,
      postItem,
      orderId: returnRequest?.data?.Order.id,
    });
  };

  const handleCloseActionLocal = () => {
    navigation.navigate("ReturnOption");
    //  navigation.goBack();
  };
  useEffect(() => {
    actions.getPaymentCards({
      userId: returnRequest?.data?.Order?.sellerId,
      type: "card",
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleCloseAction: handleCloseActionLocal });
    }, [])
  );

  const actionDate = moment(returnRequest?.data?.createdAt)
    .add(2, "day")
    .format("MM/DD/YYYY");

  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        >
          <ProductDetail sellerName={sellerName} postDetail={post} />
          {/* <Text>
            <Text style={styles.transaction_label}> TRANSACTION ID:</Text>
            <Text style={styles.transaction_id}>
              {' '}
              {returnRequest?.data?.Order?.orderID}
            </Text>
          </Text> */}

          <TouchableOpacity onPress={goToOrderStatusScreen}>
            <Text style={styles.order_detail_link}>View Order Detail</Text>
          </TouchableOpacity>

          <View style={styles.horizontal_line} />
          <Text style={styles.detail_text}>
            Please add any other return instructions you want the buyer to see.
          </Text>

          <View style={[styles["section-container"], { width }]}>
            <View style={styles["header-title-count"]}>
              <Heading type="bodyText" bold>
                Add instructions here:
              </Heading>
              <Heading type="bodyText" theme="inactive">
                {instruction.length}
                /1500
              </Heading>
            </View>
            <TextInput
              placeholderTextColor="#999999"
              placeholder="Type Here"
              fullWidth
              textAlign="left"
              value={returnLabel.instruction}
              onChangeText={(value) =>
                actions.setReturnLabel({ ...returnLabel, instruction: value })
              }
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
        </ScrollView>
      </SafeAreaView>
      {returnLabel.deliveryType === "homitagshipping" ? (
        <FooterAction
          mainButtonProperties={{
            label: "Next",
            subLabel: "PURCHASE LABEL",
            disabled: false,
            onPress: () => {
              navigation.navigate("ReturnConfirmation", {
                post,
                chatItem,
                sellerName,
              });
            },
          }}
        />
      ) : (
        <FooterAction
          mainButtonProperties={{
            label: "Share Label",
            onPress: () => {
              onSendSellerRequest();
              // goToOrderStatusScreen({
              //   returnObj: returnRequest.data,
              //   postItem: post,
              //   seller: sellerName,
              //   screen: 'OrderStatus',
              // });
              // navigation.navigate('ReturnConfirmation', { post, chatItem, sellerName });
            },
          }}
        />
      )}
      {(returnOrderUpdate.isFetching || orderDetail.isFetching) && (
        <ScreenLoader />
      )}
      <SafeAreaView style={safeAreaNotchHelper} />
      <ConfirmAlert
        isVisible={showAlert}
        message="Now just wait for the buyer to send back your item. You can check for updates on the Order Status page in the mean time"
        secButtonText="Done"
        title="Refund Label Shared !"
        prButtonText="Go to Order Status Page"
        onMainButtonPress={() => {
          // getOrderList();
          const returnObj = returnOrderUpdate.data.data;
          goToOrderStatusScreen({
            returnObj,
            postItem: post,
            seller: sellerName,
            screen: "OrderStatus",
          });
        }}
        onTouchOutside={() => {
          setShowAlert(false);
          navigation.navigate("NotificationScreen");
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
      />
    </>
  );
};

export default ReturnInstructionScreen;
