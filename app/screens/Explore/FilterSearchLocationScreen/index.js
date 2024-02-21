import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  View,
  Dimensions,
  Platform,
  AppState,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Geolocation from "react-native-geolocation-service";

import debounce from "lodash.debounce";
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";

import InputSection from "./sections/input-section";
import MapSection from "./sections/map-section";
import DistanceSection from "./sections/distance-section";
import FooterSection from "./sections/footer-section";
import { safeAreaNotchHelper } from "#styles/utilities";

import { selectFiltersData } from "#modules/Filters/selectors";
import {
  persistLocationSearchPreValues,
  persistFilterValues,
} from "#modules/Filters/actions";
import {
  Geocoder,
  getMapObjectFromGoogleObj,
  regionFrom,
  isDefaultDistance,
} from "#utils";
import {
  DEFAULT_DISTANCE,
  FAKE_DEFAULT_DISTANCE,
  DEFAULT_LOCATION,
  DEFAULT_LOCATION_DELTA,
} from "#constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocationPermissionModal } from "#components/LocationPermissionModal";
import { useFocusEffect } from "@react-navigation/native";

const HEIGHT = Dimensions.get("window").height;

const FilterSearchLocationScreen = ({ navigation, route }) => {
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
      handleLocation(true);
    }

    appState.current = nextAppState;
    console.log("AppState", appState.current);
  };

  /* Selectors */
  const { filterValues: filterValuesPersisted, locationSearchPreValues } =
    useSelector(selectFiltersData());
  const [isLocationVisible, setLocationVisible] = useState(false);

  const dispatch = useDispatch();

  /* States */
  const persistDirectly = route?.params?.persistDirectly;
  const initialLocation = persistDirectly
    ? Object.keys(filterValuesPersisted.location).length > 0
      ? filterValuesPersisted.location
      : { latitude: 0, longitude: 0 }
    : Object.keys(locationSearchPreValues.location).length > 0
    ? locationSearchPreValues.location
    : { latitude: 0, longitude: 0 };
  const [location, setLocation] = useState(initialLocation);
  const [distance, setDistance] = useState(() =>
    persistDirectly
      ? filterValuesPersisted.distance
      : locationSearchPreValues.distance
  );
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [initialRegion, setInitialRegion] = useState({
    ...initialLocation,
    ...(persistDirectly
      ? isDefaultDistance(filterValuesPersisted.distance[0])
        ? DEFAULT_LOCATION_DELTA
        : regionFrom(filterValuesPersisted.distance[0] * 2)
      : isDefaultDistance(locationSearchPreValues.distance[0])
      ? DEFAULT_LOCATION_DELTA
      : regionFrom(locationSearchPreValues.distance[0] * 2)),
  });

  const mapRef = React.useRef();
  // Set location if not exist
  const init = useCallback(() => {
    Geolocation.getCurrentPosition(
      async (data) => {
        if (persistDirectly) {
          dispatch(
            persistFilterValues({
              latitude: data.coords.latitude,
              longitude: data.coords.longitude,
            })
          );
        }
        const res = await Geocoder.from(
          data.coords.latitude,
          data.coords.longitude
        );
        setInitialRegion((v) => ({
          ...v,
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
        }));
        mapRef?.current?.getMapBoundaries().then(({ northEast, southWest }) => {
          mapRef?.current?.animateToRegion({
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
            latitudeDelta: Math.abs(southWest.latitude - northEast.latitude),
            longitudeDelta: Math.abs(southWest.longitude - northEast.longitude),
          });
        });
        const findLocation = getMapObjectFromGoogleObj(res.results[0]);
        setLocation({
          ...location,
          ...findLocation,
        });

        setLocationEnabled(true);
      },
      (error) => {
        dispatch(
          persistFilterValues({
            latitude: 0,
            longitude: 0,
          })
        );
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  }, [dispatch, location, persistDirectly]);

  /* Effects */

  useEffect(() => {
    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      })
    )
      .then((res) => {
        if (res === RESULTS.GRANTED) {
          setLocationVisible(false);
          setLocationEnabled(true);
          if (!location.latitude) {
            init();
          }
        }
      })
      .catch((reason) => {
        console.log("----reason------", { reason });
      });
  }, [init, location.latitude]);

  useFocusEffect(
    useCallback(() => {
      handleLocation();
    }, [])
  );

  const handleLocation = (value) => {
    try {
      check(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        })
      ).then((res) => {
        console.log({ res });
        if (res === RESULTS.GRANTED) {
          if (value == true) {
            init();
          }
        } else if (res !== RESULTS.GRANTED) {
          setLocationVisible(true);
        }
      });
    } catch (error) {
      console.log("🚀 ~ file: index.js:192 ~ handleLocation ~ error:", error);
    }
  };

  const handleSaveLocationPress = async () => {
    try {
      await AsyncStorage.setItem(
        "@main-screen-location",
        JSON.stringify({ location, distance })
      );
    } catch (error) {
      console.log({ error });
    }

    if (persistDirectly) {
      dispatch(persistFilterValues({ location, distance }));
    }
    dispatch(
      persistLocationSearchPreValues({
        location,
        distance,
      })
    );
    navigation.goBack();
  };

  const handleChangeDistance = (v) => {
    if (location.latitude) {
      const region = regionFrom(
        isDefaultDistance(v[0]) ? DEFAULT_DISTANCE * 2 : v[0] * 2
      );

      const delta = {
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      };

      if (isDefaultDistance(v[0])) {
        mapRef.current.animateToRegion({
          ...location,
          ...DEFAULT_LOCATION_DELTA,
        });
      } else {
        mapRef.current.animateToRegion({
          ...location,
          ...delta,
        });
      }
    }
    setDistance(v);
  };

  const handleSetLocation = (v) => {
    mapRef?.current?.getMapBoundaries().then(({ northEast, southWest }) => {
      mapRef?.current?.animateToRegion({
        latitude: v.latitude,
        longitude: v.longitude,
        latitudeDelta: Math.abs(southWest.latitude - northEast.latitude),
        longitudeDelta: Math.abs(southWest.longitude - northEast.longitude),
      });
    });

    setLocation(v);
  };

  const handleChangeRegionComplete = debounce((coordinate) => {
    return Geocoder.from(coordinate.latitude, coordinate.longitude).then(
      (res) => {
        const parsedLocation = getMapObjectFromGoogleObj(res.results[0]);
        if (
          parsedLocation.latitude !== location.latitude ||
          parsedLocation.longitude !== location.longitude
        ) {
          setLocation(parsedLocation);
        }
      }
    );
  }, 200);

  const disabledBt = location === null || Object.keys(location).length === 0;
  return (
    <>
      <SafeAreaView style={safeAreaNotchHelper} />
      <SafeAreaView style={{ flex: 1, minHeight: HEIGHT - 130 }}>
        <View style={{ flex: 1 }}>
          <MapSection
            ref={mapRef}
            initialRegion={initialRegion}
            rangeVisible={distance[0] !== FAKE_DEFAULT_DISTANCE}
            radius={distance[0] * 1604.39}
            onRegionChangeComplete={handleChangeRegionComplete}
          />
          <InputSection
            location={location}
            locationEnabled={locationEnabled}
            setLocation={handleSetLocation}
            style={{ position: "absolute", top: 10, width: "100%" }}
          />
        </View>
        <DistanceSection distance={distance} onChange={handleChangeDistance} />
        <FooterSection
          handleSaveLocationPress={handleSaveLocationPress}
          disabled={disabledBt}
        />
        {isLocationVisible && (
          <LocationPermissionModal isModalVisible={isLocationVisible} />
        )}
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default FilterSearchLocationScreen;
