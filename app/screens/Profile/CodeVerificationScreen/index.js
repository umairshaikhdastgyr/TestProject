import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import CodeInput from "react-native-confirmation-code-input";
import _ from "lodash";
import { getUserInfo } from "#modules/User/actions";
import { NormalButton, SweetAlert } from "#components";
import { userSelector } from "#modules/User/selectors";
import { Colors } from "#themes";
import { requestCode, verifyCode } from "#services/api";

import { styles } from "./styles";

import ScreenLoader from "#components/Loader/ScreenLoader";

const CodeVerificationScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  let field = null;
  const [isEnabled, setEnabled] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const { user } = useSelector(userSelector);
  const [alertStatus, setAlertStatus] = useState({
    title: "",
    visible: false,
    message: "",
    type: "",
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route?.params?.title ?? "Email verification",
      headerRight: null,
    });
  }, [navigation, route]);

  const requestVerificationCode = useCallback(async () => {
    const type = route?.params?.index ?? 0;

    const body = {};

    if (type === 0) {
      body.email = route?.params?.value ?? 0;
    } else if (type === 1) {
      body.phonenumber = `${route?.params?.value ?? 0}`;
    }

    const res = await requestCode(
      body,
      _.get(user.information, "id", ""),
      type === 0 ? "email" : "phonenumber"
    );

    if (!res.sucess) {
      setAlertStatus({
        title: "Oops",
        visible: true,
        message: "Failure to send code.",
        type: "error",
      });
    }
  }, [navigation, user.information]);

  useEffect(() => {
    requestVerificationCode();
  }, [requestVerificationCode]);

  const onAlertModalTouchOutside = () => {
    setAlertStatus({
      title: "",
      visible: false,
      message: "",
      type: "",
    });
    if (status) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (code.length === 5) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [code]);

  const onVerify = async () => {
    setLoading(true);
    const type = route?.params?.index ?? 0;

    const res = await verifyCode(
      _.get(user.information, "id", ""),
      type === 0 ? "email" : "phonenumber",
      { token: code }
    );
    setLoading(false);
    if (res.sucess) {
      setAlertStatus({
        title: "Success",
        visible: true,
        message: "You've verified successfully.",
        type: "success",
      });
      setStatus(true);
      dispatch(getUserInfo({ userId: _.get(user, "information.id", "") }));
    } else {
      setAlertStatus({
        title: "Oops",
        visible: true,
        message: "Verification failed. \n Please try again with correct code.",
        type: "error",
      });
    }
  };

  const onFocusInput = () => {
    field.clear();
    setEnabled(false);
    setCode("");
  };

  const onCodeChange = (str) => {
    setCode(str);
  };

  const onReSendSMSCode = async () => {
    setLoading(true);
    const type = route?.params?.index ?? 0;

    const target = route?.params?.value ?? 0;

    const body = {};
    if (type === 0) {
      body.email = target;
    } else if (type === 1) {
      body.phonenumber = target;
    }
    const res = await requestCode(
      body,
      _.get(user.information, "id", ""),
      type === 0 ? "email" : "phonenumber"
    );
    setLoading(false);

    if (_.get(res, "sucess", null)) {
      if (type === 0) {
        setAlertStatus({
          title: "Info",
          visible: true,
          message: `We have sent a verification code to your email address \n ${target}`,
          type: "success",
        });
      } else if (type === 1) {
        setAlertStatus({
          title: "Info",
          visible: true,
          message: `We have sent a verification code to your phone number \n ${target}`,
          type: "success",
        });
      }
    }
  };

  const label = `We have sent your verification code to\n${
    route?.params?.value ?? 0
  }`;

  return (
    <SafeAreaView style={styles.container} forceInset={{ bottom: "never" }}>
      <Text style={styles.descriptionText}>{label}</Text>
      <View style={styles.verificationCodeContainer}>
        <TouchableOpacity
          style={styles.codeInput}
          activeOpacity={1}
          onPress={onFocusInput}
        >
          <CodeInput
            ref={(ref) => {
              field = ref;
            }}
            secureTextEntry={hidePass ? true : false}
            className={"border-circle"}
            activeColor={Colors.inactiveText}
            inactiveColor={Colors.inactiveText}
            autoFocus={false}
            ignoreCase
            inputPosition="center"
            size={20}
            space={14}
            onFulfill={(isValid) => console.info("isValid", isValid)}
            containerStyle={styles.codeInputContainer}
            codeLength={5}
            keyboardType={"numeric"}
            textContentType={"username"}
            autoCompleteType={"off"}
            autoCorrect={false}
            onCodeChange={onCodeChange}
            returnKeyType={"done"}
          />
        </TouchableOpacity>
        <Text style={styles.smsLabel}>
          Enter the code{" "}
          <Text
            style={{ textDecorationLine: "underline", color: "green" }}
            onPress={() => setHidePass(!hidePass)}
          >
            {hidePass ? "Show" : "Hide"}
          </Text>
        </Text>
      </View>
      <View style={styles.resendBtnContainer}>
        <TouchableOpacity onPress={onReSendSMSCode}>
          <Text style={styles.activeText}>Send verification code again</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBtnContainer}>
        <NormalButton
          label="Verify"
          onPress={onVerify}
          disabled={!isEnabled}
          buttonStyle={{
            backgroundColor: isEnabled ? Colors.primary : Colors.inactiveShape,
          }}
        />
      </View>
      <SweetAlert
        title={alertStatus.title}
        message={alertStatus.message}
        type={alertStatus.type}
        dialogVisible={alertStatus.visible}
        onTouchOutside={onAlertModalTouchOutside}
        iconWidth={120}
      />
      {loading && <ScreenLoader />}
    </SafeAreaView>
  );
};

export default CodeVerificationScreen;
