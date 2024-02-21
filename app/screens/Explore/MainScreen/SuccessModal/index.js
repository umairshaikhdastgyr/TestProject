import * as React from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import {Modal, ModalContent, ScaleAnimation} from 'react-native-modals';
import {Fonts} from '#themes';

const SuccessModal = ({isVisible, message}) => {
  const {useState} = React;

  const [sourceImg] = useState(require('#assets/lottie/success.json'));
  const [widthImg] = useState(150);

  return (
    <Modal
      visible={isVisible}
      modalAnimation={
        new ScaleAnimation({
          initialValue: 0,
          useNativeDriver: true,
        })
      }>
      <ModalContent style={styles.modalContainer}>
        <View activeOpacity={0.9} style={styles.modalTouchContainer}>
          <LottieView
            source={sourceImg}
            style={{width: widthImg, height: 90, marginBottom: -25}}
            autoPlay
            loop={false}
          />
          <Text style={[styles.msgText]}>{message}</Text>
        </View>
      </ModalContent>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: Dimensions.get('window').width - 50,
  },
  modalTouchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  msgText: {
    fontFamily: Fonts.family.Regular,
    color: '#313334',
    fontWeight: '400',
    fontSize: 14,
    marginVertical: 20,
    textAlign: 'center',
  },
});

export default SuccessModal;
