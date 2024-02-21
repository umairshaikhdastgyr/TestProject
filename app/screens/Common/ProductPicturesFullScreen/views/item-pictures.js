import React, { useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import { Colors } from "#themes";
import FullImageView from "#components/FullImageView";
import { Loader } from "#components";

const ItemPictures = ({ postDetail, images, initialImageId, imageIndex }) => {
  const [loader, setLoader] = useState(true);
  /* Selectors */

  let initialIndex = 0;

  if (images) {
    initialIndex = images?.findIndex((image) => image.id === initialImageId);
    if (initialIndex == -1) {
      initialIndex = initialImageId;
    }
  } else {
    initialIndex = postDetail?.Product.ProductImages.findIndex(
      (image) => image.id === initialImageId
    );
  }

  setTimeout(() => {
    setLoader(false);
  }, 100);

  return (
    <View style={styles.container}>
      {loader && <Loader />}
      {images ? (
        <Swiper
          bounces
          style={styles.swiper}
          dot={<View style={styles.dot} />}
          activeDot={<View style={[styles.dot, styles.dotActive]} />}
          paginationStyle={styles.paginationStyle}
          loop={false}
          index={initialIndex-1}
        >
          {images?.slice(1)?.map((image) => (
            <FullImageView image={image.url} />
          ))}
        </Swiper>
      ) : (
        postDetail?.Product && (
          <Swiper
            bounces
            style={styles.swiper}
            dot={<View style={styles.dot} />}
            activeDot={<View style={[styles.dot, styles.dotActive]} />}
            paginationStyle={styles.paginationStyle}
            loop={false}
            index={initialIndex-1}
          >
            {postDetail?.Product?.ProductImages?.slice(1)?.map((image) => (
              <FullImageView image={image?.urlImage} />
            ))}
          </Swiper>
        )
      )}
    </View>
  );
};
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width,
    height,
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
  inActive: {
    borderColor: Colors.inactiveText,
    backgroundColor: Colors.inactiveText,
  },
  loaderPosition: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  filledImageView: {
    width: width - 10,
    aspectRatio: 1,
    marginTop: "40%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});

export default ItemPictures;
