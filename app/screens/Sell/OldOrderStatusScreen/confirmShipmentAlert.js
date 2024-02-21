import React, {Component} from 'react';
import {
  Text,
  Keyboard,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {Modal, ModalContent, ScaleAnimation} from 'react-native-modals';
import {Button} from '#components';

import {Colors, Fonts, Metrics} from '#themes';

export const styles = StyleSheet.create({
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

class ConfirmShipSuccessAlert extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.dialogVisible &&
      (!prevProps.dialogVisible || prevProps.dialogVisible === undefined)
    ) {
      Keyboard.dismiss();
    }
  }

  render() {
    let sourceImg = '';
    let widthImg = this.props.iconWidth ? this.props.iconWidth : 150;
    let isVisible = false;
    sourceImg = require('#assets/lottie/success.json');
    widthImg = 150;

    if (
      this.props.dialogVisible !== null ||
      this.props.dialogVisible !== undefined
    ) {
      if (this.props.dialogVisible === true) {
        isVisible = true;
      } else {
        isVisible = false;
      }
    }

    return (
      <Modal
        visible={isVisible}
        modalAnimation={
          new ScaleAnimation({
            initialValue: 0,
            useNativeDriver: true,
          })
        }
        onTouchOutside={() => this.props.onTouchOutside()}>
        <ModalContent style={styles.modalContainer}>
          <View activeOpacity={0.9} style={styles.modalTouchContainer}>
            <LottieView
              source={sourceImg}
              style={{width: widthImg, height: 90, marginBottom: -25}}
              autoPlay
              loop={false}
            />
            <Text style={styles.titleText}>Shipment confirmed!</Text>
            <Text style={[styles.msgText, this.props.messageStyle]}>
              You can track your shipment through the purchase details page.
              Once the buyer confirms they’ve received your item, your funds
              will be released!
            </Text>
          </View>

          <>
            <Button
              label="Done"
              theme="primary"
              size="large"
              fullWidth
              onPress={() => this.props.onTouchOutside()}
            />
          </>
        </ModalContent>
      </Modal>
    );
  }
}

export default ConfirmShipSuccessAlert;
