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
  Alert,
  Platform,
} from "react-native";
import { Button } from "#components";
import LottieView from "lottie-react-native";
import DocumentPicker from "react-native-document-picker";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import RNFS from "react-native-fs";
import { InputText } from "#components";
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
import {
  getShippingLabel as getShippingLabelApi,
  updateOrder as updateOrderApi,
  resendLabel as resendLabelApi,
  closeReturn as closeReturnApi,
} from "#services/apiOrders";
import ScreenLoader from "#components/Loader/ScreenLoader";
import MeetupArea from "./MeetupArea";
import usePrevious from "#utils/usePrevious";
import { generalSelector } from "#modules/General/selectors";
import { getContent } from "#modules/General/actions";
import ProtectionModal from "./ShippingStatus/protection-modal";
import ShippingReturnStatus from "./ShippingReturnStatus";
import { TextInput } from "react-native";
import { Notifier, NotifierComponents } from "react-native-notifier";
import fonts from "#themes/fonts";
import Ionicons from "react-native-vector-icons/MaterialIcons";
import Ionicons2 from "react-native-vector-icons/Ionicons";

import { Fonts } from "#themes";
import colors from "#themes/colors";
import { getReturnLabelData } from "../OrderStatusScreen/labelDetailsUtil";

const { width } = Dimensions.get("window");

