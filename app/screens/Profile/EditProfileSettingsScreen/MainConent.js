import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  TextInput,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import _ from "lodash";
import { Colors } from "#themes";
import { Icon } from "#components";
import Icons from "#assets/icons";
import { styles } from "./styles";
import { LocationModal } from "../../Auth/ProfileSetupScreen/LocationModal";
import Geolocation from "react-native-geolocation-service";

import Geocoder from "react-native-geocoding";
import { getMapObjectFromGoogleObj } from "#utils";
import { flex } from "#styles/utilities";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";

export const MainContent = ({
  onChangeText,
  onSetPhoto,
  userPhoto,
  firstName,
  location,
  birthdate,
  setShowDatePicker,
  originalInfo,
  errFirstName,
  lastName,
  errLastName,
  errForm,
  setLocationVisible,
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [formattedLocation, setFormattedLocation] = useState("");

  useEffect(() => {
    if (location) {
      return;
    }

    if (Platform.OS === "ios") {
      Geolocation.requestAuthorization("whenInUse");
    }

    // check for default location
    Geolocation.getCurrentPosition(
      async (data) => {
        const res = await Geocoder.from(
          data.coords.latitude,
          data.coords.longitude
        );
        onChangeText(3, res.results[0]);
      },

      () => {
        setFormattedLocation("Cannot get location, please choose manually");
      }
    );
  }, [location, onChangeText]);

  const handleLocation = () => {
    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      })
    ).then((permissionResult) => {
      if (permissionResult !== RESULTS.GRANTED) {
        setLocationVisible(true);
      }

      if (permissionResult === RESULTS.GRANTED) {
        setLocationVisible(false);
        setShowLocationModal(true);
        Geolocation.getCurrentPosition(
          async (data) => {
            const res = await Geocoder.from(
              data.coords.latitude,
              data.coords.longitude
            );
            onChangeText(3, res.results[0]);
          },

          () => {
            setFormattedLocation("Cannot get location, please choose manually");
          }
        );
      }
    });
  };

  useEffect(() => {
    if (!location) {
      return;
    }

    const findLocation = getMapObjectFromGoogleObj(location);

    const city = findLocation?.city ?? "";
    const state = findLocation?.state ?? "";

    const currentLocationText = `${city}, ${state}`;

    setFormattedLocation(currentLocationText);
  }, [location]);

  return (
    <>
      <KeyboardAwareScrollView style={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.userPhotoContainer}
          onPress={onSetPhoto}
        >
          {!userPhoto && (
            <>
              <View style={styles.subPhotoContainer}>
                <Image
                  source={Icons["in-person_grey"]}
                  style={styles.userPhotoTempImg}
                />
              </View>
              <Image source={Icons.add_in_background} style={styles.addImg} />
            </>
          )}
          {userPhoto && (
            <>
              <Image source={{ uri: userPhoto }} style={styles.userPhotoImg} />
              <Image source={Icons.edit_in_background} style={styles.addImg} />
            </>
          )}
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            placeholderTextColor={Colors.inactiveText}
            placeholder="Please input your first name"
            style={styles.inputText}
            value={firstName}
            onChangeText={(text) => onChangeText(0, text)}
            returnKeyType={"done"}
          />
          {errFirstName ? (
            <Text style={styles.redText}>{errFirstName}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            placeholderTextColor={Colors.inactiveText}
            placeholder="Please input your last name"
            style={styles.inputText}
            value={lastName}
            onChangeText={(text) => onChangeText(5, text)}
            returnKeyType={"done"}
          />
          {errLastName ? (
            <Text style={styles.redText}>{errLastName}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => handleLocation()}
        >
          <View
            style={[
              flex.directionRow,
              flex.justifyContentSpace,
              flex.alignItemsCenter,
            ]}
          >
            <Text style={styles.inputLabel}>Location</Text>
          </View>

          <Text style={[styles.inputText, { fontSize: 12 }]}>
            {formattedLocation}
          </Text>
          <Icon icon="localization" style={styles.rightIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.inputLabel}>Birthdate</Text>
          <TextInput
            placeholderTextColor={Colors.inactiveText}
            placeholder={_.get(originalInfo, "birthdate", "")}
            style={styles.inputText}
            value={birthdate}
            editable={false}
            pointerEvents="none"
          />
          <Icon icon="date_red" style={styles.rightDateIcon} />
        </TouchableOpacity>

        {errForm !== "" ? (
          <Text style={[styles.redText, styles.marginPhoneInput]}>
            {errForm}
          </Text>
        ) : null}
      </KeyboardAwareScrollView>

      <LocationModal
        modalVisible={showLocationModal}
        setVisible={setShowLocationModal}
        initialLocation={location}
        setLocation={async (details) => {
          onChangeText(3, details);
          setShowLocationModal(false);
        }}
      />
    </>
  );
};
