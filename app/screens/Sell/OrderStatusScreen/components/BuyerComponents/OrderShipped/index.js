import React from "react";
import moment from "moment";
import { Image, View, Dimensions, ScrollView, Text } from "react-native";
import OrderDatesForCurrentStatus from "../../OrderDatesForCurrentStatus";
import styles from "./styles";
import DeliveryLabelWrapper from "../../DeliveryLabelWrapper";
import ShippingAndPaymentDetails from "../../ShippingAndPaymentDetails";
import RowItem from "../../RowItem";
import ProductDetails from "../../ProductDetails";
import OrderStatusTitle from "../../OrderStatusTitle";
import {
  orderStatusText,
  orderStatusValue,
} from "#screens/Sell/OrderStatusScreen/constants";
import { FooterAction } from "#components";
import { currencyFormatter } from "#utils";
import { trackOrderById } from "#utils/trackShipment";
import {renderBuyerCalculations} from '../../renderCalculation';
import { getReturnLabelData } from "#screens/Sell/OrderStatusScreen/labelDetailsUtil";

const { width } = Dimensions.get("window");

const OrderShipped = ({ orderData, onViewReceipt, storeName }) => {
  /** This method is a getter for shipping details */
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

  return (
    <>
      <ScrollView>
        <ProductDetails
          productTitle={orderData?.productInfo?.title}
          productThumbnail={orderData?.productInfo?.image}
          productManufacturer={orderData?.sellerInfo?.name}
          storeName={storeName}
        />
        <View style={styles.orderStatusText}>
          <OrderStatusTitle
            orderStatusValue={orderStatusValue.BUYER[orderData?.order_status]}
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </View>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            active
            header={"Shipped on"}
            day={moment(orderData?.shippedAt).format("DD")}
            month={moment(orderData?.shippedAt).format("MMM")}
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
        <DeliveryLabelWrapper />
        {/* Used to render shipping Address */}
        <View style={styles.orderStatusContainer}>
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
          {/* Use these n times to render the total price break up */}
          <View style={styles.calculationContainer}>
            {renderBuyerCalculations(orderData)}
          </View>
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          label: "Track Item",
          onPress: () => onTrackItem(labelData?.[labelData.length - 1]),
        }}
        secondaryButtonProperties={{
          label: "View Receipt",
          onPress: onViewReceipt,
        }}
      />
    </>
  );
};

export default OrderShipped;
