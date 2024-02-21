import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import {Modal, ModalContent} from 'react-native-modals';
import {flex} from '#styles/utilities';

const IndependentCarrierModalSelector = ({
  independentShippingCarrier,
  setIndependentShippingCarrier,
  otherIndependentShippingCarrier,
  setOtherIndependentShippingCarrier,
}) => {
  const [showModal, setShowModal] = useState(false);

  const [dialogStyle, setDialogStyle] = useState({borderRadius: 5});

  useEffect(() => {
    const _keyboardDidShow = () => {
      setDialogStyle({
        borderRadius: 5,
        marginBottom: Platform.OS === 'ios' ? 300 : 0,
      });
    };

    const _keyboardDidHide = () => {
      setDialogStyle({borderRadius: 5});
    };

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const toggleModal = () => setShowModal(!showModal);

  const handleChangeIndependentShippingCarrier = carrier => {
    setIndependentShippingCarrier(carrier);
    toggleModal();
  };

  const isInitialSelect = independentShippingCarrier === 'Select';

  return (
    <View style={[flex.directionRow, flex.alignItemsCenter]}>
      {independentShippingCarrier !== 'other' && (
        <TouchableOpacity onPress={toggleModal}>
          <Text
            style={{
              fontFamily: isInitialSelect
                ? 'Montserrat-Regular'
                : 'Montserrat-Bold',
              color: isInitialSelect ? 'gray' : 'black',
              textTransform: isInitialSelect ? 'none' : 'uppercase',
              fontSize: 15,
              paddingVertical: 10,
            }}>
            {independentShippingCarrier}
          </Text>
        </TouchableOpacity>
      )}
      {independentShippingCarrier === 'other' && (
        <TextInput
          placeholder="Type Here"
          style={{
            fontFamily: 'Montserrat-Regular',
            fontSize: 15,
            width: '100%',
          }}
          value={otherIndependentShippingCarrier}
          onChangeText={text => setOtherIndependentShippingCarrier(text)}
        />
      )}

      <Modal
        visible={showModal}
        onTouchOutside={toggleModal}
        width={0.8}
        modalStyle={dialogStyle}>
        <ModalContent>
          <TouchableOpacity
            onPress={() => handleChangeIndependentShippingCarrier('fedex')}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 15,
                paddingVertical: 10,
                textTransform: 'uppercase',
              }}>
              fedex
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChangeIndependentShippingCarrier('ups')}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 15,
                paddingVertical: 10,
                textTransform: 'uppercase',
              }}>
              ups
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChangeIndependentShippingCarrier('usps')}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 15,
                paddingVertical: 10,
                textTransform: 'uppercase',
              }}>
              usps
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChangeIndependentShippingCarrier('other')}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 15,
                paddingVertical: 10,
                textTransform: 'uppercase',
              }}>
              Other
            </Text>
          </TouchableOpacity>
        </ModalContent>
      </Modal>
    </View>
  );
};

export default IndependentCarrierModalSelector;
