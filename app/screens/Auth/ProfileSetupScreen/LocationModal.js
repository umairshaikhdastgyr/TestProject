import React, { Component } from "react";
import { Modal, TouchableOpacity, Platform, SafeAreaView } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Config from "#config";
import { Header, Icon } from "#components";
import { styles } from "./styles";
import { PERMISSIONS, request } from "react-native-permissions";
import DeviceInfo from "react-native-device-info";

export class LocationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: props.initialLocation,
    };
    this.selectorRef = React.createRef(null);
  }

  componentDidMount() {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      })
    )
      .then((result) => {
        // console.log({ result });
      })
      .catch((reason) => console.log({ reason }));
  }

  onLeftPress = () => {
    const { setVisible } = this.props;
    setVisible(false);
  };

  onConfirm = () => {
    const { details } = this.state;
    const { setLocation } = this.props;
    setLocation(details);
  };

  renderHeaderLeft = () => <Icon icon="close" />;

  renderHeaderRight = () => {
    const hasSelectedLocation = this.state.details;

    if (!hasSelectedLocation) {
      return null;
    }

    return <Icon icon="confirm" color="active" />;
  };

  renderSearchIcon = () => (
    <TouchableOpacity
      onPress={() => {
        this?.selectorRef?.current?.setAddressText("");
      }}
    >
      <Icon icon="close" color="grey" style={styles.modalSearchIcon} />
    </TouchableOpacity>
  );

  render() {
    let hasDynamicIsland = DeviceInfo.hasDynamicIsland();
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}
        onRequestClose={() => console.info("Modal has been closed.")}
      >
        <SafeAreaView
          style={[styles.container, { marginTop: hasDynamicIsland ? 25 : 0 }]}
        >
          <Header
            leftComponent={this.renderHeaderLeft()}
            onLeftPress={this.onLeftPress}
            rightComponent={this.renderHeaderRight()}
            title="Location"
            onRightPress={this.onConfirm}
          />
          <GooglePlacesAutocomplete
            placeholder="Enter Location"
            ref={this.selectorRef}
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType="search" // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance="light" // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed // true/false/undefined
            fetchDetails
            renderDescription={(row) => row.description || row.vicinity} // custom description render
            onPress={(_data, details = null) => {
              this.setState({ details });
            }}
            getDefaultValue={() =>
              this.props?.initialLocation?.formatted_address ?? ""
            }
            query={{
              key: Config.googleApiKey,
              language: "en", // language of the results
              // types: '(cities)', // default: 'geocode'
              components: "country:us",
            }}
            styles={{
              container: styles.modalContainer,
              textInputContainer: styles.modalTextInputContainer,
              textInput: styles.modalTextInput,
              predefinedPlacesDescription: styles.modalPredefinedText,
              description: styles.modalDescriptionText,
            }}
            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: "distance",
              type: "cafe",
            }}
            GooglePlacesDetailsQuery={{
              // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
              fields: "formatted_address,icon,name,address_components,geometry",
            }}
            // filterReverseGeocodingByTypes={[
            //   'locality',
            //   'administrative_area_level_3',
            // ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            renderRightButton={this.renderSearchIcon}
            textInputProps={{
              placeholderTextColor: "#999999",
              clearButtonMode: "never",
            }}
          />
        </SafeAreaView>
      </Modal>
    );
  }
}
