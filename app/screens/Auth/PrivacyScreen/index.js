import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import { styles } from "./styles";
import { useSelector, useDispatch } from "react-redux";
import RenderHtml from "react-native-render-html";
import { Utilities } from "#styles";
import ScreenLoader from "#components/Loader/ScreenLoader";
import { getContent } from "#modules/General/actions";
import { generalSelector } from "#modules/General/selectors";

const PrivacyScreen = ({navigation, route}) => {
  const dispatch = useDispatch();

  const { width, height } = useWindowDimensions();
  const { general } = useSelector(generalSelector);
  const { contentState, sendExpressionState } = general;

  useEffect(() => {
    // RNSplashScreen.hide();
    dispatch(getContent({ params: `?type=privacy_policy`, type: "terms" }));
  }, []);

  const source = {
    html: `${general?.contentState?.data?.content}`,
  };

  return (
    <>
      <SafeAreaView style={styles.container}></SafeAreaView>
      {contentState.isFetching ? (
        <ScreenLoader />
      ) : (
        <ScrollView>
          <View style={styles.contentContainer}>
            <RenderHtml contentWidth={width} source={source} />
          </View>
        </ScrollView>
      )}
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default PrivacyScreen;
