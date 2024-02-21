import React, { useRef } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';
import { Icon, BodyText, InputSearchLocation } from '#components';
import { Colors } from '#themes';
import { Geocoder, getMapObjectFromGoogleObj } from '#utils';

import { DEFAULT_LOCATION } from '#constants';

const InputSection = ({ locationEnabled, location, setLocation, style }) => {
  const inputRef = useRef();
  const checkPermission = () =>{
    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    )
      .then(res => {
        console.log({ res });
        if (res === RESULTS.GRANTED) {
          // setLocationEnabled(true);
          // if (!location.latitude) {
          //   init();
          // }
          handleGetCurrentLocation()
        } else {
          request(
            Platform.select({
              android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            }),
          )
        }
      })
      .catch(reason => {
        console.log({ reason });
      });
  }
  const handleGetCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async data => {
        const res = await Geocoder.from(
          data.coords.latitude,
          data.coords.longitude,
        );
        const parsedLocation = getMapObjectFromGoogleObj(res.results[0]);
        setLocation(parsedLocation);
      },
      async error => {
        //TODO: must add a service to get location from IP
        const res = await Geocoder.from(
          DEFAULT_LOCATION.latitude,
          DEFAULT_LOCATION.longitude,
        );
        const parsedLocation = getMapObjectFromGoogleObj(res.results[0]);
        setLocation(parsedLocation);
      },
      { enableHighAccuracy: true, maximumAge: 0 },
    );
  };

  return (
    <View
      style={[
        styles.container,
        Platform.OS === 'ios' && styles.container_iosFix,
        style,
      ]}
    >
      {/* <View style={styles.title}>
        <BodyText size="medium" style={{ flex: 1 }} numberOfLines={1}>
          {location.formattedAddress || 'Location'}
        </BodyText>
      </View> */}
      <InputSearchLocation
        ref={inputRef}
        onChange={setLocation}
        placeholder="City or zip code"
        value={location}
      />
      <TouchableOpacity
        onPress={checkPermission}
        activeOpacity={0.8}
        style={styles.locationBtnContainer}
      >
        <Icon icon="localization" color="grey" style={styles.icon} />
        <BodyText bold style={styles.locationBtnText}>
          Use current location
        </BodyText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  container_iosFix: {
    zIndex: 2,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    // marginRight: 8,
  },
  locationBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingRight: 8,
    paddingLeft: 2,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: Colors.inactiveText,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  locationBtnText: {
    color: Colors.blackLight,
  },
});

export default InputSection;
