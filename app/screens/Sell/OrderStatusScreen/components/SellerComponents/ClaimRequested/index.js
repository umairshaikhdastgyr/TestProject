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
import { useSelector } from 'react-redux';
import { selectUserData } from '#modules/User/selectors';
import { useNavigation } from '@react-navigation/native';
import ReturnActivity from '../../ReturnActivityPopup';
import { USER_TYPES } from '#utils/enums';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';
import { trackOrderById } from '#utils/trackShipment';

const { width } = Dimensions.get('window');

const ClaimRequested = ({
  orderData: orderDetails,
  screenDetails,
  chatItem,
  orderDataV1,
  storeName
}) => {
  const orderData = orderDetails ? orderDetails : orderJSON;
  const [showPopupForActivity, setShowPopupForActivity] = useState(false);

  const navigation = useNavigation();

  const { userProductDetail } = useSelector(selectUserData());

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
          type={USER_TYPES.SELLER}
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
            orderStatusValue={orderStatusValue.SELLER[orderData?.order_status]}
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
            leftLabel="Refund Amount"
            rightLabel={`${currencyFormatter.format(
              orderData?.claimRequest?.amountRequested,
            )}`}
          />
          <RowItem
            txtType="bold"
            leftLabel="Total to Refund"
            rightLabel={`${currencyFormatter.format(
              orderData?.claimRequest?.amountRequested,
            )}`}
          />
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          disabled: false,
          label: 'Claim Request',
          showLoading: false,
          onPress: () => {
            navigation.navigate('ClaimOptionScreen', {
              screenDetails,
              userProductDetail,
              orderData: orderDataV1,
              chatItem,
            });
          },
        }}
      />
    </>
  );
};

export default ClaimRequested;