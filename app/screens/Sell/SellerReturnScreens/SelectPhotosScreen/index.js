import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";

import { SafeAreaView, View } from "react-native";

import { flex } from "#styles/utilities";

import Header from "./sections/header";
import PhotoLibrarySection from "./sections/photo-library";
import TakePhotoSection from "./sections/take-photo";
import Footer from "./sections/footer";

import { useActions } from "#utils";
import { selectSellData } from "#modules/Sell/selectors";
import { setPhotoList } from "#modules/Sell/actions";
import { useFocusEffect } from "@react-navigation/native";

let refPicsSelected;

const PhotosScreen = ({ navigation }) => {
  /* States */

  const { photosList } = useSelector(selectSellData());

  const actions = useActions({ setPhotoList });

  const [activeTab, setActiveTab] = useState("take-photo");
  const [picsSelected, setPicSelected] = useState([]);
  const tabs = [
    { id: "photo-library", name: "Photo Library" },
    { id: "take-photo", name: "Take Photo" },
  ];

  useEffect(() => {
    setPicSelected(photosList);
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setParams({ handleConfirmAction: handleConfirmActionLocal });
    }, [])
  );

  const handleConfirmActionLocal = () => {
    actions.setPhotoList(refPicsSelected);
    navigation.goBack();
  };

  useEffect(() => {
    refPicsSelected = picsSelected;
  }, [picsSelected]);

  return (
    <SafeAreaView style={flex.grow1}>
      <View style={[flex.grow1]}>
        {activeTab === "photo-library" && (
          <PhotoLibrarySection
            picsSelected={picsSelected}
            setPicSelected={setPicSelected}
            setActiveTab={setActiveTab}
            handleConfirmActionLocal={handleConfirmActionLocal}
            navigation={navigation}
            maxPhoto={10}
          />
        )}
        {activeTab === "take-photo" && (
          <TakePhotoSection
            picsSelected={picsSelected}
            setPicSelected={setPicSelected}
            setActiveTab={setActiveTab}
            handleConfirmActionLocal={handleConfirmActionLocal}
            navigation={navigation}
            maxPhoto={10}
          />
        )}
      </View>
      {/* <Footer tabs={tabs} activeTab={activeTab} /> */}
    </SafeAreaView>
  );
};

export default PhotosScreen;
