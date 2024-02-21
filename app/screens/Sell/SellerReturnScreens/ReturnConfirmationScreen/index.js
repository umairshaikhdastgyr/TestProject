import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash";
import { Heading, FooterAction, SweetAlert } from "#components";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";

import { selectOrderData } from "#modules/Orders/selectors";
import { selectUserData } from "#modules/User/selectors";
import { selectSellData } from "#modules/Sell/selectors";
import {
  setReturnLabel,
  setPaymentDefault,
  returnOrderUpdate as returnOrderUpdateApi,
  getShippingLabel,
  getOrders,
} from "#modules/Orders/actions";
import { getPaymentCards } from "#modules/User/actions";

import { useActions } from "#utils";
import ProductDetail from "../ReturnRequestScreen/product-detail";
import ItemElement from "../../../Buy/PaymentConfirmationScreen/item-element";
import { selectPostsData } from "#modules/Posts/selectors";
import PaymentMethodElement from "../../../Buy/PaymentConfirmationScreen/payment-method-element";
import AddressElement from "../../../Buy/PaymentConfirmationScreen/address-element";
import usePrevious from "#utils/usePrevious";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { userSelector } from "#modules/User/selectors";
import ConfirmAlert from "../ReturnDeclineScreen/confirmAlert";
import {
  getShippingLabelParams,
  getShippingLabelDetail,
} from "#utils/shippingLabel";
import { clearSell } from "#modules/Sell/actions";
import { selectChatData } from "#modules/Chat/selectors";
import { updateConversationVisiblity } from "#modules/Chat/actions";
import Ionicons from "react-native-vector-icons/Ionicons";
import colors from "#themes/colors";
import fonts from "#themes/fonts";
import { selectGeneralData } from "#modules/General/selectors";
import RenderHtml from "react-native-render-html";

const { width } = Dimensions.get("window");

