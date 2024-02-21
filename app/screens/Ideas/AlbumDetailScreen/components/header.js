import React from "react";
import { useSelector } from "react-redux";

import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Heading, Icon } from "#components";

import { selectIdeasData } from "#modules/Ideas/selectors";
import { useRoute } from "@react-navigation/native";

const Header = ({ navigation }) => {
  const route = useRoute();
  /* Selectors */
  const {
    albumDetails: { details },
  } = useSelector(selectIdeasData());

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon icon="back" color="grey" />
      </TouchableOpacity>
      <Heading type="h6">{details.name || route?.params?.name}</Heading>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CreateAlbumIdeas", {
            ideasAlbumId: route?.params?.ideasAlbumId,
            type: "edit",
          })
        }
      >
        <Icon icon="edit" color="grey" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 76,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 5,
    zIndex: 2,
  },
});

export default Header;
