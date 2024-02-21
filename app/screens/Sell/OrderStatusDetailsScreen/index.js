import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { Button } from "#components";
import LottieView from "lottie-react-native";

import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import ActionSheet from "react-native-actionsheet";
import { SweetDialog, SweetAlert, Icon, FooterAction } from "#components";
// import { meetup } from './data';
import ConfirmShipSuccessAlert from "./confirmShipmentAlert";
import ShippingStatus from "./ShippingStatus";
import { selectPostsData } from "#modules/Posts/selectors";
import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import styles from "./styles";
import { selectUserData } from "#modules/User/selectors";
import { selectOrderData } from "#modules/Orders/selectors";
import BuyNowSuccessAlert from "#screens/Buy/PaymentConfirmationScreen/buynowSuccessAlert";

import {
  getOrders,
  getOrderById,
  createOffer,
  getCardDetail,
  setPaymentDefault,
  orderExchange as orderExchangeAction,
  setIndependentShippingCarrier,
  updateReturn,
  cancelReturn,
  cancelClaim,
  denyCancellation,
  acceptCancellation,
  raiseDispute,
} from "#modules/Orders/actions";
import { getPostDetail } from "#modules/Posts/actions";
import {
  getUserInfo,
  postBuyerDetail as postBuyerDetailApi,
} from "#modules/User/actions";
import { useActions } from "#utils";
import ProductDetail from "./product-detail";
import ItemElement from "./item-element";
import ScreenLoader from "#components/Loader/ScreenLoader";
import usePrevious from "#utils/usePrevious";
import { generalSelector } from "#modules/General/selectors";
import { getContent } from "#modules/General/actions";
import ProtectionModal from "./ShippingStatus/protection-modal";
import { getReturnLabelData } from "../OrderStatusScreen/labelDetailsUtil";

const { width } = Dimensions.get("window");

const RETURN_STATUS_LIST = [
  "requestreturn",
  "return_requested",
  "labelshared",
  "labelsharedind",
  "returnshipped",
  "returned",
];

const CLAIM_STATUS_LIST = [
  "claimfiled",
  "claimdisputed",
  "claimaccepted",
  "claimdenied",
  "claimwithdrawn",
  "claimclosed",
];

const claimActivities = {
  claimfiled: "Buyer Filed Claim",
  claimdisputed: "Claim Disputed",
  claimaccepted: "Claim Request Granted",
  claimdenied: "Claim Request Denied",
  claimwithdrawn: "Claim Request Withdrawn",
  claimclosed: "Claim Request Closed",
};

const reasonData = {
  changed_my_mind: "Changed my mind",
  price_error: "Price Error",
  undeliverable_shipping_address: "Undeliverable Shipping Address",
  item_damaged: "Item dmaged",
  out_of_stock: "Out of Stock",
  unable_to_ship: "Unable to ship",
  buyer_cancelled: "Buyer Cancelled",
};

