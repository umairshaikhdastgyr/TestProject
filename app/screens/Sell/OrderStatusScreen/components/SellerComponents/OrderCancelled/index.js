import React from "react";
import moment from "moment";
import { Image, View, Dimensions, ScrollView } from "react-native";
import OrderDatesForCurrentStatus from "../../OrderDatesForCurrentStatus";
import styles from "./styles";
import ProductDetails from "../../ProductDetails";
import OrderStatusTitle from "../../OrderStatusTitle";
import {
  orderStatusText,
  orderStatusValue,
} from "#screens/Sell/OrderStatusScreen/constants";
import RowItem from "../../RowItem";
import { FooterAction } from "#components";
import { renderSellerCalculations } from "../../renderCalculation";

const { width } = Dimensions.get("window");

import { currencyFormatter } from "#utils";
import { ORDER_STATUS } from "#utils/enums";

/** Rendered when Order is cancelled by seller and status of order is CANCELLED */
const OrderCancelled = ({ orderData, onViewReceipt, storeName }) => {
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
            orderStatusValue={orderStatusValue.SELLER[orderData?.order_status]}
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
          {renderSellerCalculations(orderData)}
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          disabled: false,
          label: "View Receipt",
          showLoading: false,
          onPress: onViewReceipt,
        }}
        secondaryButtonProperties={null}
      />
    </>
  );
};

export default OrderCancelled;
