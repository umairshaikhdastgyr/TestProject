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
import { FooterAction } from '#components';
import { currencyFormatter } from '#utils';
import { trackOrderById } from '#utils/trackShipment';
import {renderSellerCalculations} from '../../renderCalculation';
import ReturnActivity from '../../ReturnActivityPopup';
import { USER_TYPES } from '#utils/enums';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';

const { width } = Dimensions.get('window');

const OrderReturnDeclined = ({ orderData: orderDetails, onViewReceipt, storeName }) => {
  const orderData = orderDetails ? orderDetails : orderJSON;
  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];
  const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData

  const [showPopupForActivity, setShowPopupForActivity] = useState(false);

  const onTrackItem = () => {
    trackOrderById(
      labelData?.carrier,
      labelData?.trackingId,
    );
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
          type={USER_TYPES.BUYER}
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
            header={'Shipped on'}
            active
            month={moment(orderData?.shippedAt).format('MMM')}
            day={moment(orderData?.shippedAt).format('DD')}
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
            month={moment(orderData?.deliveredAt).format('MMM')}
            day={moment(orderData?.deliveredAt).format('DD')}
          />
        </View>
        <DeliveryLabelWrapper />

        {/* Used to render shipping Address */}
        <View style={styles.orderStatusContainer}>
        {labelData?.carrier == "" ||
          labelData?.carrier ==
            undefined ||
          labelData?.carrier == null ||
          labelData?.trackingId ==
            "" ||
          labelData?.trackingId ==
            null ||
          labelData?.trackingId ==
            undefined ? (
            <Text style={styles.trackText} numberOfLines={1}>
              Tracking number not available
            </Text>
          ) : (
            <Text
              style={styles.trackText}
              numberOfLines={1}
              onPress={() => {
                onTrackItem();
              }}
            >
              {labelData?.carrier?.toUpperCase()}{" "}
              {labelData?.trackingId}
            </Text>
          )}
          
          {/* Use these n times to render the total price break up */}
          <View style={styles.calculationContainer}>
            {renderSellerCalculations(orderData)}
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

export default OrderReturnDeclined;
