import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Heading, Icon } from "#components";
import AlbumTile from "../components/album-tile";
import { Colors } from "#themes";

import { selectIdeasData } from "#modules/Ideas/selectors";
import { getAlbumsIdeas, savePostToAlbumIdea } from "#modules/Ideas/actions";

const SelectAlbumStep = ({
  setActiveStep,
  closeModal,
  userInfo,
  setAlbumSelectedInfo,
  post,
  translationOnY,
}) => {
  /* Selectors */
  const { albums } = useSelector(selectIdeasData());

  /* Actions */
  const dispatch = useDispatch();

  const dispatchGetAlbumIdeas = useCallback(
    (userId) => {
      dispatch(getAlbumsIdeas({ params: { userId } }));
    },
    [dispatch]
  );

  /* Effects */
  useEffect(() => {
    if (userInfo.id) {
      dispatchGetAlbumIdeas(userInfo.id);
    }
  }, [dispatchGetAlbumIdeas, userInfo.id]);

  const handleSaveIdea = (album) => {
    const dataToSend = {
      ideasAlbumId: album.id,
      helperImage: post.image,
      params: {
        postId: post.id,
        description: "",
      },
    };
    setAlbumSelectedInfo(album);
    dispatch(savePostToAlbumIdea(dataToSend));
    setActiveStep("saved-message");
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: translationOnY }] },
      ]}
    >
      <View style={styles.header}>
        <Heading type="h6">Save To Album</Heading>
        <TouchableOpacity style={{ padding: 10 }} onPress={closeModal}>
          <Icon icon="close" />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[styles.albums]}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {albums.isFetching && <AlbumTile text="Loading" loading />}
        {!albums.isFetching && (
          <>
            <AlbumTile
              add
              text="New Album"
              onPress={() => setActiveStep("new-album")}
            />
            {albums?.list.map((album) => (
              <AlbumTile
                key={album.id}
                text={album.name}
                image={album.firstImage}
                onPress={() => handleSaveIdea(album)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 69,
    paddingLeft: 20,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  albums: {
    paddingHorizontal: 28,
    height: 170,
    alignItems: "center",
  },
});

export default SelectAlbumStep;
