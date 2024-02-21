import React from 'react';
import MapView, {Circle} from 'react-native-maps';
import {
  StyleSheet, View, TouchableOpacity, Dimensions,
} from 'react-native';

import { Icon, BodyText } from '#components';
import { paddings, flex, margins } from '#styles/utilities';

const Location = ({ navigation, location }) => {
  /* Selectors */
  /* Methods */
  const parseCityName = (locationValue) => {
    if (!locationValue) {
      return '';
    }

    const city = locationValue.address_components?.reduce(
      (cityParsed, component) => {
        if (
          component.types.find((type) => type === 'administrative_area_level_2')
        ) {
          cityParsed = component.long_name.replace(' County', '');
        }

        if (component.types.find((type) => type === 'locality')) {
          cityParsed = component.long_name;
        }

        if (
          component.types.find((type) => type === 'administrative_area_level_1')
        ) {
          cityParsed = `${cityParsed}, ${component.long_name}`;
        }

        return cityParsed;
      },
      '',
    );
    return city;
  };

  return (
    <>
      <View style={{ ...paddings['px-3'], ...margins['mb-4'] }}>
        <View
          style={{
            ...flex.directionRow,
            ...flex.alignItemsCenter,
          }}
        >
          <Icon icon="localization" style={margins['mr-1']} />
          <BodyText theme="underline">{parseCityName(location)}</BodyText>
        </View>
      </View>
      <View style={margins['mb-4']}>
        <TouchableOpacity
          style={styles.mapToTap}
          onPress={() => navigation.navigate('LocationMap', {
            location: {
              latitude: location?.geometry?.location?.lat,
              longitude: location?.geometry?.location?.lng,
            },
          })}
        />
          <MapView
            style={styles.mapContainer}
            cacheEnabled={false}
            loadingEnabled
            region={{
              latitude: location?.geometry?.location?.lat,
              longitude: location?.geometry?.location?.lng,
              latitudeDelta: 0.0461,
              longitudeDelta: 0.02105,
            }}
          >
            <Circle
              center={{
                latitude: location?.geometry?.location?.lat,
                longitude: location?.geometry?.location?.lng,
              }}
              radius={1600}
              strokeColor="#00BDAA"
              fillColor="rgba(0,189,170,0.3)"
              strokeWidth={0.5}
            />
          </MapView>
      </View>
    </>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  mapContainer: {
    width,
    height: 189,
  },
  mapToTap: {
    width,
    height: 189,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
});

export default Location;
