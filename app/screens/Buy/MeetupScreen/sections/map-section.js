import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import MapView from 'react-native-maps';
import { Fonts, Colors } from '#themes';

const MapSection = React.memo(
  React.forwardRef(({ onRegionChangeComplete }, ref) => {
    const initialRegion = {
      latitude: 37.323,
      longitude: -122.0322,
      latitudeDelta: 0.00943,
      longitudeDelta: 0.00432,
    };

    return (
      <View style={styles.container}>
        <MapView
          ref={ref}
          rotateEnabled={false}
          initialRegion={initialRegion}
          style={styles.mapContainer}
          onRegionChangeComplete={region => onRegionChangeComplete(region)}
        />
        <View style={styles.markerFixed}>
          <Image
            style={styles.marker}
            source={require('#assets/icons/map/Subtract.png')}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.informationText}>
          Drag pin to select a meeting location or share your current location
          by selecting above.
        </Text>
      </View>
    );
  }),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 100,
    // zIndex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  containerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 0,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: 48,
    width: 48,
  },
  informationText: {
    ...Fonts.style.homiBodyTextMedium,
    color: Colors.inactiveText,
    padding: 20,
    paddingBottom: 0,
  },
});

export default MapSection;
