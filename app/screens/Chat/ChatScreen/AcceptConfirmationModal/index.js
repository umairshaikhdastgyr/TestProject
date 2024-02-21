import * as React from 'react';
import {Text, Keyboard, View, StyleSheet, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import {Modal, ModalContent, ScaleAnimation} from 'react-native-modals';
import moment from 'moment';
import {Button} from '#components';
import Item from './Item';
import {Fonts} from '#themes';
import PropTypes from 'prop-types';

const AcceptConfirmationModal = ({
  dialogVisible,
  onTouchOutside,
  orderData,
}) => {
  const {useState, useEffect} = React;

  const [sourceImg] = useState(require('#assets/lottie/success.json'));
  const [widthImg] = useState(150);

  useEffect(() => {
    const dismissKeyboard = () => {
      if (dialogVisible) {
        Keyboard.dismiss();
      }
    };

    dismissKeyboard();
  }, []);

  // if (
  //   this.props.dialogVisible !== null
  //   || this.props.dialogVisible !== undefined
  // ) {
  //   if (this.props.dialogVisible === true) {
  //     isVisible = true;
  //   } else {
  //     isVisible = false;
  //   }
  // }
  return (
    <Modal
      visible={dialogVisible}
      modalAnimation={
        new ScaleAnimation({
          initialValue: 0,
          useNativeDriver: true,
        })
      }
      onTouchOutside={() => onTouchOutside()}>
      <ModalContent style={styles.modalContainer}>
        <View activeOpacity={0.9} style={styles.modalTouchContainer}>
          <LottieView
            source={sourceImg}
            style={{width: widthImg, height: 90, marginBottom: -25}}
            autoPlay
            loop={false}
          />
          <Text style={styles.titleText}>Success</Text>
          <Text style={[styles.msgText]}>
            Congratulations. You successfully sold a{' '}
            {orderData?.productInfo?.title}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#F5F5F5',
            paddingHorizontal: 20,
            paddingBottom: 30,
            paddingTop: 10,
            marginHorizontal: -20,
          }}>
          <Item
            leftLabel="Transaction ID:"
            txtType="bold"
            rightLabel={orderData?.orderID}
            float="left"
          />
          <Item
            leftLabel="Est. Delivery Date:"
            txtType="bold"
            rightLabel={
              orderData &&
              `${moment(orderData.shipBy).format('MM/DD')} - ${moment(
                orderData.deliverBy,
              ).format('MM/DD')}`
            }
            float="left"
            // rightLabel={moment(createdAt).format('DD/MM/YYYY')}
          />
        </View>
        <View
          activeOpacity={0.9}
          style={{marginTop: 30, paddingHorizontal: 20, marginBottom: 33}}>
          <Text style={[styles.msgText]}>
            You can check your order’s status through the chat menu. Please
            reach out to the seller if you have any questions.
          </Text>
        </View>
        <>
          {/* <Button
            label="View Receipt"
            theme="primary"
            size="large"
            fullWidth
            onPress={() => onPressReceipt()}
          /> */}

          <View style={{height: 20}} />
          <Button
            label="Done"
            theme="secondary"
            size="large"
            fullWidth
            onPress={() => onTouchOutside()}
          />
        </>
      </ModalContent>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 30,
    maxWidth: Dimensions.get('window').width - 50,
  },
  modalTouchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  titleText: {
    fontFamily: Fonts.family.semiBold,
    color: '#313334',
    fontWeight: '600',
    fontSize: 23,
    marginBottom: 10,
    textAlign: 'center',
  },
  msgText: {
    fontFamily: Fonts.family.Regular,
    color: '#313334',
    fontWeight: '400',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  chatSellerLbl: {
    fontFamily: Fonts.family.Regular,
    color: '#00BDAA',
    fontWeight: '600',
    fontSize: 13,
    // marginBottom: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

AcceptConfirmationModal.defaultProps = {
  isVisible: false,
  estimateStartDays: '',
  estimateEndDays: '',
  orderData: {
    orderID: '',
    productInfo: {
      title: '',
    },
    estimateStartDays: '',
    createdAt: '',
  },
  onTouchOutside: () => [],
  onPressReceipt: () => [],
};

AcceptConfirmationModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  orderData: PropTypes.object.isRequired,
  estimateStartDays: PropTypes.string.isRequired,
  estimateEndDays: PropTypes.string.isRequired,
  onTouchOutside: PropTypes.func.isRequired,
  onPressReceipt: PropTypes.func.isRequired,
};

export default AcceptConfirmationModal;
