import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors } from "#themes";

const PhotoFullScreen = ({ navigation, route }) => {
  const imageUrl = route?.params?.imageUrl ?? "";
  const removePic = route?.params?.removePic ?? "";
  const currIndex = route?.params?.currIndex ?? "";
  const isClaim = route?.params?.isClaim;

  const removeSelectedPhoto = () => {
    removePic(currIndex);
    navigation.goBack();
    // actions.removePhotoFromList({ index });
  };
  return (
    <View style={styles.container}>
      {isClaim != true && (
        <View
          style={{
            position: "absolute",
            right: 22,
            top: getStatusBarHeight() + 5,
            zIndex: 100,
          }}
        >
          <TouchableOpacity onPress={() => removeSelectedPhoto()}>
            <AntDesign
              name="delete"
              size={25}
              color="#fff"
              style={{
                textAlign: "center",
                width: 29,
                margin: 10,
                shadowOpacity: 0.4,
                textShadowRadius: 4,
                textShadowOffset: { width: 1, height: 1 },
                elevation: 4,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          position: "absolute",
          left: 10,
          top: getStatusBarHeight(),
          zIndex: 100,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="ios-close"
            style={{
              textAlign: "center",
              width: 27,
              shadowOpacity: 0.4,
              margin: 10,
              textShadowRadius: 4,
              textShadowOffset: { width: 1, height: 1 },
              elevation: 4,
            }}
            size={35}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  image: {
    width,
    height: height,

    position: "absolute",
    zIndex: 1,
  },
  paginationStyle: {
    bottom: 12,
  },
  dot: {
    backgroundColor: "transparent",
    width: 5,
    height: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.inactiveShape,
    marginLeft: 4,
    marginRight: 4,
  },
  dotActive: {
    borderColor: Colors.active,
    backgroundColor: Colors.active,
  },
});

export default PhotoFullScreen;
