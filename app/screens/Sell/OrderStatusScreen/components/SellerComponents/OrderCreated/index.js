import React from 'react';
import moment from 'moment';
import { Image, View, Dimensions, ScrollView, Text } from 'react-native';
import OrderDatesForCurrentStatus from '../../OrderDatesForCurrentStatus';
import ShippingAndPaymentDetails from '../../ShippingAndPaymentDetails';
import styles from './styles';
import ProductDetails from '../../ProductDetails';
import OrderStatusTitle from '../../OrderStatusTitle';
import {
  orderStatusText,
  orderStatusValue,
} from '#screens/Sell/OrderStatusScreen/constants';
import orderJSON from './data.json';
import RowItem from '../../RowItem';
import { FooterAction } from '#components';
import { currencyFormatter } from '#utils';
import { trackOrderById } from '#utils/trackShipment';
import {renderSellerCalculations} from '../../renderCalculation';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';
const { width } = Dimensions.get('window');

const getShippingAddress = deliveryMethod => {
  const address = `${deliveryMethod?.addressline1}${
    deliveryMethod?.addressline2 && ', ' + deliveryMethod?.addressline2
  }\n${deliveryMethod?.city && '' + deliveryMethod?.city}${
    deliveryMethod?.state && ', ' + deliveryMethod?.state
  }${deliveryMethod?.zipcode && ' ' + deliveryMethod?.zipcode} `;

  return address;
};

const OrderCreated = ({
  orderData: orderDetails,
  onViewReceipt,
  isViewOrderDetails,
  storeName,
}) => {
  const orderData = orderDetails ? orderDetails : orderJSON;

  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];
  const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData

  const onTrackItem = () => {
    trackOrderById(labelData?.carrier, labelData?.trackingId);
  };

  const isProductDelivered = orderData?.deliveredAt !== null;
  const isProductShipped = orderData?.shippedAt !== null;

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
            isLate={orderData?.isLate}
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </View>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            active={isProductShipped}
            header={!isProductShipped ? 'Ship by' : 'Shipped on'}
            month={moment(
              isProductShipped ? orderData?.shippedAt : orderData?.shipBy,
            ).format('MMM')}
            day={moment(
              isProductShipped ? orderData?.shippedAt : orderData?.shipBy,
            ).format('DD')}
          />

          <View style={styles.dash_container}>
            <Image
              source={require('../../../../../../assets/images/dash_line.png')}
              style={{ width: width / 4, height: 2.5 }}
            />
          </View>

          <OrderDatesForCurrentStatus
            active={isProductDelivered}
            header={isProductDelivered ? 'Delivered on' : 'Deliver by'}
            month={moment(
              isProductDelivered
                ? orderData?.deliveredAt
                : orderData?.deliverBy,
            ).format('MMM')}
            day={moment(
              isProductDelivered
                ? orderData?.deliveredAt
                : orderData?.deliverBy,
            ).format('DD')}
          />
        </View>
        {(!isViewOrderDetails && labelData?.carrier == "") ||
        labelData?.carrier == undefined ||
        labelData?.carrier == null ||
        labelData?.trackingId == "" ||
        labelData?.trackingId == null ||
        labelData?.trackingId == undefined ? (
          <Text style={styles.trackText} numberOfLines={1}>
            Tracking number not available
          </Text>
        ) : (
          <Text
            style={styles.trackText}
            numberOfLines={1}
            onPress={onTrackItem}
          >{`${labelData?.carrier?.toUpperCase()} ${
            labelData?.trackingId
          }`}</Text>
        )}

        {/* Used to render shipping Address */}
        <View style={styles.orderStatusContainer}>
          <ShippingAndPaymentDetails
            leftLabel={'Ship to'}
            titleTop={orderData?.deliveryMethod?.buyerName}
            numberOfLines={3}
            topBorder={1}
            textAlignRight
            title={getShippingAddress(orderData?.deliveryMethod)}
          />

          {/* Use these n times to render the total price break up */}
          <View style={styles.calculationContainer}>
            <>
              {renderSellerCalculations(orderData)}
            </>
          </View>
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={
          isViewOrderDetails
            ? {
                disabled: false,
                label: 'Track item',
                showLoading: false,
                onPress: onTrackItem,
              }
            : {
                disabled: false,
                label: 'View Receipt',
                showLoading: false,
                onPress: onViewReceipt,
              }
        }
        secondaryButtonProperties={
          isViewOrderDetails
            ? {
                disabled: false,
                label: 'View Receipt',
                showLoading: false,
                onPress: onViewReceipt,
              }
            : null
        }
      />
    </>
  );
};

export default OrderCreated;
