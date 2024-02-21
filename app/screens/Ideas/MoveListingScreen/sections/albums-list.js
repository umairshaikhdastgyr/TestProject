import React from "react";
import { useSelector } from "react-redux";

import { ScrollView, StyleSheet } from "react-native";
import { Heading, CheckBoxSquare } from "#components";

import { selectIdeasData } from "#modules/Ideas/selectors";
import { useRoute } from "@react-navigation/native";

const AlbumsList = ({ navigation, albumIdPicked, setAlbumIdPicked }) => {
  const route = useRoute();
  /* Selectors */
  const {
    albums: { list },
  } = useSelector(selectIdeasData());

  return (
    <ScrollView style={styles.container}>
      <Heading type="bodyText" bold style={styles.heading}>
        Select an album
      </Heading>
      {list.map((album) => (
        <CheckBoxSquare
          key={album.id}
          label={album.name}
          active={albumIdPicked === album.id}
          disabled={route?.params?.ideasAlbumId === album.id}
          onChange={() => setAlbumIdPicked(album.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  heading: {
    marginBottom: 42,
  },
});

export default AlbumsList;
