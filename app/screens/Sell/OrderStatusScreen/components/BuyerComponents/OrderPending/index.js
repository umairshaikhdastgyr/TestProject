import React from 'react';
import moment from 'moment';
import { Image, View, Dimensions, ScrollView } from 'react-native';
import OrderDatesForCurrentStatus from '../../OrderDatesForCurrentStatus';
import styles from './styles';
import DeliveryLabelWrapper from '../../DeliveryLabelWrapper';
import ShippingAndPaymentDetails from '../../ShippingAndPaymentDetails';
import RowItem from '../../RowItem';
import ProductDetails from '../../ProductDetails';
import OrderStatusTitle from '../../OrderStatusTitle';
import {
  orderStatusText,
  orderStatusValue,
} from '#screens/Sell/OrderStatusScreen/constants';
import { FooterAction } from '#components';
import { currencyFormatter } from '#utils';
import {renderBuyerCalculations} from '../../renderCalculation';

const { width } = Dimensions.get('window');

const OrderPending = ({ orderData, onViewReceipt, storeName }) => {
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
            orderStatusValue={`${orderStatusValue.BUYER[orderData?.order_status]}`+ `${orderData?.cancelStatus === "cancelled" && orderData?.order_status === "pending" ? ' (CANCELLED)' : ''}`}
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
            title={getShippingAddress()}
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
        secondaryButtonProperties={null}
      />
    </>
  );
};

export default OrderPending;