const DELIVERY_TYPES = ["homitagshipping", "shipindependently"];

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
  bottomContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    // backgroundColor: 'red',
  },
  order_detail_link: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 12,
    color: "#000",
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  policy_text: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 13,
    color: "#313334",
    lineHeight: 18,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  contentContainer: {
    flexDirection: "column",
    marginBottom: 30,
    paddingHorizontal: 15,
  },
});
const ReturnLabelConfirmationScreen = ({ navigation, route }) => {
  const handleCloseActionLocal = () => {
    navigation.navigate("ReturnOption");
    // navigation.goBack();
  };

  useEffect(() => {
    navigation.setParams({ handleCloseAction: handleCloseActionLocal });
  }, []);

  const sellerName = route?.params?.sellerName ?? null;
  const post = route?.params?.post ?? null;
  const chatItem = route?.params?.chatItem ?? null;
  const orderData = route?.params?.orderData ?? null;

  /* Selectors */

  const {
    returnLabel,
    returnRequest,
    paymentDefault,
    cheapestRate,
    returnOrderUpdate,
    orderDetail,
    shippingLabel,
  } = useSelector(selectOrderData());
  const generalStore = useSelector(selectGeneralData());
  const contents = generalStore?.contentState?.data ?? [];
  const {
    information: userInfo,
    userProductDetail,
    paymentMethodDefault,
  } = useSelector(selectUserData());

  /* Actions */
  const actions = useActions({
    setReturnLabel,
    setPaymentDefault,
    returnOrderUpdateApi,
    getShippingLabel,
    clearSell,
    getOrders,
    updateConversationVisiblity,
    getPaymentCards,
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
  const {
    user: { paymentCardList, postBuyerDetail, information },
  } = useSelector(userSelector);

  const [returnPolicyModal, setReturnPolicyModal] = useState(false);

  const setDefaultPayment = () => {
    const defaultCardDetail = paymentCardList?.data.data?.find(
      (item) => item?.metadata?.isDefault == "true"
    );
    if (defaultCardDetail) {
      // actions.setPaymentDefault({

      // })
      actions.setPaymentDefault({
        ...paymentDefault,
        selectedCard: defaultCardDetail?.data?.data,
        state: defaultCardDetail?.data?.data?.id,
        default: "card",
        icon: "credit-card",
        title: `${defaultCardDetail?.data?.data?.brand.toUpperCase()} ${
          defaultCardDetail?.data?.data?.last4
        }`,
      });
    } else if (paymentCardList?.data?.data?.length > 0) {
      const cardData = paymentCardList?.data?.data[0];
      actions.setPaymentDefault({
        ...paymentDefault,
        selectedCard: cardData,
        state: cardData?.id,
        default: "card",
        icon: "credit-card",
        title: `${cardData?.brand.toUpperCase()} ${cardData?.last4}`,
      });
    }
  };

  const { postDetail } = useSelector(selectPostsData());

  const goToPaymentScreen = () => {
    actions.setPaymentDefault({ ...paymentDefault });
    navigation.navigate("PaymentScreen", {
      data: postDetail,
      screen: "returnLabel",
      address: returnLabel?.homitagReturnAddress,
      orderObj: returnRequest?.data?.Order,
    });
  };

  useEffect(() => {
    actions.getPaymentCards({ userId: information.id, type: "card" });
    setDefaultPayment();
  }, []);

  const { shipByBuyer } = returnRequest?.data?.returnReason || {};
  const returnType = shipByBuyer ? "return_ind" : "return";

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
    const convObj = arrayObj?.find(
      (conversation) =>
        conversation[1]?.post?.id === chatItem?.post?.id &&
        conversation[1]?.receiver?.userId === chatItem?.receiver?.userId
    );
    console.log(
      "🚀 ~ file: index.js:321 ~ updateConversationVisibility ~ convObj:",
      convObj
    );
    if (convObj && convObj[0] != undefined) {
      const conversationId = convObj[0];
      actions.updateConversationVisiblity({
        conversationId,
        status: "return_requested",
      });
    }
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
        actions.setReturnLabel({
          deliveryType: "",
          trackingNumber: "",
          shippingCost: "",
          providerName: "",
          homitagReturnAddress: null,
          instruction: "",
          selectedCarrierItem: "",
        });
        actions.clearSell();
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

  const provider = returnLabel?.provider;
  const rate = returnLabel?.shippingCost;

  const getShippingLabelAction = () => {
    const homitagShipping = postDetail?.DeliveryMethods?.find((item) =>
      DELIVERY_TYPES.includes(item.code)
    );
    const selectedOption =
      homitagShipping?.DeliveryMethodPerPost?.customProperties?.optionsAvailable?.find(
        (item) => item.selected === true
      );
    const weight = selectedOption?.weightRange?.split(" ")[2];
    const buyerDetail = postBuyerDetail.data;
    const sellerDetail = information;
    const buyerAddress = returnRequest?.data?.Order?.deliveryMethod;
    const returnAddress = returnLabel.homitagReturnAddress;
    const params = getShippingLabelParams({
      buyerDetail,
      sellerDetail,

      buyerAddress,
      returnAddress,
      provider,
      weight: weight || "1",
    });
    actions.getShippingLabel({
      params: {
        ...params,
        orderID: orderDetail.data?.id
          ? orderDetail.data?.id
          : returnRequest?.data?.Order.id,
      },
      provider,
    });
  };

  const onSendSellerRequest = ({ base64Data, imageType, shippingLabel }) => {
    // alert('');
    //   const returnLabelImage = `data:image/${photosList[0].ext};base64,${photosList[0].image}`;
    let type = "";
    if (paymentDefault.title === "Apple pay") {
      type = "applepay";
    } else if (paymentDefault.title === "Google pay") {
      type = "googlepay";
    } else {
      type = "creditcard";
    }
    const stripeToken = paymentDefault?.selectedCard?.id;

    const params = {
      code: "homitagshipping",
      statusCode: "labelShared",
      sellerComment: returnLabel?.instruction,
      labelData: {
        code: "homitagshipping",
        image: base64Data,
        fileExtension: imageType,
        providerSelected: {
          rate,
          provider,
        },
        paymentMethod: { type, stripeToken },
        returnAddresses: [{ ...returnLabel.homitagReturnAddress }],
        ...shippingLabel,
      },
      paymentMethod: { type, stripeToken },
      returnAddresses: [{ ...returnLabel.homitagReturnAddress }],
      providerSelected: {
        rate,
        provider,
      },
    };
    const { orderId } = returnRequest?.data;
    actions.returnOrderUpdateApi({ params, orderId, action: "sellerRequest" });
  };

  const prevShippingLabel = usePrevious(shippingLabel);
  useFocusEffect(
    useCallback(() => {
      if (shippingLabel.data && prevShippingLabel && !prevShippingLabel.data) {
        const { imageType, base64Data } = getShippingLabelDetail({
          shippingLabel,
          provider,
        });
        onSendSellerRequest({
          base64Data,
          imageType: imageType?.toLowerCase(),
          shippingLabel,
        });
      }
      if (
        shippingLabel.errorMsg &&
        prevShippingLabel &&
        !prevShippingLabel.errorMsg
      ) {
        setAlertContent({
          title: "Oops...",
          message: shippingLabel.errorMsg,
          type: "error",
          visible: true,
        });
      }
    }, [shippingLabel])
  );

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

  const currentReturnAddress = returnLabel?.homitagReturnAddress;
  const getReturnPolicy =
    contents?.length > 0 &&
    contents?.filter((it) => {
      return it?.title == "Returns and Refund Policy";
    });
  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        <ScrollView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <>
              <View style={{ marginHorizontal: 20 }}>
                <ProductDetail sellerName={sellerName} postDetail={post} />
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 30,
                  }}
                >
                  <TouchableOpacity onPress={goToOrderDetailScreen}>
                    <Text style={styles.order_detail_link}>
                      VIEW ORDER DETAIL
                    </Text>
                  </TouchableOpacity>

                  {/* <Text>
                    <Text style={styles.transaction_label}> TRANSACTION ID:</Text>
                    <Text style={styles.transaction_id}>
                      {' '}
                      {returnRequest?.data?.Order?.orderID}
                    </Text>
                  </Text> */}
                </View>
                <View style={styles.horizontal_line} />
                <View style={{ marginBottom: 5, marginTop: 10 }}>
                  <ItemElement
                    leftLabel="Return Label Cost"
                    rightLabel={
                      rate ? `$${parseFloat(rate).toFixed(2)}` : "$0.00"
                    }
                    txtType="bold"
                  />
                </View>

                {!shipByBuyer ? (
                  <PaymentMethodElement
                    icon={
                      paymentMethodDefault.icon
                        ? paymentMethodDefault.icon == "credit-card"
                          ? paymentMethodDefault?.selectedCard?.brand.toLowerCase()
                          : paymentMethodDefault.icon
                        : paymentDefault.icon
                    }
                    title={
                      paymentMethodDefault.title
                        ? paymentMethodDefault.title
                        : paymentDefault.title
                    }
                    txtType="bold"
                    leftLabel="Pay using"
                    onPress={goToPaymentScreen}
                    type={returnType}
                  />
                ) : (
                  // <PaymentMethodElement
                  //   icon={
                  //     paymentDefault.icon
                  //       ? paymentDefault.icon == "credit-card"
                  //         ? paymentDefault?.selectedCard?.brand.toLowerCase()
                  //         : paymentDefault.icon
                  //       : paymentDefault.icon
                  //   }
                  //   title={
                  //     paymentDefault.title
                  //       ? paymentDefault.title
                  //       : paymentDefault.title
                  //   }
                  //   leftLabel="Pay using"
                  //   onPress={goToPaymentScreen}
                  //   type={returnType}
                  // />
                  <AddressElement
                    title="Deduct from buyer refund"
                    leftLabel="Pay Using"
                    type="return"
                  />
                )}
                <AddressElement
                  title={
                    currentReturnAddress
                      ? `${currentReturnAddress?.name} \n ${currentReturnAddress?.address_line_1} \n ${currentReturnAddress?.city}, ${currentReturnAddress?.state} ${currentReturnAddress?.zipcode}`
                      : null
                  }
                  leftLabel="Return Address"
                />
              </View>
            </>
          </TouchableWithoutFeedback>

          <View style={styles.bottomContainer}>
            <Heading
              type="inactive"
              style={{
                fontSize: 14,
                textAlign: "left",
                marginBottom: 20,
                color: "#969696",
              }}
            >
              Please consult our{" "}
              <Text
                style={styles.policy_text}
                onPress={() => setReturnPolicyModal(true)}
              >
                Return Policy
              </Text>{" "}
              for any questions.
            </Heading>
          </View>
        </ScrollView>
        {/*Modal start*/}
        <Modal
          animationType="slide"
          transparent
          visible={returnPolicyModal}
          style={{ flex: 1 }}
          onRequestClose={() => {
            setReturnPolicyModal(false);
          }}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            {/*Header start*/}
            <View
              style={{
                elevation: 3,
                backgroundColor: "#ffffff",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 15,
                flexDirection: "row",
              }}
            >
              <Ionicons
                onPress={() => {
                  setReturnPolicyModal(false);
                }}
                name="arrow-back-outline"
                size={25}
                color="#969696"
              />
              <Text></Text>
              <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
                Return Policy
              </Text>
              <Text></Text>
              <Text></Text>
            </View>
            {/*Header end*/}
            <ScrollView>
              <View>
                {/* <View style={styles.modalContentContainer}>
          <Text style={{color: '#313334', fontWeight: '600', fontSize: 14, paddingHorizontal:10,textAlign:'justify', lineHeight:25}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
        
        </View> */}
                <View style={styles.contentContainer}>
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html:
                        getReturnPolicy && getReturnPolicy.length > 0
                          ? `${getReturnPolicy[0]?.content}`
                          : `
                  <p style='text-align:center;'>
                    Loading Return Policy...
                  </p>`,
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
        {/*Modal End*/}
      </SafeAreaView>
      <FooterAction
        mainButtonProperties={{
          label: "Complete Return Request",
          onPress: () => {
            getShippingLabelAction();
            // goToOrderStatusScreen({
            //   returnObj: returnRequest?.data,
            //   postItem: post,
            //   seller: sellerName,
            //   screen: 'OrderStatus',
            // });
            //   goToOrderStatusScreen({
            //   returnObj,
            //   postItem: post,
            //   seller: sellerName,
            // });
            // makeOffer();
            // setIsBuyNowVisible(true);
          },
        }}
      />
      <SafeAreaView style={safeAreaNotchHelper} />
      <ConfirmAlert
        isVisible={showAlert}
        message="Now just wait for the buyer to send back your item. You can check for updates on the Order Status page in the mean time"
        secButtonText="Done"
        title="Refund Label Shared !"
        prButtonText="Go to Order Status Page"
        onMainButtonPress={() => {
          // getOrderList();
          const returnObj = returnOrderUpdate?.data?.data;
          setShowAlert(false);
          goToOrderStatusScreen({
            returnObj,
            postItem: post,
            seller: sellerName,
            screen: "OrderStatus",
          });
        }}
        onTouchOutside={() => {
          setShowAlert(false);
          const returnObj = returnOrderUpdate?.data?.data;
          setShowAlert(false);
          goToOrderStatusScreen({
            returnObj,
            postItem: post,
            seller: sellerName,
            screen: "OrderStatus",
          });
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
      {(returnOrderUpdate.isFetching || shippingLabel.isFetching) && (
        <ScreenLoader />
      )}
    </>
  );
};

export default ReturnLabelConfirmationScreen;
