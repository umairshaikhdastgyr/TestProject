import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  Text,
  Alert,
  Linking,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import styles from "./styles";
import { Icon, Button, SweetDialog, SweetAlert } from "#components";
import { useDispatch, useSelector } from "react-redux";
import AppIntroSlider from "react-native-app-intro-slider";

import orderDataLocal from "./components/BuyerComponents/OrderCreated/data.json"; // JUST CHANGE THIS LOCATION AND THE STATUS WILL CHANGE
import colors from "#themes/colors";
import fonts from "#themes/fonts";
import { ORDER_STATUS, USER_TYPES } from "#utils/enums";
import SellerCancellationRequested from "./components/SellerComponents/CancellationRequested";
import BuyerOrderAccepted from "./components/BuyerComponents/OrderAccepted";
import BuyerCancellationRequested from "./components/BuyerComponents/CancellationRequested";
import BuyerCancellationDenied from "./components/BuyerComponents/CancellationDenied";
import BuyerOrderPending from "./components/BuyerComponents/OrderPending";
import OrderDelivered from "./components/BuyerComponents/OrderDelivered";
import OrderReturnDeclined from "./components/BuyerComponents/OrderReturnDeclined";
import BuyerOrderReturnCompleted from "./components/BuyerComponents/OrderReturnCompleted";
import OrderCancelled from "./components/BuyerComponents/OrderCancelled";
import SellerOrderCancelled from "./components/SellerComponents/OrderCancelled";
import SellerAwaitingShipment from "./components/SellerComponents/AwaitingShipment";
import SellerOrderCreated from "./components/SellerComponents/OrderCreated";
import BuyerOrderCreated from "./components/BuyerComponents/OrderCreated";
import SellerOrderPending from "./components/SellerComponents/OrderPending";
import SellerOrderDelivered from "./components/SellerComponents/OrderDelivered";
import SellerOrderReturnDeclined from "./components/SellerComponents/OrderReturnDeclined";
import SellerOrderReturnCompleted from "./components/SellerComponents/OrderReturnCompleted";
import SellerOrderShipped from "./components/SellerComponents/OrderShipped";
import BuyerOrderShipped from "./components/BuyerComponents/OrderShipped";
import OrderPartialShipped from "./components/BuyerComponents/OrderPartialShipped";
import BuyerReturnRequested from "./components/BuyerComponents/ReturnRequested";
import SellerReturnRequested from "./components/SellerComponents/ReturnRequested";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { selectPostsData } from "#modules/Posts/selectors";
import { apiModels } from "#services/apiModels";
import ScreenLoader from "#components/Loader/ScreenLoader";
import SellerReturnLabelShared from "./components/SellerComponents/ReturnLabelShared";
import { useActions } from "#utils";
import {
  getOrderById,
  cancelReturn,
  setIndependentShippingCarrier,
} from "#modules/Orders/actions";
import {
  closeReturn as closeReturnApi,
  resendLabel as resendLabelApi,
} from "#services/apiOrders";
import SellerReturnClosed from "./components/SellerComponents/ReturnClosed";
import BuyerReturnRequestAccepted from "./components/BuyerComponents/ReturnRequestAccepted";
import SellerReturnShipped from "./components/SellerComponents/ReturnShipped";
import BuyerReturnShipped from "./components/BuyerComponents/ReturnShipped";
import BuyerReturnClosed from "./components/BuyerComponents/ReturnClosed";
import { MORE_BUTTON_BUYER, MORE_BUTTON_SELLER } from "./constants";
import SellerClaimRequested from "./components/SellerComponents/ClaimRequested";
import BuyerClaimRequested from "./components/BuyerComponents/ClaimRequested";
import ClaimCancelPopup from "./components/CancelClaimPopup";
import SellerClaimGranted from "./components/SellerComponents/ClaimGranted";
import BuyerClaimGranted from "./components/BuyerComponents/ClaimGranted";
import { updatePostStatus } from "#modules/Sell/actions";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createOffer } from "#modules/Orders/actions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ProductDetails from "./components/ProductDetails";
import { getPostDetail } from "#modules/Posts/actions";
import { selectUserData } from "#modules/User/selectors";
import { selectOrderData } from "#modules/Orders/selectors";
import Config from "#config";
import { Colors } from "#themes";
import {
  getAddressList,
  getUserBuyList,
  getUserSellList,
} from "#modules/User/actions";
import { getSupplierDataApi } from "#services/apiCatalog";
import { getReturnLabelData } from "./labelDetailsUtil";
const { API_URL } = Config;

