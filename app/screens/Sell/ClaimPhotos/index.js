import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView, View } from "react-native";

import { useActions } from "#utils";
import { addClaimPhotoToList, setClaimPhotoList } from "#modules/User/actions";
import { selectUserData } from "#modules/User/selectors";
import { flex } from "#styles/utilities";

import PhotoLibrarySection from "./sections/photo-library";
import TakePhotoSection from "./sections/take-photo";

let refPicsSelected;

const ClaimPhotos = ({ navigation, route }) => {
  const dispatch = useDispatch();
  /* States */

  const { claimPhotosList } = useSelector(selectUserData());

  const actions = useActions({ setClaimPhotoList });

  const [activeTab, setActiveTab] = useState("take-photo");
  const [picsSelected, setPicSelected] = useState([]);
  const tabs = [
    { id: "photo-library", name: "Photo Library" },
    { id: "take-photo", name: "Take Photo" },
  ];

  const order = route?.params?.order ?? {};
  useEffect(() => {
    navigation.setParams({ handleConfirmAction: handleConfirmActionLocal });
    setPicSelected(claimPhotosList);
  }, []);

  const handleConfirmActionLocal = () => {
    setTimeout(() => {
      actions.setClaimPhotoList(refPicsSelected);
      navigation.goBack();
    }, 1500);
  };

  useEffect(() => {
    refPicsSelected = claimPhotosList;
  }, [picsSelected, claimPhotosList]);

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
            order={order}
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
            order={order}
            maxPhoto={10}
          />
        )}
      </View>
      {/* <Footer tabs={tabs} activeTab={activeTab} /> */}
    </SafeAreaView>
  );
};

export default ClaimPhotos;
