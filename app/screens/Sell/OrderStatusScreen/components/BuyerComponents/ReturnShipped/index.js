import React, {useState} from 'react';
import moment from 'moment';
import { Image, View, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import OrderDatesForCurrentStatus from '../../OrderDatesForCurrentStatus';
import styles from './styles';
import ProductDetails from '../../ProductDetails';
import OrderStatusTitle from '../../OrderStatusTitle';
import { FooterAction } from '#components';
import { USER_TYPES } from '#utils/enums';
import { useNavigation } from '@react-navigation/native';
import { trackOrderById } from '#utils/trackShipment';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';
import ReturnActivity from '../../ReturnActivityPopup';

const { width } = Dimensions.get('window');

const ReturnShipped = ({ orderData,  onViewReceipt, storeName }) => {
  const navigation = useNavigation();
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
          onPress={() => {
            setShowPopupForActivity(true);
          }}
          style={styles.orderStatusText}
        >
          <OrderStatusTitle
            orderStatusValue="RETURN SHIPPED"
            orderStatusText="Return Status "
          />
        </TouchableOpacity>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            active
            header={'Shipped on'}
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
            header={'Est. Delivery'}
            month={moment(orderData?.deliverBy).format('MMM')}
            day={moment(orderData?.deliverBy).format('DD')}
          />
        </View>
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
          >
            {labelData?.carrier?.toUpperCase()} {labelData?.trackingId}
          </Text>
        )}
        
        <Text style={styles.shippedText}>
          You'll see an update once the seller receives the item. Once they
          receive it, you'll be issued your refund.
        </Text>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          label: 'View Return Receipt',
          onPress: onViewReceipt
        }}
      />
    </>
  );
};

export default ReturnShipped;
