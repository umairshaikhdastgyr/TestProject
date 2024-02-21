import React from "react";

import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import { Icon } from "#components";

import { removePhotoFromList } from "#modules/Sell/actions";
import { useActions } from "#utils";

const SelectedPhoto = ({
  navigation,
  index,
  data,
  removePic,
  isActive,
  screen,
  screenType,
}) => {
  /* Actions */
  const actions = useActions({ removePhotoFromList });

  /* Methods */
  const removeSelectedPhoto = () => {
    removePic(index);
    // actions.removePhotoFromList({ index });
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            width: screenType === "mainscreen" ? 85 : 64,
            height: screenType === "mainscreen" ? 85 : 64,
          },
        ]}
      >
        <View
          style={[
            styles.photoContainer,
            {
              width: screenType === "mainscreen" ? 75 : 56,
              height: screenType === "mainscreen" ? 75 : 56,
            },
          ]}
        >
          <Image
            source={{
              uri:
                data.type === "taken-photo"
                  ? `data:image/jpg;base64,${data.image}`
                  : data.image,
            }}
            style={
              isActive
                ? {
                    width: screenType === "mainscreen" ? 75 : 56,
                    height: screenType === "mainscreen" ? 75 : 56,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: "#00BDAA",
                  }
                : {
                    width: screenType === "mainscreen" ? 75 : 56,
                    height: screenType === "mainscreen" ? 75 : 56,
                    borderRadius: 8,
                  }
            }
          />

          {index === 0 && (
            <View
              style={{
                position: "absolute",
                width: screenType === "mainscreen" ? 75 : 56,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                bottom: screenType === "mainscreen" ? 0 : 0,
                backgroundColor: "rgba(255,255,255, 0.7 )",
                alignItems: "center",
                justifyContent: "center",
                // paddingBottom: 4,
              }}
            >
              <Text
                style={{
                  color: "#000",
                  textAlign: "center",
                  fontSize: 12,
                  fontFamily: "Montserrat-Regular",
                }}
              >
                COVER
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
    height: 64,
    width: 64,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    backgroundColor: "rgba(255,255,255, 0)",
    marginLeft: 10,
  },
  photoContainer: {
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 5, height: 2 },
    elevation: 5,
    backgroundColor: "#fff",
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
