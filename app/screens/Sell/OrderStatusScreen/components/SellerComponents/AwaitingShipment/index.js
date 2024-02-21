import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Image,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  SafeAreaView,
} from "react-native";
import LottieView from "lottie-react-native";
import OrderDatesForCurrentStatus from "../../OrderDatesForCurrentStatus";
import styles from "./styles";
import ProductDetails from "../../ProductDetails";
import OrderStatusTitle from "../../OrderStatusTitle";
import {
  orderStatusText,
  orderStatusValue,
} from "#screens/Sell/OrderStatusScreen/constants";
import { Fonts } from "#themes";
import colors from "#themes/colors";
import RowItem from "../../RowItem";
import { Button, FooterAction, Icon } from "#components";
import { currencyFormatter } from "#utils";
import { useDispatch, useSelector } from "react-redux";
import { selectOrderData } from "#modules/Orders/selectors";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  createOffer,
  setIndependentShippingCarrier,
} from "#modules/Orders/actions";
import { shipOrder } from "#services/apiOrders";
import { useActions } from "#utils";
import { selectPostsData } from "#modules/Posts/selectors";
import IndependentCarrierSelectionScreen from "../../IndependentCarrierSelectionScreen";
import { renderSellerCalculations } from "../../renderCalculation";
import { selectUserData, userSelector } from "#modules/User/selectors";
import { Geocoder, getMapObjectFromGoogleObj } from "#utils";
import { getReturnLabelData } from "#screens/Sell/OrderStatusScreen/labelDetailsUtil";

const { width } = Dimensions.get("window");

