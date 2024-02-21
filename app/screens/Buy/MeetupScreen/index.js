import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  Keyboard,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import moment from "moment";
import Geolocation from "react-native-geolocation-service";

import { CustomDateTimePicker, Toast } from "#components";
import InputSection from "./sections/input-section";
import MapSection from "./sections/map-section";
import DateSection from "./sections/date-section";
import FooterSection from "./sections/footer-section";
import { safeAreaNotchHelper } from "#styles/utilities";

import { selectOrderData } from "#modules/Orders/selectors";
import { setMeetup } from "#modules/Orders/actions";
import { useActions, Geocoder, getMapObjectFromGoogleObj } from "#utils";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { selectUserData } from "#modules/User/selectors";
import debounce from "lodash.debounce";
import { useFocusEffect } from "@react-navigation/native";
import { DEFAULT_LOCATION } from "#constants";
import useCheckNetworkInfo from "../../../hooks/useCheckNetworkInfo";

const HEIGHT = Dimensions.get("window").height;

let meetupRequested = false;

const MeetupScreen = ({ navigation, route }) => {
  const { internetAvailable } = useCheckNetworkInfo();
  /* Selectors */
  const { meetup } = useSelector(selectOrderData());
  const { information: userInfo } = useSelector(selectUserData());

  /* Actions */
  const actions = useActions({
    setMeetup,
  });

  /* States */
  const [locationFilterValues, setLocationFilterValues] = useState({
    location: {},
    distance: [0.4],
    userLocation: {
      latitude: 0,
      longitude: 0,
    },
  });

  const [dateTimeVisible, setDateTimeVisible] = useState(false);
  const [dateMeetUp, setDateMeetUp] = useState(
    moment().startOf("hour").add(1, "hour").toDate()
  );

  const [toastError, setToastError] = useState({
    message: "",
    isVisible: false,
  });

  const mapRef = React.useRef();

  const renderToast = () => {
    const connectionErrorMessage = "Please, check your internet connection.";

    if (toastError.isVisible || internetAvailable === false) {
      return (
        <Toast
          isVisible={toastError.isVisible}
          message={
            internetAvailable === false
              ? connectionErrorMessage
              : toastError.message
          }
        />
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      meetupRequested = false;
      // Set header right button functionality
      navigation.setParams({ handleResetClick });
    }, [])
  );

  useEffect(() => {
    handlePressCurrentLocation();
  }, [handlePressCurrentLocation]);

  useEffect(() => {
    if (meetup.isFetching === false && meetupRequested === true) {
      // action after meetup
      // error
      if (meetup.errorMsg !== "") {
        setToastError("Something went wrong. Please, try again.");
        return;
      }
      if (meetup.errorMsg === "") {
        // success
        navigation.goBack();
      }
    }

    if (meetup.isFetching === true && meetupRequested === false) {
      meetupRequested = true;
    }
  }, [meetup]);

  /* Methods */
  const setFilterValue = (newValue) =>
    setLocationFilterValues((v) => ({
      ...v,
      ...newValue,
    }));

  const handleSaveLocationPress = () => {
    // SEND MEETUP REQUEST
    actions.setMeetup({
      orderId: route?.params?.orderId,
      params: {
        latitude: locationFilterValues.location.latitude,
        longitude: locationFilterValues.location.longitude,
        scheduledTime: moment.utc(dateMeetUp).format("YYYY-MM-DD HH:mm"),
        address: locationFilterValues.location,
        user: {
          id: userInfo.id,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
        },
      },
    });

    // navigation.goBack();
  };

  const handleResetClick = () => {
    Keyboard.dismiss();
  };

  const onCancel = () => {
    setDateTimeVisible(false);
  };

  const onConfirm = (date) => {
    setDateMeetUp(date);
    setDateTimeVisible(false);
  };

  const handlePressCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      async (pos) => {
        const res = await Geocoder.from(pos.coords);
        const location = getMapObjectFromGoogleObj(res.results[0]);
        setFilterValue({ location });
        mapRef?.current?.getMapBoundaries().then(({ northEast, southWest }) => {
          mapRef?.current?.animateToRegion({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: Math.abs(southWest.latitude - northEast.latitude),
            longitudeDelta: Math.abs(southWest.longitude - northEast.longitude),
          });
        });
      },
      async (error) => {
        //TODO: Add data from IP
        let defCoords = DEFAULT_LOCATION;
        const res = await Geocoder.from(defCoords);
        const location = getMapObjectFromGoogleObj(res.results[0]);
        setFilterValue({ location });
        mapRef?.current?.getMapBoundaries().then(({ northEast, southWest }) => {
          mapRef?.current?.animateToRegion({
            latitude: defCoords.latitude,
            longitude: defCoords.longitude,
            latitudeDelta: Math.abs(southWest.latitude - northEast.latitude),
            longitudeDelta: Math.abs(southWest.longitude - northEast.longitude),
          });
        });
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  }, []);

  const handleChangeRegionComplete = debounce(async (coordinate) => {
    try {
      const res = await Geocoder.from(
        coordinate.latitude,
        coordinate.longitude
      );
      const location = res.results[0];
      const locationParsed = getMapObjectFromGoogleObj(location);
      setFilterValue({ location: locationParsed });
    } catch (e) {}
  }, 200);

  const handlePressLocation = (value) => {
    setFilterValue(value);
    mapRef?.current?.getMapBoundaries().then(({ northEast, southWest }) => {
      mapRef?.current?.animateToRegion({
        latitude: value.latitude,
        longitude: value.longitude,
        latitudeDelta: Math.abs(southWest.latitude - northEast.latitude),
        longitudeDelta: Math.abs(southWest.longitude - northEast.longitude),
      });
    });
  };

  const disabledBt =
    locationFilterValues.location === null ||
    Object.keys(locationFilterValues.location).length === 0;

  const locationEnabled =
    locationFilterValues.userLocation.latitude !== 0 &&
    locationFilterValues.userLocation.longitude !== 0;

  return (
    <>
      <SafeAreaView style={safeAreaNotchHelper} />
      <SafeAreaView style={{ flex: 1, minHeight: HEIGHT - 100 }}>
        {renderToast()}
        <View style={styles.container}>
          <InputSection
            locationEnabled={locationEnabled}
            filterValues={locationFilterValues}
            setFilterValue={handlePressLocation}
            style={styles.inputContainer}
            onPressCurrentLocation={handlePressCurrentLocation}
          />
          <MapSection
            ref={mapRef}
            onRegionChangeComplete={handleChangeRegionComplete}
          />
        </View>
        <DateSection
          value={dateMeetUp}
          filterValues={locationFilterValues}
          setDateTimeVisible={setDateTimeVisible}
        />
        <CustomDateTimePicker
          visible={dateTimeVisible}
          value={dateMeetUp}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
        <FooterSection
          handleSaveLocationPress={handleSaveLocationPress}
          disabled={disabledBt || meetup.isFetching}
        />
      </SafeAreaView>
      {meetup.isFetching && <ScreenLoader />}
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
  },
});

export default MeetupScreen;
