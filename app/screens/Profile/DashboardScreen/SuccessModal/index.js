import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {Modal, ModalContent, ScaleAnimation} from 'react-native-modals';
import {Fonts} from '#themes';
import {Button} from '#components';
import PropTypes from 'prop-types';

const SuccessModal = ({isVisible, onPress}) => {
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
      <TouchableWithoutFeedback onPress={onPress}>
        <ModalContent style={styles.modalContainer}>
          <View activeOpacity={0.9} style={styles.modalTouchContainer}>
            <LottieView
              source={sourceImg}
              style={{width: widthImg, height: 90, marginBottom: -25}}
              autoPlay
              loop={false}
            />
            <Text style={[styles.title]}>Item marked as sold</Text>
            <Text style={[styles.msgText]}>
              Congratulations on selling your item! The item status has been
              updated and taken off the market.
            </Text>
            <Button
              onPress={onPress}
              label="Done"
              size="large"
              style={{width: Dimensions.get('window').width - 120}}
            />
          </View>
        </ModalContent>
      </TouchableWithoutFeedback>
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
    fontFamily: Fonts.family.regular,
    color: '#313334',
    fontWeight: '500',
    fontSize: 15,
    marginTop: 27,
    marginBottom: 45,
    textAlign: 'center',
    lineHeight: 18,
  },
  title: {
    marginTop: 19,
    fontFamily: Fonts.family.Bold,
    fontWeight: '600',
    fontSize: 16,
  },
});

SuccessModal.defaultProps = {
  isVisible: false,
  onPress: () => [],
};

SuccessModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default SuccessModal;
