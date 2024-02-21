import React from "react";

import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Icon, Loader } from "#components";
import { Colors, Fonts } from "#themes";

const AlbumTile = ({ add, text, image, onPress, loading }) => (
  <TouchableOpacity style={styles.tile} onPress={onPress}>
    <View style={[styles.circle, !add && styles.circleShadow]}>
      {!loading && (
        <>
          {add && <Icon icon="add" />}
          {!add && (
            <Image
              source={{ uri: image || null }}
              style={styles.circleImage}
              resizeMode="cover"
            />
          )}
        </>
      )}
      {loading && <Loader />}
    </View>
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  tile: {
    marginRight: 24,
  },
  circle: {
    width: 74,
    height: 74,
    borderRadius: 74,
    backgroundColor: Colors.lightGrey,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  circleImage: {
    width: 74,
    height: 74,
    borderRadius: 74,
  },
  circleShadow: {
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    fontFamily: Fonts.family.regular,
    color: Colors.black,
    textAlign: "center",
    fontSize: 13,
  },
});

export default AlbumTile;