const RETURN_STATUS_LIST = [
  "requestreturn",
  "return_requested",
  "labelshared",
  "labelsharedind",
  "returnshipped",
  "returned",
  "returnclosed",
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
    labelshared: [
      "View Order Details",
      "View Receipt",
      "Cancel Return",
      "Cancel",
    ],
    pendingbuyerconfirmation: ["Request to Cancel", "Cancel"],
    buyacceptedhomi: ["Cancel"],
    buyacceptedind: ["Cancel"],
    intransit: ["Cancel"],
    inTransit: ["Cancel"],
    transactioncomplete: ["Cancel"],
    deliveredreturn: ["Cancel"],
    delivered: ["Cancel"],
    requestreturn: ["View Order Details", "Cancel Return", "Cancel"],
    return_requested: ["View Order Details", "Cancel Return", "Cancel"],
    default: ["Cancel"],
    transactioncancelled: ["Cancel"],
    refunded: ["Cancel"],
    returndeclined: ["Cancel"],
    refundedreturned: ["View Order Details", "Cancel"],
    returnclosed: ["View Order Details", "Cancel"],
    returncancelled: ["Cancel"],
    claimfiled: ["View Order Details", "Cancel Claim", "Cancel"],
    claimdisputed: ["View Order Details", "Cancel Claim", "Cancel"],
    claimaccepted: ["Cancel"],
    claimclosed: ["Cancel"],
    claimdenied: ["Cancel"],
    claimwithdrawn: ["Cancel"],
    returned: ["View Order Details", "Cancel"],
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
    delivered: ["Issue Refund", "Cancel"],
    requestreturn: ["Issue Refund", "Cancel"],
    return_requested: ["Issue Refund", "Cancel"],
    default: ["Cancel"],
    labelshared: [
      "View Order Details",
      "Resend Label",
      "Close Return",
      "Issue Refund",
      "Cancel",
    ],
    returnshipped: ["View Order Details", "Issue Refund", "Cancel"],
    returnclosed: ["View Order Details", "Cancel"],
    returned: ["View Order Details", "Close Return", "Issue Refund", "Cancel"],
    transactioncancelled: ["Cancel"],
    refunded: ["Cancel"],
    returndeclined: ["cancel"],
    refundedreturned: ["View Order Details", "Close Return", "Cancel"],
    returncancelled: ["Cancel"],
    claimfiled: ["View Order Details", "Issue Refund", "Cancel"],
    claimdisputed: ["View Order Details", "Cancel"],
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
    claimPhotosList,
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
      // const dataToSend = {};
      // dataToSend.addRequests = true;
      // dataToSend.postId = chatItem.post.id;
      // dataToSend.sellerId = chatItem.sellerId;
      // dataToSend.sort = "createdAt-desc";
      // dataToSend.page = 1;
      // dataToSend.perPage = 5;
      // if (chatItem.sellerId === chatItem.receiver.userId) {
      //   dataToSend.buyerId = userInfo.id;
      // } else {
      //   dataToSend.buyerId = chatItem.receiver.userId;
      // }
      actions.getOrderById({ orderId });
      // actions.getOrders(dataToSend);
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
          if (type == "SELLER") {
            navigation.navigate("ClaimOptionScreen", {
              screenDetails,
              userProductDetail,
              orderData,
              chatItem,
            });
          }
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
        setorderstatus("delivered");
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

  // / Alert

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

  const onTouchOutsideOfBuyerSucces = () => {
    setIsConfirmShipSuccess(false);
  };

  useEffect(() => {
    // const dataToSend = {};
    // dataToSend.postId = chatItem.post.id;
    // dataToSend.sellerId = chatItem.sellerId;
    // dataToSend.sort = "createdAt-desc";
    // dataToSend.page = 1;
    // dataToSend.addRequests = true;
    // dataToSend.perPage = 5;
    // if (chatItem.sellerId === chatItem.receiver.userId) {
    //   dataToSend.buyerId = userInfo.id;
    // } else {
    //   dataToSend.buyerId = chatItem.receiver.userId;
    // }
    actions.getOrderById({ orderId });
    // actions.getOrders(dataToSend);
    if (!screenDetails) {
      actions.getPostDetail({ postId: chatItem.post.id });
    }

    actions.getContent({
      params: "?isActive=true&location=shipping_buyer_protection",
      type: "help",
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ showMore });
    }, [])
  );

  const confirmShipmentAction = () => {
    const returnLabel = getReturnLabelData(orderData?.labels);
    const returnOrderData = returnLabel[returnLabel?.length - 1];
    const params = {
      orderStatus: "inTransit",
      shippedAt: moment(),
      deliverBy: moment().add(5, "days"),
      labelId: returnOrderData?.id,
    };
    actions.createOffer({
      method: "PATCH",
      orderId: orderData?.id,
      params,
    });

    setTimeout(() => {
      showshippedModal(true);
    }, 2000);
  };

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

  const onTrackItem = (orderDataObj) => {
    trackOrderById(
      orderDataObj?.deliveryMethod?.carrier,
      orderDataObj?.trackingId
    );
  };
  const ShippingInformation = () => (
    <View style={styles.shipping_info_container}>
      <View style={styles.info_header}>
        <Icon
          icon="package_icon_black"
          style={{ width: 20, height: 20, marginRight: 10 }}
          resizeMode="contain"
        />
        <Text style={styles.shipping_info_header}>Shipping Information</Text>
      </View>
      <Text style={styles.shipping_info_detail}>
        You’ll see shipping information here once the seller accepts your
        request
      </Text>
    </View>
  );
  const ReturnShippingDetail = () => {
    const responseLimit =
      orderData?.ReturnRequests &&
      orderData?.ReturnRequests[0]?.sellerResponseLimit
        ? moment(orderData?.ReturnRequests[0]?.sellerResponseLimit).format(
            "DD/MM"
          )
        : "00/00";
    const requestLimit =
      orderData?.ReturnRequests &&
      orderData?.ReturnRequests[0]?.claimRequestLimit
        ? moment(orderData?.ReturnRequests[0]?.claimRequestLimit).format(
            "DD/MM"
          )
        : "00/00";

    return (
      <View style={styles.shipping_detail_container}>
        <Text style={styles.shipping_detail_text}>
          {`The seller has 3 days to respond to your request. If they don’t respond by ${responseLimit} you can open a claim.`}
        </Text>
      </View>
    );
  };

  const handleShipItem = async () => {
    try {
      setShippingIsLoading(true);

      const returnLabel = getReturnLabelData(orderData?.labels);
      const returnOrderData = returnLabel[returnLabel?.length - 1];
      const updatePostOnShipIndependently = async ({ trackingId }) => {
        const isIndependentShipping =
          orderData.deliveryMethod.type === "shipindependently";

        const updateOrderResult = await updateOrderApi({
          orderId: orderData.id,
          params: {
            trackingId: trackingId,
            shippingQuantity: 1,
            orderID: orderData.id,
            id: orderData.id,
            orderStatus: isIndependentShipping ? "buyAccepted" : "buyAccepted",
            shippedAt: moment().toISOString(),
            deliverBy: isIndependentShipping
              ? moment().add(5, "days")
              : undefined,
            carrier: isIndependentShipping
              ? independentShippingCarrier.carrier
              : orderData?.deliveryMethod?.carrier,
            deliveryMethod: {
              ...orderData.deliveryMethod,
              carrier: isIndependentShipping
                ? independentShippingCarrier.carrier
                : orderData?.deliveryMethod?.carrier,
            },
            deliveryStatus: "processing",
            labelId: returnOrderData?.id,
          },
        });
        if (!updateOrderResult?.success) {
          Notifier.showNotification({
            title: updateOrderResult?.result?.content?.message,
            Component: NotifierComponents.Alert,
            componentProps: {
              alertType: "error",
            },
          });
        } else {
          if (isIndependentShipping) {
            confirmShipmentAction();
            return;
          } else {
            showLabelModal(true);
          }
        }

        setOrderData(null);
        dispatch(getOrderById({ orderId }));
        //dispatch(getOrders(dataToSend));
      };

      let trackingId = "";
      if (orderData.deliveryMethod.type !== "shipindependently") {
        const provider = orderData?.deliveryMethod?.carrier;
        const params = getShippingLabelParams({
          buyerDetail: postBuyerDetail.data,
          sellerDetail: userInfo,
          buyerAddress: orderData.deliveryMethod,
          returnAddress: selectedReturnAddress,
          weight: postDetail?.customProperties?.weight.toString(),
          height: postDetail?.customProperties?.height.toString(),
          length: postDetail?.customProperties?.length.toString(),
          width: postDetail?.customProperties?.width.toString(),
          provider,
        });
        const shippingLabel = await getShippingLabelApi({
          params: {
            ...params,
            orderID: orderData.id,
            labelID: returnOrderData?.id,
          },
          provider,
        });

        if (!shippingLabel?.shippingLabel?.deliveryStatus == "label_created") {
          Notifier.showNotification({
            title: "Something went wrong!",
            Component: NotifierComponents.Alert,
            componentProps: {
              alertType: "error",
            },
          });
          return;
        } else {
          showLabelModal(true);
        }
        dispatch(getOrderById({ orderId }));
      } else if (orderData.deliveryMethod.type === "shipindependently") {
        trackingId = independentShippingCarrier.trackingId;
        if (trackingId) {
          await updatePostOnShipIndependently({ trackingId });
        }
      }
    } catch (error) {
      console.log({ error });
    } finally {
      const isIndependentShipping =
        orderData.deliveryMethod.type === "shipindependently";
      if (!isIndependentShipping) {
        setShippingIsLoading(false);
      }
    }
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

  const [shippingIsLoading, setShippingIsLoading] = useState(false);

  const independentShippingInfoIsNotValid = () => {
    if (orderData?.deliveryMethod?.type === "shipindependently") {
      if (independentShippingCarrier.carrier === "") {
        return true;
      }
      if (independentShippingCarrier.trackingId === "") {
        return true;
      }
    }
  };

  const pickFIle = async () => {
    try {
      let resizeImage = null;
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (Platform.OS === "ios") {
        resizeImage = await ImageResizer.createResizedImage(
          res.uri,
          720,
          1280,
          "JPEG",
          60
        );
      } else if (Platform.OS === "android") {
        resizeImage = { uri: res.uri };
      }
      const photoBase64 = await RNFS.readFile(resizeImage.uri, "base64");
      const returnLabelImage = `data:image/jpeg;base64,${photoBase64}`;
      // actions.setPhotoList([
      //   {
      //     type: 'selected-photo',
      //     image: returnLabelImage,
      //     uri: resizeImage.uri,
      //     ext: 'jpeg',
      //   },
      // ]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const homitagShippingInfoIsNotValid = () => {
    if (orderData?.deliveryMethod?.type === "homitagshipping") {
      if (!selectedReturnAddress) {
        return true;
      }
    }
  };

  const getShippingLabelParams = ({
    buyerDetail,
    sellerDetail,
    buyerAddress,
    returnAddress,
    provider,
    weight,
    width,
    height,
    length,
  }) => {
    const buyerPhone =
      "1234567890" || buyerDetail?.phonenumber?.replace("+", "");
    const sellerPhone =
      "1234567890" || sellerDetail?.phonenumber?.replace("+", "");

    // buyerAddress;
    let params = {};
    switch (provider) {
      case "ups":
        params = {
          service: {
            Code: "003",
            Description: "UPS Ground",
          },
          buyer: {
            Name: `${buyerDetail.firstName} ${buyerDetail.lastName}`,
            AddressLine: buyerAddress.addressline1,
            AddressCity: buyerAddress.city,
            AddressState: buyerAddress.state,
            AddressZIP: buyerAddress.zipcode,
            AddressCountry: "us",
            Phone: buyerPhone,
          },
          seller: {
            Name: `${returnAddress.name}`,
            AddressLine: returnAddress.address_line_1,
            AddressCity: returnAddress.city,
            AddressState: returnAddress.state,
            AddressZIP: returnAddress.zipcode,
            AddressCountry: "us",
            Phone: sellerPhone,
          },
          package: {
            Description: "Package description",
            PackagingCode: "02",
            PackagingDescription: "Other Packaging",
            Length: length,
            Width: width,
            Height: height,
            Weight: weight,
          },
        };

        break;
      case "usps":
        params = {
          fromName: `${buyerDetail.firstName} ${buyerDetail.lastName}`,
          fromAddressA: buyerAddress.addressline1,
          fromAddressB:
            buyerAddress.addressline2 === "-" ? "" : buyerAddress.addressline2,
          fromCity: buyerAddress.city,
          fromState: buyerAddress.state,
          fromZip: buyerAddress.zipcode,
          fromPhone: sellerPhone,
          toName: `${returnAddress.name}`,
          toAddressA: returnAddress.address_line_1,
          toAddressB:
            returnAddress.address_line_2 === "-"
              ? ""
              : returnAddress.address_line_2,
          toCity: returnAddress.city,
          toState: returnAddress.state,
          toZip: returnAddress.zipcode,
          toPhone: buyerPhone,
          weightLbs: weight,
          widthInch: width,
          lengthInch: length,
          heightInch: height,
          serviceType: "Express",
          container: "FLAT RATE ENVELOPE",
          type: "PNG",
        };

        break;
      case "fedex":
        params = {
          buyer: {
            PersonName: `${buyerDetail.firstName} ${buyerDetail.lastName}`,
            CompanyName: " ",
            PhoneNumber: buyerPhone,
            EMailAddress: buyerDetail.email,
            AddressLine: buyerAddress.addressline1,
            AddressCity: buyerAddress.city,
            AddressState: buyerAddress.state,
            AddressZIP: buyerAddress.zipcode,
            AddressCountry: "US",
          },
          seller: {
            PersonName: `${returnAddress.name}`,
            CompanyName: " ",
            PhoneNumber: sellerPhone,
            EMailAddress: sellerDetail.email,
            AddressLine: returnAddress.address_line_1,
            AddressCity: returnAddress.city,
            AddressState: returnAddress.state,
            AddressZIP: returnAddress.zipcode,
            AddressCountry: "US",
          },
          package: {
            Weight: weight,
            Length: length,
            Width: width,
            Height: height,
            DropoffType: "REGULAR_PICKUP",
            PackagingType: "YOUR_PACKAGING",
            ServiceType: "FEDEX_2_DAY",
          },
        };
        break;
      default:
        break;
    }
    return params;
  };

  const offerPriceByQuantity = () => {
    const priceAccepted = parseFloat(orderData?.priceAccepted);

    return priceAccepted ? priceAccepted?.toFixed(2) : "0.00";
  };

  if (!orderData || !orderData.id) {
    return <ScreenLoader />;
  }
  const claimFiled = orderData?.claimRequestActive;

  let moreMenuOptions = [...moreButtonOptions[type]?.[orderstatus]] ?? [];

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
    orderData?.availableClaim === true &&
    !moreMenuOptions.includes("File a claim") &&
    type == "BUYER"
  ) {
    moreMenuOptions = ["File a claim", ...moreMenuOptions];
  }

  if (
    orderData &&
    orderData?.shippedAt &&
    orderstatus == "pendingbuyerconfirmation" &&
    type == "SELLER"
  ) {
    moreMenuOptions = ["Cancel"];
  }

  if (
    orderData &&
    orderData?.availableReturn &&
    orderstatus == "delivered" &&
    type == "BUYER"
  ) {
    moreMenuOptions = ["Return/Contest Item", ...moreMenuOptions];
  }

  const onActionSheetMore = async (opt) => {
    setShowMoreMenu(false);
    switch (opt) {
      case "Close Return":
        const returnIdToSend = orderData?.id;
        const closeReturnApiResp = await closeReturnApi({
          returnId: returnIdToSend,
        });
        if (
          closeReturnApiResp?.data &&
          closeReturnApiResp?.data?.returnStatus &&
          closeReturnApiResp?.data?.returnStatus == "closed"
        ) {
          Alert.alert("Success", "Return Closed successfully!");
          actions.getOrderById({ orderId });
        } else {
          Alert.alert(
            "Oops Close Return Failed",
            closeReturnApiResp?.result?.content?.message
          );
        }
        break;
      case "Resend Label":
        const returnId = orderData?.ReturnRequests?.[0]?.id;
        const resendLabelResp = await resendLabelApi({ returnId });
        if (resendLabelResp?.result?.status != 200 || !resendLabelResp?.data) {
          Alert.alert(
            "Oops Resend Label Failed",
            resendLabelResp?.result?.content?.message
          );
        } else {
          Alert.alert("Success", "Label sent successfully!");
        }
        break;
      case "View Order Details":
        navigation.navigate("OrderStatusReturn", {
          orderData: orderData,
          type: type,
          chatItem,
          orderId,
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
        <Modal
          animationType="slide"
          visible={trackingNumberModal}
          onRequestClose={() => {
            showTrackingNumberModal(false);
          }}
        >
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
                showTrackingNumberModal(false);
              }}
              name="arrow-back"
              size={25}
              color="#969696"
            />
            <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
              Shipping Label
            </Text>
            <Text></Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              marginHorizontal: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "flex-start",
                flex: 1,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  marginTop: 25,
                  marginBottom: 40,
                  borderBottomWidth: 2,
                  width: "95%",
                  borderBottomColor: "#E8E8E8",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 15,
                  }}
                >
                  Tracking Number*
                </Text>
                <TextInput
                  placeholder="Type Here"
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 16,
                    paddingVertical: 10,
                    paddingTop: 5,
                    color: "#000000",
                    paddingLeft: 0,
                  }}
                  onSubmitEditing={() => {
                    showTrackingNumberModal(false);
                  }}
                  numberOfLines={1}
                  value={independentShippingCarrier.trackingId}
                  onChangeText={(text) =>
                    dispatch(
                      setIndependentShippingCarrier({
                        carrier: independentShippingCarrier.carrier,
                        trackingId: text,
                      })
                    )
                  }
                />
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          visible={labelGenModal}
          onRequestClose={() => {
            showLabelModal(false);
          }}
          transparent
        >
          <View
            style={{
              backgroundColor: "#00000080",
              flex: 1,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#ffffff",
                width: "90%",
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                  alignItems: "center",
                }}
              >
                <LottieView
                  source={require("#assets/lottie/success.json")}
                  style={{ width: 300, height: 130, marginBottom: -60 }}
                  autoPlay
                  loop={false}
                />
                <Text
                  style={{
                    fontFamily: Fonts.family.semiBold,
                    fontSize: 16,
                    textAlign: "center",
                    marginTop: 30,
                  }}
                >
                  Label Generated!
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.family.regular,
                    fontSize: 14,
                    marginTop: 10,
                    textAlign: "center",
                    marginBottom: 30,
                  }}
                >
                  We generated the shipping label. Please check your email.
                  Confirm shipment once the item is shipped.
                </Text>
                <Button
                  label={"Done"}
                  subLabel={""}
                  size="large"
                  fullWidth={true}
                  disabled={false}
                  onPress={async () => {
                    showLabelModal(false);
                  }}
                  style={{ width: "100%", marginBottom: 15 }}
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          visible={shippedModal}
          onRequestClose={() => {
            showshippedModal(false);
          }}
          transparent
        >
          <View
            style={{
              backgroundColor: "#00000080",
              flex: 1,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#ffffff",
                width: "90%",
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                  alignItems: "center",
                }}
              >
                <LottieView
                  source={require("#assets/lottie/success.json")}
                  style={{ width: 300, height: 130, marginBottom: -60 }}
                  autoPlay
                  loop={false}
                />
                <Text
                  style={{
                    fontFamily: Fonts.family.semiBold,
                    fontSize: 16,
                    textAlign: "center",
                    marginTop: 30,
                  }}
                >
                  Tracking confirmed!
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.family.regular,
                    fontSize: 13,
                    marginTop: 10,
                    textAlign: "center",
                    marginBottom: 30,
                  }}
                >
                  You can track your shipment through the purchase details page.
                  Once the buyer confirms they’ve received your item, your funds
                  will be released!
                </Text>
                <Button
                  label={"Done"}
                  subLabel={""}
                  size="large"
                  fullWidth={true}
                  disabled={false}
                  onPress={async () => {
                    showshippedModal(false);
                  }}
                  style={{ width: "100%", marginBottom: 15 }}
                />
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          visible={claimCancelModal}
          onRequestClose={() => {
            showClaimCancelModal(false);
          }}
          transparent
        >
          <View
            style={{
              backgroundColor: "#00000080",
              flex: 1,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#ffffff",
                width: "90%",
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eeeeee",
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{ fontFamily: Fonts.family.semiBold, fontSize: 18 }}
                >
                  Cancel Claim
                </Text>
                <Ionicons
                  onPress={() => {
                    showClaimCancelModal(false);
                  }}
                  name="close"
                  size={25}
                  color="#969696"
                />
              </View>
              <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                <Text
                  style={{
                    fontFamily: Fonts.family.regular,
                    fontSize: 14,
                    marginBottom: 30,
                    marginTop: 30,
                  }}
                >
                  Are you sure you want to cancel?
                </Text>
                <Button
                  label={"Yes"}
                  subLabel={""}
                  size="large"
                  fullWidth={true}
                  disabled={false}
                  onPress={async () => {
                    showClaimCancelModal(false);
                    await actions.cancelClaim({
                      claimId: orderData?.ClaimRequests?.[0]?.id,
                      orderId,
                      params: {
                        origin: "buyer",
                        nextStatus: "cancelled",
                        settledInFavorOf: "seller",
                        fundedBy: "buyer",
                        userOrigin: userInfo.id,
                        comment: "",
                        destination: "seller",
                      },
                    });
                  }}
                  style={{ width: "100%", marginBottom: 15 }}
                />
                <Button
                  label={"No"}
                  subLabel={""}
                  size="large"
                  fullWidth={true}
                  disabled={false}
                  onPress={() => {
                    showClaimCancelModal(false);
                  }}
                  theme="secondary"
                  style={{ width: "100%", marginBottom: 10 }}
                />
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          visible={showMoreMenu ? true : false}
          onRequestClose={() => {
            setShowMoreMenu(false);
          }}
          transparent
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#00000080",
              justifyContent: "flex-end",
            }}
          >
            {moreMenuOptions.map((opt, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onActionSheetMore(opt)}
                style={{
                  width: "100%",
                  padding: 20,
                  backgroundColor:
                    opt.toLowerCase() == "cancel" ? "#FF5656" : "#fff",
                  borderBottomWidth: 1,
                  borderBottomColor: "#efefef",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: Fonts.family.semiBold,
                    color: opt.toLowerCase() == "cancel" ? "white" : "black",
                  }}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
        <Modal
          animationType="slide"
          visible={shippingLabelModal ? true : false}
          onRequestClose={() => {
            setShippingLabelModal(false);
          }}
        >
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
                setShippingLabelModal(false);
              }}
              name="arrow-back"
              size={25}
              color="#969696"
            />
            <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
              Shipping Label
            </Text>
            <Text></Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              marginHorizontal: 10,
            }}
          >
            <View
              style={{
                borderWidth: 1,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                marginBottom: 10,
              }}
            >
              <Image
                source={
                  shippingLabelModal.code == "shipindependently"
                    ? {
                        uri:
                          shippingLabelModal?.image ||
                          shippingLabelModal?.labelData,
                      }
                    : shippingLabelModal.fileExtension == "pdf"
                    ? require("../../../assets/images/pdficon.png")
                    : {
                        uri:
                          shippingLabelModal?.image ||
                          shippingLabelModal?.labelImge,
                      }
                }
                defaultSource={require("../../../assets/images/pdficon.png")}
                resizeMode="contain"
                style={
                  shippingLabelModal.fileExtension == "pdf"
                    ? { width: width * 0.55, height: "85%" }
                    : { width: width * 0.85, height: "85%" }
                }
              />
            </View>
            <Button
              label={"Download"}
              subLabel={""}
              size="large"
              fullWidth={true}
              disabled={false}
              onPress={() => {
                Linking.openURL(
                  shippingLabelModal?.image ||
                    shippingLabelModal?.labelImge ||
                    shippingLabelModal?.labelData
                );
              }}
              style={{ width: "90%", marginBottom: 10 }}
            />
          </View>
        </Modal>
        <Modal
          animationType="slide"
          onRequestClose={() => {
            showOrderClaimHistory(false);
          }}
          visible={orderClaimHistory ? true : false}
        >
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
            <Text></Text>
            <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
              Request Details
            </Text>
            <Ionicons
              onPress={() => {
                showOrderClaimHistory(false);
              }}
              name="close"
              size={25}
              color="#969696"
            />
          </View>
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 25,
                justifyContent: "center",
              }}
            >
              <Text style={styles.statusText}>Status:</Text>
              <Text style={styles.statusText2}>{` ${
                type === "BUYER"
                  ? ORDER_STATUS_SHIPP_BUYER[orderstatus]
                  : ORDER_STATUS_SHIPP_SELLER[orderstatus]
              }`}</Text>
            </View>
            <View
              style={{
                borderBottomColor: "#E8E8E8",
                borderBottomWidth: 1,
                paddingBottom: 20,
                paddingTop: 5,
              }}
            >
              <Text style={{ fontFamily: Fonts.family.regular, fontSize: 13 }}>
                {
                  orderClaimHistory?.ClaimRequests?.[
                    orderClaimHistory?.ClaimRequests.length - 1
                  ]?.claimStatus
                }
              </Text>
            </View>
            <View
              style={{
                paddingTop: 10,
                borderBottomColor: "#E8E8E8",
                borderBottomWidth: 1,
                paddingBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 12.5,
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{ fontFamily: Fonts.family.regular, fontSize: 14 }}
                >
                  Request ID:
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: Fonts.family.regular,
                    fontSize: 13,
                    width: "40%",
                    textAlign: "right",
                  }}
                >
                  {orderClaimHistory?.ClaimRequests?.[0]?.claimID}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 12.5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontFamily: Fonts.family.regular, fontSize: 14 }}
                >
                  Buyer Name:
                </Text>
                <Text
                  style={{ fontFamily: Fonts.family.regular, fontSize: 13 }}
                >
                  {orderClaimHistory?.buyerInfo?.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 12.5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontFamily: Fonts.family.regular, fontSize: 14 }}
                >
                  Request Reason:
                </Text>
                <Text
                  style={{ fontFamily: Fonts.family.regular, fontSize: 13 }}
                >
                  {
                    orderClaimHistory?.ClaimRequests?.[0]
                      ?.claimReasonDescription
                  }
                </Text>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: "#E8E8E8",
                borderBottomWidth: 1,
                paddingVertical: 20,
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Image
                resizeMode="cover"
                source={{ uri: orderClaimHistory?.productInfo?.image }}
                style={{ width: 80, height: 80, borderRadius: 10 }}
              />
              <View style={{ paddingLeft: 10, flex: 1 }}>
                <Text
                  style={{ fontFamily: Fonts.family.semiBold, fontSize: 12 }}
                >
                  {screenDetails?.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    Date Purchased
                  </Text>
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    {orderClaimHistory?.createdAt
                      ? moment(orderClaimHistory?.createdAt).format(
                          "DD/MM/YYYY"
                        )
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    Transaction ID
                  </Text>
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    {orderClaimHistory?.orderID}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    Total Paid
                  </Text>
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    ${orderClaimHistory?.totalPaid}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                paddingVertical: 20,
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  fontFamily: Fonts.family.semiBold,
                  fontSize: 15,
                  marginBottom: 10,
                }}
              >
                Request Activity:
              </Text>
              {orderClaimHistory?.ClaimRequests?.[0]?.ClaimComments?.map(
                (comm) => {
                  return (
                    <View
                      style={{
                        paddingVertical: 10,
                        borderBottomColor: "#E8E8E8",
                        borderBottomWidth: 1,
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Fonts.family.Regular,
                          fontSize: 13,
                        }}
                      >
                        {moment(comm?.updatedAt).format("DD MMM YYYY")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.family.Regular,
                          fontSize: 13,
                        }}
                      >
                        {comm?.claimCommentStatusDescription}
                      </Text>

                      <Text
                        style={{
                          fontFamily: Fonts.family.Regular,
                          fontSize: 13,
                        }}
                      >
                        Comment:
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.family.Regular,
                          fontSize: 13,
                        }}
                      >
                        {comm?.comment || "-"}
                      </Text>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          onRequestClose={() => {
            showOrderReturnHistory(false);
          }}
          visible={orderReturnHistory ? true : false}
        >
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
            <Text></Text>
            <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
              Request Details
            </Text>
            <Ionicons
              onPress={() => {
                showOrderReturnHistory(false);
              }}
              name="close"
              size={25}
              color="#969696"
            />
          </View>
          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 25,
                justifyContent: "center",
              }}
            >
              <Text style={styles.statusText}>Status:</Text>
              <Text style={styles.statusText2}>{`  ${
                isShippingStatus
                  ? orderData && type === "BUYER"
                    ? ORDER_STATUS_SHIPP_BUYER[orderstatus]
                    : returnObj
                    ? ORDER_STATUS_SHIPP_SELLER.labelshared
                    : ORDER_STATUS_SHIPP_SELLER[orderstatus]
                  : orderData && ORDER_STATUS_PICKUP[orderstatus]
              }`}</Text>
            </View>
            <View
              style={{
                borderBottomColor: "#E8E8E8",
                borderBottomWidth: 1,
                paddingBottom: 20,
                paddingTop: 5,
              }}
            >
              <Text style={{ fontFamily: Fonts.family.regular, fontSize: 13 }}>
                The buyer sent you a return request.
              </Text>
            </View>
            <View
              style={{
                paddingTop: 10,
                borderBottomColor: "#E8E8E8",
                borderBottomWidth: 1,
                paddingBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 12.5,
                  alignItems: "flex-start",
                }}
              >
                <Text
                  style={{ fontFamily: Fonts.family.regular, fontSize: 15 }}
                >
                  Request ID:
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: Fonts.family.regular,
                    fontSize: 13,
                    width: "40%",
                    textAlign: "right",
                  }}
                >
                  {orderReturnHistory?.ReturnRequests?.[0]?.returnID}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 12.5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontFamily: Fonts.family.regular, fontSize: 15 }}
                >
                  Buyer Name:
                </Text>
                <Text
                  style={{ fontFamily: Fonts.family.regular, fontSize: 13 }}
                >
                  {orderReturnHistory?.buyerInfo?.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 12.5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontFamily: Fonts.family.regular, fontSize: 15 }}
                >
                  Request Reason:
                </Text>
                <Text
                  style={{ fontFamily: Fonts.family.regular, fontSize: 13 }}
                >
                  {orderReturnHistory?.ReturnRequests?.[0]?.returnReason?.name}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: "#E8E8E8",
                borderBottomWidth: 1,
                paddingVertical: 20,
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Image
                resizeMode="cover"
                source={{ uri: orderReturnHistory?.productInfo?.image }}
                style={{ width: 80, height: 80, borderRadius: 10 }}
              />
              <View style={{ paddingLeft: 10, flex: 1 }}>
                <Text
                  style={{ fontFamily: Fonts.family.semiBold, fontSize: 12 }}
                >
                  {screenDetails?.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    Date Purchased
                  </Text>
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    {orderReturnHistory?.createdAt
                      ? moment(orderReturnHistory?.createdAt).format(
                          "DD/MM/YYYY"
                        )
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    Transaction ID
                  </Text>
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    {orderReturnHistory?.orderID}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingTop: 5,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    Total Paid
                  </Text>
                  <Text
                    style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                  >
                    ${orderReturnHistory?.totalPaid}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                paddingVertical: 20,
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  fontFamily: Fonts.family.semiBold,
                  fontSize: 15,
                  marginBottom: 10,
                }}
              >
                Request Activity:
              </Text>
              {orderReturnHistory?.ReturnRequests?.[0]?.histories?.map(
                (comm) => {
                  return (
                    <View
                      style={{
                        paddingVertical: 10,
                        borderBottomColor: "#E8E8E8",
                        borderBottomWidth: 1,
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Fonts.family.Regular,
                          fontSize: 13,
                        }}
                      >
                        {moment(comm?.updatedAt).format("DD MMM YYYY")}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.family.Regular,
                          fontSize: 13,
                        }}
                      >
                        {returnActivities[comm?.returnStatus]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.family.Regular,
                          fontSize: 13,
                        }}
                      >
                        Comment:
                      </Text>
                      <Text
                        style={{
                          fontFamily: Fonts.family.Regular,
                          fontSize: 13,
                        }}
                      >
                        {comm?.notes?.comment || "-"}
                      </Text>
                    </View>
                  );
                }
              )}
            </View>
          </ScrollView>
        </Modal>

        <Modal
          onRequestClose={() => {
            setCancellationRequestModal(false);
            setDeniedScreen(false);
          }}
          visible={cancellationRequestModal}
        >
          <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={{}}>
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
                <Text></Text>
                <Text
                  style={{
                    fontFamily: fonts.family.semiBold,
                    fontSize: 16,
                    marginLeft: 30,
                  }}
                >
                  Cancellation Request
                </Text>
                <Ionicons
                  onPress={() => {
                    setCancellationRequestModal(false);
                    setDeniedScreen(false);
                  }}
                  name="close"
                  size={25}
                  color="#969696"
                />
              </View>
              {screenDetails?.id && (
                <ProductDetail
                  screenDetails={screenDetails}
                  userProductDetail={userProductDetail}
                />
              )}
              <Text
                onPress={() => {
                  setCancellationRequestModal(false);
                  setDeniedScreen(false);
                }}
                style={{
                  fontFamily: Fonts.family.semiBold,
                  fontSize: 10,
                  marginBottom: 15,
                  textDecorationLine: "underline",
                  textAlign: "center",
                }}
              >
                VIEW ORDER DETAILS
              </Text>
              <View
                style={{
                  width: "90%",
                  height: 1,
                  backgroundColor: "#76767630",
                  alignSelf: "center",
                  marginBottom: 20,
                }}
              ></View>
              {deniedScreen ? (
                <>
                  <Text
                    style={{
                      fontFamily: Fonts.family.semiBold,
                      fontSize: 15,
                      textAlign: "left",
                      marginTop: 20,
                      marginLeft: 20,
                    }}
                  >
                    Deny Request Details
                  </Text>
                  <InputText
                    placeholder="Type Here"
                    fullWidth
                    textAlign="left"
                    value={denyRequestText}
                    onChangeText={(text) => {
                      setDenyRequestText(text);
                    }}
                    maxLength={500}
                    returnKeyType="done"
                    multiline
                    numberOfLines={6}
                    style={{ fontSize: 15 }}
                  />
                  {/* <TextInput
                    placeholder="Add Comment Here"
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: 16,
                      marginHorizontal: 20,
                      padding: 0,
                      borderBottomColor: "#96969660",
                      borderBottomWidth: 1,
                    }}
                    numberOfLines={5}
                    value={denyRequestText}
                    onChangeText={(text) => {
                      setDenyRequestText(text);
                    }}
                  /> */}
                </>
              ) : (
                <>
                  <Text
                    style={{
                      fontFamily: Fonts.family.regular,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {`Please respond to this cancellation request by [date].`}
                  </Text>

                  <Text
                    style={{
                      fontFamily: Fonts.family.semiBold,
                      fontSize: 15,
                      textAlign: "left",
                      marginVertical: 20,
                      marginLeft: 20,
                    }}
                  >
                    Cancellation Details
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#F5F5F5",
                      padding: 10,
                      paddingVertical: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.family.regular,
                        fontSize: 14,
                        paddingBottom: 8,
                        marginHorizontal: 27.5,
                        textAlign: "center",
                        color: "#767676",
                      }}
                    >
                      {
                        orderData?.OrderCancels?.[
                          orderData?.OrderCancels?.length - 1 || 0
                        ]?.comment
                      }
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "90%",
                      height: 1,
                      backgroundColor: "#76767630",
                      alignSelf: "center",
                      marginTop: 30,
                      marginBottom: 20,
                    }}
                  ></View>
                  <Text
                    style={{
                      fontFamily: Fonts.family.semiBold,
                      fontSize: 15,
                      textAlign: "left",
                      marginVertical: 15,
                      marginLeft: 20,
                    }}
                  >
                    Ways to Respond
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                    }}
                  >
                    <View style={[styles.contentItemConainer]}>
                      <TouchableOpacity
                        onPress={() => {
                          actions.acceptCancellation({
                            orderId: orderData.id,
                            cancellationId:
                              orderData?.OrderCancels?.[
                                orderData?.OrderCancels?.length - 1 || 0
                              ]?.id,
                            params: {},
                          });
                          setCancellationRequestModal(false);
                          setDeniedScreen(false);
                        }}
                      >
                        <View style={styles.contentItemHeader}>
                          <Text style={styles.itemHeaderText}>
                            {"Cancel Order"}
                          </Text>
                        </View>
                        <View style={styles.contentIconContainer}>
                          <Icon
                            icon={"option_tick_icon"}
                            style={{
                              width: 24,
                              height: 30,
                            }}
                          />
                        </View>
                        <View style={styles.itemDetailContainer}>
                          <Text style={styles.itemDetailText}>
                            Accept this request to cancel the transaction and
                            release the funds back to the buyer.
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.contentItemConainer]}>
                      <TouchableOpacity
                        onPress={() => {
                          setDeniedScreen(true);
                        }}
                      >
                        <View style={styles.contentItemHeader}>
                          <Text style={styles.itemHeaderText}>{"Decline"}</Text>
                        </View>
                        <View style={styles.contentIconContainer}>
                          <Icon
                            icon={"option_close_icon"}
                            style={{
                              height: 30,
                              width: 50,
                            }}
                          />
                        </View>
                        <View style={styles.itemDetailContainer}>
                          <Text style={styles.itemDetailText}>
                            Deny this request to proceed with the transaction.
                            The seller may request a return once they receive
                            the item.
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
            {deniedScreen ? (
              <FooterAction
                mainButtonProperties={{
                  label: "Deny Cancellation",
                  onPress: () => {
                    actions.denyCancellation({
                      orderId: orderData.id,
                      cancellationId:
                        orderData?.OrderCancels?.[
                          orderData?.OrderCancels?.length - 1 || 0
                        ]?.id,
                      params: {
                        sellerDeclineReason: "itemhasshipped",
                        sellerComment: denyRequestText,
                      },
                    });
                    setCancellationRequestModal(false);
                    setDeniedScreen(false);
                  },
                }}
              />
            ) : null}
          </SafeAreaView>
        </Modal>
        <Modal
          onRequestClose={() => {
            setClaimRequest(false);
          }}
          visible={claimRequest}
        >
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
            <Text></Text>
            <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
              Claim Request
            </Text>
            <Ionicons
              onPress={() => {
                setClaimRequest(false);
                setdisputeScreen(false);
              }}
              name="close"
              size={25}
              color="#969696"
            />
          </View>
          <ScrollView
            contentContainerStyle={{ justifyContent: "space-between" }}
            style={{ flex: 1 }}
          >
            <View style={{}}>
              {screenDetails?.id && (
                <ProductDetail
                  screenDetails={screenDetails}
                  userProductDetail={userProductDetail}
                />
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.family.bold,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Claim Status:
                </Text>
                <Text
                  onPress={() => {
                    setClaimRequest(false);
                    setdisputeScreen(false);
                    showOrderClaimHistory(orderData);
                    // setCancellationRequestModal(false);
                    // setDeniedScreen(false);
                  }}
                  style={{
                    fontFamily: Fonts.family.semiBold,
                    fontSize: 11,
                    color: colors.green,
                    marginLeft: 10,
                    textDecorationLine: "underline",
                    textAlign: "center",
                  }}
                >
                  BUYER FILED CLAIM
                </Text>
              </View>

              {disputeScreen ? (
                <>
                  <Text
                    style={{
                      fontFamily: Fonts.family.semiBold,
                      fontSize: 15,
                      textAlign: "left",
                      marginTop: 20,
                      marginLeft: 20,
                    }}
                  >
                    Explaination
                  </Text>
                  <TextInput
                    placeholder="Add Comment Here"
                    style={{
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: 16,
                      width: "100%",
                      marginHorizontal: 20,
                      padding: 0,
                      height: 100,
                      paddingRight: 20,
                      borderBottomColor: "#96969660",
                      borderBottomWidth: 1,
                    }}
                    numberOfLines={5}
                    multiline={true}
                    value={disputeRequestText}
                    onChangeText={(text) => {
                      setDisputeRequestText(text);
                    }}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    blurOnSubmit
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 15,
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setClaimRequest(false);
                        setdisputeScreen(false);
                        navigation.navigate("ClaimPhotos", {
                          order: orderData,
                        });
                      }}
                      style={{
                        flexDirection: "row",
                        marginRight: 5,
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        borderColor: colors.active,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 7.5,
                      }}
                    >
                      <Ionicons2
                        size={20}
                        name="camera-outline"
                        color={colors.active}
                      />
                      <Text
                        style={{
                          fontFamily: Fonts.family.regular,
                          color: colors.active,
                          fontSize: 12,
                          marginLeft: 5,
                        }}
                      >
                        ATTACH CAMERA
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        pickFIle();
                      }}
                      style={{
                        flexDirection: "row",
                        marginLeft: 5,
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        borderColor: colors.active,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 7.5,
                      }}
                    >
                      <Ionicons2 size={20} name="add" color={colors.active} />
                      <Text
                        style={{
                          fontFamily: Fonts.family.regular,
                          color: colors.active,
                          fontSize: 12,
                          marginLeft: 5,
                        }}
                      >
                        ATTACH DOCS
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      fontFamily: Fonts.family.regular,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {`${orderData.buyerInfo.name} has filed a claim and is requesting $${orderData.totalPaid}. Please respond to this claim within 48 hours. Here’s what they said:`}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#F5F5F5",
                      padding: 10,
                      paddingVertical: 5,
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.family.regular,
                        fontSize: 14,
                        paddingBottom: 8,
                        marginHorizontal: 27.5,
                        textAlign: "center",
                        color: "#767676",
                      }}
                    >
                      {
                        orderData?.ClaimRequests?.[
                          orderData?.ClaimRequests?.length - 1 || 0
                        ]?.ClaimComments?.[0]?.comment
                      }
                    </Text>
                  </View>

                  {orderData?.ClaimRequests?.[
                    orderData?.ClaimRequests?.length - 1 || 0
                  ]?.ClaimComments?.[0]?.images?.length ? (
                    <Text
                      style={{
                        fontFamily: Fonts.family.semiBold,
                        fontSize: 15,
                        textAlign: "left",
                        marginVertical: 20,
                        marginLeft: 20,
                      }}
                    >
                      Photos
                    </Text>
                  ) : null}
                  <View style={{ flexDirection: "row" }}>
                    {orderData?.ClaimRequests?.[
                      orderData?.ClaimRequests?.length - 1 || 0
                    ]?.ClaimComments?.[0]?.images.map(() => {
                      return (
                        <Image
                          source={{
                            uri: "https://i.imgur.com/TsMfKOr.jpg",
                          }}
                          style={{
                            width: 100,
                            height: 100,
                            marginLeft: 10,
                            borderRadius: 10,
                          }}
                        />
                      );
                    })}
                  </View>
                  <View
                    style={{
                      width: "90%",
                      height: 1,
                      backgroundColor: "#76767630",
                      alignSelf: "center",
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  ></View>
                  <Text
                    style={{
                      fontFamily: Fonts.family.semiBold,
                      fontSize: 15,
                      textAlign: "left",
                      marginVertical: 15,
                      marginLeft: 20,
                    }}
                  >
                    Ways to Respond
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                    }}
                  >
                    <View style={[styles.contentItemConainer]}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("ChatScreen", { item: chatItem });
                          setClaimRequest(false);
                          setdisputeScreen(false);
                          setDisputeRequestText("");
                        }}
                      >
                        <View style={styles.contentItemHeader}>
                          <Text style={styles.itemHeaderText}>
                            {"Chat with Buyer"}
                          </Text>
                        </View>
                        <View style={styles.contentIconContainer}>
                          <Icon
                            icon={"chat_active"}
                            style={{
                              width: 45,
                              height: 40,
                            }}
                          />
                        </View>
                        <View style={styles.itemDetailContainer}>
                          <Text style={styles.itemDetailText}>
                            If you resolve this with the seller, and they
                            retract their claim, your claim won’t be affected
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.contentItemConainer]}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("ReturnRefund", {
                            post: chatItem.post,
                            sellerName: `${chatItem.sellerFirstName} ${chatItem.sellerLastName}`,
                            chatItem,
                            orderObj: orderData,
                            screen: "orderstatus",
                            claimRequestId:
                              orderData?.ClaimRequests?.[
                                orderData?.ClaimRequests?.length - 1 || 0
                              ]?.id,
                          });
                          setClaimRequest(false);
                          setdisputeScreen(false);
                          setDisputeRequestText("");
                        }}
                      >
                        <View style={styles.contentItemHeader}>
                          <Text style={styles.itemHeaderText}>
                            {"Refund the Buyer"}
                          </Text>
                        </View>
                        <View style={styles.contentIconContainer}>
                          <Icon
                            icon={"option_refund_icon"}
                            style={{
                              height: 35,
                              width: 50,
                            }}
                          />
                        </View>
                        <View style={styles.itemDetailContainer}>
                          <Text style={styles.itemDetailText}>
                            Issuing a refund for the disputed amount will
                            quickly close the case.
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      marginHorizontal: 10,
                      flexDirection: "row",
                      marginBottom: 20,
                    }}
                  >
                    <View style={[styles.contentItemConainer]}>
                      <TouchableOpacity
                        onPress={() => {
                          setdisputeScreen(true);
                          setDisputeRequestText("");
                        }}
                      >
                        <View style={styles.contentItemHeader}>
                          <Text style={styles.itemHeaderText}>
                            {"Dispute Claim"}
                          </Text>
                        </View>
                        <View style={styles.contentIconContainer}>
                          <Icon
                            icon={"dispute"}
                            style={{
                              height: 40,
                              width: 55,
                            }}
                          />
                        </View>
                        <View style={styles.itemDetailContainer}>
                          <Text style={styles.itemDetailText}>
                            Dispute this claim by explaining the situation.
                            Homitag will also be involved in this process.
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}></View>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
          {disputeScreen ? (
            <FooterAction
              mainButtonProperties={{
                label: "Submit Dispute",
                onPress: () => {
                  setraiseDisputeLoading(true);
                  actions.raiseDispute({
                    orderId: orderData.id,
                    claimId:
                      orderData?.ClaimRequests?.[
                        orderData?.ClaimRequests?.length - 1 || 0
                      ]?.id,
                    params: {
                      comment: disputeRequestText,
                      destination: "homitag",
                      images: claimPhotosList,
                      nextStatus: "disputed",
                      origin: "seller",
                    },
                  });
                  setTimeout(() => {
                    setraiseDisputeLoading(false);
                    setClaimRequest(false);
                    setdisputeScreen(false);
                  }, 2000);
                },
                showLoading: raiseDisputeLoading,
              }}
            />
          ) : null}
        </Modal>
        <Modal
          onRequestClose={() => {
            actions.createOffer({
              method: "PATCH",
              orderId: orderData.id,
              params: { hideCancelModal: true },
            });
            setModalCancel(false);
          }}
          visible={modalCancel}
        >
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
            <Text></Text>
            <Text
              style={{
                fontFamily: fonts.family.semiBold,
                fontSize: 16,
                marginLeft: 30,
              }}
            >
              {" "}
              Cancellation Request
            </Text>
            <Ionicons
              onPress={() => {
                actions.createOffer({
                  method: "PATCH",
                  orderId: orderData.id,
                  params: { hideCancelModal: true },
                });
                setModalCancel(false);
              }}
              name="close"
              size={25}
              color="#969696"
            />
          </View>
          <View>
            {screenDetails?.id && (
              <ProductDetail
                screenDetails={screenDetails}
                userProductDetail={userProductDetail}
              />
            )}
            <View
              style={{
                backgroundColor: "#F5F5F5",
                padding: 10,
                paddingVertical: 15,
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.family.regular,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                {`${orderData?.sellerInfo?.name} declined your cancellation request. Your order will proceed as planned.`}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: Fonts.family.semiBold,
                fontSize: 15,
                textAlign: "left",
                marginVertical: 20,
                marginLeft: 20,
              }}
            >
              Reason for declining:
            </Text>
            <View
              style={{
                backgroundColor: "#F5F5F5",
                padding: 10,
                paddingVertical: 15,
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.family.regular,
                  fontSize: 14,
                  paddingBottom: 8,
                  marginHorizontal: 27.5,
                  textAlign: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#DADADA",
                }}
              >
                {
                  orderData?.OrderCancels?.[
                    orderData?.OrderCancels?.length - 1 || 0
                  ]?.sellerComment
                }
              </Text>
            </View>
          </View>
        </Modal>
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
                  {orderData?.cancelStatus === "cancelled" &&
                    type === "BUYER" && (
                      <View
                        style={{
                          backgroundColor: "#F5F5F5",
                          marginHorizontal: -20,
                          padding: 15,
                          marginTop: 20,
                          marginBottom: -20,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fonts.family.regular,
                            fontSize: 14,
                            textAlign: "center",
                            color: "#313334",
                          }}
                        >
                          {`The seller has cancelled your order (${orderData.orderID}) . Your funds will be returned in the next 3 business day.`}
                        </Text>
                      </View>
                    )}
                  {orderstatus == "claimaccepted" ? (
                    <>
                      <ShippingStatus
                        type="claim"
                        cardTitle={cardTitle}
                        cardDetail={cardDetail}
                        order={orderData}
                        side={type}
                      />
                      <ItemElement
                        leftLabel="Refund Amount"
                        rightLabel={`$${parseFloat(
                          orderData?.ClaimRequests?.[0]?.amountRequested || 0
                        ).toFixed(2)}`}
                      />
                      <ItemElement
                        leftLabel="Total Refunded"
                        rightLabel={`$${parseFloat(
                          orderData?.ClaimRequests?.[0]?.amountRequested || 0
                        ).toFixed(2)}`}
                        txtType="bold"
                      />
                      <View
                        style={{
                          height: 1,
                          backgroundColor: "#b7b7b7",
                          width: "100%",
                        }}
                      ></View>
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
                      <ItemElement
                        leftLabel="Refund Amount"
                        rightLabel={`$${parseFloat(
                          orderData?.ClaimRequests?.[0]?.amountRequested || 0
                        ).toFixed(2)}`}
                      />
                      <ItemElement
                        leftLabel="Total to Refund"
                        rightLabel={`$${parseFloat(
                          orderData?.ClaimRequests?.[0]?.amountRequested || 0
                        ).toFixed(2)}`}
                        txtType="bold"
                      />
                      <View
                        style={{
                          height: 1,
                          backgroundColor: "#b7b7b7",
                          width: "100%",
                        }}
                      ></View>
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
                              type={
                                orderstatus == "returnclosed" ? "" : "return"
                              }
                              cardTitle={null}
                              cardDetail={cardDetail}
                              order={orderData}
                              side={type}
                            />
                          ) : (
                            <>
                              <ShippingInformation />
                              <ReturnShippingDetail />
                            </>
                          )}
                          {/* <View style={styles.payment_detail}>
                            <ItemElement
                              leftLabel="Refund Amount"
                              rightLabel={
                                orderData?.priceAccepted
                                  ? `$${parseFloat(
                                      orderData?.priceAccepted
                                    ).toFixed(2)}`
                                  : "0.00"
                              }
                            />
                          </View> */}
                        </>
                      )}

                      {/* {returnObj && (
                        <>
                          <ShippingReturnStatus returnObj={returnObj} />
                          <View style={styles.payment_detail}>
                            <ItemElement
                              leftLabel="Refund Amount"
                              rightLabel={`$${parseFloat(
                                returnObj.refundedValue || 0
                              ).toFixed(2)}`}
                            />
                            <ItemElement
                              leftLabel="Shipping Label Cost"
                              rightLabel={
                                returnObj.labelData.code === "homitagshipping"
                                  ? `$${parseFloat(
                                      returnObj.labelData.providerSelected
                                        .rate || 0
                                    ).toFixed(2)}`
                                  : `$${parseFloat(
                                      returnObj.labelData.shippingCost || 0
                                    ).toFixed(2)}`
                              }
                            />
                            <ItemElement
                              leftLabel="Total to Refund"
                              rightLabel={
                                returnObj.labelData.code === "homitagshipping"
                                  ? `$${(
                                      parseFloat(returnObj.refundedValue || 0) -
                                      parseFloat(
                                        returnObj.labelData.providerSelected
                                          .rate
                                      )
                                    ).toFixed(2)}`
                                  : `$${(
                                      parseFloat(returnObj.refundedValue || 0) -
                                      parseFloat(
                                        returnObj.labelData.shippingCost
                                      )
                                    ).toFixed(2)}`
                              }
                              txtType="bold"
                            />
                          </View>
                        </>
                      )} */}
                    </>
                  ) : (
                    <>
                      {isShippingStatus && (
                        <ShippingStatus
                          cardTitle={cardTitle}
                          type={
                            type == "BUYER"
                              ? orderstatus == "labelshared" ||
                                orderstatus == "labelsharedind" ||
                                orderstatus == "returnshipped" ||
                                orderstatus == "returnclosed" ||
                                orderstatus == "returned"
                              : orderstatus == "labelshared" ||
                                orderstatus == "labelsharedind" ||
                                orderstatus == "returnshipped" ||
                                orderstatus == "returned"
                              ? "return"
                              : ""
                          }
                          cardDetail={cardDetail}
                          order={orderData}
                          side={type}
                        />
                      )}
                      {!isShippingStatus &&
                      orderData?.orderStatus === "accepted" ? (
                        orderData?.meetup ? (
                          <MeetupArea
                            navigation={navigation}
                            data={orderData?.meetup}
                            onPress={goToMeetupScreen}
                          />
                        ) : (
                          <>
                            <TouchableOpacity
                              onPress={goToMeetupScreen}
                              style={styles.proposMapButton}
                            >
                              <Icon
                                icon="localization_blue"
                                style={{
                                  width: 19.25,
                                  height: 25.67,
                                  resizeMode: "contain",
                                  marginRight: 10,
                                }}
                              />
                              <Text
                                style={{
                                  fontFamily: "Montserrat-Regular",
                                  fontWeight: "bold",
                                  fontSize: 15,
                                  textAlign: "center",
                                  textDecorationLine: "underline",
                                  color: "#7471FF",
                                }}
                              >
                                Propose a meetup spot
                              </Text>
                            </TouchableOpacity>

                            <View style={{ marginBottom: 50, marginTop: 5 }}>
                              <Text
                                style={{
                                  fontFamily: "Montserrat-Regular",
                                  fontSize: 13,
                                  color: "#313334",
                                  textAlign: "center",
                                  paddingHorizontal: 10,
                                }}
                              >
                                Tap here to choose a spot to meet up with the
                                seller. We always suggest a public space.
                              </Text>
                            </View>
                          </>
                        )
                      ) : (
                        <View style={{ marginTop: 0 }} />
                      )}

                      {type === "BUYER" && (
                        <ItemElement
                          leftLabel="Item Price"
                          rightLabel={`$${offerPriceByQuantity()}`}
                        />
                      )}

                      {type === "SELLER" &&
                        (orderstatus === "accepted" ||
                          orderstatus === "pendingbuyerconfirmation") &&
                        orderData?.cancelStatus != "requested" && (
                          <>
                            {orderData?.deliveryMethod.type ===
                              "shipindependently" && (
                              <View
                                style={{
                                  borderTopWidth: 1,
                                  borderColor: "#E8E8E8",
                                  paddingTop: 14,
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    fontSize: 15,
                                  }}
                                >
                                  Add Tracking Details
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: 14,
                                    marginVertical: 10,
                                  }}
                                >
                                  Provide the tracking information for your
                                  item. Both you and the buyer can track it in
                                  the Order Status page.
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: "Montserrat-SemiBold",
                                    fontSize: 15,
                                    marginTop: 10,
                                  }}
                                >
                                  Select a carrier
                                  <Text style={{ color: "red" }}>{` *`}</Text>
                                </Text>

                                <TouchableOpacity
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: 10,
                                    paddingBottom: 10,
                                    marginBottom: 10,
                                    borderBottomColor: "#E8E8E8",
                                    borderBottomWidth: 1.5,
                                  }}
                                  onPress={() => {
                                    navigation.navigate(
                                      "IndependentCarrierSelection"
                                    );
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: "Montserrat-SemiBold",
                                      fontSize: 14,
                                      color:
                                        independentShippingCarrier.carrier ===
                                        ""
                                          ? "gray"
                                          : "black",
                                      textTransform:
                                        independentShippingCarrier.carrier ===
                                        ""
                                          ? "none"
                                          : "uppercase",
                                    }}
                                  >
                                    {independentShippingCarrier.carrier === ""
                                      ? "Choose an Option"
                                      : independentShippingCarrier.carrier}
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: "Montserrat-SemiBold",
                                      color: colors.active,
                                      fontSize: 15,
                                      textDecorationLine: "underline",
                                    }}
                                  >
                                    Select
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={{
                                    marginTop: 10,
                                    marginBottom: 40,
                                    borderBottomWidth: 2,
                                    borderBottomColor: "#E8E8E8",
                                  }}
                                  onPress={() => {
                                    showTrackingNumberModal(true);
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: "Montserrat-SemiBold",
                                      fontSize: 15,
                                    }}
                                  >
                                    Tracking Number*
                                  </Text>
                                  <TextInput
                                    placeholder="Type Here"
                                    style={{
                                      fontFamily: "Montserrat-SemiBold",
                                      fontSize: 16,
                                      paddingVertical: 10,
                                      color: "#000000",
                                      paddingTop: 5,
                                      paddingLeft: 0,
                                    }}
                                    numberOfLines={1}
                                    value={
                                      independentShippingCarrier.trackingId
                                    }
                                    editable={false}
                                    // onChangeText={(text) =>
                                    //   dispatch(
                                    //     setIndependentShippingCarrier({
                                    //       carrier:
                                    //         independentShippingCarrier.carrier,
                                    //       trackingId: text,
                                    //     })
                                    //   )
                                    // }
                                  />
                                </TouchableOpacity>
                              </View>
                            )}
                            {orderData?.deliveryMethod.type ===
                              "homitagshipping" && (
                              <View
                                style={{
                                  borderTopWidth: 1,
                                  borderBottomWidth: 1,
                                  borderColor: "#E8E8E8",
                                  paddingVertical: 20,
                                  marginBottom: 20,
                                  width: "100%",
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() => {
                                    navigation.navigate("LabelGenerator", {
                                      postDetail,
                                      provider:
                                        orderData?.deliveryMethod?.carrier,
                                      orderData,
                                    });
                                  }}
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontFamily: "Montserrat-Regular",
                                      fontSize: 15,
                                      alignSelf: "flex-start",
                                    }}
                                  >
                                    Ship From{" "}
                                    <Text style={{ color: "red" }}>*</Text>
                                  </Text>
                                  <View style={{ flex: 1, paddingLeft: 20 }}>
                                    {!selectedReturnAddress && (
                                      <Text
                                        style={{
                                          fontFamily: "Montserrat-Regular",
                                          fontSize: 15,
                                          color: "#999999",
                                        }}
                                      >
                                        Enter a return address
                                      </Text>
                                    )}
                                    {selectedReturnAddress && (
                                      <View
                                        style={styles.addressDetailContainer}
                                      >
                                        <Text
                                          style={{
                                            fontFamily: "Montserrat-Bold",
                                            fontSize: 15,
                                          }}
                                        >
                                          {selectedReturnAddress?.name}
                                        </Text>
                                        <Text
                                          style={{
                                            fontFamily: "Montserrat-Regular",
                                            fontSize: 13,
                                          }}
                                        >
                                          {`${
                                            selectedReturnAddress?.address_line_1 ||
                                            ""
                                          } ${
                                            selectedReturnAddress?.address_line_2 ||
                                            ""
                                          } \n${
                                            selectedReturnAddress?.city || ""
                                          }, ${
                                            selectedReturnAddress?.state || ""
                                          } ${
                                            selectedReturnAddress?.zipcode || ""
                                          }`}
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                    }}
                                  >
                                    <Icon
                                      icon="chevron-right"
                                      style={{ width: 20, height: 20 }}
                                    />
                                  </View>
                                </TouchableOpacity>
                              </View>
                            )}
                          </>
                        )}
                      {type === "SELLER" &&
                        (orderstatus == "returnshipped" ||
                          orderstatus == "labelshared" ||
                          orderstatus == "returned") && (
                          <Text
                            style={{
                              textAlign: "center",
                              borderTopWidth: 1,
                              paddingTop: 10,
                              borderTopColor: "#96969650",
                              fontFamily: fonts.family.regular,
                              color: "#969696",
                            }}
                          >
                            This screen will update once the buyer sends the
                            item. When you receive the item, please inspect it
                            before tapping Confirm to issue the return.
                          </Text>
                        )}
                      {type === "SELLER" &&
                      (orderstatus == "labelshared" ||
                        orderstatus == "labelsharedind" ||
                        orderstatus == "returnshipped" ||
                        orderstatus == "returnclosed" ||
                        orderstatus == "returned") ? null : (
                        <>
                          {type === "SELLER" &&
                            (isShippingStatus ||
                              orderData?.orderStatus ===
                                "transactioncomplete") && (
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
                            (orderData?.deliveryMethod.type ===
                            "homitagshipping" ? (
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
                                    ? `$${parseFloat(orderData?.tax).toFixed(
                                        2
                                      )}`
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
                                      parseFloat(
                                        orderData?.partialInfo?.homitagFee
                                      ) * -1
                                    ).toFixed(2)}`
                                  : "0.00"
                              }
                            />
                          )}

                          {type === "BUYER" ? (
                            <ItemElement
                              leftLabel={
                                isShippingStatus
                                  ? "Total you paid"
                                  : "Total you owe"
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
                                  orderData?.cancelStatus === "cancelled" ||
                                  orderstatus == "refundedreturned"
                                    ? "0.00"
                                    : orderData?.sellerShare
                                    ? parseFloat(
                                        orderData?.sellerShare
                                      ).toFixed(2)
                                    : "0.00"
                                }`}
                                txtType="bold"
                              />
                              {(orderstatus == "buyacceptedhomi" ||
                                orderstatus == "buyacceptedind" ||
                                orderstatus == "intransit" ||
                                orderstatus == "inTransit" ||
                                orderstatus == "labelshared" ||
                                orderstatus == "created" ||
                                orderstatus == "accepted" ||
                                orderstatus == "pending" ||
                                orderstatus == "pendingbuyerconfirmation") && (
                                <Text
                                  style={{
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: 15,
                                    marginBottom: 20,
                                    marginTop: 10,
                                  }}
                                >
                                  Your funds will remain pending until the buyer
                                  confirms the shipment is received.
                                </Text>
                              )}
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
                      )}

                      {type === "SELLER" &&
                        (orderstatus === "accepted" ||
                          orderstatus === "pendingbuyerconfirmation") &&
                        orderData?.cancelStatus != "requested" && (
                          <View
                            style={{
                              borderTopWidth: 1,
                              borderColor: "#E8E8E8",
                              paddingTop: 30,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Montserrat-Regular",
                                fontSize: 15,
                                marginBottom: 10,
                              }}
                            >
                              Consider the following tips to ensure the shipping
                              process goes as smoothly as possible.
                            </Text>
                            <TouchableOpacity
                              style={{ paddingVertical: 10, paddingLeft: 20 }}
                              onPress={() => {
                                navigation.navigate("PackingTips");
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "Montserrat-Bold",
                                  fontSize: 15,
                                  color: "#00BDAA",
                                }}
                              >
                                Packing Tips
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{ paddingVertical: 10, paddingLeft: 20 }}
                              onPress={() => {
                                navigation.navigate("DropOff", {
                                  provider:
                                    orderData?.deliveryMethod?.carrier ??
                                    independentShippingCarrier.carrier === ""
                                      ? "Carrier"
                                      : independentShippingCarrier.carrier,
                                });
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "Montserrat-Bold",
                                  fontSize: 15,
                                  color: "#00BDAA",
                                }}
                              >
                                Drop Off Instructions
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                    </>
                  )}
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

      {!orderDetail.isFetching && !RETURN_STATUS_LIST.includes(orderstatus) && (
        <>
          {type === "BUYER" ? (
            orderData?.deliveryMethod.type === "pickup" &&
            orderData?.orderStatus === "accepted" ? (
              <FooterAction
                mainButtonProperties={{
                  label: "Confirm Exchange",
                  onPress: () => {
                    setDialogVisible(true);
                    setOfferActionData({
                      title: "Confirm Exchange",
                      message:
                        "Only confirm the exchange if you’re satisfied with your item. If not cancel the order through the top right menu on the order status page.",
                      action: "cancel",
                      mainBtTitle: "Confirm Exchange",
                      secondaryBtTitle: "Cancel",
                      onSecondaryButtonPressed: () => setDialogVisible(false),
                    });
                  },
                }}
                secondaryButtonProperties={{
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
            ) : orderData?.orderStatus === "inTransit" &&
              TRACKING_CARRIERS.includes(orderData?.deliveryMethod.carrier) ? (
              <FooterAction
                mainButtonProperties={{
                  label: "Track Item",
                  onPress: () => {
                    onTrackItem(orderData);
                  },
                }}
                secondaryButtonProperties={{
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
            ) : (
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
            )
          ) : (
            isShippingStatus &&
            (orderstatus === "accepted" ||
              orderstatus === "intransit" ||
              orderstatus === "inTransit" ||
              orderstatus === "buyacceptedhomi" ||
              orderstatus === "buyacceptedind" ||
              orderstatus === "pendingbuyerconfirmation") &&
            (orderstatus === "buyacceptedhomi" ||
            orderstatus === "buyacceptedind" ||
            orderstatus === "intransit" ? (
              orderstatus === "inTransit" ? (
                TRACKING_CARRIERS.includes(
                  orderData?.deliveryMethod.carrier
                ) ? (
                  <FooterAction
                    mainButtonProperties={{
                      label: "Track Item",
                      onPress: () => {
                        onTrackItem(orderData);
                      },
                    }}
                    secondaryButtonProperties={{
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
                ) : (
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
                )
              ) : (
                <FooterAction
                  type="shipment"
                  secondaryButtonProperties={{
                    label: "View Receipt",
                    onPress: () => {
                      navigation.navigate("Receipt", {
                        data: screenDetails,
                        orderData,
                        type,
                      });
                    },
                  }}
                  mainButtonProperties={{
                    label: "Confirm Shipment",
                    onPress: () => {
                      confirmShipmentAction();
                    },
                  }}
                />
              )
            ) : orderData?.cancelStatus == "requested" ? (
              <FooterAction
                mainButtonProperties={{
                  label: "Cancellation Request",
                  onPress: () => {
                    setCancellationRequestModal(true);
                  },
                }}
              />
            ) : (
              <FooterAction
                mainButtonProperties={{
                  label: "Ship Item",
                  showLoading: shippingIsLoading,
                  disabled:
                    shippingIsLoading ||
                    homitagShippingInfoIsNotValid() ||
                    independentShippingInfoIsNotValid(),
                  onPress: handleShipItem,
                }}
                secondaryButtonProperties={{
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
            ))
          )}
        </>
      )}

      {orderstatus == "returnclosed" && (
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
      )}
      {type === "SELLER" && orderstatus == "claimfiled" && (
        <FooterAction
          mainButtonProperties={{
            label: "Claim Request",
            onPress: () => {
              navigation.navigate("ClaimOptionScreen", {
                screenDetails,
                userProductDetail,
                orderData,
                chatItem,
              });
              //setClaimRequest(true);
            },
          }}
        />
      )}

      {type === "SELLER" &&
        (orderstatus == "claimaccepted" ||
          orderstatus == "claimclosed" ||
          orderstatus == "claimdisputed") && (
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
        )}
      {type === "SELLER" &&
        orderData?.ReturnRequests &&
        orderData?.ReturnRequests[0]?.returnStatus === "requested" && (
          <FooterAction
            mainButtonProperties={{
              label: "Return Request",
              onPress: () => {
                navigation.navigate("SellerReturnRequest", {
                  post: chatItem.post,
                  sellerName: `${chatItem.sellerFirstName} ${chatItem.sellerLastName}`,
                  returnId: orderData?.ReturnRequests[0]?.id,
                  chatItem,
                });
              },
            }}
          />
        )}
      {type === "BUYER" &&
        (orderData?.ReturnRequests?.[0]?.returnStatus == "labelShared" ||
          orderData?.ReturnRequests?.[0]?.returnStatus == "labelSharedInd") && (
          <FooterAction
            secondaryButtonProperties={{
              label: "View Label",
              onPress: () => {
                setShippingLabelModal(
                  orderData?.ReturnRequests?.[0]?.labelData
                );
              },
            }}
            mainButtonProperties={{
              label: "Confirm Shipment",
              onPress: async () => {
                await actions.updateReturn({
                  returnId: orderData?.ReturnRequests?.[0]?.id,
                  orderId,
                  params: {
                    shippedAt: moment().format(),
                    returnStatus: "returnshipped",
                  },
                });
                showConfirmShipmentModal(true);
              },
            }}
          />
        )}
      {type === "BUYER" &&
        (orderData?.ReturnRequests?.[0]?.returnStatus == "returnshipped" ||
          orderData?.ReturnRequests?.[0]?.returnStatus == "returned") && (
          <FooterAction
            secondaryButtonProperties={null}
            mainButtonProperties={{
              label: "View Return Receipt",
              onPress: () => {
                navigation.navigate("Receipt", {
                  data: screenDetails,
                  orderData,
                  type,
                });
              },
            }}
          />
        )}
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
