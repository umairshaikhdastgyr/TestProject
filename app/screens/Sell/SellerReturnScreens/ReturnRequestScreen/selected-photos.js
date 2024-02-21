import React from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
} from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    // marginBottom: 16,
  },
  heading: {
    marginBottom: 16,
    paddingLeft: 16,
  },
  photoTile: {
    marginRight: 10,
  },
  photoContainer: {
    height: width / 5,
    width: width / 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 2, height: 2 },
    marginTop: 12,
  },
  image: {
    width: width / 5,
    height: width / 5,
    borderRadius: 8,
  },
  closeIcon: {
    width: 10,
    height: 10,
  },
  closeBtnContainer: {
    position: "absolute",
    height: 24,
    width: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 4, height: 5 },
    elevation: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    marginHorizontal: 16,
  },
});

const SelectedPhotos = ({ images, navigation }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ marginHorizontal: 24, paddingRight: 35 }}
    >
      {images?.map((photo, index) => (
        <View key={`key-${index}`} style={styles.photoTile}>
          <View style={styles.photoContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("ProductPicturesFull", {
                  images,
                  initialImageId: index,
                  imageIndex: index,
                });
              }}
            >
              <Image
                source={{
                  uri: photo.url,
                }}
                style={styles.image}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default SelectedPhotos;
