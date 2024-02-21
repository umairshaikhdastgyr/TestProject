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
import styles from './styles';
import ProductDetails from '../../ProductDetails';
import OrderStatusTitle from '../../OrderStatusTitle';
import {
  orderStatusText,
  orderStatusValue,
} from '#screens/Sell/OrderStatusScreen/constants';
import orderJSON from './data.json';
import { Fonts } from '#themes';
import colors from '#themes/colors';
import RowItem from '../../RowItem';
import { FooterAction } from '#components';
import { currencyFormatter } from '#utils';
import ReturnActivity from '../../ReturnActivityPopup';
import { USER_TYPES } from '#utils/enums';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';
import { trackOrderById } from '#utils/trackShipment';

const { width } = Dimensions.get('window');

const ClaimGranted = ({ orderData: orderDetails, onViewReceipt, storeName }) => {
  const orderData = orderDetails ? orderDetails : orderJSON;
  const [showPopupForActivity, setShowPopupForActivity] = useState(false);

  const isReturnFiled = orderData?.returnRequest?.deliveredAt !== null;

  const isOrderInitiallyDelivered = orderData?.deliveredAt !== null;

  const orderNotYetReachedBuyer = !isReturnFiled && !isOrderInitiallyDelivered;

  const shippedAtReturn = orderData?.returnRequest?.shippedAt;
  const shippedAtOriginal = orderData?.shippedAt;
  const deliveredAtReturn = orderData?.returnRequest?.deliveredAt;
  const deliveredAtOriginal = orderData?.deliveredAt ?? new Date();

  const shippedAt = isReturnFiled ? shippedAtReturn : shippedAtOriginal;
  const deliveredAt = isReturnFiled ? deliveredAtReturn : deliveredAtOriginal;

  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];

  const trackingInfo = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData

  const onTrackItem = () => {
    trackOrderById(trackingInfo?.carrier, trackingInfo?.trackingId);
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center' }}>
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
            active
            header="Shipped on"
            month={moment(shippedAt).format('MMM')}
            day={moment(shippedAt).format('DD')}
          />

          <View style={styles.dash_container}>
            <Image
              source={require('../../../../../../assets/images/dash_line.png')}
              style={{ width: width / 4, height: 2.5 }}
            />
          </View>

          <OrderDatesForCurrentStatus
            active={!orderNotYetReachedBuyer}
            header={orderNotYetReachedBuyer ? 'Est. Delivery' : 'Delivered on'}
            month={
              orderNotYetReachedBuyer ? '?' : moment(deliveredAt).format('MMM')
            }
            day={
              orderNotYetReachedBuyer ? '?' : moment(deliveredAt).format('DD')
            }
          />
        </View>
        <View style={styles.trackClaimContatiner}>
          <Text
            style={[
              styles.trackText,
              {
                textDecorationLine: 'underline',
                color: colors.active,
                fontFamily: Fonts.family.semiBold,
              },
            ]}
            numberOfLines={1}
            onPress={onTrackItem}
          >
            Tracking number: {trackingInfo?.trackingId}
          </Text>
        </View>
        <View style={styles.rowItemsContainer}>
          <RowItem
            leftLabel="Refund Requested"
            rightLabel={`${currencyFormatter.format(
              orderData?.claimRequest?.amountRequested,
            )}`}
          />
          <RowItem
            txtType="bold"
            leftLabel={
              orderData?.claimRequest?.fundedBy != 'buyer'
                ? 'Total Refunded'
                : orderData?.claimRequest?.claimStatus == 'closed'
                ? 'Total Refunded'
                : 'Total to Refund'
            }
            rightLabel={`${currencyFormatter.format(
              orderData?.claimRequest?.fundedBy != 'buyer'
                ? orderData?.claimRequest?.amountRequested
                : 0,
            )}`}
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
      />
    </>
  );
};

export default ClaimGranted;
