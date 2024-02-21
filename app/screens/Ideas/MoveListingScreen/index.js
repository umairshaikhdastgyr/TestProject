import React, { useState } from "react";

import { SafeAreaView } from "react-native";
import Header from "./components/header";
import Footer from "./components/footer";
import AlbumsList from "./sections/albums-list";
import { safeAreaView, safeAreaNotchHelper } from "#styles/utilities";

import { moveIdeaToAnotherAlbum } from "#modules/Ideas/actions";
import { useActions } from "#utils";

const MoveListingScreen = ({ navigation, route }) => {
  /* States */
  const [albumIdPicked, setAlbumIdPicked] = useState("");
  const actions = useActions({ moveIdeaToAnotherAlbum });

  const handleSaveIdea = async () => {
    await actions.moveIdeaToAnotherAlbum({
      ideasAlbumId: route?.params?.ideasAlbumId,
      postId: route?.params?.postId,
      params: {
        descripton: "",
        ideasAlbumId: albumIdPicked,
      },
    });
    navigation.goBack();
  };

  return (
    <>
      <SafeAreaView style={safeAreaNotchHelper} />
      <SafeAreaView style={safeAreaView}>
        {/* <Header navigation={navigation} /> */}
        <AlbumsList
          navigation={navigation}
          albumIdPicked={albumIdPicked}
          setAlbumIdPicked={setAlbumIdPicked}
        />
        <Footer handleSaveIdea={handleSaveIdea} />
      </SafeAreaView>
      <SafeAreaView style={safeAreaNotchHelper} />
    </>
  );
};

export default MoveListingScreen;
