import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { SafeAreaView, View, BackHandler } from "react-native";
import { safeAreaView, safeAreaNotchHelper } from "#styles/utilities";

import Title from "./components/title";
import AlbumsList from "./views/AlbumsList";

import { useActions } from "#utils";
import { selectUserData } from "#modules/User/selectors";
import { getAlbumsIdeas } from "#modules/Ideas/actions";
import { selectIdeasData } from "#modules/Ideas/selectors";
import { useFocusEffect } from "@react-navigation/native";
import { Toast } from "#components";
import CheckConnection from "#utils/connectivity";
import { MainAuthStackNavigation } from "../../../navigators/MainAuthStackNavigation";

const MainScreen = ({ navigation, route }) => {
  let network = CheckConnection();
  /* Selectors */
  const { information: userInfo } = useSelector(selectUserData());
  const fromScreen = route?.params?.fromScreen ?? "tabBar";
  const followerId = route?.params?.followerId ?? null;

  const [loader, setLoader] = useState(false);

  const {
    albums: { list, isFetching, requireUpdate },
  } = useSelector(selectIdeasData());

  /* Actions */
  const actions = useActions({ getAlbumsIdeas });

  const ideaParams =
    fromScreen === "tabBar"
      ? {
          userId: userInfo.id,
        }
      : {
          userId: followerId,
          isPrivate: false,
        };

  useEffect(() => {
    const handleBackButton = () => {
      navigation.goBack();
      return true;
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => subscription.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userInfo.id) {
        actions.getAlbumsIdeas({ params: ideaParams });
      } else {
        if (network === true) {
          MainAuthStackNavigation(navigation);
        } else {
          setLoader(false);
        }
      }
    }, [navigation, userInfo.id, network])
  );

  useFocusEffect(
    useCallback(() => {
      if (requireUpdate === true) {
        if (userInfo.id) {
          actions.getAlbumsIdeas({ params: ideaParams });
        }
      }
    }, [navigation, list, requireUpdate, userInfo.id, network])
  );

  if (!userInfo.id) {
    return (
      <View
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          position: "absolute",
          backgroundColor: "#fff",
        }}
      ></View>
    );
  }

  return (
    <>
      <SafeAreaView style={safeAreaNotchHelper} />
      <SafeAreaView style={safeAreaView}>
        <Toast
          isVisible={network === false}
          message="Please, check your internet connection."
        />
        {fromScreen === "tabBar" && <Title navigation={navigation} />}
        <AlbumsList
          navigation={navigation}
          loader={loader}
          fromScreen={fromScreen}
          network={network === true}
        />
      </SafeAreaView>
    </>
  );
};

export default MainScreen;
