/* eslint-disable no-use-before-define */
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  StyleSheet,
  PixelRatio,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import Config from "#config";
import { Icon } from "#components";
import { Colors, Fonts, Metrics } from "#themes";
import { Geocoder, getMapObjectFromGoogleObj } from "#utils";

const InputSearchLocation = (
  { value, onChange, placeholder, style, allowAddress, updateText },
  ref
) => {
  /* State */
  const [currentLocation, setCurrentLocation] = useState(false);
  const [showAndroidX, setShowAndroidX] = useState(false);
  const [listViewDisplayed, setListViewDisplayed] = useState(false);
  const [textValue, setTextValue] = useState(value.formattedAddress);

  useEffect(() => {
    setTextValue(value?.formattedAddress);
    locationRef?.current?.setAddressText(value?.formattedAddress)
    setCurrentLocation(true);
    locationRef?.current?.getCurrentLocation()
  }, [value?.formattedAddress]);

  const locationRef = useRef();
  useImperativeHandle(ref, () => ({
    getCurrentLocation: () => {
      setCurrentLocation(true);
      locationRef?.current?.getCurrentLocation();
    },
    setAddressText: (v) => locationRef?.current?.setAddressText(v),
    updateText: () => {
      setTextValue(value?.formattedAddress);
    },
  }));
  /* Methods */
  const handlePressLocationWithGeoLocation = async (locationPressed) => {
    setShowAndroidX(false);
    setCurrentLocation(false);
    const res = await Geocoder.from(
      locationPressed.geometry.location.lat,
      locationPressed.geometry.location.lng
    );
    const location = res.results[0];
    const locationParsed = getMapObjectFromGoogleObj(location);
    onChange(locationParsed);
  };

  const handlePressLocation = (locationPressed) => {
    setShowAndroidX(false);
    setCurrentLocation(false);
    locationRef.current.setAddressText("");
    const locationParsed = getMapObjectFromGoogleObj(locationPressed);
    onChange(locationParsed);
  };

  const handleClearInput = () => {
    setShowAndroidX(false);
    locationRef.current.setAddressText("");
  };

  return (
    <View
      keyboardShouldPersistTaps="handled"
      style={[styles.mainContainer, style]}
    >
      <GooglePlacesAutocomplete
        ref={locationRef}
        placeholder={placeholder}
        minLength={2} // minimum length of text to search
        // autoFocus={true}
        returnKeyType="search" // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        keyboardAppearance="light" // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
        listViewDisplayed={listViewDisplayed} // true/false/undefined
        fetchDetails
        renderDescription={(row) => {
          if (row.isCurrentLocation) {
            return null;
          }
          return row.description || row.vicinity;
        }} // custom description render
        onPress={(data, location = null) => {
          if (allowAddress && allowAddress === true) {
            handlePressLocation(location);
          } else {
            handlePressLocationWithGeoLocation(location);
          }
        }}
        text={textValue}
        textInputProps={{
          placeholderTextColor: "#999999",
          clearButtonMode: "never",
          onChangeText: (text) => {
            setTextValue(text);
            if (
              text.length > 0 &&
              locationRef &&
              locationRef.current &&
              locationRef.current.refs &&
              locationRef.current.refs.textInput.isFocused()
            ) {
              setShowAndroidX(true);
            } else {
              setShowAndroidX(false);
            }
            // setTextValue(text);
          },
          onFocus: () => {
            if (locationRef.current.getAddressText()) {
              setShowAndroidX(true);
            }
            setListViewDisplayed(true);
          },
          onBlur: () => {
            setShowAndroidX(false);
            setListViewDisplayed(false);
          },
        }}
        getDefaultValue={() =>
          value.formattedAddress ? value.formattedAddress : ""
        }
        query={{
          key: Config.googleApiKey,
          language: "en", // language of the results
          types: allowAddress && allowAddress === true ? "address" : "geocode", // default: 'geocode'
          components: "country:us",
        }}
        styles={{
          // container: styles.container,
          listView: styles.listView,
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          predefinedPlacesDescription: styles.predefinedPlacesDescription,
          description: styles.description,
          powered: styles.powered,
        }}
        currentLocation={currentLocation} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Use current location"
        nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: "distance",
          type: "cities",
        }}
        GooglePlacesDetailsQuery={{
          // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
          fields: "formatted_address,icon,name,address_components,geometry",
        }}
        filterReverseGeocodingByTypes={[]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        debounce={0} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        renderLeftButton={() => (
          <Icon icon="search" color="grey" style={styles.searchIcon} />
        )}
        renderRightButton={() =>
          showAndroidX && (
            <TouchableOpacity
              style={styles.clearIcon}
              onPress={handleClearInput}
            >
              <Icon icon="close" size="small" color="grey" />
            </TouchableOpacity>
          )
        }
        onKeyPress={() => {}}
      />
    </View>
  );
};

// InputSearchLocation.defaultProps = {
//   isInitialedOpen: false,
// };

const styles = StyleSheet.create({
  mainContainer: {
    height: 34,
  },
  listView: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 3,
    zIndex: 10,
    maxHeight: Metrics.height / 2,
  },
  textInputContainer: {
    overflow: "visible",
    height: 40,
    borderRadius: 7,
    borderColor: Colors.inactiveText,
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderLeftWidth: 1 / PixelRatio.get(),
    borderRightWidth: 1 / PixelRatio.get(),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  textInput: {
    ...Fonts.style.inputText,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    height: 38,
    borderRadius: 8,
    color: "black",
  },
  predefinedPlacesDescription: {
    color: Colors.black,
    ...Fonts.style.inputText,
    fontWeight: "bold",
  },
  description: {
    ...Fonts.style.inputText,
  },
  searchIcon: {
    marginLeft: 12,
    tintColor: "purple",
  },
  clearIcon: {
    paddingRight: 12,
    paddingLeft: 5,
    paddingVertical: 12,
  },
  powered: {
    height: 15,
  },
});

export default forwardRef(InputSearchLocation);
