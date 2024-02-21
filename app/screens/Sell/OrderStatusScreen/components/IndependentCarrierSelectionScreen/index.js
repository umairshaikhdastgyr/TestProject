import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { flex, safeAreaNotchHelper } from '#styles/utilities';
import { TouchableOpacity } from 'react-native';

import dhlIcon from './dhl-icon.png';
import upsIcon from './ups-icon.png';
import uspsIcon from './usps-icon.png';
import fedexIcon from './fedex-icon.png';
import { TextInput } from 'react-native';
import { FooterAction } from '#components';
import { useDispatch, useSelector } from 'react-redux';
import { setIndependentShippingCarrier } from '#modules/Orders/actions';
import { selectOrderData } from '#modules/Orders/selectors';

const carrierSelections = ['usps', 'fedex', 'ups', 'dhl'];

const TouchableCarrier = ({
  carrierName,
  selectedCarrier,
  setSelectedCarrier,
}) => {
  const carrierIcon = () => {
    if (carrierName === 'usps') {
      return uspsIcon;
    }
    if (carrierName === 'ups') {
      return upsIcon;
    }
    if (carrierName === 'fedex') {
      return fedexIcon;
    }
    if (carrierName === 'dhl') {
      return dhlIcon;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ width: '50%', flexDirection: 'row' }}
      onPress={() => setSelectedCarrier(carrierName)}
    >
      <View
        style={{
          flexGrow: 1,
          margin: 20,
          alignItems: 'center',
          paddingVertical: 15,
          borderRadius: 8,
          backgroundColor: carrierName === selectedCarrier ? 'gray' : 'white',
          shadowColor:
            carrierName === selectedCarrier
              ? 'rgba(0, 0, 0, 0.15)'
              : 'rgba(0, 0, 0, 0.05)',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Image source={carrierIcon()} />
        <Text
          style={{
            fontFamily: 'Montserrat-Regular',
            color: carrierName === selectedCarrier ? 'white' : '#969696',
            textTransform: 'uppercase',
            marginTop: 5,
            fontSize: 13,
          }}
        >
          {carrierName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const IndependentCarrierSelectionScreen = ({showCarrierModal}) => {
  const dispatch = useDispatch();
  const { independentShippingCarrier } = useSelector(selectOrderData());
  const [selectedCarrier, setSelectedCarrier] = useState(
    independentShippingCarrier.carrier,
  );

  const handleSaveCarrier = () => {
    dispatch(
      setIndependentShippingCarrier({
        trackingId: independentShippingCarrier.trackingId,
        carrier: selectedCarrier,
      }),
    );
    showCarrierModal(false);
  };

  return (
    <>
      <View style={flex.grow1}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {carrierSelections.map(carrierName => (
              <TouchableCarrier
                carrierName={carrierName}
                selectedCarrier={selectedCarrier}
                setSelectedCarrier={setSelectedCarrier}
              />
            ))}
          </View>

          <View style={{ margin: 20 }}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 15,
              }}
            >
              Carrier Not Shown? Enter It Here:
            </Text>
            <TextInput
              placeholder="Type Here"
              style={{
                fontFamily: 'Montserrat-Regular',
                fontSize: 15,
                width: '100%',
              }}
              onChangeText={text => setSelectedCarrier(text)}
            />
          </View>
        </ScrollView>
        <FooterAction
          mainButtonProperties={{
            label: 'Save Carrier',
            disabled: selectedCarrier === '',
            onPress: handleSaveCarrier,
          }}
        />
      </View>
    </>
  );
};

export default IndependentCarrierSelectionScreen;
