import React from 'react';
import moment from 'moment';
import { Image, View, Modal, Text, ScrollView, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Fonts } from '#themes';
import { ORDER_STATUS, USER_TYPES } from '#utils/enums';
import { orderStatusValue } from '#screens/Sell/OrderStatusScreen/constants';
import fonts from '#themes/fonts';
import styles from './styles';

const ReturnActivity = ({ orderData, type, onHide, isVisible }) => {
  const orderStatus = orderData?.order_status;

  const returnActivities = {
    requested: 'Buyer Requested Return',
    labelShared: 'Seller Accepted Return and Shared label',
    labelsharedind: 'Seller Accepted Return and Shared label',
    returnshipped: 'Buyer Shipped Item to Seller',
    returned: 'Return Succefully Completed',
    declined: 'Seller Declined Return Request',
    closed: 'Seller Closed Return',
  };

  const ORDER_STATUS_PICKUP = {
    accepted: 'PENDING EXCHANGE',
    transactioncomplete: 'TRANSACTION COMPLETED',
  };

  const isShippingStatus = orderData?.deliveryMethod.type !== 'pickup';

  const returnObj = null;

  const showForClaims = orderData?.order_status?.includes('claim');

  return (
    <>
      <Modal animationType="slide" onRequestClose={onHide} visible={isVisible}>
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
          }}
        >
          <View />
          <Text style={{ fontFamily: fonts.family.semiBold, fontSize: 16, marginLeft: 35 }}>
            Request Details
          </Text>
          <View style={{marginRight: 15}}>
          <Ionicons onPress={onHide} name="close" size={25} color="#969696" />
          </View>
        </View>
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 25,
              justifyContent: 'center',
            }}
          >
            <Text style={styles.statusText}>Status:</Text>
            <Text style={styles.statusText2}>{`  ${
              orderData && type === USER_TYPES.BUYER
                ? orderStatusValue.BUYER[orderStatus]
                : orderStatusValue.SELLER[orderStatus]
            }`}</Text>
          </View>
          <View
            style={{
              borderBottomColor: '#E8E8E8',
              borderBottomWidth: 1,
              paddingBottom: 20,
              paddingTop: 5,
            }}
          >
            <Text style={{ fontFamily: Fonts.family.regular, fontSize: 13 }}>
              {showForClaims
                ? 'Buyer filed a claim for this order.'
                : 'The buyer sent you a return request.'}
            </Text>
          </View>
          <View
            style={{
              paddingTop: 10,
              borderBottomColor: '#E8E8E8',
              borderBottomWidth: 1,
              paddingBottom: 20,
              width: '100%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 12.5,
                alignItems: 'flex-start',
              }}
            >
              <Text style={{ fontFamily: Fonts.family.regular, fontSize: 15 }}>
                Request ID:
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: Fonts.family.regular,
                  fontSize: 13,
                  width: '40%',
                  textAlign: 'right',
                }}
              >
                {showForClaims
                  ? orderData?.claimRequest?.claimID
                  : orderData?.returnRequest?.returnID}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 12.5,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: Fonts.family.regular, fontSize: 15 }}>
                Buyer Name:
              </Text>
              <Text style={{ fontFamily: Fonts.family.regular, fontSize: 13 }}>
                {orderData?.buyerInfo?.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 12.5,
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.family.regular,
                  fontSize: 15,
                  width: '40%',
                }}
              >
                Request Reason:
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: Fonts.family.regular,
                  fontSize: 13,
                  width: '50%',
                  textAlign: 'right',
                }}
              >
                {showForClaims
                  ? orderData?.claimRequest?.claimReasonDescription
                  : orderData?.returnRequest?.returnReason?.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: '#E8E8E8',
              borderBottomWidth: 1,
              paddingVertical: 20,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <Image
              resizeMode="cover"
              source={{ uri: orderData?.productInfo?.image }}
              style={{ width: 80, height: 80, borderRadius: 10 }}
            />
            <View style={{ paddingLeft: 10, flex: 1 }}>
              <Text style={{ fontFamily: Fonts.family.semiBold, fontSize: 12 }}>
                {orderData?.productInfo?.title}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 5,
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                >
                  Date Purchased
                </Text>
                <Text
                  style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                >
                  {orderData?.createdAt
                    ? moment(orderData?.createdAt).format('DD/MM/YYYY')
                    : '-'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 5,
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                >
                  Transaction ID
                </Text>
                <Text
                  style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                >
                  {orderData?.orderID}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 5,
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                >
                  Total Paid
                </Text>
                <Text
                  style={{ fontFamily: Fonts.family.Regular, fontSize: 12 }}
                >
                  ${orderData?.calculationValues?.shippedInfo?.totalPaid}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              paddingVertical: 20,
              alignItems: 'flex-start',
            }}
          >
            <Text
              style={{
                textDecorationLine: 'underline',
                fontFamily: Fonts.family.semiBold,
                fontSize: 15,
                marginBottom: 10,
              }}
            >
              Request Activity:
            </Text>
            {orderData?.histories?.returns?.map(comm => {
              return (
                <View
                  style={{
                    paddingVertical: 10,
                    borderBottomColor: '#E8E8E8',
                    borderBottomWidth: 1,
                    width: '100%',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.family.Regular,
                      fontSize: 13,
                    }}
                  >
                    {moment(comm?.updatedAt).format('DD MMM YYYY')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.family.Regular,
                      fontSize: 13,
                    }}
                  >
                    {returnActivities[comm?.returnStatus]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.family.Regular,
                      fontSize: 13,
                    }}
                  >
                    Comment:
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.family.Regular,
                      fontSize: 13,
                    }}
                  >
                    {comm?.notes?.comment || '-'}
                  </Text>
                </View>
              );
            })}
            {orderData?.histories?.claims?.map(comm => {
              if(type === USER_TYPES.BUYER && comm?.destination!='buyer' && comm?.origin!='buyer'){
                return null
              }
              if(type === USER_TYPES.SELLER && comm?.destination!='seller' && comm?.origin!='seller'){
                return null
              }
              return (
                <View
                  style={{
                    paddingVertical: 10,
                    borderBottomColor: '#E8E8E8',
                    borderBottomWidth: 1,
                    width: '100%',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.family.Regular,
                      fontSize: 13,
                    }}
                  >
                    {moment(comm?.updatedAt).format('DD MMM YYYY')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.family.Regular,
                      fontSize: 13,
                    }}
                  >
                    {comm?.claimCommentStatusDescription}
                  </Text>

                  <Text
                    style={{
                      fontFamily: Fonts.family.Regular,
                      fontSize: 13,
                    }}
                  >
                    {'Comment:'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.family.Regular,
                      fontSize: 13,
                    }}
                  >
                    {comm?.comment || '-'}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default ReturnActivity;
