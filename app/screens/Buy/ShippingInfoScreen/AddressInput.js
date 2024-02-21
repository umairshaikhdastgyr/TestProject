import React, { useState } from 'react';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  PixelRatio,
  SafeAreaView,
  Platform,
} from 'react-native';
import Config from '#config';
import { Geocoder, getMapObjectFromGoogleObj } from '#utils';
import { BodyText, Icon, Heading } from '#components';
import { Colors, Fonts } from '#themes';

const AddressInput = ({ value, onChange, placeholder, isInitialedOpen }) => {
  /* States */
  const [isModalVisible, setIsModalVisible] = useState(isInitialedOpen);

  /* Methods */
  const handlePressLocationWithGeoLocation = async locationPressed => {
    const res = await Geocoder.from(
      locationPressed.geometry.location.lat,
      locationPressed.geometry.location.lng,
    );
    const location = res.results[0];
    const locationParsed = getMapObjectFromGoogleObj(location);
    if (onChange) {
      onChange(locationParsed);
    }
    setIsModalVisible(false);
  };
  // const handlePressLocation = (locationPressed) => {
  //   const { address_components, formatted_address } = locationPressed;
  //   const locationParsed = {
  //     country: address_components.reduce((acc, address_component) => {
  //       if (address_component.types.includes('country')) {
  //         acc = address_component.short_name;
  //       }
  //       return acc;
  //     }, ''),
  //     state: address_components.reduce((newString, address_component) => {
  //       if (address_component.types.includes('administrative_area_level_1')) {
  //         newString = address_component.short_name;
  //       }
  //       return newString;
  //     }, ''),
  //     city: address_components.reduce((newString, address_component) => {
  //       if (address_component.types.includes('locality')) {
  //         newString = address_component.long_name;
  //       }
  //       if (
  //         newString === ''
  //         && address_component.types.includes('sublocality')
  //       ) {
  //         newString = address_component.long_name;
  //       }
  //       if (
  //         newString === ''
  //         && address_component.types.includes('administrative_area_level_2')
  //       ) {
  //         newString = address_component.long_name;
  //       }
  //       return newString;
  //     }, ''),
  //     zipcode: address_components.reduce((acc, address_component) => {
  //       if (address_component.types.includes('postal_code')) {
  //         acc = address_component.long_name;
  //       }
  //       return acc;
  //     }, ''),
  //     formattedAddress: formatted_address,
  //   };
  //   onChange && onChange(locationParsed);
  //   setIsModalVisible(false);
  // };

  return (
    <>
      <View style={styles.locationInput}>
        <BodyText
          theme={!value ? 'inactive' : ''}
          style={styles.inputTrigger}
          numberOfLines={1}
          onPress={() => setIsModalVisible(true)}>
          {value || placeholder}
        </BodyText>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => console.info('Modal has been closed.')}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Heading type="h6">Location</Heading>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Icon icon="close" />
            </TouchableOpacity>
          </View>
          <GooglePlacesAutocomplete
            placeholder="Enter Location"
            minLength={2}
            autoFocus
            returnKeyType="search"
            keyboardAppearance="light"
            listViewDisplayed
            fetchDetails
            renderDescription={row => row.description || row.vicinity}
            onPress={(data, location = null) => {
              handlePressLocationWithGeoLocation(location);
            }}
            getDefaultValue={() => ''}
            query={{
              key: Config.googleApiKey,
              language: 'en',
              types: 'address',
              components: 'country:us',
            }}
            styles={{
              container: styles.modalContainer,
              textInputContainer: styles.modalTextInputContainer,
              textInput: styles.modalTextInput,
              predefinedPlacesDescription: styles.modalPredefinedText,
              description: styles.modalDescriptionText,
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            GooglePlacesSearchQuery={{
              rankby: 'distance',
              type: 'address',
            }}
            GooglePlacesDetailsQuery={{
              fields: 'formatted_address,name,address_components,geometry',
            }}
            debounce={200}
            renderRightButton={() => (
              <Icon icon="search" color="grey" style={styles.modalSearchIcon} />
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

AddressInput.defaultProps = {
  isInitialedOpen: false,
};

const styles = StyleSheet.create({
  header: {
    height: 76,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  safeArea: {
    flex: 1,
  },
  locationInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    paddingTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inactiveShape,
  },
  modalContainer: {
    marginHorizontal: 16,
  },
  modalTextInputContainer: {
    width: '100%',
    height: 44,
    borderRadius: 4,
    borderTopColor: '#313334',
    borderBottomColor: '#313334',
    borderLeftColor: '#313334',
    borderRightColor: '#313334',
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderLeftWidth: 1 / PixelRatio.get(),
    borderRightWidth: 1 / PixelRatio.get(),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  modalTextInput: {
    ...Fonts.style.inputText,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    height: 42,
    borderRadius: 4,
  },
  modalPredefinedText: {
    color: Colors.black,
    ...Fonts.style.inputText,
    fontWeight: 'bold',
  },
  modalDescriptionText: {
    ...Fonts.style.inputText,
  },
  modalSearchIcon: {
    marginRight: 4,
  },
  inputTrigger: {
    flex: 1,
    marginTop: 15,
    ...Platform.select({
      android: {
        marginLeft: 4,
      },
    }),
  },
  touchable: {
    paddingVertical: 8,
  },
});

export default AddressInput;
