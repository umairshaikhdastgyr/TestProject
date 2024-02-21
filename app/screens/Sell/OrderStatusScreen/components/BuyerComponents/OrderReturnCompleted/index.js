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
import { useNavigation } from '@react-navigation/native';
import { USER_TYPES } from '#utils/enums';
import { trackOrderById } from '#utils/trackShipment';
import ReturnActivity from '../../ReturnActivityPopup';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';
import ShippingAndPaymentDetails from '../../ShippingAndPaymentDetails';
import RowItem from '../../RowItem';
import { currencyFormatter } from '#utils';
const { width } = Dimensions.get('window');
import {renderBuyerCalculations} from '../../renderCalculation';

const OrderReturnCompleted = ({
  orderData: orderDetails,
  onViewReceipt,
  storeName
}) => {
  const orderData = orderDetails ? orderDetails : orderJSON;
  const navigation = useNavigation();
  const [showPopupForActivity, setShowPopupForActivity] = useState(false);

  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];
  const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData

  const onTrackItem = () => {
    trackOrderById(labelData.carrier, labelData.trackingId);
  };

  const isRefunded =
    orderData?.returnRequest?.returnStatus === 'refundedreturned';

  const getShippingAddress = () => {
    const address = `${orderData?.deliveryMethod?.addressline1}${
      orderData?.deliveryMethod?.addressline2 &&
      ', ' + orderData?.deliveryMethod?.addressline2
    }\n${
      orderData?.deliveryMethod?.city && '' + orderData?.deliveryMethod?.city
    }${
      orderData?.deliveryMethod?.state &&
      ', ' + orderData?.deliveryMethod?.state
    }${
      orderData?.deliveryMethod?.zipcode &&
      ' ' + orderData?.deliveryMethod?.zipcode
    } `;
    return address;
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
        <TouchableOpacity
          onPress={() => setShowPopupForActivity(true)}
          style={styles.orderStatusText}
        >
          <OrderStatusTitle
            orderStatusValue={
              isRefunded
                ? 'REFUNDED/RETURNED'
                : orderStatusValue.BUYER[orderData?.order_status]
            }
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </TouchableOpacity>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            active
            header={'Shipped on'}
            month={moment(orderData?.returnRequest?.shippedAt||orderData?.shippedAt  ).format('MMM')}
            day={moment(orderData?.returnRequest?.shippedAt||orderData?.shippedAt).format('DD')}
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
              numberOfLines={1}
              onPress={onTrackItem}
              style={styles.trackLinkText}
            >{`${labelData?.carrier?.toUpperCase()} ${labelData?.trackingId}`}</Text>
          )}
        </View>
        <View style={styles.trackContatiner}>
          {isRefunded ? (
            <>
              <ShippingAndPaymentDetails
                leftLabel={'Ship to'}
                titleTop={orderData?.deliveryMethod?.buyerName}
                numberOfLines={3}
                topBorder={1}
                textAlignRight
                title={getShippingAddress()}
              />
              {/* Used to render payment method */}
              <ShippingAndPaymentDetails
                title={orderData?.paymentMethod?.last4 ?`**** ${orderData?.paymentMethod?.last4}`  : orderData?.paymentMethod?.type}
                txtType={'bold'}
                leftLabel={'Payment Method'}
                icon={orderData?.paymentMethod?.last4 ?orderData?.paymentMethod?.brand?.toLowerCase() : orderData?.paymentMethod?.type}
              />
              <View style={{ height: 12 }} />
              {renderBuyerCalculations(orderData)}
            </>
          ) : (
            <Text style={styles.trackText}>
              You'll see an update once the seller receives the item. Once they
              receive it, you'll be issue your refund.
            </Text>
          )}
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          disabled: false,
          label: 'View Return Receipt',
          showLoading: false,
          onPress: onViewReceipt
        }}
      />
    </>
  );
};

export default OrderReturnCompleted;
