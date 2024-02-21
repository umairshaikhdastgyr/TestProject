import React, { useState } from "react";
import moment from "moment";
import {
  Image,
  View,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import OrderDatesForCurrentStatus from "../../OrderDatesForCurrentStatus";
import DeliveryLabelWrapper from "../../DeliveryLabelWrapper";
import styles from "./styles";
import ProductDetails from "../../ProductDetails";
import OrderStatusTitle from "../../OrderStatusTitle";
import {
  orderStatusText,
  orderStatusValue,
} from "#screens/Sell/OrderStatusScreen/constants";
import orderJSON from "./data.json";
import RowItem from "../../RowItem";
import { FooterAction } from "#components";
import { currencyFormatter } from "#utils";
import { trackOrderById } from "#utils/trackShipment";
import ShippingAndPaymentDetails from "../../ShippingAndPaymentDetails";
import ReturnActivity from "../../ReturnActivityPopup";
import { USER_TYPES } from "#utils/enums";
import {renderBuyerCalculations} from '../../renderCalculation';
import { getReturnLabelData } from "#screens/Sell/OrderStatusScreen/labelDetailsUtil";

const { width } = Dimensions.get("window");

const OrderReturnDeclined = ({ orderData: orderDetails, onViewReceipt, storeName }) => {
  const orderData = orderDetails ? orderDetails : orderJSON;

  const [showPopupForActivity, setShowPopupForActivity] = useState(false);

  const getShippingAddress = () => {
    const address = `${orderData?.deliveryMethod?.addressline1}${
      orderData?.deliveryMethod?.addressline2 &&
      ", " + orderData?.deliveryMethod?.addressline2
    }\n${
      orderData?.deliveryMethod?.city && "" + orderData?.deliveryMethod?.city
    }${
      orderData?.deliveryMethod?.state &&
      ", " + orderData?.deliveryMethod?.state
    }${
      orderData?.deliveryMethod?.zipcode &&
      " " + orderData?.deliveryMethod?.zipcode
    } `;
    return address;
  };

  const labelData = getReturnLabelData(orderData?.labels);
  const onTrackItem = (labelObj) => {
    trackOrderById(labelObj?.carrier, labelObj?.trackingId);
  };

  const showPopup = () => {
    setShowPopupForActivity(true);
  };

  return (
    <>
      <ReturnActivity
        onHide={() => setShowPopupForActivity(false)}
        isVisible={showPopupForActivity}
        orderData={orderData}
        type={USER_TYPES.BUYER}
      />
      <ScrollView>
        <ProductDetails
          productTitle={orderData?.productInfo?.title}
          productThumbnail={orderData?.productInfo?.image}
          productManufacturer={orderData?.sellerInfo?.name}
          storeName={storeName}
        />
        <TouchableOpacity onPress={showPopup} style={styles.orderStatusText}>
          <OrderStatusTitle
            orderStatusValue={orderStatusValue.BUYER[orderData?.order_status]}
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </TouchableOpacity>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            header={"Shipped on"}
            month={moment(orderData?.shippedAt).format("MMM")}
            day={moment(orderData?.shippedAt).format("DD")}
            active
          />

          <View style={styles.dash_container}>
            <Image
              source={require("../../../../../../assets/images/dash_line.png")}
              style={{ width: width / 4, height: 2.5 }}
            />
          </View>

          <OrderDatesForCurrentStatus
            header={"Deliver at"}
            month={moment(orderData?.deliveredAt).format("MMM")}
            day={moment(orderData?.deliveredAt).format("DD")}
            active
          />
        </View>
        <DeliveryLabelWrapper />

        <View style={styles.trackContatiner}>
          {labelData && labelData?.map((obj, ind) => {
            if (obj?.carrier && obj?.trackingId && labelData?.length - 1 == ind) {
              return (
                <Text
                  key={"lbl_" + ind}
                  style={styles.trackText}
                  numberOfLines={1}
                  onPress={() => onTrackItem(obj)}
                >{`${obj?.carrier?.toUpperCase()} ${obj?.trackingId}`}</Text>
              );
            }
            return <Text
            key={"lbl_" + ind}
            style={styles.trackText}
          >Tracking number not available</Text>;
          })}
        </View>

        {/* Used to render shipping Address */}
        <View style={styles.orderStatusContainer}>
          {/* Use these n times to render the total price break up */}
          <ShippingAndPaymentDetails
            leftLabel={"Ship to"}
            titleTop={orderData?.deliveryMethod?.buyerName}
            numberOfLines={3}
            topBorder={1}
            textAlignRight
            title={getShippingAddress()}
          />
          {/* Used to render payment method */}
          <ShippingAndPaymentDetails
            title={orderData?.paymentMethod?.last4 ?`**** ${orderData?.paymentMethod?.last4}`  : orderData?.paymentMethod?.type}
            txtType={"bold"}
            leftLabel={"Payment Method"}
            icon={orderData?.paymentMethod?.last4 ?orderData?.paymentMethod?.brand?.toLowerCase() : orderData?.paymentMethod?.type}
          />
        </View>
        <View style={styles.calculationContainer}>
          {renderBuyerCalculations(orderData)}
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          disabled: false,
          label: "View Receipt",
          showLoading: false,
          onPress: onViewReceipt,
        }}
      />
    </>
  );
};

export default OrderReturnDeclined;
