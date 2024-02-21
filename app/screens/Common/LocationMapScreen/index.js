import React from "react";
import MapView, { Marker, Circle } from "react-native-maps";
import { StyleSheet, SafeAreaView, Dimensions } from "react-native";

import { flex } from "#styles/utilities";

const LocationMapScreen = ({ navigation, route }) => {
  const { location, marker } = route?.params;
  const initialRegion = {
    latitude: 37.323,
    longitude: -122.0322,
    latitudeDelta: 0.00943,
    longitudeDelta: 0.00432,
  };
  return (
    <SafeAreaView style={flex.grow1}>
      <MapView
        style={styles.mapContainer}
        tracksViewChanges={false}
        region={{
          latitude: location?.latitude ?? initialRegion?.latitude,
          longitude: location?.longitude ?? initialRegion?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {marker ? (
          <Marker
            coordinate={{
              latitude: location?.latitude ?? initialRegion?.latitude,
              longitude: location?.longitude ?? initialRegion?.longitude,
            }}
            image={require("#assets/icons/map/Subtract.png")}
            style={{ width: 30, height: 30 }}
          />
        ) : (
          <Circle
            center={{
              latitude: location?.latitude ?? initialRegion?.latitude,
              longitude: location?.longitude ?? initialRegion?.longitude,
            }}
            radius={1600}
            strokeColor={"#00BDAA"}
            fillColor={"rgba(0,189,170,0.3)"}
            strokeWidth={0.5}
          />
        )}
      </MapView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    width,
  },
});

export default LocationMapScreen;