const initialMoreButtonOptions = {
  BUYER: {
    created: ["Request to Cancel", "Cancel"],
    accepted: ["Request to Cancel", "Cancel"],
    partialyshipped: ["Request to Cancel", "Cancel"],
    pending: ["Cancel"],
    labelshared: ["View Receipt", "Cancel Return", "Cancel"],
    pendingbuyerconfirmation: ["Request to Cancel", "Cancel"],
    buyacceptedhomi: ["Cancel"],
    buyacceptedind: ["Cancel"],
    intransit: ["Cancel"],
    inTransit: ["Cancel"],
    transactioncomplete: ["Cancel"],
    deliveredreturn: ["Return/Contest Item", "Cancel"],
    delivered: ["Cancel"],
    requestreturn: ["Cancel Return", "Cancel"],
    return_requested: ["Cancel Return", "Cancel"],
    default: ["Cancel"],
    transactioncancelled: ["Cancel"],
    refunded: ["Cancel"],
    returndeclined: ["Cancel"],
    refundedreturned: ["Cancel"],
    returnclosed: ["Cancel"],
    returncancelled: ["Cancel"],
    claimfiled: ["View Order Details", "Cancel Claim", "Cancel"],
    claimdisputed: ["Cancel Claim", "Cancel"],
    claimaccepted: ["Cancel"],
    claimclosed: ["Cancel"],
    claimdenied: ["Cancel"],
    claimwithdrawn: ["Cancel"],
    returned: ["Cancel"],
    returnshipped: ["Cancel"],
  },

  SELLER: {
    created: ["Cancel"],
    accepted: ["Offer a discount", "Cancel Order", "Cancel"],
    pending: ["Cancel"],
    partialyshipped: ["Cancel Order", "Cancel"],
    pendingbuyerconfirmation: ["Cancel Order", "Cancel"],
    buyacceptedhomi: ["View Label", "Cancel Order", "Cancel"],
    buyacceptedind: ["Edit Label", "Cancel Order", "Cancel"],
    intransit: ["Refund Buyer", "Edit Shipment", "Cancel"],
    inTransit: ["Refund Buyer", "Edit Shipment", "Cancel"],
    transactioncomplete: ["Cancel"],
    labelsharedind: ["Edit Label", "Cancel"],
    delivered: ["Cancel"],
    requestreturn: ["Cancel"],
    return_requested: ["Cancel"],
    default: ["Cancel"],
    labelshared: [
      "View Order Details",
      "Resend Label",
      "Close Return",
      "Issue Refund",
      "Cancel",
    ],
    returnshipped: ["View Order Details", "Issue Refund", "Cancel"],
    returnclosed: ["Cancel"],
    returned: ["View Order Details", "Close Return", "Issue Refund", "Cancel"],
    transactioncancelled: ["Cancel"],
    refunded: ["Cancel"],
    returndeclined: ["cancel"],
    refundedreturned: ["Cancel"],
    returncancelled: ["Cancel"],
    claimfiled: ["View Order Details", "Issue Refund", "Cancel"],
    claimdisputed: ["Cancel"],
    claimaccepted: ["Cancel"],
    claimclosed: ["Cancel"],
    claimdenied: ["Cancel"],
    claimwithdrawn: ["Cancel"],
  },
};

const TRACKING_URL = {
  FedEx: "https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=",
  DHL: "https://www.logistics.dhl/us-en/home/tracking/tracking-freight.html?submit=1&tracking-id=",
  UPS: "https://www.ups.com/track?loc=en_US&tracknum=",
  USPS: "https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=",
};

const trackOrderById = (carrier, trackingId) => {
  switch (carrier) {
    case "ups":
      Linking.openURL(TRACKING_URL.UPS + trackingId);
      break;
    case "fedex":
      Linking.openURL(TRACKING_URL.FedEx + trackingId);
      break;
    case "usps":
      Linking.openURL(TRACKING_URL.USPS + trackingId);
      break;
    case "dhl":
      Linking.openURL(TRACKING_URL.DHL + trackingId);
      break;
    default:
      break;
  }
};

const ORDER_STATUS_SHIPP_BUYER = {
  created: "REQUESTED",
  pending: "REQUESTED",
  accepted: "REQUESTED",
  acceptedSeller: "AWAITING SHIPPING",
  pendingbuyerconfirmation: "ACCEPTED",
  buyaccepteddSeller: "AWAITING SHIPPING",
  returnshipped: "RETURN SHIPPED",
  returned: "RETURN COMPLETED",
  claimfiled: "CLAIM FILED",
  claimdisputed: "CLAIM DISPUTED",
  claimaccepted: "CLAIM GRANTED",
  claimdenied: "CLAIM DENIED",
  claimwithdrawn: "CLAIM WITHDRAWN",
  claimclosed: "CLAIM CLOSED",
  // buyaccepted: 'ACCEPTED',
  buyacceptedhomi: "SHIPPED",
  buyacceptedind: "SHIPPED",
  partialyshipped: "PARTIALY SHIPPED",
  intransit: "SHIPPED",
  inTransit: "SHIPPED",
  requestreturn: "RETURN REQUESTED",
  return_requested: "RETURN REQUESTED",
  labelshared: "LABEL SHARED",
  labelsharedind: "LABEL SHARED",
  delivered: "DELIVERED",
  deliveredreturn: "DELIVERED",
  transactioncancelled: "CANCELLED",
  refunded: "REFUNDED",
  default: "IN PROGRESS",
  returndeclined: "RETURN DECLINED",
  refundedreturned: "REFUNDED/RETURNED",
  returnclosed: "RETURN CLOSED",
  returncancelled: "RETURN CANCELLED",
  transactioncomplete: "DELIVERED",
};

