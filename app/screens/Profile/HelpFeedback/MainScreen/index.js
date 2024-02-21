import React, { useCallback, useEffect, useState } from "react";
import FilterInput from "./filter-input";
import { styles } from "./styles";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import ItemContainer from "./item-container";
import { FooterAction } from "#components";
import { getContent } from "../../../../modules/General/actions";
import { useSelector, useDispatch } from "react-redux";
import { generalSelector } from "../../../../modules/General/selectors";
import { Utilities } from "#styles";
import ScreenLoader from "#components/Loader/ScreenLoader";
import usePrevious from "#utils/usePrevious";
import Icon from "react-native-vector-icons/Entypo";
import { SweetAlert } from "#components";

const HelpFeedbackScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const { general } = useSelector(generalSelector);
  const { contentState, sendExpressionState } = general;

  useEffect(() => {
    dispatch(
      getContent({ params: `?location=policy&isActive=true`, type: "all" })
    );
  }, []);

  const [dialogeContent, setDialogeContent] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });
  const prevSendExpressionState = usePrevious(sendExpressionState);

  useEffect(() => {
    if (
      sendExpressionState.data &&
      prevSendExpressionState &&
      !prevSendExpressionState.data
    ) {
      setDialogeContent({
        title: "Success",
        visible: true,
        message: "Thanks for your opinion",
        type: "success",
      });
    }

    if (
      sendExpressionState.failure &&
      prevSendExpressionState &&
      !prevSendExpressionState.failure
    ) {
      setDialogeContent({
        title: "Oops!",
        visible: true,
        message: JSON.stringify(sendExpressionState.failure),
        type: "error",
      });
    }
  }, [sendExpressionState]);

  const [searchText, setSearchText] = useState("");

  const onAlertModalTouchOutside = () => {
    setDialogeContent({
      title: "",
      visible: false,
      message: "",
      type: "",
    });
  };
  const renderButton = () => {
    return (
      <FooterAction
        mainButtonProperties={{
          label: "Send us Feedback",
          onPress: () => {
            navigation.navigate("SendFeedback", {
              isAuth: route?.params?.isAuth,
            });
          },
        }}
      />
    );
  };

  const renderList = ({ item, index }) => {
    if (
      item.title.toLowerCase().includes(searchText.toLowerCase()) &&
      item.title !== "Privacy Policy" &&
      item.title !== "Terms of Services" &&
      item.title !== "Homitag Shipping Policy for Supplier" &&
      item.title !== "Seller Protection"
    ) {
      return (
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() => {
            navigation.navigate("HelpBuying", {
              qa: { title: item.title, content: item.content, id: item.id },
            });
          }}
        >
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                flex: 8,
                color: "gray",
              }}
            >
              {item.title}
            </Text>
            <View>
              <Icon name="chevron-small-right" size={26} color={"gray"} />
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };
  return (
    <>
      {sendExpressionState.isFetching || general.contentState.isFetching ? (
        <ScreenLoader />
      ) : (
        <SafeAreaView style={styles.container}>
          <FilterInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Looking for something?"}
          />
          <FlatList
            data={general?.contentState?.data}
            renderItem={renderList}
            keyExtractor={(item) => item.id.toString()}
          />
          {renderButton()}
        </SafeAreaView>
      )}
      <SweetAlert
        title={dialogeContent.title}
        message={dialogeContent.message}
        type={dialogeContent.type}
        dialogVisible={dialogeContent.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default HelpFeedbackScreen;
