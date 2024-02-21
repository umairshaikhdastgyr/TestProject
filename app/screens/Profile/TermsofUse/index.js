import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { styles } from "./styles";
import { useSelector, useDispatch } from "react-redux";
import { generalSelector } from "../../../modules/General/selectors";
import { getContent } from "../../../modules/General/actions";
import { Utilities } from "#styles";
import RenderHtml from "react-native-render-html";
import ScreenLoader from "#components/Loader/ScreenLoader";

const TermsAndConditionScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const { general } = useSelector(generalSelector);
  const { contentState, sendExpressionState } = general;

  useEffect(() => {
    dispatch(getContent({ params: `?type=homitag_ts`, type: "terms" }));
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

export default TermsAndConditionScreen;