const AwaitingShipment = ({
  orderData,
  navigation,
  updateOrderData,
  onViewReceipt,
  orderDataV1,
  isEditShipment,
  onOrderShipped,
  storeName,
}) => {
  const dispatch = useDispatch();
  const { addressListState } = useSelector(selectUserData());

  const [trackingNumberModal, showTrackingNumberModal] = useState(false);
  const [shippingIsLoading, setShippingIsLoading] = useState(false);
  const [shippedModal, showShippedModal] = useState(false);
  const [carrierModal, showCarrierModal] = useState(false);
  const [selectedReturnAddress, setSelectedReturnAddress] = useState({});

  const { independentShippingCarrier } = useSelector(selectOrderData());
  const { user } = useSelector(userSelector);

  const { postDetail } = useSelector(selectPostsData());

  const returnAddress = addressListState?.data?.find(
    (returnAddress) => returnAddress?.default
  );

  useEffect(() => {
    onSetAddress();
  }, []);

  const onSetAddress = async () => {
    if (returnAddress && Object.keys(returnAddress).length > 0) {
      setSelectedReturnAddress(returnAddress);
      return;
    } else {
      let cleaned = ("" + user?.information?.phonenumber).replace(/\D/g, "");
      const location = user?.information?.location?.geometry?.location;
      const res = await Geocoder.from(location?.lat, location?.lng);
      const parsedLocation = getMapObjectFromGoogleObj(res.results[0]);
      const getPlusCode = parsedLocation?.googleObj?.address_components?.filter(
        (item) => item?.types?.includes("plus_code")
      );

      const splitUserAddress =
        user?.information?.location?.formatted_address?.split(",");
      const removePlusCode = splitUserAddress?.filter(
        (obj) => !obj.includes(getPlusCode[0]?.long_name)
      );
      if (
        splitUserAddress?.length > 0 &&
        removePlusCode?.length > 0 &&
        parsedLocation?.postalCode &&
        parsedLocation?.country &&
        parsedLocation?.state &&
        parsedLocation?.city
      ) {
        const userAddress = {
          name: user?.information?.name || "",
          address_line_1: removePlusCode[0]?.trim() || "",
          address_line_2: "",
          city: parsedLocation?.city || "",
          state: parsedLocation?.state || "",
          zipcode: parsedLocation?.postalCode || "",
          country: parsedLocation?.country || "",
          phoneNumber: "+1" + cleaned,
        };
        setSelectedReturnAddress(userAddress);
        return;
      }
    }
  };

  //Following method returns boolean if seller entered all information required to ship item with Homitag
  const homitagShippingInfoIsNotValid = () => {
    if (orderData?.deliveryMethod?.type === "homitagshipping") {
      if (!selectedReturnAddress) {
        return true;
      }
    }
  };

  //Following method returns boolean if seller entered all information required to ship item independently
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

  const actions = useActions({
    createOffer,
    setIndependentShippingCarrier,
  });

  /** this is only consumed to populate values when in EDIT mode */
  useEffect(() => {
    const returnLabel = getReturnLabelData(orderData?.labels);
    const returnOrderData = returnLabel[returnLabel?.length - 1];
    const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData
    if (isEditShipment) {
      dispatch(
        setIndependentShippingCarrier({
          trackingId: labelData?.trackingId,
          carrier: labelData?.carrier,
        })
      );
    }
  }, [dispatch, isEditShipment, orderData]);

  const renderCarrierModal = () => {
    return (
      <Modal
        animationType="slide"
        visible={carrierModal}
        onRequestClose={() => {
          showCarrierModal(false);
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
                showCarrierModal(false);
              }}
              name="arrow-back"
              size={25}
              color="#969696"
            />
            <Text style={{ fontFamily: Fonts.family.semiBold, fontSize: 16 }}>
              Select Carrier
            </Text>
            <Text />
          </View>
          <IndependentCarrierSelectionScreen
            showCarrierModal={showCarrierModal}
          />
        </SafeAreaView>
      </Modal>
    );
  };

  const renderTrackingModal = () => {
    return (
      <Modal
        animationType="slide"
        visible={trackingNumberModal}
        onRequestClose={() => {
          showTrackingNumberModal(false);
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
                showTrackingNumberModal(false);
              }}
              name="arrow-back"
              size={25}
              color="#969696"
            />
            <Text style={{ fontFamily: Fonts.family.semiBold, fontSize: 16 }}>
              Shipping Label
            </Text>
            <Text />
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
                  Tracking Number<Text style={{ color: "red" }}>{" *"}</Text>
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
                  onChangeText={(text) => {
                    actions.setIndependentShippingCarrier({
                      carrier: independentShippingCarrier.carrier,
                      trackingId: text,
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderShippedModal = () => {
    return (
      <Modal
        animationType="fade"
        visible={shippedModal}
        onRequestClose={() => {
          showShippedModal(false);
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
                Tracking confirmed
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
                {orderData?.deliveryMethod?.type === "homitagshipping"
                  ? `We generated the shipping label. Please check your email. You can also download packing slip using three dotted menu on top corner.
                You can track your shipment through the purchase details page.
                Once the buyer confirms they’ve received your item, your funds
                will be released!`
                  : `Please check your email for packing slip. You can also download packing slip using three dotted menu on top corner.
                You can track your shipment through the purchase details page.
                Once the buyer confirms they’ve received your item, your funds
                will be released!`}
              </Text>
              <Button
                label={"Done"}
                subLabel={""}
                size="large"
                fullWidth={true}
                disabled={false}
                onPress={async () => {
                  showShippedModal(false);
                  updateOrderData();
                  actions.setIndependentShippingCarrier({
                    carrier: "",
                    trackingId: "",
                  });
                }}
                style={{ width: "100%", marginBottom: 15 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const handleShipItem = async () => {
    setShippingIsLoading(true);
    let shippingPayload;
    const trackingId = independentShippingCarrier.trackingId;
    if (orderData?.deliveryMethod?.type == "shipindependently") {
      const carrier = independentShippingCarrier.carrier;
      const returnLabel = getReturnLabelData(orderData?.labels);
      const returnOrderData = returnLabel[returnLabel?.length - 1];
      const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData
      shippingPayload = labelData?.carrier
        ? {
            trackingNumber: trackingId,
            carrier: carrier,
            labelId: labelData?.id,
          }
        : {
            trackingNumber: trackingId,
            carrier:
              carrier == "shippo" || carrier == "Shippo" ? "SHIPPO" : carrier,
          };
    } else {
      let cleaned = ("" + selectedReturnAddress?.phoneNumber).replace(
        /\D/g,
        ""
      );
      shippingPayload = {
        returnAddress: {
          name: selectedReturnAddress?.name,
          addressLine1: selectedReturnAddress?.address_line_1,
          addressLine2: selectedReturnAddress?.address_line_2 || " ",
          city: selectedReturnAddress?.city,
          state: selectedReturnAddress?.state,
          zipcode: selectedReturnAddress?.zipcode,
          country: "US",
          phoneNumber:
            selectedReturnAddress?.phoneNumber == null ? " " : "+1" + cleaned,
        },
      };
    }
    shipOrder({
      orderId: orderData.id,
      params: shippingPayload,
    })
      .then((resp) => {
        if (!resp?.error && resp.status == 200) {
          showShippedModal(true);
        } else {
          Alert.alert("Shipment Failed", resp?.result?.content?.message);
        }
      })
      .catch(() => {
        Alert.alert("Shipment Failed", "Something went wrong!");
      })
      .finally(() => {
        setShippingIsLoading(false);
        onOrderShipped();
      });
  };

  const renderPrepaidShipping = () => {
    return (
      <View style={styles.prepaidBox}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("LabelGenerator", {
              postDetail,
              provider: orderData?.deliveryMethod?.carrier,
              orderData: orderDataV1,
            });
          }}
          style={styles.prepaidReturnAddressWrap}
        >
          <Text style={styles.shipFromText}>
            Ship From <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={styles.returnAddressBox}>
            {Object.keys(selectedReturnAddress).length == 0 && (
              <Text style={styles.enterAddressTxt}>Enter a return address</Text>
            )}
            {Object.keys(selectedReturnAddress).length > 0 && (
              <View>
                <Text style={styles.returnAddressName}>
                  {selectedReturnAddress.name}
                </Text>
                <Text style={styles.returnAddressTxt}>
                  {`${selectedReturnAddress.address_line_1 || ""} ${
                    selectedReturnAddress.address_line_2 || ""
                  } \n${selectedReturnAddress.city || ""}, ${
                    selectedReturnAddress.state || ""
                  } ${selectedReturnAddress.zipcode || ""}`}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.returnAddressRightIcon}>
            <Icon icon="chevron-right" style={{ width: 20, height: 20 }} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderShipIndependentlyShipping = () => {
    return (
      <View
        style={{
          borderTopWidth: 1,
          borderColor: "#E8E8E8",
          paddingTop: 14,
        }}
      >
        <Text
          style={{
            fontFamily: Fonts.family.semiBold,
            fontSize: 15,
          }}
        >
          Add Tracking Details
        </Text>
        <Text
          style={{
            fontFamily: Fonts.family.regular,
            fontSize: 14,
            marginVertical: 10,
          }}
        >
          Provide the tracking information for your item. Both you and the buyer
          can track it in the Order Status page.
        </Text>
        <Text
          style={{
            fontFamily: Fonts.family.semiBold,
            fontSize: 15,
            marginTop: 10,
          }}
        >
          Select a carrier
          <Text style={{ color: "red" }}>{" *"}</Text>
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
          onPress={() => showCarrierModal(true)}
        >
          <Text
            style={{
              fontFamily: "Montserrat-SemiBold",
              fontSize: 14,
              color:
                independentShippingCarrier.carrier === "" ? "gray" : "black",
              textTransform:
                independentShippingCarrier.carrier === ""
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
              fontFamily: Fonts.family.semiBold,
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
          onPress={() => showTrackingNumberModal(true)}
        >
          <Text
            style={{
              fontFamily: Fonts.family.semiBold,
              fontSize: 15,
            }}
          >
            Tracking Number<Text style={{ color: "red" }}>{" *"}</Text>
          </Text>
          <Text
            style={{
              fontFamily: Fonts.family.semiBold,
              fontSize: 16,
              paddingVertical: 10,
              color:
                independentShippingCarrier.trackingId === "" ? "gray" : "black",
              paddingTop: 5,
              paddingLeft: 0,
            }}
            numberOfLines={1}
          >
            {independentShippingCarrier.trackingId
              ? independentShippingCarrier.trackingId
              : "Type Here"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];
  const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData

  const areEdittedValuesDifferent =
    independentShippingCarrier?.trackingId ===
      labelData?.trackingId &&
    independentShippingCarrier?.carrier === labelData?.carrier;

  return (
    <>
      <ScrollView>
        {renderShippedModal()}
        {renderTrackingModal()}
        {renderCarrierModal()}
        <ProductDetails
          productTitle={orderData?.productInfo?.title}
          productThumbnail={orderData?.productInfo?.image}
          productManufacturer={orderData?.sellerInfo?.name}
          storeName={storeName}
        />
        <View style={styles.orderStatusText}>
          <OrderStatusTitle
            orderStatusValue={orderStatusValue.SELLER[orderData?.order_status]}
            isLate={orderData?.isLate}
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </View>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            header={"Ship by"}
            month={moment(orderData?.shipBy).format("MMM")}
            day={moment(orderData?.shipBy).format("DD")}
          />

          <View style={styles.dash_container}>
            <Image
              source={require("../../../../../../assets/images/dash_line.png")}
              style={{ width: width / 4, height: 2.5 }}
            />
          </View>

          <OrderDatesForCurrentStatus
            header={"Deliver by"}
            month={moment(orderData?.deliverBy).format("MMM")}
            day={moment(orderData?.deliverBy).format("DD")}
          />
        </View>
        <View style={styles.rowItemsContainer}>
          {orderData?.deliveryMethod?.type == "shipindependently"
            ? renderShipIndependentlyShipping()
            : renderPrepaidShipping()}
          {renderSellerCalculations(orderData)}
          <Text style={styles.footerInfo}>
            Your funds will remain pending until the buyer confirms the shipment
            is received.
          </Text>

          <View
            style={{
              borderTopWidth: 1,
              borderColor: "#E8E8E8",
              paddingTop: 30,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.family.Regular,
                fontSize: 15,
                marginBottom: 10,
              }}
            >
              Consider the following tips to ensure the shipping process goes as
              smoothly as possible.
            </Text>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingLeft: 20 }}
              onPress={() => navigation.navigate("PackingTips")}
            >
              <Text
                style={{
                  fontFamily: Fonts.family.bold,
                  fontSize: 15,
                  color: "#00BDAA",
                }}
              >
                Packing Tips
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingLeft: 20 }}
              onPress={() =>
                navigation.navigate("DropOff", {
                  provider:
                    orderData?.deliveryMethod?.carrier ??
                    independentShippingCarrier.carrier === ""
                      ? "Carrier"
                      : independentShippingCarrier.carrier,
                })
              }
            >
              <Text
                style={{
                  fontFamily: Fonts.family.bold,
                  fontSize: 15,
                  color: "#00BDAA",
                }}
              >
                Drop Off Instructions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          disabled:
            shippingIsLoading ||
            homitagShippingInfoIsNotValid() ||
            independentShippingInfoIsNotValid() ||
            areEdittedValuesDifferent,
          label: "Ship Item",
          showLoading: shippingIsLoading,
          onPress: handleShipItem,
        }}
        secondaryButtonProperties={{
          label: "View Receipt",
          onPress: onViewReceipt,
        }}
      />
    </>
  );
};

export default AwaitingShipment;
