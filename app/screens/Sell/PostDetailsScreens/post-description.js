import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import {
  StyleSheet,
  Platform,
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StepsBar, InputText, Heading } from "#components";

import styles from "./styles";

import { selectSellData } from "#modules/Sell/selectors";
import { setFormValue, changePostDetail } from "#modules/Sell/actions";
import { useActions } from "#utils";
import DeviceInfo from "react-native-device-info";

const PostDescriptionScreen = ({ navigation, route }) => {
  let hasDynamicIsland = DeviceInfo.hasDynamicIsland();
  /* Selectors */
  const { formData } = useSelector(selectSellData());

  /* Actions */
  const actions = useActions({ setFormValue, changePostDetail });

  /* States */
  const [postDescription, setPostDescription] = useState(
    formData.postDescription ?? ""
  );

  /* Methods */
  const handleSubmit = () => {
    actions.setFormValue({ postDescription: postDescription.trim() });
    if (formData.postDescription != postDescription) {
      actions.changePostDetail(true);
    }
    navigation.goBack();
  };
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const marginFromBottom = keyboardHeight === 0 ? 0 : keyboardHeight;

  let keyboardDidShowListener = null;
  let keyboardDidHideListener = null;

  const [keyboardShow, setKeyboardShow] = useState(true);

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
  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      keyboardShouldPersistTaps={"always"}
    >
      <StepsBar steps={5} step={2} />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={style.parent}>
          <View style={style.upper}>
            <View style={styles["section-container"]}>
              <View style={styles["header-title-count"]}>
                <Heading type="bodyText" bold>
                  Post Description
                </Heading>
                <Heading type="bodyText" style={{ color: "gray" }}>
                  {postDescription?.length}
                  /1500
                </Heading>
              </View>
              <InputText
                placeholder="Write a nice description..."
                fullWidth
                textAlign="left"
                value={postDescription}
                onChangeText={(value) => setPostDescription(value)}
                autoCapitalize="sentences"
                autoFocus
                maxLength={1500}
                bottomLine={false}
                multiline
                numberOfLines={5}
                style={{ fontSize: 15, marginBottom: 25 }}
                onSubmitEditing={handleSubmit}
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
  upper: {
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
export default PostDescriptionScreen;
