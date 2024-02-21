import React, { useState } from 'react';
import moment from 'moment';
import { Image, View, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import OrderDatesForCurrentStatus from '../../OrderDatesForCurrentStatus';
import styles from './styles';
import DeliveryLabelWrapper from '../../DeliveryLabelWrapper';
import ShippingAndPaymentDetails from '../../ShippingAndPaymentDetails';
import ProductDetails from '../../ProductDetails';
import OrderStatusTitle from '../../OrderStatusTitle';
import {
  orderStatusText,
  orderStatusValue,
} from '#screens/Sell/OrderStatusScreen/constants';
import { FooterAction } from '#components';
import { trackOrderById } from '#utils/trackShipment';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';
import ReturnActivity from '../../ReturnActivityPopup';
import { USER_TYPES } from '#utils/enums';
const { width } = Dimensions.get('window');

const ReturnClosed = ({ orderData, onViewReceipt, storeName }) => {
  /** This method is a getter for shipping details */
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
  const [showPopupForActivity, setShowPopupForActivity] = useState(false);

  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];
  const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData

  const onTrackItem = () => {
    trackOrderById(labelData?.carrier, labelData?.trackingId);
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
            orderStatusValue={orderStatusValue.BUYER[orderData?.order_status]}
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </TouchableOpacity>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            header={'Shipped on'}
            month={moment(orderData?.shippedAt).format('MMM')}
            day={moment(orderData?.shippedAt).format('DD')}
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
            month={moment(orderData?.deliveredAt).format('MMM')}
            day={moment(orderData?.deliveredAt).format('DD')}
            active
          />
        </View>

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
                numberOfLines={1}
                onPress={onTrackItem}
              >{`${labelData?.carrier?.toUpperCase()} ${
                labelData?.trackingId
              }`}</Text>
          )}
        </View>

        <DeliveryLabelWrapper />
        {/* Used to render shipping Address */}
        <View style={styles.orderStatusContainer}>
          <ShippingAndPaymentDetails
            leftLabel={'Ship to'}
            titleTop={orderData?.deliveryMethod?.buyerName}
            numberOfLines={3}
            topBorder={1}
            textAlignRight
            title={getShippingAddress()}
          />
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          disabled: false,
          label: 'View Receipt',
          showLoading: false,
          onPress: onViewReceipt,
        }}
        secondaryButtonProperties={null}
      />
    </>
  );
};

export default ReturnClosed;
