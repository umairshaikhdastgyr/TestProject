import React, { useState } from 'react';
import moment from 'moment';
import {
  Image,
  View,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import OrderDatesForCurrentStatus from '../../OrderDatesForCurrentStatus';
import DeliveryLabelWrapper from '../../DeliveryLabelWrapper';
import styles from './styles';
import ProductDetails from '../../ProductDetails';
import OrderStatusTitle from '../../OrderStatusTitle';
import {
  orderStatusText,
  orderStatusValue,
} from '#screens/Sell/OrderStatusScreen/constants';
import orderJSON from './data.json';
import { FooterAction } from '#components';
import RowItem from '../../RowItem';
import { trackOrderById } from '#utils/trackShipment';
import ReturnActivity from '../../ReturnActivityPopup';
import { USER_TYPES } from '#utils/enums';
import { currencyFormatter } from '#utils';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';

const { width } = Dimensions.get('window');

const ReturnClosed = ({ orderData: orderDetails, onViewReceipt, storeName }) => {
  const orderData = orderDetails ? orderDetails : orderJSON;

  const [showPopupForActivity, setShowPopupForActivity] = useState(false);

  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];
  const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData

  const onTrackItem = () => {
    trackOrderById(labelData.carrier, labelData.trackingId);
  };

  const showPopup = () => {
    setShowPopupForActivity(true);
  };

  return (
    <>
      <ScrollView>
        <ReturnActivity
          onHide={() => setShowPopupForActivity(false)}
          isVisible={showPopupForActivity}
          orderData={orderData}
          type={USER_TYPES.SELLER}
        />
        <ProductDetails
          productTitle={orderData?.productInfo?.title}
          productThumbnail={orderData?.productInfo?.image}
          productManufacturer={orderData?.sellerInfo?.name}
          storeName={storeName}
        />
        <TouchableOpacity onPress={showPopup} style={styles.orderStatusText}>
          <OrderStatusTitle
            orderStatusValue={orderStatusValue.SELLER[orderData?.order_status]}
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </TouchableOpacity>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            active
            header={'Shipped on'}
            month={moment(orderData?.returnRequest?.deliveredAt||orderData?.deliveredAt ).format('MMM')}
            day={moment(orderData?.returnRequest?.deliveredAt||orderData?.deliveredAt ).format('DD')}
          />

          <View style={styles.dash_container}>
            <Image
              source={require('../../../../../../assets/images/dash_line.png')}
              style={{ width: width / 4, height: 2.5 }}
            />
          </View>

          <OrderDatesForCurrentStatus
            active
            header={'Delivered on'}
            month={moment(orderData?.returnRequest?.deliveredAt||orderData?.deliveredAt ).format('MMM')}
            day={moment(orderData?.returnRequest?.deliveredAt||orderData?.deliveredAt ).format('DD')}
       
          />
        </View>
        <DeliveryLabelWrapper />

        <View style={styles.trackContatiner}>
          {labelData?.carrier == "" ||
          labelData?.carrier == undefined ||
          labelData?.carrier == null ||
          labelData?.trackingId == "" ||
          labelData?.trackingId == null ||
          labelData?.trackingId == "- undefined" ? (
            <Text style={styles.trackText} numberOfLines={1}>
              Tracking number not available
            </Text>
          ) : (
            <Text
              style={styles.trackText}
              onPress={onTrackItem}
              numberOfLines={1}
            >
              {labelData?.carrier?.toUpperCase()} {labelData?.trackingId}
            </Text>
          )}
        </View>
        <View style={styles.orderStatusContainer}>
          {/* Use these n times to render the total price break up */}
          <View style={styles.calculationContainer}>
            {/* <RowItem
              leftLabel="Buyer Refunded"
              rightLabel={`${currencyFormatter.format(
                orderData?.calculationValues?.shippedInfo?.buyerRefunded ?? 0,
              )}`}
            />
            <RowItem
              leftLabel="Shipping"
              rightLabel={`${currencyFormatter.format(
                orderData?.calculationValues?.shippedInfo?.shippingFee ?? 0,
              )}`}
            />
            <RowItem
              leftLabel="Total Refunded"
              rightLabel={`${currencyFormatter.format(
                orderData?.calculationValues?.shippedInfo?.totalRefunded ?? 0,
              )}`}
            /> */}
          </View>
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          disabled: false,
          label: 'View Receipt',
          showLoading: false,
          onPress: onViewReceipt,
        }}
      />
    </>
  );
};

export default ReturnClosed;
