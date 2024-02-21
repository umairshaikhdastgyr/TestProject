/* eslint-disable no-use-before-define */
import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  StyleSheet,
  PixelRatio,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Modal,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Header, Icon } from "#components";
import Config from "#config";

import { Colors, Fonts, Metrics } from "#themes";

const InputSearchLocation = ({ modalVisible, setVisible, setLocation }) => {
  /* State */
  const [currentLocation, setCurrentLocation] = useState(false);
  const [showAndroidX, setShowAndroidX] = useState(false);
  const locationRef = useRef();

  /* Methods */
  const handlePressLocation = (locationPressed) => {
    setShowAndroidX(false);
    setCurrentLocation(false);
    locationRef.current.setAddressText("");
    const locationParsed = {
      country: locationPressed.address_components.reduce(
        (newString, address_component) => {
          if (address_component.types.find((type) => type === "country")) {
            newString = address_component.short_name;
          }
          return newString;
        },
        ""
      ),
      state: locationPressed.address_components.reduce(
        (newString, address_component) => {
          if (
            address_component.types.find(
              (type) => type === "administrative_area_level_1"
            )
          ) {
            newString = address_component.short_name;
          }
          return newString;
        },
        ""
      ),
      city: locationPressed.address_components.reduce(
        (newString, address_component) => {
          if (
            address_component.types.find(
              (type) =>
                type === "administrative_area_level_2" || type === "locality"
            )
          ) {
            newString = address_component.long_name;
          }
          return newString;
        },
        ""
      ),
      formattedAddress: locationPressed.formatted_address,
      latitude: locationPressed.geometry.location.lat,
      longitude: locationPressed.geometry.location.lng,
      googleObj: locationPressed,
    };
    // onChange(locationParsed);
  };

  const handleClearInput = () => {
    setShowAndroidX(false);
    locationRef.current.setAddressText("");
  };

  const onLeftPress = () => {
    // eslint-disable-next-line react/prop-types
    // const { setVisible } = this.props;
    setVisible(false);
  };

  const onConfirm = () => {
    const { details } = this.state;
    //  const { setLocation } = this.props;
    setLocation(details);
  };

  const renderHeaderLeft = () => (
    // eslint-disable-next-line react/jsx-filename-extension
    // eslint-disable-next-line react/jsx-indent
    // eslint-disable-next-line react/jsx-filename-extension
    <Icon icon="close" />
  );

  const renderHeaderRight = () => <Icon icon="confirm" />;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => console.info("Modal has been closed.")}
    >
      <SafeAreaView style={styles.container}>
        <Header
          leftComponent={renderHeaderLeft()}
          onLeftPress={onLeftPress}
          rightComponent={renderHeaderRight()}
          title="Location"
          onRightPress={onConfirm}
        />
        <GooglePlacesAutocomplete
          ref={locationRef}
          // placeholder={placeholder}
          minLength={2} // minimum length of text to search
          // autoFocus={true}
          returnKeyType="search" // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          keyboardAppearance="light" // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
          listViewDisplayed // true/false/undefined
          fetchDetails
          renderDescription={(row) => {
            if (row.isCurrentLocation) {
              return null;
            }
            return row.description || row.vicinity;
          }} // custom description render
          onPress={(data, location = null) => {
            handlePressLocation(location);
          }}
          textInputProps={{
            placeholderTextColor: "#999999",
            clearButtonMode: "never",
            onChangeText: (text) => {
              if (text.length > 0) {
                setShowAndroidX(true);
              } else {
                setShowAndroidX(false);
              }
            },
            onFocus: () => {
              if (locationRef.current.getAddressText()) {
                setShowAndroidX(true);
              }
            },
            onBlur: () => {
              setShowAndroidX(false);
            },
          }}
          // getDefaultValue={() => {
          //   return value.formattedAddress ? value.formattedAddress : '';
          // }}
          query={{
            key: Config.googleApiKey,
            language: "en", // language of the results
            types: "geocode",
          }}
          styles={{
            container: styles.moda,
            listView: styles.listView,
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput,
            predefinedPlacesDescription: styles.predefinedPlacesDescription,
            description: styles.description,
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
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
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
        />
      </SafeAreaView>
    </Modal>
  );
};

// InputSearchLocation.defaultProps = {
//   isInitialedOpen: false,
// };

const styles = StyleSheet.create({
  mainContainer: {
    height: 34,
  },
  modalContainer: {
    marginHorizontal: 10,
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
    borderTopColor: "#969696",
    borderBottomColor: "#969696",
    borderLeftColor: "#969696",
    borderRightColor: "#969696",
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
  },
  clearIcon: {
    marginRight: 12,
  },
});

export default forwardRef(InputSearchLocation);
