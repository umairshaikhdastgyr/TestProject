import React, { useState, useRef } from "react";

import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Utilities } from "#styles";
import { userSelector } from "#modules/User/selectors";
import { checkEmail } from "#utils";
import { Button, Toast } from "#components";
import { Colors, Fonts } from "#themes";
import {
  requestCode as requestCodeApi,
  verifyCode as verifyCodeApi,
  updateProfile as updateProfileApi,
} from "#services/api";
import CodeInput from "react-native-confirmation-code-input";

const PersonalInfoEmailVerifyCodeScreen = ({ navigation, route }) => {
  const { user } = useSelector(userSelector);
  const { information: userInfo } = user;
  const otpRef = useRef(null);
  const [errEmail, setErrEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const email = route?.params?.email ?? null;
  const [code, setCode] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    isVisible: false,
    message: "",
  });

  const handleRequestCode = async () => {
    otpRef.current.clear();
    setCode("");
    try {
      if (!email) {
        return;
      }

      if (isLoading) {
        return;
      }

      setIsLoading(true);
      setErrEmail("");

      const requestCodeParam = { email };
      const requestCodeResponse = await requestCodeApi(
        requestCodeParam,
        userInfo.id,
        "email"
      );
      if (requestCodeResponse?.sucess) {
        setToastMessage({
          isVisible: true,
          message: `Your OTP send successfully ${email}.`,
        });
      }
      if (requestCodeResponse?.result?.success === false) {
        otpRef.current.clear();
        throw new Error(
          requestCodeResponse?.result?.content?.message ??
            "Please check your email address and try again"
        );
      }
      setCode("");
    } catch (error) {
      setCode("");
      otpRef.current.clear();
      setErrEmail(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      if (!email) {
        return;
      }

      if (isLoading) {
        return;
      }

      setIsLoading(true);
      setErrEmail("");

      const verifyCodeParam = { email, token: code };
      const verifyCodeResponse = await verifyCodeApi(
        userInfo.id,
        "email",
        verifyCodeParam
      );
      if (verifyCodeResponse?.result?.success === false) {
        otpRef.current.clear();
        throw new Error(
          verifyCodeResponse?.result?.content?.message ??
            "Please check your email address and try again"
        );
      }

      setVerificationSuccess(true);
      const updateProfileParam = {
        userId: userInfo.id,
        email,
      };

      const updateProfileResponse = await updateProfileApi(updateProfileParam);


      if (updateProfileResponse?.result?.success === false) {
        throw new Error(
          updateProfileResponse?.result?.content?.message ??
            'Please check your email address and try again',
        );
      }
    } catch (error) {
      otpRef.current.clear();
      setErrEmail(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSuccess) {
    return (
      <>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: Colors.backgroundGrey,
            justifyContent: "space-between",
          }}
          forceInset={{ bottom: "never" }}
        >
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontFamily: Fonts.family.regular,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Your email address has been successfully verified.
            </Text>
          </View>
          <View style={{ backgroundColor: "white", padding: 10 }}>
            <Button
              label="Done"
              size="large"
              onPress={() => navigation.navigate("EditPersonalInfo")}
            />
          </View>
        </SafeAreaView>
        <SafeAreaView style={Utilities.safeAreaNotchHelper} />
      </>
    );
  }

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.backgroundGrey,
          justifyContent: "space-between",
        }}
        forceInset={{ bottom: "never" }}
      >
        {toastMessage.isVisible && (
          <Toast
            autoHideMs={3000}
            isVisible={toastMessage.isVisible}
            message={toastMessage.message}
            success={true}
          />
        )}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontFamily: Fonts.family.regular,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            {`We have sent you a verification code to\n${email}`}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#F5F5F5",
            height: 150,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <CodeInput
            ref={otpRef}
            secureTextEntry={hidePass ? true : false}
            className={"border-circle"}
            activeColor={Colors.inactiveText}
            inactiveColor={Colors.inactiveText}
            autoFocus={true}
            ignoreCase
            inputPosition="center"
            size={20}
            space={14}
            onFulfill={(isValid) => console.info("isValid", isValid)}
            codeLength={6}
            keyboardType="numeric"
            textContentType="oneTimeCode"
            autoCompleteType={"off"}
            autoCorrect={false}
            onCodeChange={(text) => setCode(text)}
            returnKeyType={"done"}
          />
          <Text
            style={{
              width: "100%",
              borderTopWidth: 1,
              paddingTop: 10,
              borderColor: "black",
              textAlign: "center",
            }}
          >
            Enter the code{" "}
            <Text
              style={{ textDecorationLine: "underline", color: "green" }}
              onPress={() => setHidePass(!hidePass)}
            >
              {hidePass ? "Show" : "Hide"}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: Fonts.family.regular,
              color: "red",
              paddingHorizontal: 10,
            }}
          >
            {errEmail}
          </Text>
          <TouchableOpacity onPress={handleRequestCode}>
            <Text
              style={{
                fontFamily: Fonts.family.semiBold,
                fontSize: 11,
                color: "#00BDAA",
                textDecorationLine: "underline",
              }}
            >
              Send verification code again
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "white", padding: 10 }}>
          <Button
            label="Verify"
            size="large"
            onPress={handleVerifyCode}
            disabled={
              checkEmail(email) === false || isLoading || code?.length < 5
            }
          />
        </View>
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default PersonalInfoEmailVerifyCodeScreen;
