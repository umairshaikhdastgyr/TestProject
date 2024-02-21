import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { styles } from "./styles";
import { FooterAction } from "#components";
import { checkEmail } from "#utils";
import { sendFeedback } from "../../../../modules/General/actions";
import { generalSelector } from "../../../../modules/General/selectors";
import { userSelector } from "#modules/User/selectors";
import usePrevious from "#utils/usePrevious";
import ScreenLoader from "../../../../components/Loader/ScreenLoader";
import { Utilities } from "#styles";

const SendFeedbackScreen = ({ navigation, route }) => {
  const {
    user: {
      information: { id },
    },
  } = useSelector(userSelector);

  const {
    general: { sendFeedbackState },
  } = useSelector(generalSelector);

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [errEmail, setErrEmail] = useState(false);
  const [message, setMessage] = useState("");
  const [errMessage, setErrMessage] = useState(false);
  const prevSendFeedbackState = usePrevious(sendFeedbackState);

  useEffect(() => {
    if (
      sendFeedbackState.data &&
      prevSendFeedbackState &&
      !prevSendFeedbackState.data
    ) {
      setEmail("");
      setMessage("");
      navigation.navigate("FeedbackConfirmation", {
        isAuth: route?.params?.isAuth,
      });
    }
  }, [sendFeedbackState]);

  const onChangeEmail = (text) => {
    setEmail(text);
    const validateEmail = checkEmail(text);
    if (text && !validateEmail) {
      setErrEmail(true);
    } else {
      setErrEmail(false);
    }
  };

  const validForm = () => {
    let valid = true;
    const validEmail = checkEmail(email);
    const validMessage = message;
    if (!validEmail) {
      valid = false;
      setErrEmail(true);
    } else {
      setErrEmail(false);
    }

    if (!validMessage) {
      valid = false;
      setErrMessage(true);
    } else {
      setErrMessage(false);
    }
    return valid;
  };

  const onSend = () => {
    const validateForm = validForm();
    if (!validateForm) return;
    const params = {
      email,
      message,
      userId: id,
    };
    dispatch(sendFeedback({ body: { params } }));
  };

  const renderButton = () => (
    <FooterAction
      mainButtonProperties={{
        label: "Send",
        onPress: () => {
          onSend();
        },
      }}
    />
  );
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              placeholderTextColor={"#999999"}
              style={styles.inputText}
              value={email}
              onChangeText={(text) => onChangeEmail(text)}
              keyboardType="email-address"
              autoCapitalize={false}
            />
            {errEmail && <Text style={styles.redText}>Enter valid email</Text>}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>YOUR MESSAGE</Text>
            <TextInput
              placeholderTextColor={"#999999"}
              style={styles.inputText}
              value={message}
              onChangeText={(text) => setMessage(text)}
              multiline
              blurOnSubmit
            />
            {errMessage && <Text style={styles.redText}>Required</Text>}
          </View>
        </ScrollView>
        {renderButton()}
        {sendFeedbackState.isFetching && <ScreenLoader />}
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default SendFeedbackScreen;
