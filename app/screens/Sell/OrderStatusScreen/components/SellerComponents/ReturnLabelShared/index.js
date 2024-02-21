import React, {useState} from 'react';
import moment from 'moment';
import { Image, View, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';
import OrderDatesForCurrentStatus from '../../OrderDatesForCurrentStatus';
import styles from './styles';
import ProductDetails from '../../ProductDetails';
import OrderStatusTitle from '../../OrderStatusTitle';
import {
  orderStatusText,
  orderStatusValue,
} from '#screens/Sell/OrderStatusScreen/constants';
import orderJSON from './data.json';
import { trackOrderById } from '#utils/trackShipment';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';
import ReturnActivity from '../../ReturnActivityPopup';
import { USER_TYPES } from '#utils/enums';
const { width } = Dimensions.get('window');

const ReturnLabelShared = ({ orderData: orderDetails, orderDataV1, storeName }) => {
  const orderData = orderDetails ? orderDetails : orderJSON;

  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];
  const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData
  const [showPopupForActivity, setShowPopupForActivity] = useState(false);

  const onTrackItem = () => {
    trackOrderById(labelData.carrier, labelData.trackingId);
  };

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
            orderStatusValue={orderStatusValue.SELLER[orderData?.order_status]}
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </TouchableOpacity>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            header="Buyer Ship By"
            month={moment(orderDataV1?.ReturnRequests?.[0]?.deliverBy).format(
              'MMM',
            )}
            day={moment(orderDataV1?.ReturnRequests?.[0]?.deliverBy).format(
              'DD',
            )}
          />

          <View style={styles.dash_container}>
            <Image
              source={require('../../../../../../assets/images/dash_line.png')}
              style={{ width: width / 4, height: 2.5 }}
            />
          </View>

          <OrderDatesForCurrentStatus
            header="Est. Delivery"
            month={moment(orderDataV1?.ReturnRequests?.[0]?.deliverBy)
              .add(3, 'days')
              .format('MMM')}
            day={moment(orderDataV1?.ReturnRequests?.[0]?.deliverBy)
              .add(3, 'days')
              .format('DD')}
          />
        </View>
        <View style={styles.rowItemsContainer}>
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
              onPress={() => {
                onTrackItem();
              }}
            >
              {labelData?.carrier?.toUpperCase()} {labelData?.trackingId}
            </Text>
          )}
          {/* <Text style={styles.footerInfo}>
            This screen will update once the buyer sends the item. When you
            receive the item, please inspect it before tapping Confirm to issue
            the return.
          </Text> */}
        </View>
      </ScrollView>
    </>
  );
};

export default ReturnLabelShared;
