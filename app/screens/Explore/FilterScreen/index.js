import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { SafeAreaView, ScrollView, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";

import { flex, safeAreaNotchHelper } from "#styles/utilities";

import Location from "./views/Location";
import DistanceRange from "./views/DistanceRange";
import SortBy from "./views/SortBy";
import Categories from "./views/Categories";
import FiltersByCategory from "./views/FiltersByCategory";
import Footer from "./views/Footer";

import { useActions, Geocoder, getMapObjectFromGoogleObj } from "#utils";
import { selectFiltersData } from "#modules/Filters/selectors";
import {
  persistFilterValues,
  setPropertiesValues,
  resetFiltersToDefault,
  persistPropertiesValues,
} from "#modules/Filters/actions";
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { useFocusEffect } from "@react-navigation/native";

const FilterScreen = ({ navigation, route }) => {
  /* Selectors */
  const {
    filterValues: filterValuesPersisted,
    locationSearchPreValues,
    propertiesValues,
    defaultValues,
  } = useSelector(selectFiltersData());

  /* Actions */
  const actions = useActions({
    persistFilterValues,
    setPropertiesValues,
    resetFiltersToDefault,
    persistPropertiesValues,
  });

  /* States */
  const [filterValues, setFilterValues] = useState({
    location: filterValuesPersisted.location,
    distance: filterValuesPersisted.distance,
    sortBy: filterValuesPersisted.sortBy,
    category: "",

    // childFilters
    subCategories: [],
    subCategoriesChilds: [],
    delivery: [],
    quickDeliveries: [],
    priceRange: [0, 1],
    customProperties: {},
  });
  const [isDefaultSet, setIsDefaultSet] = useState(false);
  const [customPropertiesProps, setCustomPropertiesProps] = useState({});

  /* Effects */
  useEffect(() => {
    // Set user default values
    if (!filterValuesPersisted.userDefaultIsSetted) {
      Geolocation.getCurrentPosition(
        (data) => {
          actions.persistFilterValues({
            userDefaultIsSetted: true,
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
          });

          setFilterValue({
            location: locationSearchPreValues.location,
            distance: locationSearchPreValues.distance,
          });
        },
        (error) => {
          actions.persistFilterValues({
            userDefaultIsSetted: true,
            latitude: 0,
            longitude: 0,
          });

          setFilterValue({
            location: locationSearchPreValues.location,
            distance: locationSearchPreValues.distance,
          });
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
    // Set header right button functionality

    // pass direct to filter location if is needed
    if (route?.params?.filterToOpen === "location") {
      navigation.navigate("FilterSearchLocation");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleResetClick });
    }, [])
  );

  useEffect(() => {
    if (filterValuesPersisted.userDefaultIsSetted) {
      setDefaultFilters();
    }
  }, [filterValuesPersisted.userDefaultIsSetted]);

  useEffect(() => {
    if (
      isDefaultSet &&
      filterValues.category !== filterValuesPersisted.category
    ) {
      cleanChildFilters();
    }
  }, [filterValues.category]);

  useEffect(() => {
    if (isDefaultSet) {
      setFilterValue({
        location: locationSearchPreValues.location,
        distance: locationSearchPreValues.distance,
      });
    }
  }, [locationSearchPreValues]);

  /* Methods */
  const handleResetClick = () => {
    navigation.goBack();
    let defaultData = defaultValues;

    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      })
    )
      .then((permissionResult) => {
        if (permissionResult !== RESULTS.GRANTED) {
          request(
            Platform.select({
              android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            })
          )
            .then((result) => {
              if (
                result == "blocked" ||
                result == "denied" ||
                result == "unavailable"
              ) {
                setFilterValues({ ...defaultData });
              }
            })
            .catch((reason) => {});
        }

        if (permissionResult === RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            async (data) => {
              const res = await Geocoder.from(
                data.coords.latitude,
                data.coords.longitude
              );
              const findLocation = getMapObjectFromGoogleObj(res.results[0]);
              defaultData.location = findLocation;
              setFilterValues({ ...defaultData });
            },
            (error) => {
              console.log({ error });
              setFilterValues({ ...defaultData });
            },
            { enableHighAccuracy: true, maximumAge: 0 }
          );
        }
      })
      .catch((reason) => {
        setFilterValues({ ...defaultData });
      });

    actions.resetFiltersToDefault();
  };

  const setDefaultFilters = () => {
    setFilterValues({
      ...filterValues,
      ...filterValuesPersisted,
    });
    setIsDefaultSet(true);
  };

  const cleanChildFilters = () =>
    setFilterValues({
      ...filterValues,
      delivery: [],
      priceRange: [0, defaultValues.maxPrice],
    });

  const setFilterValue = (newValue) => {
    setFilterValues({
      ...filterValues,
      ...newValue,
    });
  };

  const handlePersistFilters = async () => {
    let customToPersists = propertiesValues;

    if (Object.keys(customPropertiesProps).length > 0) {
      customToPersists = customPropertiesProps;
      const data = await actions.persistPropertiesValues(customPropertiesProps);
    }

    const data = await actions.persistFilterValues({
      ...filterValues,
      ...{ customProperties: customToPersists },
    });
    navigation.goBack();
  };

  const childProps = {
    filterValues: filterValues,
    setFilterValue: setFilterValue,
    setCustomPropertiesProps: setCustomPropertiesProps,
    navigation,
  };

  return (
    <>
      <SafeAreaView style={flex.grow1}>
        <ScrollView>
          <Location
            {...childProps}
            isInitialedOpen={route?.params?.filterToOpen === "location"}
          />
          <DistanceRange {...childProps} />
          <SortBy {...childProps} />
          <Categories {...childProps} />
          <FiltersByCategory {...childProps} />
        </ScrollView>
        <Footer handlePersistFilters={handlePersistFilters} />
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default FilterScreen;
