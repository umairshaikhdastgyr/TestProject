import React from 'react';
import moment from 'moment';
import { Image, View, Dimensions, ScrollView } from 'react-native';
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
import {renderSellerCalculations} from '../../renderCalculation';

const { width } = Dimensions.get('window');

const getShippingAddress = deliveryMethod => {
  const address = `${deliveryMethod?.addressline1}${
    deliveryMethod?.addressline2 && ', ' + deliveryMethod?.addressline2
  }\n${deliveryMethod?.city && '' + deliveryMethod?.city}${
    deliveryMethod?.state && ', ' + deliveryMethod?.state
  }${deliveryMethod?.zipcode && ' ' + deliveryMethod?.zipcode} `;

  return address;
};

const OrderPending = ({ orderData: orderDetails, onViewReceipt, storeName }) => {
  const orderData = orderDetails ? orderDetails : orderJSON;

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
            orderStatusValue={orderData?.cancelStatus === "cancelled" ? 'CANCELLED' : `${orderStatusValue.SELLER[orderData?.order_status]}`}
            isLate={orderData?.isLate}
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </View>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            header={'Ship by'}
            month={moment(orderData?.shipBy).format('MMM')}
            day={moment(orderData?.shipBy).format('DD')}
          />

          <View style={styles.dash_container}>
            <Image
              source={require('../../../../../../assets/images/dash_line.png')}
              style={{ width: width / 4, height: 2.5 }}
            />
          </View>

          <OrderDatesForCurrentStatus
            header={'Deliver by'}
            month={moment(orderData?.deliverBy).format('MMM')}
            day={moment(orderData?.deliverBy).format('DD')}
          />
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
        secondaryButtonProperties={null}
      />
    </>
  );
};

export default OrderPending;
