import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

import { SafeAreaView, Share } from "react-native";
import { safeAreaView, safeAreaNotchHelper } from "#styles/utilities";
import Tabs from "./components/tabs";
import SavedView from "./views/saved";
import RelatedView from "./views/related";

import { selectIdeasData } from "#modules/Ideas/selectors";
import {
  getAlbumIdeasDetail,
  getAlbumIdeasRelatedPost,
  getAlbumIdeasSavedPost,
} from "#modules/Ideas/actions";
import { useActions } from "#utils";
import { useFocusEffect } from "@react-navigation/native";

const AlbumDetailScreen = ({ navigation, route }) => {
  const ideasAlbumId = route?.params?.ideasAlbumId;
  /* Selectors */
  const {
    albumDetails: { details, requireUpdate },
  } = useSelector(selectIdeasData());

  /* States */
  const [activeTab, setActiveTab] = useState("saved");
  const tabs = [
    { id: "saved", name: "Saved" },
    { id: "related", name: "Related" },
  ];

  /* Actions */
  const actions = useActions({
    getAlbumIdeasDetail,
    getAlbumIdeasRelatedPost,
    getAlbumIdeasSavedPost,
  });

  /* Effects */
  useEffect(() => {
    actions.getAlbumIdeasDetail({
      ideasAlbumId: ideasAlbumId,
    });
    actions.getAlbumIdeasRelatedPost({
      ideasAlbumId: ideasAlbumId,
      page: 1,
      perPage: 20,
    });
    actions.getAlbumIdeasSavedPost({
      ideasAlbumId: ideasAlbumId,
      page: 1,
      perPage: 20,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ name: details.name });
    }, [details.name])
  );

  useEffect(() => {
    if (requireUpdate === true) {
      actions.getAlbumIdeasDetail({
        ideasAlbumId: ideasAlbumId,
      });
    }
  }, [requireUpdate]);

  /* Methods */
  const openShareAlbumOptions = async () => {
    const shareOptions = {
      title: "Share Album",
      message: `Check out this ${details.name}. I found on Homitag.`,
    };
    await Share.share(shareOptions);
  };

  return (
    <>
      <SafeAreaView style={safeAreaNotchHelper} />
      <SafeAreaView style={safeAreaView}>
        {/* <Header navigation={navigation} /> */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openShareAlbumOptions={openShareAlbumOptions}
          navigation={navigation}
        />
        {activeTab === "saved" && (
          <SavedView navigation={navigation} route={route} ideasAlbumId={ideasAlbumId} />
        )}
        {activeTab === "related" && (
          <RelatedView navigation={navigation} ideasAlbumId={ideasAlbumId} />
        )}
      </SafeAreaView>
    </>
  );
};

export default AlbumDetailScreen;
