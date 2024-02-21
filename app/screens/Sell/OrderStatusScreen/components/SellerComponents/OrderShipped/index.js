import React from 'react';
import moment from 'moment';
import {
  Image,
  View,
  Dimensions,
  Text,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import OrderDatesForCurrentStatus from '../../OrderDatesForCurrentStatus';
import styles from './styles';
import ProductDetails from '../../ProductDetails';
import OrderStatusTitle from '../../OrderStatusTitle';
import {
  orderStatusText,
  orderStatusValue,
} from '#screens/Sell/OrderStatusScreen/constants';
import RowItem from '../../RowItem';
import orderJSON from './data.json';
import fonts from '#themes/fonts';
import { FooterAction, Icon } from '#components';
import { currencyFormatter } from '#utils';
import Clipboard from '@react-native-community/clipboard';
import {renderSellerCalculations} from '../../renderCalculation';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';

const { width } = Dimensions.get('window');

const OrderShipped = ({
  orderData: orderDetails,
  onViewReceipt,
  screenDetails,
  storeName
}) => {
  const orderData = orderDetails ? orderDetails : orderJSON;

  const TRACKING_URL = {
    FedEx:
      'https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=',
    DHL: 'https://www.logistics.dhl/us-en/home/tracking/tracking-freight.html?submit=1&tracking-id=',
    UPS: 'https://www.ups.com/track?loc=en_US&tracknum=',
    USPS: 'https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=',
  };

  const trackOrderById = (carrier, trackingId) => {
    switch (carrier) {
      case 'ups':
        Linking.openURL(TRACKING_URL.UPS + trackingId);
        break;
      case 'fedex':
        Linking.openURL(TRACKING_URL.FedEx + trackingId);
        break;
      case 'usps':
        Linking.openURL(TRACKING_URL.USPS + trackingId);
        break;
      case 'dhl':
        Linking.openURL(TRACKING_URL.DHL + trackingId);
        break;
      default:
        Alert.alert(
          'Tracking Instruction',
          `Please user tracking number: ${trackingId} on ${carrier} website tracking`,
          [
            {
              text: 'Copy tracking number',
              onPress: () => {
                Clipboard.setString(carrier);
              },
            },
          ],
        );
        break;
    }
  };
  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];
  const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData
  const onTrackItem = () => {
    trackOrderById(
      labelData?.carrier,
      labelData?.trackingId,
    );
  };

  const renderPrepaidShipping = () => {
    const selectedReturnAddress =
      screenDetails?.DeliveryMethods?.[0]?.DeliveryMethodPerPost
        ?.customProperties?.returnAddresses?.[0];
    if (!selectedReturnAddress) {
      return null;
    }
    return (
      <View style={styles.prepaidBox}>
        <View style={styles.prepaidReturnAddressWrap}>
          <Text style={styles.shipFromText}>
            Ship From <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <View style={styles.returnAddressBox}>
            {!selectedReturnAddress && (
              <Text style={styles.enterAddressTxt}>Enter a return address</Text>
            )}
            {selectedReturnAddress && (
              <View>
                <Text style={styles.returnAddressName}>
                  {selectedReturnAddress.name}
                </Text>
                <Text style={styles.returnAddressTxt}>
                  {`${selectedReturnAddress.address_line_1 || ''} ${
                    selectedReturnAddress.address_line_2 || ''
                  } \n${selectedReturnAddress.city || ''}, ${
                    selectedReturnAddress.state || ''
                  } ${selectedReturnAddress.zipcode || ''}`}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
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
            orderStatusValue={orderStatusValue.SELLER[orderData?.order_status]}
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
            header={'Deliver by'}
            month={moment(orderData?.deliverBy).format('MMM')}
            day={moment(orderData?.deliverBy).format('DD')}
          />
        </View>
        {labelData?.carrier == "" ||
        labelData?.carrier == undefined ||
        labelData?.carrier == null ||
        labelData?.trackingId == "" ||
        labelData?.trackingId == null ||
        labelData?.trackingId == undefined ? (
          <Text style={styles.trackText} numberOfLines={1}>
            Tracking number not available
          </Text>
        ) : (
          <Text
            style={styles.trackText}
            numberOfLines={1}
            onPress={onTrackItem}
          >{`${labelData?.carrier?.toUpperCase()} ${
            labelData?.trackingId
          }`}</Text>
        )}

        <View style={styles.rowItemsContainer}>
          {orderData?.deliveryMethod?.type == 'shipindependently'
            ? null
            : renderPrepaidShipping()}
          {renderSellerCalculations(orderData)}
          <Text
            style={{
              fontFamily: fonts.family.regular,
              fontSize: 15,
              marginBottom: 20,
              marginTop: 10,
            }}
          >
            Your funds will remain pending until the buyer confirms the shipment
            is received.
          </Text>
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          disabled: false,
          label: 'Track Item',
          showLoading: false,
          onPress: onTrackItem,
        }}
        secondaryButtonProperties={{
          label: 'View Receipt',
          onPress: onViewReceipt,
        }}
      />
    </>
  );
};

export default OrderShipped;
