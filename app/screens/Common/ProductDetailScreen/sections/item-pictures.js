import React, { useState } from "react";

import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import Swiper from "react-native-swiper";
import { Colors, Fonts } from "#themes";
import DeviceInfo from "react-native-device-info";
import { CachedImage } from "#components";
import * as Progress from "react-native-progress";

const { height, width } = Dimensions.get("window");

const heightConst = height * 0.6; //width / 0.793
const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height - 300;

const ItemPictures = ({
  navigation,
  postDetail,
  status,
  statusColor,
  setPostDetailScreen,
  updatedProductImages = [],
}) => {
  const heightPicturesDefault = heightConst;
  const widthDefault = width;
  const [picturesDimension, setPicturesDimension] = useState({
    height: heightPicturesDefault,
    width: widthDefault,
  });

  const handleFavorite = (value) => {
    setPostDetailScreen({
      ...postDetail,
      isFavorite: value,
    });
  };

  return (
    <Animated.View style={{ ...styles.container }}>
      {status && (
        <View style={styles.headerButton}>
          <View
            style={{
              width: "auto",
              paddingHorizontal: 15,
              height: 43,
              borderRadius: 40,
              backgroundColor:
                status == "Blocked" || status == "blocked"
                  ? Colors.red
                  : statusColor,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={[Fonts.style.buttonText, { color: Colors.white }]}>
              {status}
            </Text>
          </View>
        </View>
      )}
      <Swiper
        bounces={false}
        style={styles.swiper}
        dot={<View style={styles.dot} />}
        activeDot={<View style={{ ...styles.dot, ...styles.dotActive }} />}
        paginationStyle={styles.paginationStyle}
        loop={false}
        loadMinimal={true}
        loadMinimalSize={5}
      >
        {(updatedProductImages?.length > 0
          ? updatedProductImages
          : postDetail?.Product && postDetail?.Product?.ProductImages
        )
          ?.slice(1)
          ?.map((image, index) => {
            return (
              <>
                <TouchableWithoutFeedback
                  key={image.id}
                  style={picturesDimension}
                  onPress={() => {
                    navigation.navigate("ProductPicturesFull", {
                      postDetail: {
                        ...postDetail,
                        Product: {
                          ...postDetail?.Product,
                          ProductImages:
                            updatedProductImages?.length > 0
                              ? updatedProductImages
                              : postDetail?.Product &&
                                postDetail?.Product?.ProductImages,
                        },
                      },
                      initialImageId: image.id,
                      imageIndex: index,
                      handleFav: handleFavorite,
                    });
                  }}
                >
                  <CachedImage
                    source={{ uri: image?.urlImage }}
                    style={{ ...styles.image }}
                    indicator={Progress.Pie}
                    resizeMode="contain"
                    indicatorProps={{
                      size: 30,
                      borderWidth: 0,
                      color: Colors.primary,
                      unfilledColor: Colors.white,
                    }}
                  />
                </TouchableWithoutFeedback>
              </>
            );
          })}
      </Swiper>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
    // position: "absolute",
    zIndex: -1,
    top: 0,
    left: 0,
    width,
    height: heightConst,
  },
  swiper: {
    height: heightConst,
  },
  image: {
    width,
    height: heightConst - 100,
    marginTop: 50,
    justifyContent: "center",
    alignSelf: "center",
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
  headerButton: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width,
    top: 50,
    left: 0,
    zIndex: 99999,
    backgroundColor: "transparent",
  },
  loading: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ItemPictures;
