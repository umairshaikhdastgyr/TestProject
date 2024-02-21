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
import RowItem from '../../RowItem';
import { currencyFormatter } from '#utils';
import { trackOrderById } from '#utils/trackShipment';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';
import ReturnActivity from '../../ReturnActivityPopup';
import { USER_TYPES } from '#utils/enums';
const { width } = Dimensions.get('window');
import {renderSellerCalculations} from '../../renderCalculation';

const OrderReturnCompleted = ({ orderData: orderDetails, storeName }) => {
  const orderData = orderDetails ? orderDetails : orderJSON;
  const [showPopupForActivity, setShowPopupForActivity] = useState(false);
  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];
  const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData

  const onTrackItem = () => {
    trackOrderById(labelData.carrier, labelData.trackingId);
  };

  const isRefunded =
    orderData?.returnRequest?.returnStatus === 'refundedreturned';

  return (
    <>
      <ReturnActivity
        onHide={() => setShowPopupForActivity(false)}
        isVisible={showPopupForActivity}
        orderData={orderData}
        type={USER_TYPES.SELLER}
      />
      <ScrollView>
        <ProductDetails
          productTitle={orderData?.productInfo?.title}
          productThumbnail={orderData?.productInfo?.image}
          productManufacturer={orderData?.sellerInfo?.name}
          storeName={storeName}
        />
        <TouchableOpacity
          onPress={() => {
            setShowPopupForActivity(true);
          }}
          style={styles.orderStatusText}
        >
          <OrderStatusTitle
            orderStatusValue={
              isRefunded
                ? 'REFUNDED/RETURNED'
                : orderStatusValue.SELLER[orderData?.order_status]
            }
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </TouchableOpacity>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            header={'Shipped on'}
            month={moment(orderData?.returnRequest?.shippedAt||orderData?.shippedAt  ).format('MMM')}
            day={moment(orderData?.returnRequest?.shippedAt||orderData?.shippedAt).format('DD')}
            active
          />

          <View style={styles.dash_container}>
            <Image
              source={require('../../../../../../assets/images/dash_line.png')}
              style={{ width: width / 4, height: 2.5 }}
            />
          </View>

          <OrderDatesForCurrentStatus
            header={'Delivered on'}
            month={moment(orderData?.returnRequest?.deliveredAt||orderData?.deliveredAt ).format('MMM')}
            day={moment(orderData?.returnRequest?.deliveredAt||orderData?.deliveredAt ).format('DD')}
            active
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
              numberOfLines={1}
              onPress={onTrackItem}
              style={styles.trackText}
            >{`${labelData?.carrier?.toUpperCase()} ${labelData?.trackingId}`}</Text>
          )}
        </View>

        {/* Used to render shipping Address */}
        <View style={styles.orderStatusContainer}>
          {renderSellerCalculations(orderData)}
          {!isRefunded && (
            <Text style={styles.footerInfo}>
              Your funds will remain pending until the buyer confirms the
              shipment is received.
            </Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default OrderReturnCompleted;
