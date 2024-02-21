import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Platform,
  Image,
  AppState,
} from "react-native";
import MapView from "react-native-maps";
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";
import debounce from "lodash.debounce";
import Geolocation from "react-native-geolocation-service";

import { InputSearchLocation, Icon, FooterAction, BodyText } from "#components";
import { selectSellData } from "#modules/Sell/selectors";
import { setFormValue, changePostDetail } from "#modules/Sell/actions";
import { Geocoder, getMapObjectFromGoogleObj } from "#utils";

import { DEFAULT_LOCATION } from "#constants";

import { safeAreaViewWhite, safeAreaNotchHelper } from "#styles/utilities";
import styles from "./styles";
import SmallLoader from "#components/Loader/SmallLoader";
import { LocationPermissionModal } from "#components/LocationPermissionModal";

const PostDescriptionScreen = ({ navigation, route }) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      handleLocation();
    }

    appState.current = nextAppState;
    console.log("AppState", appState.current);
  };

  const { formData } = useSelector(selectSellData());
  const dispatch = useDispatch();

  /* States */
  const [location, setLocation] = useState(formData.location || {});
  const [initialRegion, setInitialRegion] = useState({
    latitude: formData.location.latitude || 0,
    longitude: formData.location.longitude || 0,
    latitudeDelta: 0.0943,
    longitudeDelta: 0.0042,
  });
  const [isLocationVisible, setLocationVisible] = useState(false);
  const [loadingInitialLocation, setLoadingInitialLocation] = useState(false);

  const inputRef = useRef();
  const mapRef = useRef();
  /* Effects */
  useEffect(() => {
    handleLocation();
  }, []);

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
        Geolocation.getCurrentPosition(
          async (pos) => {
            setLoadingInitialLocation(true);
            setLocationVisible(false);
            const addr = await Geocoder.from(
              pos.coords.latitude,
              pos.coords.longitude
            );

            const parsedLocation = getMapObjectFromGoogleObj(addr.results[0]);
            setInitialRegion((previousState) => ({
              ...previousState,
              ...parsedLocation,
            }));
            if (Object.keys(formData.location)?.length == 0) {
              setLocation(() => ({
                ...parsedLocation,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              }));
            }
            setLoadingInitialLocation(false);
          },
          (error) => {
            console.log("-------------", { error });
          },
          { enableHighAccuracy: true, maximumAge: 0 }
        );
      }
    });
  };

  /* Methods */
  const handleSubmit = () => {
    const isGoods = formData?.listingType?.name === "Goods";
    let locationIsChanged = false;
    if (isGoods && formData?.deliveryMethodsSelected?.length > 0) {
      locationIsChanged = true;
    }
    dispatch(
      setFormValue({
        location,
        deliveryMethodsSelected: isGoods
          ? []
          : formData?.deliveryMethodsSelected,
        customProperties: isGoods ? {} : formData?.customProperties,
        locationIsChanged,
      })
    );
    dispatch(changePostDetail(true));
    navigation.goBack();
  };

  const handleUseCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (data) => {
        await setLocationFromLatLon(data.coords);
        mapRef?.current?.getMapBoundaries().then(({ northEast, southWest }) => {
          mapRef?.current?.animateToRegion({
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
            latitudeDelta: Math.abs(southWest.latitude - northEast.latitude),
            longitudeDelta: Math.abs(southWest.longitude - northEast.longitude),
          });
        });
      },
      async (error) => {
        //TODO: Try get data from IP
        const defCoords = DEFAULT_LOCATION;
        await setLocationFromLatLon(defCoords);
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
  };

  const handleRegionChangeComplete = debounce(async (coordinate) => {
    await setLocationFromLatLon(coordinate);
  }, 200);

  const setLocationFromLatLon = useCallback(async (coordinate) => {
    const res = await Geocoder.from(coordinate.latitude, coordinate.longitude);
    const parsedLocation = getMapObjectFromGoogleObj(res.results[0]);

    setLocation(() => ({
      ...parsedLocation,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    }));
  }, []);

  const handlePressLocation = (v) => {
    inputRef.current.updateText();
    setLocation(v);
    mapRef?.current?.getMapBoundaries().then(({ northEast, southWest }) => {
      mapRef?.current?.animateToRegion({
        latitude: v.latitude,
        longitude: v.longitude,
        latitudeDelta: Math.abs(southWest.latitude - northEast.latitude),
        longitudeDelta: Math.abs(southWest.longitude - northEast.longitude),
      });
    });
  };

  if (loadingInitialLocation) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <SmallLoader />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={safeAreaViewWhite}>
        <View style={styles.container}>
          <View style={styles["map-container"]}>
            <MapView
              ref={mapRef}
              initialRegion={initialRegion}
              onRegionChangeComplete={handleRegionChangeComplete}
              style={{ flex: 1, zIndex: -1 }}
            />

            <View style={styles.markerFixed}>
              <Image
                style={styles.marker}
                source={require("#assets/icons/map/Subtract.png")}
                resizeMode="contain"
              />
            </View>
          </View>
          <View
            style={[styles["location-header-input"], styles.container_iosFix]}
          >
            <InputSearchLocation
              ref={inputRef}
              onChange={handlePressLocation}
              placeholder="City or zip code"
              value={location}
            />
            <TouchableOpacity
              onPress={handleUseCurrentLocation}
              activeOpacity={0.8}
              style={styles.locationBtnContainer}
            >
              <Icon icon="localization" color="grey" />
              <BodyText bold style={styles.locationBtnText}>
                Use current location
              </BodyText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
          <FooterAction
            mainButtonProperties={{
              label: "Save Location",
              disabled: !location.longitude,
              onPress: handleSubmit,
            }}
          />
        </View>
        {isLocationVisible && (
          <LocationPermissionModal isModalVisible={isLocationVisible} />
        )}
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default PostDescriptionScreen;
