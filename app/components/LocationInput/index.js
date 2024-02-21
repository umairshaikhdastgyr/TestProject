import React, { useState, useEffect } from 'react';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  PixelRatio,
  SafeAreaView,
} from 'react-native';
import Config from '#config';

import {
  BodyText, Label, Icon, Heading,
} from '#components';
import { Colors, Fonts } from '#themes';

const LocationInput = ({ value, onChange, isInitialedOpen }) => {
  /* States */
  const [isModalVisible, setIsModalVisible] = useState(false);

  /* Effects */
  useEffect(() => {
    setIsModalVisible(isInitialedOpen);
  }, []);

  /* Methods */
  const handlePressLocation = (locationPressed) => {
    const locationParsed = {
      country: locationPressed.address_components.reduce(
        (newString, address_component) => {
          if (address_component.types.find((type) => type === 'country')) { newString = address_component.short_name; }
          return newString;
        },
        '',
      ),
      state: locationPressed.address_components.reduce(
        (newString, address_component) => {
          if (
            address_component.types.find(
              (type) => type === 'administrative_area_level_1',
            )
          ) { newString = address_component.short_name; }
          return newString;
        },
        '',
      ),
      city: locationPressed.address_components.reduce(
        (newString, address_component) => {
          if (
            address_component.types.find(
              (type) => type === 'administrative_area_level_2',
            )
          ) { newString = address_component.long_name; }
          return newString;
        },
        '',
      ),
      formattedAddress: locationPressed.formatted_address,
    };
    onChange(locationParsed);
    setIsModalVisible(false);
  };

  return (
    <>
      <View style={styles.locationInput}>
        <BodyText
          size="medium"
          theme={!value ? 'inactive' : ''}
          style={styles.inputTrigger}
          numberOfLines={1}
          onPress={() => setIsModalVisible(true)}
        >
          {value || 'Select a City'}
        </BodyText>
        <TouchableOpacity
          onPress={() => {
            if (!value) setIsModalVisible(true);
            else onChange({});
          }}
          style={styles.touchable}
        >
          <Label bold size="medium" type="underline">
            {value ? 'CLEAR' : 'UPDATE'}
          </Label>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => console.info('Modal has been closed.')}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Heading type="h6">Location</Heading>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Icon icon="close" />
            </TouchableOpacity>
          </View>
          <GooglePlacesAutocomplete
            placeholder="Enter Location"
            minLength={2} // minimum length of text to search
            autoFocus
            returnKeyType="search" // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance="light" // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed // true/false/undefined
            fetchDetails
            renderDescription={(row) => row.description || row.vicinity} // custom description render
            onPress={(data, location = null) => {
              handlePressLocation(location);
            }}
            getDefaultValue={() => ''}
            query={{
              key: Config.googleApiKey,
              language: 'en', // language of the results
              types: '(cities)', // default: 'geocode'
              components: 'country:us',
            }}
            styles={{
              container: styles.modalContainer,
              textInputContainer: styles.modalTextInputContainer,
              textInput: styles.modalTextInput,
              predefinedPlacesDescription: styles.modalPredefinedText,
              description: styles.modalDescriptionText,
            }}
            // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            // currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance',
              type: 'cities',
            }}
            GooglePlacesDetailsQuery={{
              // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
              fields: 'formatted_address,icon,name,address_components,geometry',
            }}
            filterReverseGeocodingByTypes={[
              'locality',
              'administrative_area_level_3',
            ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            renderRightButton={() => (
              <Icon icon="search" color="grey" style={styles.modalSearchIcon} />
            )}
            textInputProps={{
              placeholderTextColor: '#999999',
              clearButtonMode: 'never',
            }}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

LocationInput.defaultProps = {
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: Colors.grey,
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
  },
  touchable: {
    paddingVertical: 8,
  },
});

export default LocationInput;
