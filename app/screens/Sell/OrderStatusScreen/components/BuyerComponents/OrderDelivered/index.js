import React from 'react';
import moment from 'moment';
import { Image, View, Dimensions, Text, ScrollView } from 'react-native';
import OrderDatesForCurrentStatus from '../../OrderDatesForCurrentStatus';
import DeliveryLabelWrapper from '../../DeliveryLabelWrapper';
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
import {renderBuyerCalculations} from '../../renderCalculation';
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

const OrderDelivered = ({ orderData: orderDetails, onViewReceipt, storeName }) => {
  const orderData = orderDetails ? orderDetails : orderJSON;

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
            header={'Deliver at'}
            month={moment(orderData?.deliveredAt).format('MMM')}
            day={moment(orderData?.deliveredAt).format('DD')}
            active
          />
        </View>
        <DeliveryLabelWrapper />

        <View style={styles.trackContatiner}>
            {labelData && labelData?.map((obj, ind) => {
              if (obj?.carrier && obj?.trackingId) {
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
          <ShippingAndPaymentDetails
            leftLabel={'Ship to'}
            titleTop={orderData?.deliveryMethod?.buyerName}
            numberOfLines={3}
            topBorder={1}
            textAlignRight
            title={getShippingAddress(orderData?.deliveryMethod)}
          />

          {/* Used to render payment method */}
          <ShippingAndPaymentDetails
            title={orderData?.paymentMethod?.last4 ?`**** ${orderData?.paymentMethod?.last4}`  : orderData?.paymentMethod?.type}
            txtType={'bold'}
            leftLabel={'Payment Method'}
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
          disabled: false,
          label: 'View Receipt',
          showLoading: false,
          onPress: onViewReceipt,
        }}
      />
    </>
  );
};

export default OrderDelivered;
