import React, { useState } from 'react';
import moment from 'moment';
import {
  Image,
  View,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {
  InputText,
} from "#components";
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
import { FooterAction, Icon } from '#components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { denyCancellation, acceptCancellation } from '#modules/Orders/actions';
import { useActions } from '#utils';
import { currencyFormatter } from '#utils';
import {renderSellerCalculations} from '../../renderCalculation';
import ScreenLoader from '#components/Loader/ScreenLoader';
import { SweetAlert } from '#components';

const { width } = Dimensions.get('window');

const CancellationRequested = ({
  orderData: orderDetails,
  updateOrderData,
  setLoader,
  loader,
  storeName
}) => {
  const orderData = orderDetails ? orderDetails : orderJSON;
  const [cancellationRequestModal, setCancellationRequestModal] =
    useState(false);
  const [deniedScreen, setDeniedScreen] = useState(false);
  const [denyRequestText, setDenyRequestText] = useState('');
  const actions = useActions({
    denyCancellation,
    acceptCancellation,
  });
  const [alertContent, setAlertContent] = useState({
    title: '',
    message: '',
    type: 'success',
    visible: false,
  });

  const onAlertModalTouchOutside = () => {
    setLoader(true)
    setAlertContent({
      title: '',
      message: '',
      type: 'success',
      visible: false,
    })
    setTimeout(() => {
      setCancellationRequestModal(false);
      setDeniedScreen(false);
      setLoader(false)
    }, 3995);
    setTimeout(() => {
      updateOrderData();
    }, 4000);
  };

  const renderCancellationModal = () => {
    return (
      <>
      <Modal
        animationType="slide"
        onRequestClose={() => {
          setCancellationRequestModal(false);
          setDeniedScreen(false);
        }}
        visible={cancellationRequestModal}
      >
        <SafeAreaView style={styles.mainContainer}>
          {loader && <ScreenLoader />}
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View style={styles.mainHeader}>
              <Text />
              <Text style={styles.mainHeaderTxt}>Cancellation Request</Text>
              <Ionicons
                onPress={() => {
                  setCancellationRequestModal(false);
                  setDeniedScreen(false);
                }}
                name="close"
                size={25}
                color="#969696"
              />
            </View>
            <ProductDetails
              productTitle={orderData?.productInfo?.title}
              productThumbnail={orderData?.productInfo?.image}
              productManufacturer={orderData?.sellerInfo?.name}
            />
            <Text
              onPress={() => {
                setCancellationRequestModal(false);
                setDeniedScreen(false);
              }}
              style={styles.viewOrderTxt}
            >
              VIEW ORDER DETAILS
            </Text>
            <View style={styles.sepLine} />
            {deniedScreen ? (
              <>
                <Text style={styles.denyTxt}>Deny Request Details</Text>
                <View style={{marginHorizontal: 20}}>
                <InputText
                    placeholder="Type Here"
                    fullWidth
                    textAlign="left"
                    value={denyRequestText}
                    onChangeText={text => {
                      setDenyRequestText(text);
                    }}
                    maxLength={500}
                    returnKeyType="done"
                    multiline
                    numberOfLines={6}
                    style={{ fontSize: 15 }}
                  />
                  </View>
                {/* <TextInput
                  placeholder="Add Comment Here"
                  style={styles.commentInput}
                  numberOfLines={5}
                  maxLength={1500}
                  value={denyRequestText}
                  onChangeText={text => {
                    setDenyRequestText(text);
                  }}
                /> */}
              </>
            ) : (
              <>
                <Text style={styles.cancellationRespond}>
                  {`Please respond to this cancellation request by \n ${moment(
                    orderData?.createdAt,
                  )
                    .add(3, 'days')
                    .format('DD MMM')} .`}
                </Text>

                <Text style={styles.cancellationDetailsTxt}>
                  Cancellation Details
                </Text>
                <View style={styles.cancellationDetailContainer}>
                  <Text style={styles.commentBox}>
                    {orderData?.cancelRequest?.buyerComment}
                  </Text>
                </View>
                <View style={styles.sepLine2} />
                <Text style={styles.waysToRespTxt}>Ways to Respond</Text>
                <View style={styles.waysToRespBox}>
                  <View style={[styles.contentItemConainer]}>
                    <TouchableOpacity
                      onPress={() => {
                        actions.acceptCancellation({
                          orderId: orderData.id,
                          cancellationId: orderData?.cancelRequest?.id,
                          params: {},
                        });
                        setAlertContent({
                          title: `You’ve successfully cancelled the transaction for ${orderData?.productInfo?.title}.`,
                          message: 'The buyer’s funds will be released immediately and you’re free to sell this item to other members',
                          type: 'success',
                          visible: true,
                        })
                      }}
                    >
                      <View style={styles.contentItemHeader}>
                        <Text style={styles.itemHeaderText}>
                          {'Cancel Order'}
                        </Text>
                      </View>
                      <View style={styles.contentIconContainer}>
                        <Icon
                          icon={'option_tick_icon'}
                          style={{
                            width: 24,
                            height: 30,
                          }}
                        />
                      </View>
                      <View style={styles.itemDetailContainer}>
                        <Text style={styles.itemDetailText}>
                          Accept this request to cancel the transaction and
                          release the funds back to the buyer.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.contentItemConainer]}>
                    <TouchableOpacity
                      onPress={() => {
                        setDeniedScreen(true);
                      }}
                    >
                      <View style={styles.contentItemHeader}>
                        <Text style={styles.itemHeaderText}>{'Decline'}</Text>
                      </View>
                      <View style={styles.contentIconContainer}>
                        <Icon
                          icon={'option_close_icon'}
                          style={{
                            height: 30,
                            width: 50,
                          }}
                        />
                      </View>
                      <View style={styles.itemDetailContainer}>
                        <Text style={styles.itemDetailText}>
                          Deny this request to proceed with the transaction. The
                          seller may request a return once they receive the
                          item.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
          {deniedScreen ? (
            <FooterAction
              mainButtonProperties={{
                label: 'Deny Cancellation',
                disabled: !denyRequestText,
                onPress: () => {
                  setLoader(true)
                  actions.denyCancellation({
                    orderId: orderData.id,
                    cancellationId: orderData?.cancelRequest?.id,
                    params: {
                      sellerDeclineReason: 'itemhasshipped',
                      sellerComment: denyRequestText,
                    },
                  });
                  setTimeout(() => {
                    setCancellationRequestModal(false);
                    setDeniedScreen(false);
                    setLoader(false)
                  }, 3900);
                  setTimeout(() => {
                    updateOrderData();
                  }, 4000);
                },
              }}
            />
          ) : null}
        </SafeAreaView>
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible}
        onTouchOutside={onAlertModalTouchOutside}
        onDone={onAlertModalTouchOutside}
      />
      </Modal>
      </>
    );
  };

  return (
    <>
      <ScrollView>
        {renderCancellationModal()}
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
        <View style={styles.rowItemsContainer}>
          {renderSellerCalculations(orderData)}
          
          <Text style={styles.footerInfo}>
            Your funds will remain pending until the buyer confirms the shipment
            is received.
          </Text>
        </View>
      </ScrollView>
      <FooterAction
        mainButtonProperties={{
          disabled: false,
          label: 'Cancellation Request',
          showLoading: false,
          onPress: () => setCancellationRequestModal(true),
        }}
        secondaryButtonProperties={null}
      />
    </>
  );
};

export default CancellationRequested;