const ORDER_STATUS_SHIPP_SELLER = {
  created: "REQUESTED",
  accepted: "AWAITING SHIPPING",
  pending: "REQUESTED",
  returnshipped: "RETURN SHIPPED",
  pendingbuyerconfirmation: "AWAITING SHIPPING",
  buyacceptedhomi: "LABEL PRINTED",
  buyacceptedind: "LABEL PRINTED",
  intransit: "SHIPPED",
  inTransit: "SHIPPED",
  labelshared: "LABEL SHARED",
  claimfiled: "CLAIM FILED",
  claimdisputed: "CLAIM DISPUTED",
  claimaccepted: "CLAIM GRANTED",
  claimdenied: "CLAIM DENIED",
  claimwithdrawn: "CLAIM WITHDRAWN",
  claimclosed: "CLAIM CLOSED",
  partialyshipped: "ACCEPTED",
  returned: "DELIVERED",
  delivered: "DELIVERED",
  requestreturn: "REQUESTED",
  return_requested: "REQUESTED",
  labelshared: "LABEL SHARED",
  transactioncancelled: "CANCELLED",
  refunded: "REFUNDED",
  returnclosed: "RETURN CLOSED",
  default: "IN PROGRESS",
  returndeclined: "RETURN DECLINED",
  refundedreturned: "REFUNDED/RETURNED",
  returncancelled: "RETURN CANCELLED",
};

const ORDER_STATUS_PICKUP = {
  accepted: "PENDING EXCHANGE",
  transactioncomplete: "TRANSACTION COMPLETED",
};

const TRACKING_CARRIERS = ["usps", "fedex", "ups", "dhl"];
const returnActivities = {
  requested: "Buyer Requested Return",
  labelShared: "Seller Accepted Return and Shared label",
  labelsharedind: "Seller Accepted Return and Shared label",
  returnshipped: "Buyer Shipped Item to Seller",
  returned: "Return Succefully Completed",
  declined: "Seller Declined Return Request",
};

const OrderStatusScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [moreButtonOptions, setMoreButtonOptions] = useState(
    initialMoreButtonOptions
  );
  const [orderstatus, setorderstatus] = useState("default");
  const [orderData, setOrderData] = useState(null);
  const [confirmShipmentModal, showConfirmShipmentModal] = useState(false);

  useEffect(() => {
    if (orderData) {
      const minDiff = moment().diff(moment(orderData.createdAt), "minutes");
      if (minDiff > 5) {
        setMoreButtonOptions((prevState) => ({
          ...prevState,
          BUYER: {
            ...prevState.BUYER,
            accepted: prevState.BUYER.accepted.map((option) =>
              option === "Cancel Order" ? "Request to Cancel" : option
            ),
            pendingbuyerconfirmation: prevState.BUYER.accepted.map((option) =>
              option === "Cancel Order" ? "Request to Cancel" : option
            ),
          },
        }));
      }
    }
  }, [orderData]);

  useEffect(() => {
    const handleBackButton = () => {
      navigation.goBack();
      return true;
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { orderExchange, order, cardDetail, independentShippingCarrier } =
    useSelector(selectOrderData());
  const {
    information: userInfo,
    userProductDetail,
    postBuyerDetail,
    addressListState,
  } = useSelector(selectUserData());
  /* Actions */

  const selectedReturnAddress = addressListState?.data?.find(
    (returnAddress) => returnAddress?.default
  );

  const prevCardDetail = usePrevious(cardDetail);
  useEffect(() => {
    if (cardDetail.data && prevCardDetail && !prevCardDetail.data) {
      setCardTitle(`**** ${cardDetail.data.last4}`);
    }
  }, [cardDetail]);

  const actions = useActions({
    createOffer,
    getUserInfo,
    setPaymentDefault,
    orderExchangeAction,
    getOrders,
    getContent,
    getPostDetail,
    getCardDetail,
    getOrderById,
    updateReturn,
    cancelReturn,
    cancelClaim,
    postBuyerDetailApi,
    denyCancellation,
    acceptCancellation,
    raiseDispute,
  });
  const { general } = useSelector(generalSelector);
  const { postDetail } = useSelector(selectPostsData());
  const [isShippingStatus, setIsShippingStatus] = useState(false);
  const [shippingLabelModal, setShippingLabelModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [claimCancelModal, showClaimCancelModal] = useState(false);
  const [shippedModal, showshippedModal] = useState(false);
  const [labelGenModal, showLabelModal] = useState(false);

  const [trackingNumberModal, showTrackingNumberModal] = useState(false);

  // alert('');
  const [screenDetails, setScreenDetails] = useState(route?.params?.data);
  useFocusEffect(
    useCallback(() => {
      if (postDetail.id) {
        setScreenDetails(postDetail);
      }
    }, [postDetail])
  );
  const type = route?.params?.type;
  const orderId = route?.params?.orderId;

  const [alertStatus, setAlertStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [offerActionData, setOfferActionData] = useState({
    action: null,
    title: "",
    message: "",
  });
  const [modalCancel, setModalCancel] = useState(false);
  const [cancellationRequestModal, setCancellationRequestModal] =
    useState(false);

  const [claimRequest, setClaimRequest] = useState(false);
  const [disputeScreen, setdisputeScreen] = useState(false);
  const [disputeRequestText, setDisputeRequestText] = useState("");

  const [raiseDisputeLoading, setraiseDisputeLoading] = useState(false);

  const [deniedScreen, setDeniedScreen] = useState(false);
  const [denyRequestText, setDenyRequestText] = useState("");

  const [orderReturnHistory, showOrderReturnHistory] = useState(false);

  const [orderClaimHistory, showOrderClaimHistory] = useState(false);

  const [shipItemDisable, setShipItemDisable] = useState(false);

  const chatItem = route?.params?.chatItem ?? null;
  const conversationId = route?.params?.conversationId ?? null;
  const seller = route?.params?.seller ?? null;
  const postItem = route?.params?.postItem ?? null;

  const [cardTitle, setCardTitle] = useState("CARD");

  const { ordersList, orderDetail } = useSelector(selectOrderData());

  const prevOrderExchange = usePrevious(orderExchange);
  const prevOrder = usePrevious(order);
  const [isConfirmShipSuccess, setIsConfirmShipSuccess] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (order.id && prevOrder && !prevOrder.id) {
        actions.getOrderById({ orderId });
      }

      if (order.errorMsg && prevOrder && !prevOrder.errorMsg) {
        setAlertStatus({
          title: "Oops",
          visible: true,
          message: order.errorMsg,
          type: "error",
        });
      }
    }, [order])
  );

  useEffect(() => {
    if (orderExchange.data && prevOrderExchange && !prevOrderExchange.data) {
      setAlertStatus({
        title: "Exchange Confirmed",
        visible: true,
        message:
          "Lookout for notification to review the seller you will be able to do so once they post their review.",
        type: "success",
      });
      actions.getOrderById({ orderId });
    }

    if (
      orderExchange.failure &&
      prevOrderExchange &&
      !prevOrderExchange.failure
    ) {
      setAlertStatus({
        title: "Oops",
        visible: true,
        message: JSON.stringify(orderExchange.failure),
        type: "error",
      });
    }
  }, [orderExchange]);

  const returnObj = null;

  useEffect(() => {
    if (orderData) {
      orderData?.orderStatus != "buyAccepted" &&
        orderData?.cancelStatus == "denied" &&
        !orderData?.hideCancelModal &&
        type != "SELLER" &&
        setModalCancel(true);
      setIsShippingStatus(orderData?.deliveryMethod.type !== "pickup");
      if (type == "SELLER") {
        actions.postBuyerDetailApi({
          userId: orderData?.buyerId,
        });
      }

      if (orderData?.claimRequestActive) {
        if (orderData?.ClaimRequests?.[0]?.claimStatus == "disputed") {
          setorderstatus("claimdisputed");
        } else if (orderData?.ClaimRequests?.[0]?.claimStatus == "accepted") {
          setorderstatus("claimaccepted");
        } else if (orderData?.ClaimRequests?.[0]?.claimStatus == "closed") {
          setorderstatus("claimclosed");
        } else {
          setorderstatus("claimfiled");
        }
      } else if (orderData?.ReturnRequests?.length) {
        const returnRequest = orderData?.ReturnRequests[0];
        if (returnRequest.returnStatus == "requested") {
          setorderstatus("requestreturn");
        } else if (returnRequest.returnStatus == "requested") {
          setorderstatus("return_requested");
        } else if (returnRequest.returnStatus == "labelShared") {
          setorderstatus("labelshared");
        } else if (returnRequest.returnStatus == "returnshipped") {
          setorderstatus("returnshipped");
        } else if (returnRequest.returnStatus == "returned") {
          setorderstatus("returned");
        } else if (
          returnRequest.returnStatus == "cancelled" &&
          returnRequest.deliverStatus == "processed"
        ) {
          setorderstatus("returncancelled");
        } else if (returnRequest.returnStatus == "closed") {
          setorderstatus("returnclosed");
        } else if (returnRequest.returnStatus == "closed") {
          setorderstatus("returnclosed");
        } else if (returnRequest.returnStatus == "refundedreturned") {
          setorderstatus("refundedreturned");
        } else {
          setorderstatus("returndeclined");
        }
      } else if (
        orderData?.deliveryMethod.type !== "pickup" &&
        orderData?.orderStatus === "accepted"
      ) {
        setorderstatus("pendingbuyerconfirmation");
      } else if (orderData?.orderStatus === "buyAccepted") {
        if (orderData?.deliveryMethod.type === "homitagshipping") {
          setorderstatus("buyacceptedhomi");
        } else {
          setorderstatus("buyacceptedind");
        }
      } else if (orderData?.orderStatus === "delivered") {
        if (type === "BUYER" && orderData?.availableReturn) {
          setorderstatus("deliveredreturn");
        } else {
          setorderstatus("delivered");
        }
      } else {
        setorderstatus(orderData?.orderStatus.toLowerCase());
      }
      if (orderData?.paymentMethod?.type === "creditcard") {
        actions.getCardDetail({
          cardId:
            orderData?.paymentMethod?.stripeToken ||
            orderData?.paymentMethod?.id,
          userId: orderData?.buyerId,
        });
      }
    }
  }, [orderData]);

  const onAlertModalTouchOutside = () => {
    if (alertStatus.type === "error") {
      setAlertStatus({
        title: "",
        visible: false,
        message: "",
        type: "",
      });
    } else {
      setAlertStatus({
        title: "",
        visible: false,
        message: "",
        type: "",
      });
      navigation.navigate("ChatScreen", { item: chatItem });
    }
  };

  const MoreActionSheetRef = useRef(null);

  const showMore = () => {
    setShowMoreMenu(true);
  };
  const onActionSheetMore = async (index) => {
    setShowMoreMenu(false);
    switch (moreButtonOptions[type]?.[orderstatus][index]) {
      case "View Order Details":
        const data = route?.params?.data;
        const type = route?.params?.type;
        const orderId = route?.params?.orderId;
        navigation.navigate("OrderStatusReturn", {
          orderData: orderData,
          type: type,
          chatItem,
          orderId: orderId,
          orignalOrder: true,
        });
        break;
      case "Return/Contest Item":
        navigation.navigate("Return", {
          data: screenDetails,
          order: orderData,
        });
        break;
      case "View Label":
        const returnLabel = getReturnLabelData(orderData?.labels);
        const returnOrderData = returnLabel[returnLabel?.length - 1];
        setShippingLabelModal(returnOrderData);
        break;
      case "Edit Shipment":
        setorderstatus("pendingbuyerconfirmation");
        break;
      case "Cancel Claim":
        showClaimCancelModal(true);
        break;
      case "Cancel Return":
        await actions.cancelReturn({
          returnId: orderData?.ReturnRequests?.[0]?.id,
          orderId,
          params: {
            returnStatus: "cancelled",
            isBuyer: true,
            comment: "test",
          },
        });
        break;
      case "File a claim":
        navigation.navigate("Claim", { data: screenDetails, order: orderData });
        break;
      case "Cancel Order":
        const isBuyer = userInfo.id !== chatItem?.sellerId;
        navigation.navigate("CancelExchange", {
          data: screenDetails,
          type,
          chatItem,
          title: "Cancel Order",
          directlyCancel: isBuyer ? true : false,
        });
        break;
      case "Request to Cancel":
        navigation.navigate("CancelExchange", {
          data: screenDetails,
          type,
          chatItem,
          title: "Request to Cancel",
        });
        break;
      case "Edit Label":
        if (returnObj) {
          navigation.navigate("EditLabel", {
            post: postItem,
            sellerName: seller,
            chatItem,
            returnObj,
          });
        } else {
          navigation.navigate("PackingTips", {
            postDetail: screenDetails,
            provider: orderData?.deliveryMethod.carrier,
            orderData: orderData,
            deliveryMethodType: orderData?.deliveryMethod.type,
          });
        }
        break;
      case "Reprint Label":
        navigation.navigate("TrackItem", {
          title: `${orderData?.deliveryMethod?.carrier?.toUpperCase()} Tracking`,
          orderData: orderData,
        });
        break;
      case "Refund Buyer":
        navigation.navigate("ReturnRefund", {
          post: chatItem.post,
          sellerName: `${chatItem.sellerFirstName} ${chatItem.sellerLastName}`,
          returnId: orderData?.ReturnRequests?.[0]?.id,
          chatItem,
          orderObj: orderData,
          screen: "orderstatus",
        });
        break;
      case "Issue Refund":
        navigation.navigate("ReturnRefund", {
          post: chatItem.post,
          sellerName: `${chatItem.sellerFirstName} ${chatItem.sellerLastName}`,
          returnId: orderData?.ReturnRequests?.[0]?.id,
          chatItem,
          orderObj: orderData,
          screen: "orderstatus",
        });
        break;
      case "View Receipt":
        navigation.navigate("Receipt", {
          data: screenDetails,
          orderData,
          type,
        });
        break;
      default:
        break;
    }
  };
  const onTouchOutsideOfBuyerSucces = () => {
    setIsConfirmShipSuccess(false);
  };
  useEffect(() => {
    actions.getOrderById({ orderId });
    if (!screenDetails) {
      actions.getPostDetail({ postId: chatItem.post.id });
    }

    actions.getContent({
      params: "?isActive=true&location=shipping_buyer_protection",
      type: "help",
    });
  }, []);

  useEffect(() => {
    if (orderDetail.isFetching) {
      setOrderData(null);
      return;
    }
    if (orderDetail) {
      setOrderData(orderDetail.data);
    } else {
      setOrderData(null);
    }
  }, [orderDetail]);

  const goToMeetupScreen = () => {
    navigation.navigate("Meetup", {
      orderId: orderData.id,
      screenDetails,
      item: chatItem,
    });
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onMainButtonPressed = () => {
    actions.orderExchangeAction({
      orderId: orderData?.id,
      user: {
        id: userInfo.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
      },
      userId: userInfo.id,
    });
    setDialogVisible(false);
  };

  const [prModalVisible, setPrModalVisible] = useState(false);

  const prModalVisibleAction = (value) => {
    setPrModalVisible(value);
  };

  // / GET SHIPPING COST ///

  const getShippingCost = () => {
    if (!orderData) {
      return 0;
    }
    const { shippingValue, deliveryMethod } = orderData;
    if (type === "BUYER") {
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

  const getTotalPaidForSeller = () => {
    const { shippingValue, totalPaid, deliveryMethod, priceAccepted } =
      orderData;

    if (deliveryMethod.type === "shipindependently" && type === "SELLER") {
      return Number(totalPaid) - Number(shippingValue);
    }
    return Number(priceAccepted);
  };

  const offerPriceByQuantity = () => {
    const priceAccepted = parseFloat(orderData?.priceAccepted);

    return priceAccepted ? priceAccepted?.toFixed(2) : "0.00";
  };

  if (!orderData || !orderData.id) {
    return <ScreenLoader />;
  }
  const claimFiled = orderData?.claimRequestActive;

  let moreMenuOptions = moreButtonOptions[type]?.[orderstatus] ?? [];

  if (
    orderData &&
    (orderData?.cancelStatus === "requested" ||
      orderData?.cancelStatus === "cancelled" ||
      orderData?.cancelStatus === "denied") &&
    moreMenuOptions.includes("Request to Cancel")
  ) {
    const index = moreMenuOptions.indexOf("Request to Cancel");
    moreMenuOptions.splice(index, 1);
  }

  if (
    orderData &&
    orderData?.availableClaim &&
    !moreMenuOptions.includes("File a claim") &&
    type == "BUYER"
  ) {
    moreMenuOptions.unshift("File a claim");
  }

  if (
    orderData &&
    !orderData?.availableReturn &&
    moreMenuOptions.includes("Return/Contest Item")
  ) {
    const index = moreMenuOptions.indexOf("Return/Contest Item");
    moreMenuOptions.splice(index, 1);
  }

  const renderOrderStatusHeaderText = () => {
    const orderStatusText = RETURN_STATUS_LIST.includes(orderstatus)
      ? "Return Status:"
      : CLAIM_STATUS_LIST.includes(orderstatus)
      ? "Claim Status"
      : "Order Status:";

    const orderStatusValue =
      orderData?.cancelStatus === "requested"
        ? "CANCELLATION REQUESTED"
        : orderData?.cancelStatus === "cancelled"
        ? "CANCELLED"
        : isShippingStatus
        ? orderData && type === "BUYER"
          ? ORDER_STATUS_SHIPP_BUYER[orderstatus]
          : returnObj
          ? ORDER_STATUS_SHIPP_SELLER.labelshared
          : ORDER_STATUS_SHIPP_SELLER[orderstatus]
        : orderData && ORDER_STATUS_PICKUP[orderstatus];
    return (
      <Text style={styles.statusText}>
        {orderStatusText}
        {"  "}
        <Text
          onPress={() => {
            if (
              RETURN_STATUS_LIST.includes(orderstatus) ||
              orderstatus == "returndeclined"
            ) {
              showOrderReturnHistory(orderData);
            } else if (CLAIM_STATUS_LIST.includes(orderstatus)) {
              showOrderClaimHistory(orderData);
            }
          }}
          style={styles.statusText2}
        >
          {orderStatusValue}
        </Text>
      </Text>
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
    });
  }, [navigation]);

  const headerRight = () => (
    <View style={styles.headerRightContainer}>
      <TouchableOpacity
        style={styles.rightIconContainer1}
        onPress={() => showMore()}
      >
        <Icon icon="more" color="grey" style={styles.moreIcon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <SafeAreaView style={[safeAreaViewWhite, { flex: 1 }]}>
        {!orderDetail.isFetching && (
          <ScrollView>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <>
                <View style={{ marginHorizontal: 20, alignItems: "center" }}>
                  {screenDetails?.id && (
                    <ProductDetail
                      screenDetails={screenDetails}
                      userProductDetail={userProductDetail}
                    />
                  )}
                  {/* <ReturnShippingDetail /> */}

                  <View style={styles.statusContainer}>
                    {renderOrderStatusHeaderText()}
                  </View>

                  {orderstatus == "claimaccepted" ? (
                    <>
                      <ShippingStatus
                        type="claim"
                        cardTitle={cardTitle}
                        cardDetail={cardDetail}
                        order={orderData}
                        side={type}
                      />
                    </>
                  ) : claimFiled ? (
                    <>
                      <ShippingStatus
                        type="claim"
                        cardTitle={cardTitle}
                        cardDetail={cardDetail}
                        order={orderData}
                        side={type}
                        orderstatus={orderstatus}
                      />
                    </>
                  ) : (type === "BUYER" || returnObj) &&
                    RETURN_STATUS_LIST.includes(orderstatus) ? (
                    <>
                      {type === "BUYER" && (
                        <>
                          {orderstatus == "labelshared" ||
                          orderstatus == "labelsharedind" ||
                          orderstatus == "returnshipped" ||
                          orderstatus == "returnclosed" ||
                          orderstatus == "returned" ? (
                            <ShippingStatus
                              type={"return"}
                              cardTitle={null}
                              cardDetail={cardDetail}
                              order={orderData}
                              side={type}
                            />
                          ) : (
                            <>
                              <ShippingStatus
                                cardTitle={null}
                                cardDetail={cardDetail}
                                order={orderData}
                                side={type}
                              />
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {isShippingStatus && (
                        <ShippingStatus
                          cardTitle={cardTitle}
                          type={
                            orderstatus == "labelshared" ||
                            orderstatus == "labelsharedind" ||
                            orderstatus == "returnshipped" ||
                            orderstatus == "returned"
                              ? ""
                              : ""
                          }
                          cardDetail={cardDetail}
                          order={orderData}
                          side={type}
                        />
                      )}
                    </>
                  )}
                  <>
                    {type === "BUYER" && (
                      <ItemElement
                        leftLabel="Item Price"
                        rightLabel={`$${offerPriceByQuantity()}`}
                      />
                    )}
                    {type === "SELLER" &&
                      (isShippingStatus ||
                        orderData?.orderStatus === "transactioncomplete") && (
                        <ItemElement
                          leftLabel="Purchase Price"
                          rightLabel={`$${
                            orderData?.totalPaid
                              ? getTotalPaidForSeller().toFixed(2)
                              : "0.00"
                          }`}
                        />
                      )}

                    {isShippingStatus &&
                      (orderData?.deliveryMethod.type === "homitagshipping" ? (
                        <ItemElement
                          leftLabel="Shipping"
                          rightLabel={
                            parseFloat(getShippingCost()) !== 0
                              ? formatValue(getShippingCost())
                              : "Free"
                          }
                        />
                      ) : (
                        <ItemElement
                          leftLabel="Shipping"
                          rightLabel={
                            parseFloat(getShippingCost()) !== 0
                              ? `${formatValue(getShippingCost())}`
                              : "Free"
                          }
                        />
                      ))}

                    {type === "SELLER" && (
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

                    {type === "SELLER" && (
                      <ItemElement
                        leftLabel="Sales Tax"
                        rightLabel={
                          orderData?.shippedAt
                            ? orderData?.tax
                              ? `$${parseFloat(orderData?.tax).toFixed(2)}`
                              : "0.00"
                            : orderData?.partialInfo?.tax
                            ? `$${parseFloat(
                                orderData?.partialInfo?.tax
                              ).toFixed(2)}`
                            : "0.00"
                        }
                      />
                    )}
                    {type === "SELLER" && (
                      <ItemElement
                        leftLabel="Service Fee"
                        rightLabel={
                          orderData?.shippedAt
                            ? orderData?.partialInfo?.homitagFee
                              ? `-$${(
                                  parseFloat(
                                    orderData?.partialInfo?.homitagFee
                                  ) * -1
                                ).toFixed(2)}`
                              : "0.00"
                            : orderData?.partialInfo?.homitagFee
                            ? `-$${(
                                parseFloat(orderData?.partialInfo?.homitagFee) *
                                -1
                              ).toFixed(2)}`
                            : "0.00"
                        }
                      />
                    )}

                    {type === "BUYER" ? (
                      <ItemElement
                        leftLabel={
                          isShippingStatus ? "Total you paid" : "Total you owe"
                        }
                        rightLabel={`$${
                          orderData?.cancelStatus === "cancelled" ||
                          orderstatus == "refundedreturned"
                            ? "0.00"
                            : orderData?.ReturnRequests?.[0]
                                ?.returnDeclineReason ==
                              "returnprocessedcustomerrefunded"
                            ? "0.00"
                            : orderData?.totalPaid
                            ? parseFloat(orderData?.totalPaid).toFixed(2)
                            : "0.00"
                        }`}
                        txtType="bold"
                      />
                    ) : isShippingStatus ||
                      orderData?.orderStatus === "transactioncomplete" ? (
                      <>
                        <ItemElement
                          leftLabel="Total you earn"
                          rightLabel={`$${
                            orderData?.sellerShare
                              ? parseFloat(orderData?.sellerShare).toFixed(2)
                              : "0.00"
                          }`}
                          txtType="bold"
                        />
                      </>
                    ) : (
                      <ItemElement
                        leftLabel="Buyer Offer"
                        rightLabel={`$${
                          orderData?.totalPaid
                            ? parseFloat(orderData?.totalPaid).toFixed(2)
                            : "0.00"
                        }`}
                        txtType="bold"
                      />
                    )}
                  </>
                </View>

                <View style={{ marginBottom: 50 }} />
              </>
            </TouchableWithoutFeedback>
          </ScrollView>
        )}
      </SafeAreaView>
      {isShippingStatus && (
        <ProtectionModal
          isVisible={prModalVisible}
          onTouchOutside={prModalVisibleAction}
          contents={general.contentState.data}
        />
      )}

      <FooterAction
        mainButtonProperties={{
          label: "View Receipt",
          onPress: () => {
            navigation.navigate("Receipt", {
              data: screenDetails,
              orderData,
              type,
            });
          },
        }}
      />

      <SweetAlert
        title={alertStatus.title}
        message={alertStatus.message}
        type={alertStatus.type}
        dialogVisible={alertStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
      {orderData && moreButtonOptions && (
        <ActionSheet
          ref={MoreActionSheetRef}
          options={
            orderData?.cancelStatus === "requested" ||
            orderData?.cancelStatus === "cancelled" ||
            orderData?.cancelStatus === "denied"
              ? ["cancel"]
              : moreButtonOptions[type]?.[orderstatus] ?? []
          }
          onPress={(index) => onActionSheetMore(index, 1)}
        />
      )}
      <SafeAreaView style={safeAreaNotchHelper} />
      <SweetDialog
        title={offerActionData.title}
        message={offerActionData.message}
        dialogVisible={dialogVisible}
        onTouchOutside={onModalTouchOutside}
        mainBtTitle={offerActionData.mainBtTitle}
        secondaryBtTitle={offerActionData.secondaryBtTitle}
        onSecondaryButtonPressed={offerActionData.onSecondaryButtonPressed}
        onMainButtonPressed={onMainButtonPressed}
      />
      <ConfirmShipSuccessAlert
        dialogVisible={isConfirmShipSuccess}
        onTouchOutside={onTouchOutsideOfBuyerSucces}
        onPressDone={onTouchOutsideOfBuyerSucces}
      />
      <BuyNowSuccessAlert
        dialogVisible={confirmShipmentModal}
        onDone={() => {
          showConfirmShipmentModal(false);
          actions.getOrderById({ orderId });
          navigation.goBack();
        }}
        onCTAClick={() => {}}
        goTo={() => {
          showConfirmShipmentModal(false);
          actions.getOrderById({ orderId });
          navigation.goBack();
        }}
        orderData={order}
        module={"shippmentConfirmScreen"}
      />
    </>
  );
};

export default OrderStatusScreen;
