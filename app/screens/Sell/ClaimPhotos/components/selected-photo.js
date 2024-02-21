import React from "react";

import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import { Icon } from "#components";

const SelectedPhoto = ({ index, data, removePic, isActive }) => {
  /* Methods */
  const removeSelectedPhoto = () => {
    removePic(data.Key, index);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.photoContainer]}>
          <Image
            source={{ uri: data.url }}
            style={
              isActive
                ? {
                    width: 62,
                    height: 62,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: "#00BDAA",
                  }
                : {
                    width: 62,
                    height: 62,
                    borderRadius: 8,
                  }
            }
          />

          {index === 0 && (
            <View
              style={{
                position: "absolute",
                width: 62,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                bottom: 0,
                backgroundColor: "rgba(255,255,255, 0.7 )",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#000",
                  textAlign: "center",
                  fontSize: 13,
                  fontFamily: "Montserrat-Regular",
                }}
              >
                Cover
              </Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.closeBtnContainer}
        onPress={removeSelectedPhoto}
      >
        <Icon icon="close" style={{ width: 10, height: 10 }} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 76,
    width: 76,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    backgroundColor: "rgba(255,255,255, 0)",
    marginLeft: 10,
  },
  photoContainer: {
    height: 62,
    width: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
    backgroundColor: "rgba(255,255,255, 0)",
    marginRight: 12,
    marginTop: 12,
  },
  closeBtnContainer: {
    position: "absolute",
    height: 20,
    width: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 4, height: 5 },
    elevation: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    top: 4,
    right: 6,
  },
});

export default SelectedPhoto;
