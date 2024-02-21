import React, { useState } from 'react';
import moment from 'moment';
import {
  Image,
  View,
  Dimensions,
  ScrollView,
  Text,
  Linking,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OrderDatesForCurrentStatus from '../../OrderDatesForCurrentStatus';
import styles from './styles';
import DeliveryLabelWrapper from '../../DeliveryLabelWrapper';
import ProductDetails from '../../ProductDetails';
import OrderStatusTitle from '../../OrderStatusTitle';
import {
  orderStatusText,
  orderStatusValue,
} from '#screens/Sell/OrderStatusScreen/constants';
import { getOrderById, updateReturn } from '#modules/Orders/actions';
import { Button, FooterAction } from '#components';
import { useActions } from '#utils';
import BuyNowSuccessAlert from '#screens/Buy/PaymentConfirmationScreen/buynowSuccessAlert';
import { useNavigation } from '@react-navigation/native';
import fonts from '#themes/fonts';
import { trackOrderById } from '#utils/trackShipment';
import { getReturnLabelData } from '#screens/Sell/OrderStatusScreen/labelDetailsUtil';
import ReturnActivity from '../../ReturnActivityPopup';
import { USER_TYPES } from '#utils/enums';
import { Fonts } from '#themes';
const { width } = Dimensions.get('window');
import AppIntroSlider from 'react-native-app-intro-slider';
import Config from "#config";
const { API_URL } = Config;

const ReturnRequestAccepted = ({ orderData, orderDataV1, orderId, storeName }) => {
  const [confirmShipmentModal, showConfirmShipmentModal] = useState(false);
  const [shippingLabelModal, setShippingLabelModal] = useState(false);
  const [showPopupForActivity, setShowPopupForActivity] = useState(false);
  const [showReturnInstructions, setShowReturnInstructions] = useState(true);

  const navigation = useNavigation();

  const actions = useActions({
    updateReturn,
    getOrderById,
  });

  const renderLabelModal = () => {
    return (
      <Modal
        animationType="slide"
        visible={shippingLabelModal ? true : false}
        onRequestClose={() => {
          setShippingLabelModal(false);
        }}
      >
        <SafeAreaView style={{flex:1}}>
        <View
          style={{
            elevation: 3,
            backgroundColor: "#ffffff",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 15,
            flexDirection: "row",
          }}
        >
          <Ionicons
            onPress={() => {
              setShippingLabelModal(false);
            }}
            name="arrow-back"
            size={25}
            color="#969696"
          />
          <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16 }}>
            Shipping Label
          </Text>
          <Text />
        </View>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
          }}
        >
          <AppIntroSlider
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    source={
                      item.source
                        ? {
                            uri: item.source,
                          }
                        : shippingLabelModal.code === "shipindependently"
                        ? {
                            uri:
                              shippingLabelModal?.image ||
                              shippingLabelModal?.labelData,
                          }
                        : shippingLabelModal.fileExtension === "pdf"
                        ? require("../../../../../../assets/images/pdficon.png")
                        : {
                            uri:
                              shippingLabelModal?.image ||
                              shippingLabelModal?.labelImge,
                          }
                    }
                    defaultSource={require("../../../../../../assets/images/pdficon.png")}
                    resizeMode="contain"
                    style={
                      item.source?{width: width , height: "85%",}:
                      shippingLabelModal.fileExtension === "pdf"
                        ? { width: width * 0.55, height: "85%" }
                        : { width: width , height: "85%" }
                    }
                  />
                  <Button
                    label={"Download"}
                    subLabel={""}
                    size="large"
                    fullWidth={true}
                    disabled={false}
                    onPress={() => {
                      Linking.openURL(item.source||
                        shippingLabelModal?.data[0]?.image ||
                          shippingLabelModal?.data[0]?.labelImge ||
                          shippingLabelModal?.data[0]?.labelData)
                    }}
                    style={{ width: "90%", marginBottom: 10 }}
                  />
                </View>
              );
            }}
            slides={[
              {
                key: "intro1",
                source: null,
              },
              {
                key: "intro2",
                source: `${API_URL}/orders/orders/${orderData.id}/returnSlip?type=image`,
              },
            ]}
            hidePagination
          />
        </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderReturnInstructionsModal = () => {
    return (
      <Modal
        animationType="slide"
        visible={showReturnInstructions}
        onRequestClose={() => {
          setShowReturnInstructions(false);
        }}
      >
        <SafeAreaView style={{flex:1}}>
        <View
          style={{
            elevation: 3,
            backgroundColor: '#ffffff',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 15,
            flexDirection: 'row',
            marginLeft: 15,
          }}
        >
          <Ionicons
            onPress={() => {
              setShowReturnInstructions(false);
            }}
            name="arrow-back"
            size={25}
            color="#969696"
          />
          <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16, marginRight: 35 }}>
            Return Instruction
          </Text>
          <Text />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginHorizontal: 10,
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 18,
            }}
          >
            <Text style={styles.returnInstructionText}>
              The seller has accepted your request. Please see below on how to
              proceed with your return. Drop off your package within 5 days.
            </Text>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                borderRadius: 8,
                elevation: 4,
                backgroundColor: 'white',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 28,
              }}
            >
              <View
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  alignSelf: 'flex-start',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: 12,
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                  backgroundColor: '#00BDAA',
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.family.semiBold,
                    color: 'white',
                  }}
                >
                  Message from Seller:
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: Fonts.family.regular,
                  padding: 14,
                  color: '#313334',
                }}
              >
                The seller provided a return label. Please print the label and
                affix it to your package.
              </Text>
              {orderData?.returnRequest?.sellerComment && (
                <Text
                  style={{
                    fontFamily: Fonts.family.regular,
                    padding: 14,
                    color: '#00BDAA',
                    textAlign: 'left',
                  }}
                >
                  {orderData?.returnRequest?.sellerComment}
                </Text>
              )}
            </View>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                borderRadius: 8,
                elevation: 4,
                backgroundColor: 'white',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 28,
              }}
            >
              <View
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  alignSelf: 'flex-start',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: 12,
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                  backgroundColor: '#00BDAA',
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.family.semiBold,
                    color: 'white',
                  }}
                >
                  Additional Instructions:
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: Fonts.family.regular,
                  padding: 14,
                  color: '#313334',
                }}
              >
                - Place return slip inside package with the item.
                {'\n'}- Ensure there are not other labels attach to your
                package.
                {'\n'}- Affix label on the package, covering up any previous
                delivery address and barcode.
                {'\n'}- Drop this package to a{' '}
                {labelData?.carrier?.toUpperCase()} location within 5 days
              </Text>
            </View>
          </View>
        </View>
        <FooterAction
          mainButtonProperties={{
            label: 'Go to Order Status',
            onPress: () => setShowReturnInstructions(false),
          }}
        />
        </SafeAreaView>
      </Modal>
    );
  };

  const returnLabel = getReturnLabelData(orderData?.labels);
  const returnOrderData = returnLabel[returnLabel?.length - 1];
  const labelData = (returnLabel?.carrier  && returnLabel?.trackingId ) ? returnLabel : returnOrderData

  const onTrackItem = () => {
    trackOrderById(labelData.carrier, labelData.trackingId);
  };

  return (
    <>
      {renderLabelModal()}
      {renderReturnInstructionsModal()}
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
            orderStatusValue={orderStatusValue.BUYER[orderData?.order_status]}
            orderStatusText={orderStatusText[orderData?.order_status]}
          />
        </TouchableOpacity>
        <View style={styles.shippingInfo}>
          <OrderDatesForCurrentStatus
            header={'Return by'}
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
            header={'Est. Delivery'}
            month={moment(orderDataV1?.ReturnRequests?.[0]?.deliverBy)
              .add(3, 'days')
              .format('MMM')}
            day={moment(orderDataV1?.ReturnRequests?.[0]?.deliverBy)
              .add(3, 'days')
              .format('DD')}
          />
        </View>
        <DeliveryLabelWrapper />
        {/* Used to render shipping Address */}
        <View style={styles.orderStatusContainer}>
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
          <View style={styles.calculationContainer}>
            <Text style={styles.infoText}>{`Please return the item by ${moment(
              new Date(orderDataV1?.ReturnRequests?.[0]?.deliverBy),
            ).format(
              'DD/MM',
            )}. Once you’ve shipped it off, please confirm so below.`}</Text>
          </View>
        </View>
      </ScrollView>
      <FooterAction
        secondaryButtonProperties={{
          label: 'View Label',
          onPress: () => {
            setShippingLabelModal(orderDataV1?.ReturnRequests?.[0]?.labelData);
          },
        }}
        mainButtonProperties={{
          label: 'Confirm Shipment',
          onPress: async () => {
            await actions.updateReturn({
              returnId: orderDataV1?.ReturnRequests?.[0]?.id,
              orderId,
              params: {
                shippedAt: moment().format(),
                returnStatus: 'returnshipped',
              },
            });
            showConfirmShipmentModal(true);
          },
        }}
      />
      <BuyNowSuccessAlert
        dialogVisible={confirmShipmentModal}
        onDone={() => {
          showConfirmShipmentModal(false);
          navigation.goBack();
        }}
        onCTAClick={() => {}}
        goTo={() => {
          showConfirmShipmentModal(false);
          navigation.goBack();
        }}
        orderData={orderDataV1}
        module={'shippmentConfirmScreen'}
      />
    </>
  );
};

export default ReturnRequestAccepted;
