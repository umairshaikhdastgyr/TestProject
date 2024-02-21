import React, { useState } from 'react';
import moment from 'moment';
import {
  View,
  Text,
  Image,
  Dimensions,
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
import { Colors } from '#themes';
import RowItem from '../../RowItem';
import { FooterAction } from '#components';
import fonts from '#themes/fonts';
import { currencyFormatter, showAlert } from '#utils';
import { useNavigation } from '@react-navigation/native';
import { trackOrderById } from '#utils/trackShipment';
import {renderSellerCalculations} from '../../renderCalculation';

const { width } = Dimensions.get('window');
import { USER_TYPES } from '#utils/enums';
import ReturnActivity from '../../ReturnActivityPopup';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';
const ReturnRequested = ({
  orderData: orderDetails,
  orderDataV1,
  chatItem,
  storeName,
}) => {
  const navigation = useNavigation();
  const [showPopupForActivity, setShowPopupForActivity] = useState(false);

  const orderData = orderDetails ? orderDetails : orderJSON;

  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];
  const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData

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
          onPress={() => setShowPopupForActivity(true)}
          style={styles.orderStatusText}
        >
          <OrderStatusTitle
            orderStatusValue={orderStatusValue?.SELLER[orderData?.order_status]}
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </TouchableOpacity>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            active
            header={'Shipped on'}
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
        <Text
          onPress={() =>
            trackOrderById(labelData.carrier, labelData.trackingId)
          }
          style={{
            textDecorationLine: 'underline',
            color: Colors.gray,
            fontSize: 14,
            fontFamily: fonts.family.Regular,
            textAlign: 'center',
            textDecorationColor: Colors.gray,
            marginBottom: 38,
          }}
        >
          {labelData.carrier?.toUpperCase()}{' '}
          {labelData.trackingId?.toUpperCase()}
        </Text>
        <View style={styles.rowItemsContainer}>
          {renderSellerCalculations(orderData)}
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          disabled: false,
          label: 'Return Request',
          showLoading: false,
          onPress: () =>
            navigation.navigate('SellerReturnRequest', {
              chatItem,
              post: chatItem.post,
              returnId: orderData?.returnRequest?.id,
              sellerName: `${chatItem.sellerFirstName} ${chatItem.sellerLastName}`,
              orderData: orderData
            }),
        }}
      />
    </>
  );
};

export default ReturnRequested;
