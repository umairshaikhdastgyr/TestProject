import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native";

import { selectUserData } from "#modules/User/selectors";
import { selectChatData } from "#modules/Chat/selectors";

import { Loader, Toast } from "#components";
import { styles } from "./styles";
import { Alert } from "react-native";

import Tabs from "./Tabs";
import ConversationsList from "./views/ConversationsList";
import ConfirmationPopup from "#screens/Sell/MainScreen/ConfirmationPopup";

import { seenConversation, receiveConversations } from "#modules/Chat/actions";

import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import { clearOrders } from "#modules/Orders/actions";
import CheckConnection from "#utils/connectivity";
import { MainAuthStackNavigation } from "../../../navigators/MainAuthStackNavigation";

const tabs = [
  { id: "all", name: "All" },
  { id: "buy", name: "Buy" },
  { id: "sell", name: "Sell" },
];

let firstLoad = true;

const MainScreen = ({ navigation }) => {
  let network = CheckConnection();

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const { chatInfo, isFetching } = useSelector(selectChatData());
  const { information: userInfo } = useSelector(selectUserData());
  const dispatch = useDispatch();
  const [dataGrouped, setDataGrouped] = useState([]);
  const [showNumberVerificationPopup, setShowVerificationNumberPopup] =
    useState(false);

  useEffect(() => {
    if (!userInfo.id) {
      if (network === true) {
        MainAuthStackNavigation(navigation);
      }
    } else if (!userInfo?.emailvalidated && !userInfo?.phonenumbervalidated) {
      setShowVerificationNumberPopup(true);
    } else {
      navigation.addListener("didFocus", () => {
        dispatch(
          seenConversation({
            conversationId: "",
          })
        );
      });
    }
  }, []);

  const receiveConversationsCallback = useCallback(() => {
    dispatch(
      receiveConversations({
        userId: userInfo.id,
        lightMode: false,
        origin: "app",
      })
    );
  }, [dispatch, userInfo.id]);

  useFocusEffect(
    useCallback(() => {
      receiveConversationsCallback();
    }, [receiveConversationsCallback])
  );

  useEffect(() => {
    const didBlurMainChatScreen = navigation.addListener(
      "blur",
      receiveConversationsCallback
    );

    return () => {
      didBlurMainChatScreen();
    };
  }, [receiveConversationsCallback, navigation]);

  useEffect(() => {
    dispatch(
      receiveConversations({
        userId: userInfo.id,
        lightMode: false,
        origin: "app",
      })
    );
  }, []);

  const loadData = () => {
    firstLoad = false;

    let arrayObj = Object.entries(chatInfo);

    arrayObj.sort(function (a, b) {
      if (moment(a[1].datetime) > moment(b[1].datetime)) {
        return -1;
      }
      if (moment(a[1].datetime) < moment(b[1].datetime)) {
        return 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    if (chatInfo != null) {
      let arrayObj = Object.entries(chatInfo);
      arrayObj.sort(function (a, b) {
        if (moment(a[1].datetime) > moment(b[1].datetime)) {
          return -1;
        }
        if (moment(a[1].datetime) < moment(b[1].datetime)) {
          return 1;
        }
        return 0;
      });

      setDataGrouped(arrayObj);

      if (firstLoad === true) {
        loadData();
      }
    }
  }, [chatInfo]);

  useEffect(() => {
    if (chatInfo != null) {
      const arrayObj = Object.entries(chatInfo);
      arrayObj.sort(function (a, b) {
        if (moment(a[1].datetime) > moment(b[1].datetime)) {
          return -1;
        }
        if (moment(a[1].datetime) < moment(b[1].datetime)) {
          return 1;
        }
        return 0;
      });

      switch (activeTab) {
        case "all":
          setDataGrouped(arrayObj);
          break;
        case "buy":
          setDataGrouped(
            arrayObj.filter((dataList) => dataList[1].sellerId !== userInfo.id)
          );
          break;
        case "sell":
          setDataGrouped(
            arrayObj.filter((dataList) => dataList[1].sellerId === userInfo.id)
          );
          break;
      }
    }
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      setActiveTab(tabs[0].id);
      dispatch(clearOrders());
    }, [dispatch])
  );

  const navigateToNumberVerification = () => {
    navigation.navigate("EditPersonalInfo");
  };

  if (!userInfo.id) {
    return null;
  }
  return (
    <SafeAreaView style={styles.Container}>
      <Toast
        isVisible={network === false}
        message="Please, check your internet connection."
      />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {isFetching === true && dataGrouped.length === 0 && <Loader />}
      {(isFetching === false || dataGrouped.length > 0) && (
        <ConversationsList
          navigation={navigation}
          dataList={dataGrouped}
          userId={userInfo.id}
        />
      )}
      {showNumberVerificationPopup && (
        <ConfirmationPopup
          isVisible={showNumberVerificationPopup}
          title="Verification required!"
          description="Please verify your phone number to access this feature"
          onClose={() => {
            setShowVerificationNumberPopup(false);
            navigation.navigate("ExploreMain");
          }}
          primaryButtonText="Verify Phone Number"
          onPressSecondaryButton={() => {
            setShowVerificationNumberPopup(false);
            navigation.navigate("ExploreMain");
          }}
          secondaryButtonText="Back to Explore"
          onPressPrimaryButton={() => {
            setShowVerificationNumberPopup(false);
            navigateToNumberVerification();
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default MainScreen;
