import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Keyboard,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StepsBar, InputText, Heading } from "#components";

import styles from "./styles";

import { selectSellData } from "#modules/Sell/selectors";
import { setFormValue, changePostDetail } from "#modules/Sell/actions";
import { useActions } from "#utils";
import DeviceInfo from "react-native-device-info";

const PostTitleScreen = ({ navigation, route }) => {
  let hasDynamicIsland = DeviceInfo.hasDynamicIsland();
  /* Selectors */
  const { formData } = useSelector(selectSellData());

  /* Actions */
  const actions = useActions({ setFormValue, changePostDetail });

  /* States */
  const [postTitle, setPostTitle] = useState(formData.postTitle);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardShow, setKeyboardShow] = useState(true);

  const marginFromBottom = keyboardHeight === 0 ? 0 : keyboardHeight;

  let keyboardDidShowListener = null;
  let keyboardDidHideListener = null;

  useFocusEffect(
    useCallback(() => {
      const keyboardDidShow = (event) => {
        setKeyboardHeight(
          event.endCoordinates.height > 100
            ? Platform.OS === "ios"
              ? event.endCoordinates.height
              : 0
            : 0
        );
        setKeyboardShow(true);
      };

      const keyboardDidHide = (event) => {
        setKeyboardHeight(0);
        setKeyboardShow(false);
      };
      keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        keyboardDidShow
      );
      keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        keyboardDidHide
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, [])
  );

  /* Methods */
  const handleSubmit = () => {
    actions.setFormValue({ postTitle: postTitle.trim() });
    if (formData.postTitle != postTitle) {
      actions.changePostDetail(true);
    }
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={style.parent}
      keyboardShouldPersistTaps={"always"}
    >
      <StepsBar steps={5} step={2} />
      <KeyboardAvoidingView style={style.parent}>
        <View style={style.parent}>
          <View style={style.parent}>
            <View style={[styles["section-container"]]}>
              <View
                style={[styles["header-title-count"], { marginBottom: 10 }]}
              >
                <Heading type="bodyText" bold>
                  Post Title
                </Heading>
                <Heading type="bodyText" style={{ color: "gray" }}>
                  {postTitle?.length}
                  /70
                </Heading>
              </View>
              <InputText
                placeholder="Title is very important..."
                fullWidth
                textAlign="left"
                autoCapitalize={"words"}
                value={postTitle}
                onChangeText={(value) => {
                  setPostTitle(value);
                }}
                autoFocus
                maxLength={70}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                style={{ fontSize: 15 }}
                bottomLine={false}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
          <View
            style={{
              ...style.bottomParent,
              marginBottom: hasDynamicIsland
                ? marginFromBottom == 0
                  ? 0
                  : marginFromBottom - 36
                : marginFromBottom,
            }}
          >
            <TouchableOpacity
              style={{ paddingVertical: Platform.OS === "ios" ? 20 : 10 }}
              onPress={handleSubmit}
            >
              <Text style={style.bottom}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  parent: {
    flex: 1,
  },
  bottomParent: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#DADADA",
    paddingRight: 10,
    backgroundColor: "#fff",
    zIndex: 9,
  },
  bottom: {
    textAlignVertical: "center",
    textAlign: "center",
    color: "#00BDAA",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
  },
});

export default PostTitleScreen;