/** This screen is responsible for showing correct order statuses */
const OrderStatusScreen = ({ navigation, route }) => {
  const userType = route?.params?.type ?? null;
  const chatItem = route?.params?.chatItem ?? null;
  const orderId = route?.params?.orderId;
  console.log("🚀 ~ file: index.js:92 ~ OrderStatusScreen ~ orderId:", orderId);
  const screenDetailsData = route?.params?.data;
  const type = route?.params?.type;
  const screenName = route?.params?.screenName;
  const [orderData, setOrderData] = useState(null);
  const [orderDataV1, setOrderDataV1] = useState(null);
  const [showOrderLoading, setShowOrderLoading] = useState(false);
  const [screenDetails, setScreenDetails] = useState(screenDetailsData);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [orderStatus, setOrderStatus] = useState(false);
  const [showClaimCancelPopup, setShowClaimCancelPopup] = useState(false);
  const [isEditShipment, setIsEditShipment] = useState(false);
  const [shippingModal, setshippingModal] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dialogData, setDialogData] = useState({
    code: "",
    title: "",
    message: "",
    mainBtTitle: "",
    secondaryBtTitle: "",
    onPress: () => {},
    stage: "START",
  });
  const [alertStatus, setAlertStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
    alertType: "",
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [supplier, setSupplier] = useState({});
  const { information: userInfo } = useSelector(selectUserData());
  const { orderDetail } = useSelector(selectOrderData());

  const { postDetail } = useSelector(selectPostsData());
  const isFocused = useIsFocused();
  const { width } = Dimensions.get("window");

  const actions = useActions({
    getOrderById,
    cancelReturn,
    setIndependentShippingCarrier,
    createOffer,
    getPostDetail,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (orderDetail.isFetching) {
      getV2OrderDetails();
    }
    dispatch(getAddressList());
  }, [orderDetail]);

  useFocusEffect(
    useCallback(() => {
      if (postDetail.id) {
        setScreenDetails(postDetail);
      }
      if (!isFocused) {
        getV2OrderDetails();
      } else if (screenName == "ClaimDispute") {
        getV2OrderDetails();
      }
      if (Object.keys(postDetail)?.length > 0) {
        setScreenDetails(postDetail);
      }
    }, [postDetail, screenName])
  );

  /** This method toggles more menu */
  const showMore = () => {
    setShowMoreMenu(true);
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onSecondaryButtonPressed = () => {
    setDialogVisible(false);
  };

  const getV2OrderDetails = async () => {
    setShowOrderLoading(true);
    /** This will get deprecated eventually */
    const v1OrderData = await apiModels(
      `${API_URL}/orders/orders/${orderId}`,
      "GET",
      null,
      null,
      true
    );
    v1OrderData.id && setOrderDataV1(v1OrderData);

    const v2OrderData = await apiModels(
      `${API_URL}/orders/v2/orders/${orderId}`,
      "GET",
      null,
      null,
      true
    );
    if (v2OrderData.id) {
      dispatch(
        getUserBuyList(
          {
            type: "buy",
            userId: userInfo.id,
            page: 1,
          },
          1
        )
      );
      dispatch(
        getUserSellList(
          {
            type: "sell",
            userId: userInfo.id,
            page: 1,
            isDashBoard: false,
          },
          1
        )
      );
      setOrderData(v2OrderData);
      setOrderStatus(v2OrderData?.order_status);
      if (
        v2OrderData?.cancelRequest?.state == "denied" &&
        !v2OrderData?.hideCancelModal &&
        userType === USER_TYPES.BUYER
      ) {
        setModalCancel(true);
      }
    }

    setShowOrderLoading(false);
  };

  useEffect(() => {
    navigation.setParams({ showMore });
    getV2OrderDetails();
    const postId = route?.params?.postId;
    if (postId) {
      actions.getPostDetail({
        postId,
        params: {
          lat: 0,
          lng: 0,
          ...(userInfo?.id && { userId: userInfo?.id }),
        },
      });
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const supplierInfoData = await getSupplierDataApi({
        userId: screenDetailsData
          ? screenDetailsData?.userId
          : screenDetails?.userId,
      });

      if (supplierInfoData?.result?.success != false) {
        setSupplier(supplierInfoData);
      }
    };

    fetchUserInfo();
  }, [screenDetails?.userId]);

  /** Order Status Screen More button Actions */
  const onActionSheetMore = async (opt) => {
    setShowMoreMenu(false);
    switch (opt) {
      case "View Order Details":
        navigation.navigate("ViewOrderDetails", {
          type,
          orderData,
          onViewReceipt: () => onActionSheetMore("View Receipt"),
          storeName: supplier?.storefront?.name
            ? supplier?.storefront?.name
            : orderData?.sellerInfo?.name,
        });
        break;
      case "Return/Contest Item":
        navigation.navigate("Return", {
          data: screenDetails,
          order: orderDataV1,
          storeName: supplier?.storefront?.name
            ? supplier?.storefront?.name
            : orderData?.sellerInfo?.name,
        });
        break;
      case "View Label":
        setshippingModal(true);
        break;
      case "View Packing Slip":
        setshippingModal(true);
        break;
      case "Edit Shipment":
        setIsEditShipment(true);
        setOrderStatus("accepted");
        break;
      case "Cancel Claim":
        setShowClaimCancelPopup(true);
        break;
      case "Cancel Return":
        await actions.cancelReturn({
          returnId: orderData?.returnRequest?.id,
          orderId,
          params: {
            returnStatus: "cancelled",
            isBuyer: true,
            comment: "test",
          },
        });
        getV2OrderDetails();
        break;
      case "Accept Return":
        navigation.navigate("SellerReturnRequest", {
          chatItem,
          post: chatItem.post,
          returnId: orderData?.returnRequest?.id,
          sellerName: supplier?.storefront?.name
            ? supplier?.storefront?.name
            : `${chatItem.sellerFirstName} ${chatItem.sellerLastName}`,
        });
        break;
      case "File a claim":
        navigation.navigate("Claim", {
          data: screenDetails,
          order: orderDataV1,
          storeName: supplier?.storefront?.name
            ? supplier?.storefront?.name
            : orderData?.sellerInfo?.name,
        });
        break;
      case "Cancel Order":
        navigation.navigate("CancelExchange", {
          data: screenDetails,
          type: userType,
          chatItem,
          title: "Cancel Order",
          directlyCancel: true,
          storeName: supplier?.storefront?.name
            ? supplier?.storefront?.name
            : orderData?.sellerInfo?.name,
        });
        break;
      case "Request to Cancel":
        navigation.navigate("CancelExchange", {
          data: screenDetails,
          type: userType,
          title: "Request to Cancel",
          chatItem,
          storeName: supplier?.storefront?.name
            ? supplier?.storefront?.name
            : orderData?.sellerInfo?.name,
        });
        break;
      case "Edit Label":
        break;
      case "Reprint Label":
        break;
      case "Refund Buyer":
        break;
      case "Issue Refund":
        navigation.navigate("ReturnRefund", {
          post: chatItem.post,
          sellerName: `${chatItem.sellerFirstName} ${chatItem.sellerLastName}`,
          returnId: orderDataV1?.ReturnRequests?.[0]?.id,
          chatItem,
          orderObj: orderDataV1,
          screen: "orderstatus",
          storeName: supplier?.storefront?.name
            ? supplier?.storefront?.name
            : orderData?.sellerInfo?.name,
        });
        break;
      case "View Receipt":
        navigation.navigate("OrderReceipt", {
          data: screenDetails,
          orderData: orderData,
          type: userType,
          storeName: supplier?.storefront?.name
            ? supplier?.storefront?.name
            : orderData?.sellerInfo?.name,
        });
        break;
      case "Close Return":
        const returnIdToSend = orderDataV1?.id;
        const closeReturnApiResp = await closeReturnApi({
          returnId: returnIdToSend,
        });
        if (
          closeReturnApiResp?.data &&
          closeReturnApiResp?.data?.returnStatus &&
          closeReturnApiResp?.data?.returnStatus === "closed"
        ) {
          setAlertStatus({
            title: "Return Closed",
            visible: true,
            message: "This return has been closed and the buyer notified.",
            type: "success",
          });
        } else {
          Alert.alert(
            "Oops Close Return Failed",
            closeReturnApiResp?.result?.content?.message
          );
        }
        break;
      case "Resend Label":
        const returnId = orderDataV1?.ReturnRequests?.[0]?.id;
        const resendLabelResp = await resendLabelApi({ returnId });
        if (resendLabelResp?.status !== 200) {
          Alert.alert(
            "Oops Resend Label Failed",
            resendLabelResp?.result?.content?.message
          );
        } else {
          setDialogData({
            code: "draft_available",
            title: "Label sent successfully!",
            message: "Label shared successfully.",
            mainBtTitle: "Done",
            stage: "DO",
            onPress: () => {
              setDialogVisible(false);
            },
          });
          setDialogVisible(true);
        }
        break;
      case "Repost Item":
        const postStatusId = screenDetails?.PostStatus?.id;
        const postId = screenDetails.id;
        dispatch(
          updatePostStatus({
            params: { postStatusId, availableQuantity: 1 },
            postId,
          })
        );
        break;
      default:
        break;
    }
  };

  /** Process conditional More Options */
  const processMoreOptions = useMemo(() => {
    const orderStatusLocal = orderData?.order_status;
    let moreButtonOptions =
      userType === USER_TYPES.SELLER
        ? MORE_BUTTON_SELLER[orderStatusLocal]
        : MORE_BUTTON_BUYER[orderStatusLocal];

    /** Add Edit Shipment when seller shipped order using shipindepdently */
    if (
      userType === USER_TYPES.SELLER &&
      orderStatusLocal === ORDER_STATUS.SHIPPED &&
      orderData?.deliveryMethod?.type === "shipindependently" &&
      !isEditShipment &&
      !moreButtonOptions.includes("Edit Shipment")
    ) {
      moreButtonOptions = ["Edit Shipment", ...moreButtonOptions];
    }

    if (
      userType === USER_TYPES.SELLER &&
      orderData?.availableCancel &&
      !moreButtonOptions.includes("Cancel Order")
    ) {
      moreButtonOptions = ["Cancel Order", ...moreButtonOptions];
    }

    /** Add View Label when seller shipped order using prepaid shipping */
    if (
      userType === USER_TYPES.SELLER &&
      orderStatusLocal === ORDER_STATUS.SHIPPED &&
      !isEditShipment &&
      !moreButtonOptions.includes("View Label") &&
      !moreButtonOptions.includes("View Packing Slip")
    ) {
      moreButtonOptions = [
        orderData?.deliveryMethod?.type == "homitagshipping"
          ? "View Label"
          : "View Packing Slip",
        ...moreButtonOptions,
      ];
    }

    /** Add Return/Contest Item when seller delivered order */
    if (
      userType === USER_TYPES.BUYER &&
      orderData?.availableReturn &&
      !moreButtonOptions.includes("Return/Contest Item")
    ) {
      moreButtonOptions = ["Return/Contest Item", ...moreButtonOptions];
    }

    /** Add File a claim when coming from backend */
    if (
      userType === USER_TYPES.BUYER &&
      orderData?.availableClaim &&
      orderStatusLocal !== ORDER_STATUS.RETURN_RETURNED &&
      !moreButtonOptions.includes("File a claim")
    ) {
      moreButtonOptions = ["File a claim", ...moreButtonOptions];
    }
    if (
      userType === USER_TYPES.BUYER &&
      orderData?.availableClaim &&
      orderStatusLocal === ORDER_STATUS.RETURN_RETURNED
    ) {
      moreButtonOptions = [...moreButtonOptions];
    }

    /** Remove refund option if already refunded */
    if (
      userType === USER_TYPES.SELLER &&
      orderStatusLocal === ORDER_STATUS.RETURN_COMPLETED &&
      orderData?.returnRequest?.returnStatus !== "refundedreturned" &&
      !moreButtonOptions.includes("Issue Refund")
    ) {
      moreButtonOptions = ["Issue Refund", ...moreButtonOptions];
    }

    if (
      userType === USER_TYPES.SELLER &&
      orderStatusLocal === ORDER_STATUS.RETURN_RETURNED &&
      orderData?.returnRequest?.returnStatus !== "refundedreturned" &&
      !moreButtonOptions.includes("Issue Refund")
    ) {
      moreButtonOptions = ["Issue Refund", ...moreButtonOptions];
    }

    /** Remove refund option if already refunded */
    if (
      userType === USER_TYPES.SELLER &&
      orderStatusLocal === ORDER_STATUS.CLAIM_FILED &&
      orderData?.returnRequest?.returnStatus === "requested" &&
      !moreButtonOptions.includes("Accept Return")
    ) {
      moreButtonOptions = ["Accept Return", ...moreButtonOptions];
    }

    return moreButtonOptions;
  }, [orderData, userType, isEditShipment]);

  /** This method will show shipped modal in case of prepaid shipping */
  const renderLabelModal = () => {
    const returnLabel = getReturnLabelData(orderData?.labels);
    const returnOrderData = returnLabel[returnLabel?.length - 1];
    return (
      <Modal
        animationType="slide"
        visible={shippingModal ? true : false}
        onRequestClose={() => {
          setshippingModal(false);
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
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
                setshippingModal(false);
              }}
              name="arrow-back"
              size={25}
              color="#969696"
            />
            <Text
              style={{
                fontFamily: fonts.family.semiBold,
                textTransform: "capitalize",
                fontSize: 16,
              }}
            >
              {returnOrderData?.carrier} Tracking & Packing slip
            </Text>
            <Text />
          </View>
          <View
            style={{
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <AppIntroSlider
              paginationStyle={{ marginBottom: 50 }}
              activeDotStyle={{
                backgroundColor: colors.active,
              }}
              showNextButton={false}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      alignItems: "center",
                      flex: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <Image
                      source={
                        item?.source?.split("pdf")?.length > 1
                          ? require("../../../assets/images/pdficon.png")
                          : {
                              uri: item?.source,
                            }
                      }
                      resizeMode="contain"
                      style={{
                        width: width,
                        height: "85%",
                      }}
                    />
                    <Button
                      label={"Download"}
                      subLabel={""}
                      size="large"
                      fullWidth={true}
                      disabled={false}
                      onPress={() => {
                        Linking.openURL(item.source);
                      }}
                      style={{ width: "90%", marginBottom: 10 }}
                    />
                  </View>
                );
              }}
              slides={
                orderData?.deliveryMethod?.type == "homitagshipping"
                  ? [
                      {
                        key: "intro1",
                        source: returnOrderData?.labelImge,
                      },
                      {
                        key: "intro2",
                        source: `https://homitag-packing-slips.s3.us-west-2.amazonaws.com/Order_Packing_Slip_${orderData.orderID}.pdf`,
                      },
                    ]
                  : [
                      {
                        key: "intro2",
                        source: `https://homitag-packing-slips.s3.us-west-2.amazonaws.com/Order_Packing_Slip_${orderData.orderID}.pdf`,
                      },
                    ]
              }
            />
            {/* <ScrollView
            horizontal
            contentContainerStyle={{ flexDirection: "row" }}
          >

            <Image
              source={{
                uri: `https://homitag-gateway-prod.herokuapp.com/orders/orders/${orderData.id}/packing?type=image&origin=suppliers&shipped=false`,
              }}
              resizeMode="contain"
              style={{ width: width, height: "85%" }}
            />
          </ScrollView> */}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  /** Cancellation Denied Modal */
  const renderCancellationDeniedModal = () => {
    return (
      <Modal
        animationType="slide"
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
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.deniedModalHeaderContainer}>
            <Text />
            <Text style={styles.deniedModalHeaderText}>
              {" "}
              Cancellation Request
            </Text>
            <MaterialIcons
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
            <ProductDetails
              productTitle={orderData?.productInfo?.title}
              productThumbnail={orderData?.productInfo?.image}
              productManufacturer={orderData?.sellerInfo?.name}
            />
            <View style={styles.denyReasonContainer}>
              <Text style={styles.denyReasonText}>
                {`${orderData?.sellerInfo?.name} declined your cancellation request. Your order will proceed as planned.`}
              </Text>
            </View>
            <Text style={styles.denyReasonTextSeller}>
              Reason for declining:
            </Text>
            <View style={styles.denyReasonBox}>
              <Text style={styles.denyReasonValue}>
                {orderData?.cancelRequest?.sellerComment}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  /** This method is a renderer for rendering More menu options */
  const renderMoreButton = () => {
    return (
      <Modal
        animationType="fade"
        visible={showMoreMenu}
        onRequestClose={() => {
          setShowMoreMenu(false);
        }}
        transparent
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#00000080",
            justifyContent: "flex-end",
          }}
        >
          {processMoreOptions.map((opt, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={"moreBtn" + index}
              onPress={() => {
                onActionSheetMore(opt);
              }}
              style={{
                width: "100%",
                padding: 20,
                backgroundColor:
                  opt.toLowerCase() === "cancel" ? "#FF5656" : "#fff",
                borderBottomWidth: 1,
                borderBottomColor: "#efefef",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: fonts.family.semiBold,
                  color: opt.toLowerCase() === "cancel" ? "white" : "black",
                }}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </SafeAreaView>
      </Modal>
    );
  };

  const renderClaimCancelPopup = () => {
    return (
      <ClaimCancelPopup
        isVisible={showClaimCancelPopup}
        onHide={() => {
          setShowClaimCancelPopup(false);
          setTimeout(() => {
            getV2OrderDetails();
            setLoader(false);
            setAlertStatus({
              title: `Your claim for ${orderData?.productInfo?.title} has been successfully cancelled.`,
              visible: true,
              message: "We’ll notify the seller of your cancellation too.",
              type: "success",
            });
          }, 3000);
        }}
        orderData={orderDataV1}
        orderId={orderId}
        setLoader={setLoader}
      />
    );
  };

  /** This method is a renderer for rendering **SELLER** order details on basis of status */
  const renderSellerOrderDetailsStatusWise = () => {
    switch (orderStatus) {
      case ORDER_STATUS.CREATED:
        return (
          <SellerOrderCreated
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
          />
        );
      case ORDER_STATUS.PENDING:
        return (
          <SellerOrderPending
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
          />
        );
      case ORDER_STATUS.CANCELLATION_REQUESTED:
        return (
          <SellerCancellationRequested
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            updateOrderData={() => getV2OrderDetails()}
            setLoader={setLoader}
            loader={loader}
          />
        );
      case ORDER_STATUS.CANCELLED:
        return (
          <SellerOrderCancelled
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
          />
        );
      case ORDER_STATUS.CANCELLATION_DENIED:
      case ORDER_STATUS.ACCEPTED:
        return (
          <SellerAwaitingShipment
            navigation={navigation}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            orderDataV1={orderDataV1}
            onOrderShipped={() => setIsEditShipment(false)}
            updateOrderData={() => getV2OrderDetails()}
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            isEditShipment={isEditShipment}
          />
        );
      case ORDER_STATUS.IN_TRANSIT:
        return (
          <SellerOrderShipped
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            orderDataV1={orderDataV1}
            screenDetailsData={screenDetailsData}
          />
        );
      case ORDER_STATUS.DELIVERED:
      case ORDER_STATUS.RETURN_CANCELLED:
        return (
          <SellerOrderDelivered
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            orderDataV1={orderDataV1}
            screenDetails={screenDetails}
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      case ORDER_STATUS.RETURN_DENIED:
        return (
          <SellerOrderReturnDeclined
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            orderDataV1={orderDataV1}
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      case ORDER_STATUS.RETURN_SHIPPED:
        return (
          <SellerReturnShipped
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
          />
        );
      case ORDER_STATUS.RETURN_RETURNED:
      case ORDER_STATUS.RETURN_COMPLETED:
        return (
          <SellerOrderReturnCompleted
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            orderDataV1={orderDataV1}
            screenDetails={screenDetails}
          />
        );
      case ORDER_STATUS.SHIPPED:
        return (
          <SellerOrderShipped
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            screenDetails={screenDetails}
          />
        );
      case ORDER_STATUS.CLAIM_FILED:
        return (
          <SellerClaimRequested
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            screenDetails={screenDetails}
            chatItem={chatItem}
            orderDataV1={orderDataV1}
          />
        );
      case ORDER_STATUS.RETURN_REQUESTED:
        return (
          <SellerReturnRequested
            chatItem={chatItem}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            orderDataV1={orderDataV1}
          />
        );
      case ORDER_STATUS.RETURN_ACCEPTED:
        return (
          <SellerReturnLabelShared
            chatItem={chatItem}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            orderDataV1={orderDataV1}
          />
        );
      case ORDER_STATUS.RETURN_CLOSED:
        return (
          <SellerReturnClosed
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      case ORDER_STATUS.CLAIM_CLOSED:
      case ORDER_STATUS.CLAIM_DISPUTED:
      case ORDER_STATUS.CLAIM_ACCEPTED:
        return (
          <SellerClaimGranted
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      default:
        return <Text>Case Unhandled SELLER! ${orderStatus}</Text>;
    }
  };

  /** This method is a renderer for rendering **BUYER** order details on basis of status */
  const renderBuyerOrderDetailsStatusWise = () => {
    switch (orderStatus) {
      case ORDER_STATUS.CREATED:
        return (
          <BuyerOrderCreated
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
          />
        );
      case ORDER_STATUS.PENDING:
        return (
          <BuyerOrderPending
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
          />
        );
      case ORDER_STATUS.ACCEPTED:
        return (
          <BuyerOrderAccepted
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
          />
        );
      case ORDER_STATUS.CANCELLATION_REQUESTED:
        return (
          <BuyerCancellationRequested
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            updateOrderData={() => getV2OrderDetails()}
          />
        );
      case ORDER_STATUS.CANCELLED:
        return (
          <OrderCancelled
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
          />
        );
      case ORDER_STATUS.CANCELLATION_DENIED:
        return (
          <BuyerCancellationDenied
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      case ORDER_STATUS.PARTIAL_SHIPPED:
        return (
          <OrderPartialShipped
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
          />
        );
      case ORDER_STATUS.SHIPPED:
        return (
          <BuyerOrderShipped
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
          />
        );
      case ORDER_STATUS.DELIVERED:
      case ORDER_STATUS.RETURN_CANCELLED:
        return (
          <OrderDelivered
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      case ORDER_STATUS.RETURN_REQUESTED:
        return (
          <BuyerReturnRequested
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            orderDataV1={orderDataV1}
          />
        );
      case ORDER_STATUS.RETURN_DENIED:
        return (
          <OrderReturnDeclined
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      case ORDER_STATUS.RETURN_SHIPPED:
        return (
          <BuyerReturnShipped
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      case ORDER_STATUS.RETURN_RETURNED:
      case ORDER_STATUS.RETURN_COMPLETED:
        return (
          <BuyerOrderReturnCompleted
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      case ORDER_STATUS.IN_TRANSIT:
        return (
          <BuyerOrderAccepted
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
          />
        );
      case ORDER_STATUS.RETURN_ACCEPTED:
        return (
          <BuyerReturnRequestAccepted
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
            orderId={orderId}
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            orderDataV1={orderDataV1}
          />
        );
      case ORDER_STATUS.RETURN_CLOSED:
        return (
          <BuyerReturnClosed
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      case ORDER_STATUS.CLAIM_FILED:
        return (
          <BuyerClaimRequested
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            screenDetails={screenDetails}
            chatItem={chatItem}
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      case ORDER_STATUS.CLAIM_CLOSED:
      case ORDER_STATUS.CLAIM_DISPUTED:
      case ORDER_STATUS.CLAIM_ACCEPTED:
        return (
          <BuyerClaimGranted
            orderData={orderData}
            storeName={
              supplier?.storefront?.name
                ? supplier?.storefront?.name
                : orderData?.sellerInfo?.name
            }
            onViewReceipt={() => {
              onActionSheetMore("View Receipt");
            }}
          />
        );
      default:
        return <Text>Case Unhandled BUYER! ${orderStatus}</Text>;
    }
  };

  /** This method is a renderer for all the order details */
  const renderOrderDetailsStatusAndUserWise = () => {
    switch (userType) {
      case USER_TYPES.BUYER:
        return renderBuyerOrderDetailsStatusWise();
      case USER_TYPES.SELLER:
        return renderSellerOrderDetailsStatusWise();
      default:
        return <Text>Case Unhandled! ${userType}</Text>;
    }
  };

  const _onRefresh = () => {
    setRefreshing(true);
    getV2OrderDetails();
  };

  useEffect(() => {
    if (!showOrderLoading) {
      setRefreshing(false);
    }
  }, [showOrderLoading]);

  const onAlertModalTouchOutside = () => {
    if (alertStatus.title == "Return Closed") {
      actions.getOrderById({ orderId });
      getV2OrderDetails();
    }
    setAlertStatus({
      title: "",
      visible: false,
      message: "",
      type: "",
    });
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

  /** Root renderer */
  const makeRender = () => {
    if (
      !orderData ||
      !orderData.id ||
      loader ||
      (showOrderLoading && !refreshing)
    ) {
      return <ScreenLoader />;
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        {processMoreOptions?.length > 1 ? renderMoreButton() : null}
        {renderClaimCancelPopup()}
        {renderLabelModal()}
        {renderCancellationDeniedModal()}
        {/* Adding a switch to identify different use cases */}
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={Colors.active}
              refreshing={refreshing}
              onRefresh={_onRefresh}
            />
          }
          contentContainerStyle={{ flex: 1 }}
        >
          {renderOrderDetailsStatusAndUserWise()}
        </ScrollView>
        <SweetAlert
          title={alertStatus.title}
          message={alertStatus.message}
          type={alertStatus.type}
          dialogVisible={alertStatus.visible}
          onTouchOutside={onAlertModalTouchOutside}
          onDone={onAlertModalTouchOutside}
          iconWidth={120}
        />
        <SweetDialog
          title={dialogData.title}
          message={dialogData.message}
          type="two"
          mainBtTitle={dialogData.mainBtTitle}
          secondaryBtTitle={dialogData.secondaryBtTitle}
          dialogVisible={dialogVisible}
          onTouchOutside={onModalTouchOutside}
          onMainButtonPressed={dialogData.onPress}
          onSecondaryButtonPressed={onSecondaryButtonPressed}
        />
      </SafeAreaView>
    );
  };

  return makeRender();
};

export default OrderStatusScreen;
