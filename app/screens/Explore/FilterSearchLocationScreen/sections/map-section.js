import React from "react";
import { StyleSheet, View, Image } from "react-native";
import MapView, { Circle } from "react-native-maps";

const MapSection = React.memo(
  React.forwardRef(
    ({ initialRegion, rangeVisible, radius, onRegionChangeComplete }, ref) => {
      const defaultRegion = { latitude: 37.323, longitude: -122.0322 };
      const [region, setRegion] = React.useState({});
      const [visibleCircle, setVisibleCircle] = React.useState(false);
      const handleRegionChange = (r) => {
        setVisibleCircle(false);
      };
      const handleRegionChangeComplete = (r) => {
        setRegion(r);
        setVisibleCircle(true);
        onRegionChangeComplete(r);
      };

      return (
        <View style={styles.container}>
          <MapView
            ref={ref}
            rotateEnabled={false}
            zoomEnabled
            zoomTapEnabled
            pitchEnabled
            style={styles.mapContainer}
            initialRegion={initialRegion}
            onPanDrag={() => setVisibleCircle(false)}
            onRegionChange={handleRegionChange}
            onRegionChangeComplete={handleRegionChangeComplete}
          >
            {rangeVisible && visibleCircle && (
              <Circle
                center={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                radius={radius}
                strokeColor={"#00BDAA"}
                fillColor={"rgba(0,189,170,0.3)"}
                strokeWidth={0.5}
              />
            )}
          </MapView>
          <View style={styles.markerFixed}>
            <Image
              style={styles.marker}
              source={require("#assets/icons/map/Subtract.png")}
              resizeMode="contain"
            />
          </View>
        </View>
      );
    }
  )
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
    left: "50%",
    marginLeft: -24,
    marginTop: -48,
    position: "absolute",
    top: "50%",
  },
  marker: {
    height: 48,
    width: 48,
  },
});

export default MapSection;
