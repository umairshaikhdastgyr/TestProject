import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import { signOut as signOutAction } from "#modules/Auth/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ButtonItems } from "./ButtonItems";
import { styles } from "./styles";
import { SweetDialog } from "#components";
import { setPaymentDefault } from "#modules/Orders/actions";
import { deleteUserAccount } from "#services/apiUsers";
import { userSelector } from "#modules/User/selectors";
import ScreenLoader from "#components/Loader/ScreenLoader";

const AccountSettingScreen = ({ navigation, route }) => {
  const [googleValue, setGoogleValue] = useState(false);
  const [loader, setLoader] = useState(false);
  const {
    user: {
      information: { id },
    },
  } = useSelector(userSelector);
  const dispatch = useDispatch();

  const signOut = async () => {
    const data = {
      state: null,
      selectedCard: { id: null },
      default: null,
      title: null,
      icon: null,
    };
    dispatch(setPaymentDefault(data));
    dispatch(signOutAction());
  };

  const [dialogVisible, setDialogVisible] = useState(false);

  const logotDialogData = {
    code: "draft_available",
    title: "Log out",
    message: "You are about to logout of your account",
    mainBtTitle: "Logout",
    secondaryBtTitle: "Cancel",
  };

  const onModalTouchOutside = () => {
    setDialogVisible(false);
  };

  const onSecondaryButtonPressed = () => {
    setDialogVisible(false);
  };

  const onMainButtonPressed = async () => {
    await setDialogVisible(false);
    await signOut();
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'MainAuth' },
        ],
      })
    );
  };

  const onLogoutPress = () => {
    setDialogVisible(true);
  };

  useEffect(() => {
    check();
  }, []);

  const check = async () => {
    const keys = await AsyncStorage.getItem("@com.homitag:UserInformation");
    const user = JSON.parse(keys);
    if (user.googleaccount == null) {
    } else {
      setGoogleValue(true);
    }
  };

  const onDeleteAccount = async () => {
    setLoader(true);
    try {
      const response = await deleteUserAccount(id);
      if (response?.status == 200) {
        await signOut();
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'MainAuth' },
            ],
          })
        );
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account!",
      "Are you certain you want to delete your account?",
      [
        {
          text: "Delete Account",
          onPress: () => {
            onDeleteAccount();
          },
        },
        { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loader && <ScreenLoader />}
      <ScrollView
        style={styles.mainContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ButtonItems
          onLogoutPress={onLogoutPress}
          navigation={navigation}
          googleValue={googleValue}
          handleDeleteAccount={handleDeleteAccount}
        />
        <SweetDialog
          title={logotDialogData.title}
          message={logotDialogData.message}
          type="two"
          mainBtTitle={logotDialogData.mainBtTitle}
          secondaryBtTitle={logotDialogData.secondaryBtTitle}
          dialogVisible={dialogVisible}
          onTouchOutside={onModalTouchOutside}
          onMainButtonPressed={onMainButtonPressed}
          onSecondaryButtonPressed={onSecondaryButtonPressed}
          logout
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSettingScreen;
