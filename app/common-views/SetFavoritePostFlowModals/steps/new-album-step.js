import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Keyboard,
  Platform,
} from "react-native";
import { Heading, Icon, InputText, Button } from "#components";
import { Colors } from "#themes";

import { selectIdeasData } from "#modules/Ideas/selectors";
import { createAlbumIdea, savePostToAlbumIdea } from "#modules/Ideas/actions";

const NewAlbumStep = ({
  setActiveStep,
  closeModal,
  userInfo,
  post,
  setAlbumSelectedInfo,
  closeNewModal,
}) => {
  const dispatch = useDispatch();
  /* Selectors */
  const {
    albums: { list: albumsList, isFetching: isFetchingAlbum },
  } = useSelector(selectIdeasData());

  /* States */
  const [albumName, setAlbumName] = useState("");
  const [saveWasPressed, setSaveWasPressed] = useState(false);

  const [dialogStyle, setDialogStyle] = useState({});

  useEffect(() => {
    const _keyboardDidShow = () => {
      setDialogStyle({ marginBottom: Platform.OS === "ios" ? 200 : 0 });
    };

    const _keyboardDidHide = () => {
      setDialogStyle({});
    };

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      _keyboardDidShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      _keyboardDidHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  /* Effects */
  useEffect(() => {
    const processSave = async () => {
      await handleSaveIdea(albumsList[0]);
      setSaveWasPressed(false);
    };
    if (saveWasPressed && !isFetchingAlbum) {
      processSave();
    }
  }, [albumsList, handleSaveIdea, isFetchingAlbum, saveWasPressed]);

  /* Methods */
  const handlePressSave = async () => {
    setSaveWasPressed(true);
    dispatch(
      createAlbumIdea({
        userId: userInfo.id,
        name: albumName ? albumName : "New Unnamed Album",
        description: "",
        isPrivate: true,
      })
    );
  };

  const handleSaveIdea = useCallback(
    async (album) => {
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
      Keyboard.dismiss();
      setActiveStep("saved-message");
    },
    [dispatch, post.id, post.image, setActiveStep, setAlbumSelectedInfo]
  );

  return (
    <View style={[styles.container, dialogStyle]}>
      <View style={styles.header}>
        <Heading type="h6">Create Album</Heading>
        <TouchableOpacity onPress={closeNewModal}>
          <Icon icon="close" />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.imageContainer}>
          <Image style={styles.imagePlaceholder} source={{ uri: post.image }} />
        </View>
        <InputText
          placeholder="Name Your Album"
          name="albumName"
          value={albumName}
          onChangeText={(value) => setAlbumName(value)}
          bottomLine={false}
          maxLength={40}
          fullWidth
          numberOfLines={3}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
        />
        <Button
          style={{ marginTop: 20 }}
          disabled={isFetchingAlbum || albumName.length === 0}
          label="Save"
          onPress={handlePressSave}
          size="large"
          fullWidth
        />
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: width - 60,
    borderRadius: 5,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 69,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  body: {
    padding: 26,
    paddingBottom: 40,
    alignItems: "center",
  },
  imagePlaceholder: {
    width: 74,
    height: 74,
    borderRadius: 74,
    backgroundColor: Colors.lightGrey,
    marginBottom: 20,
  },
  imageContainer: {
    width: 74,
    height: 74,
    borderRadius: 74,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 15,
  },
});

export default NewAlbumStep;
