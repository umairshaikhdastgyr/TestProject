import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { SafeAreaView, View } from 'react-native';
import { flex } from '#styles/utilities';

import PhotoLibrarySection from './sections/photo-library';
import TakePhotoSection from './sections/take-photo';

import { useActions } from '#utils';
import { selectSellData } from '#modules/Sell/selectors';
import { setPhotoList } from '#modules/Sell/actions';

let refPicsSelected;

const PhotosScreen = ({ navigation, route }) => {
  const { photosList } = useSelector(selectSellData());

  const actions = useActions({ setPhotoList });

  const [activeTab, setActiveTab] = useState('take-photo');
  const [picsSelected, setPicSelected] = useState(
    photosList.map((item, index) => ({
      ...item,
      savIndex: index,
    })),
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
        {activeTab === 'photo-library' && (
          <PhotoLibrarySection
            picsSelected={picsSelected}
            setPicSelected={setPicSelected}
            setActiveTab={setActiveTab}
            handleConfirmActionLocal={handleConfirmActionLocal}
            navigation={navigation}
            maxPhoto={10}
          />
        )}
        {activeTab === 'take-photo' && (
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
