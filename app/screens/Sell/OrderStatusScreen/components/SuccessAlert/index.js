import React from 'react';
import { Text, View, Modal, Image, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import { Button } from '#components';
import PurchasedItem from '../../../../Buy/PaymentConfirmationScreen/purchased-item';
import styles from './styles';
import { ORDER_STATUS } from '#utils/enums';

const SuccessAlert = ({
  isVisible,
  onRequestClose,
  orderId,
  title,
  productThumbnail,
  shipBy,
  deliverBy,
  orderStatus,
  footerButtonTheme,
  onPressFooterButton,
  onPressHyperlink,
  hyperLinkText,
  infoText,
  onCTAClick,
}) => {
  let sourceImg = '';
  let widthImg = 170;
  sourceImg = require('#assets/lottie/success.json');
  return (
    <Modal
      visible={isVisible}
      onRequestClose={() => onRequestClose()}
      transparent={true}
    >
      <View style={styles.modalOuterContainer}>
        <View style={styles.modalContainer}>
          {orderStatus === ORDER_STATUS.CREATED && (
            <View activeOpacity={0.9} style={styles.modalTouchContainer}>
              <LottieView
                source={sourceImg}
                style={{
                  width: widthImg,
                  height: 130,
                  marginBottom: -30,
                  marginTop: -5,
                }}
                autoPlay
                loop={false}
              />
              <Text style={styles.titleText}>Success</Text>
              <Text style={[styles.msgText]}>
                Congratulations. You successfully purchased {title}
              </Text>
            </View>
          )}
          {orderStatus === ORDER_STATUS.CANCELLATION_REQUESTED && (
            <View activeOpacity={0.9} style={styles.modalTouchContainer}>
              <View
                style={{
                  elevation: 1,
                  width: 90,
                  height: 90,
                  overflow: 'hidden',
                  borderRadius: 10,
                  marginVertical: 20,
                }}
              >
                <Image
                  source={{ uri: productThumbnail }}
                  style={{ width: 90, height: 90 }}
                  resizeMode="cover"
                />
              </View>

              <Text style={[styles.msgText]}>
                Your cancellation has been requested.
              </Text>
            </View>
          )}
          {orderStatus === ORDER_STATUS.CLAIM_FILED && (
            <View activeOpacity={0.9} style={styles.modalTouchContainer}>
              <LottieView
                source={sourceImg}
                style={{ width: 300, height: 130, marginBottom: -25 }}
                autoPlay
                loop={false}
              />
              <Text style={styles.titleText}>
                {`You've successfully filled a claim for ${title}`}
              </Text>
            </View>
          )}
          {orderStatus === ORDER_STATUS.RETURN_REQUESTED && (
            <View activeOpacity={0.9} style={styles.modalTouchContainer}>
              <View
                style={{
                  elevation: 1,
                  width: 90,
                  height: 90,
                  overflow: 'hidden',
                  borderRadius: 10,
                  marginVertical: 20,
                }}
              >
                <Image
                  source={{ uri: productThumbnail }}
                  style={{ width: 90, height: 90 }}
                  resizeMode="cover"
                />
              </View>

              <Text style={[styles.msgText]}>
                Your return has been requested.
              </Text>
            </View>
          )}
          {orderStatus === ORDER_STATUS.SHIPPED && (
            <View activeOpacity={0.9} style={styles.modalTouchContainer}>
              <LottieView
                source={sourceImg}
                style={{ width: widthImg, height: 100, marginBottom: -25 }}
                autoPlay
                loop={false}
              />
              <Text style={styles.titleText}>Shipment confirmed</Text>
              <Text style={[styles.msgText]}>
                You can track your shipment through the purchase details page.
                Once the seller confirms they’ve received your item the return
                will be complete.
              </Text>
            </View>
          )}

          <View
            style={{
              backgroundColor: '#F5F5F5',
              paddingBottom: 20,
              paddingTop: 10,
              display:
                orderStatus !== ORDER_STATUS.SHIPPED &&
                orderStatus !== ORDER_STATUS.CLAIM_FILED
                  ? 'flex'
                  : 'none',
            }}
          >
            {orderStatus === ORDER_STATUS.CANCELLATION_REQUESTED ||
            orderStatus === ORDER_STATUS.RETURN_REQUESTED ? (
              <PurchasedItem
                leftLabel={title}
                txtType="bold"
                rightLabel={''}
                float="left"
              />
            ) : null}
            {orderStatus !== ORDER_STATUS.CLAIM_FILED && (
              <PurchasedItem
                leftLabel="Order ID:"
                txtType="bold"
                rightLabel={orderId}
                float="left"
              />
            )}
            {orderStatus === ORDER_STATUS.CREATED && (
              <PurchasedItem
                leftLabel="Est. Delivery Date:"
                txtType="bold"
                rightLabel={
                  shipBy &&
                  deliverBy &&
                  `${moment(shipBy).format('MM/DD')} - ${moment(
                    deliverBy,
                  ).format('MM/DD')}`
                }
                float="left"
              />
            )}
          </View>
          <View
            activeOpacity={0.9}
            style={{
              marginTop: orderStatus !== ORDER_STATUS.SHIPPED ? 20 : 0,
              paddingHorizontal: 20,
              marginBottom: 20,
            }}
          >
            {orderStatus !== ORDER_STATUS.SHIPPED && (
              <Text style={[styles.msgText]}>{infoText}</Text>
            )}

            <TouchableOpacity onPress={onPressHyperlink}>
              <Text style={styles.chatSellerLbl}>{hyperLinkText}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: '90%' }}>
            {orderStatus === ORDER_STATUS.CREATED && (
              <View style={{ width: '100%', marginBottom: 10 }}>
                <Button
                  label="View Receipt"
                  theme="primary"
                  size="large"
                  fullWidth
                  onPress={onCTAClick}
                />
              </View>
            )}
            <View style={{ width: '100%' }}>
              <Button
                label="Done"
                theme={footerButtonTheme}
                size="large"
                fullWidth
                onPress={onPressFooterButton}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessAlert;
