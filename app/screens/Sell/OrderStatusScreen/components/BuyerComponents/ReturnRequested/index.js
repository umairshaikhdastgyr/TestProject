import React, {useState} from 'react';
import moment from 'moment';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import ProductDetails from '../../ProductDetails';
import OrderStatusTitle from '../../OrderStatusTitle';
import {
  orderStatusText,
  orderStatusValue,
} from '#screens/Sell/OrderStatusScreen/constants';
import { Icon } from '#components';
import { USER_TYPES } from '#utils/enums';
import ReturnActivity from '../../ReturnActivityPopup';

// https://www.figma.com/file/tFroYB9kPpWyq36t95Fm6e/Homitag_Final?node-id=581%3A128485
const ReturnRequested = ({ orderData, orderDataV1, storeName }) => {
  const responseDeadlineDate = moment(
    orderDataV1?.ReturnRequests[0]?.sellerResponseLimit,
  ).format('DD/MM');
  const [showPopupForActivity, setShowPopupForActivity] = useState(false);

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
         <TouchableOpacity onPress={()=>setShowPopupForActivity(true)} style={styles.orderStatusText}>
        
          <OrderStatusTitle
            orderStatusValue={orderStatusValue.BUYER[orderData?.order_status]}
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </TouchableOpacity>

        <View style={styles.shippingInfoContainer}>
          <View style={styles.infoHeader}>
            <Icon
              icon="package_icon_black"
              style={{ width: 20, height: 20, marginRight: 10 }}
              resizeMode="contain"
            />
            <Text style={styles.shippingInfoHeader}>Shipping Information</Text>
          </View>
          <Text style={styles.shippingInfoDetail}>
            You'll see shipping information here once the seller accepts your
            request
          </Text>
        </View>
        <View style={styles.shippingDetailContainer}>
          <Text style={styles.shippingDetailText}>
            The seller has 3 days to respond to your request. If they don't
            respond by {responseDeadlineDate} you can open a claim.
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default ReturnRequested;
