import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import moment, { isMoment } from "moment";
import { styles } from "./styles";
import MapItem from "./map-item";

const MeetupArea = ({ data, navigation, onPress }) => (
  <View style={{ marginHorizontal: -20, marginTop: 40 }}>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          fontFamily: "Montserrat-Regular",
          fontSize: 15,
          fontWeight: "600",
        }}
      >
        Meetup
      </Text>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            fontFamily: "Montserrat-Regular",
            fontSize: 15,
            fontWeight: "600",
            textDecorationLine: "underline",
            textTransform: "uppercase",
            color: "#00BDAA",
          }}
        >
          Update
        </Text>
      </TouchableOpacity>
    </View>
    <View>
      <TouchableOpacity
        style={styles.mapToTap}
        onPress={() =>
          navigation.navigate("LocationMap", { location: data.address })
        }
      />
      <MapView
        style={styles.mapContainer}
        zoomEnabled={false}
        scrollEnabled={false}
        region={{
          latitude: data.address.latitude,
          longitude: data.address.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: data.address.latitude,
            longitude: data.address.longitude,
          }}
          image={require("#assets/icons/map/Subtract.png")}
          style={{ width: 30, height: 30 }}
        />
      </MapView>
    </View>
    <View style={{ marginTop: 20, marginBottom: 28 }}>
      <MapItem icon="localization" data={data.address.formattedAddress} />
      <MapItem icon="clock" data={moment(data.scheduledTime).format("lll")} />
    </View>
  </View>
);

export default MeetupArea;
