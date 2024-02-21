import React, { useState } from "react";
import { string } from "prop-types";
import { StyleSheet, ActivityIndicator, View, Platform } from "react-native";
import { CachedImage } from "#components";
import { CustomCachedImage } from "react-native-img-cache";
import Image from "react-native-image-progress";
import * as Progress from "react-native-progress";
import { Colors } from "#themes";
import { ImageAspectRation } from "#constants";

const Picture = ({ source, type, style, screenType, Product }) => {
  const [loader, setLoader] = useState(false);
  return (
    <>
      {Platform.OS == "android" ? (
        <>
          <CachedImage
            source={{ uri: source }}
            style={{ ...styles[type], ...style }}
            resizeMode="contain"
            indicator={Progress.Circle}
            indicatorProps={{
              size: 30,
              borderWidth: 0,
              color: Colors.blacktoolight,
              unfilledColor: Colors.white,
            }}
            onError={() => {
              // your implemention
            }}
          />
        </>
      ) : (
        <>
          {screenType == "explore" && (
            <ActivityIndicator
              size="small"
              color={Colors.blacktoolight}
              style={styles.loader_position}
            />
          )}
          {loader && (
            <ActivityIndicator
              size="small"
              color={Colors.blacktoolight}
              style={styles.loader_position}
            />
          )}
          <CustomCachedImage
            component={Image}
            source={{ uri: source }}
            style={{ ...styles[type], ...style, zIndex: 0 }}
            resizeMode="contain"
            onLoadStart={() => setLoader(true)}
            onLoadEnd={() => setLoader(false)}
          />
        </>
      )}
    </>
  );
};

Picture.propTypes = {
  source: string.isRequired,
  type: string,
};

const styles = StyleSheet.create({
  product: {
    width: "100%",
    aspectRatio: ImageAspectRation,
  },
  ["product-detail"]: {
    width: "100%",
    height: 473,
  },
  ["album-idea"]: {
    width: "100%",
    height: 87,
  },
  avatar: {
    height: 66,
    width: 66,
    borderRadius: 50,
  },
  loader_position: {
    position: "absolute",
    zIndex: -1,
    top: 0,
    right: 0,
    left: 0,
    bottom: 32,
  },
});

export default Picture;
