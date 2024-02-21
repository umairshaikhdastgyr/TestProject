import React, { useState, useEffect } from "react";
import { bool, string, func } from "prop-types";

import { StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { Fonts, Colors } from "#themes";
import { CachedImage } from "#components";
import {
  base64ToImageBlob,
  getImageDataFromStorage,
  saveImageData,
} from "#components/OfflineImageStorage";

const CategoryTag = ({ label, icon, iconActive, active, onPress }) => {
  const [inActiveIcon, setInActiveIcon] = useState(null);
  const [activeIcon, setActiveIcon] = useState(null);

  useEffect(() => {
    saveImageData(icon, icon);
    saveImageData(iconActive, iconActive);
  }, []);

  useEffect(() => {
    getImageDataFromStorage(icon)
      .then((base64Image) => {
        if (base64Image) {
          setInActiveIcon(base64Image);
        }
      })
      .catch((error) => {});

    getImageDataFromStorage(iconActive)
      .then((base64Image) => {
        if (base64Image) {
          setActiveIcon(base64Image);
        }
      })
      .catch((error) => {});
  }, []);

  return (
    <TouchableOpacity style={styles.categorieTag} onPress={onPress}>
      <Image
        source={{
          uri: !active
            ? inActiveIcon
              ? inActiveIcon
              : icon
            : activeIcon
            ? activeIcon
            : iconActive,
        }}
        style={{ ...styles.icon }}
        resizeMode="contain"
      />
      <Text
        style={{
          ...styles.categorieTag__text,
          ...(active && styles["text--active"]),
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

CategoryTag.propTypes = {
  active: bool,
  label: string,
  onPress: func,
};

CategoryTag.defaultProps = {
  active: false,
};

const styles = StyleSheet.create({
  categorieTag: {
    marginRight: 32,
  },
  categorieTag__icon: {
    marginBottom: 4,
    marginLeft: "auto",
    marginRight: "auto",
  },
  categorieTag__text: {
    fontFamily: Fonts.family.regular,
    color: Colors.blackLight,
    fontWeight: "500",
    fontSize: 10,
    textAlign: "center",
  },
  "text--active": {
    color: Colors.black,
    fontFamily: Fonts.family.bold,
    fontWeight: "600",
  },
  icon: {
    width: 45,
    height: 30,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 18,
  },
});

export default CategoryTag;
