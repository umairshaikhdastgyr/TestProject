import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { Utilities } from "#styles";
import { userSelector } from "#modules/User/selectors";
import { Button, Toast } from "#components";
import { Colors, Fonts } from "#themes";
import {
  requestCode as requestCodeApi,
  updateProfile as updateProfileApi,
} from "#services/api";

import GooglePhoneLib from "google-libphonenumber";

const PersonalInfoPhoneVerificationScreen = ({ navigation, route }) => {
  const { user } = useSelector(userSelector);
  const { information: userInfo } = user;
  const [phone, setPhone] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dumpNumber, setDumpNumber] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isbuttonworking, setisButtonWorking] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    isVisible: false,
    message: "",
  });

  useEffect(() => {
    if (userInfo?.phonenumbervalidated === true) {
      setisButtonWorking(false);
    } else if (userInfo?.phonenumbervalidated == null) {
      setisButtonWorking(false);
    } else {
      setisButtonWorking(true);
    }
    formatPhoneNow(userInfo?.phonenumber);
  }, []);

  const handleRequestCode = async () => {
    try {
      setIsLoading(true);
      setErrPhone("");
      console.log("phoneNumber => ", phoneNumber);
      var number = 0;
      const PNF = GooglePhoneLib.PhoneNumberFormat;
      const phoneUtil = GooglePhoneLib.PhoneNumberUtil.getInstance();
      if (isEdit) {
        number = phoneUtil.parse("+1" + phoneNumber);
      } else {
        number = phoneUtil.parse(phoneNumber);
      }
      const formattedPhoneNumber = phoneUtil.format(number, PNF.E164);

      const updateProfileParam = {
        userId: userInfo.id,
        phonenumber: formattedPhoneNumber,
        email: userInfo.email,
        // body:{
        //   params:{
        //     userId: userInfo.id,
        //     phonenumber: formattedPhoneNumber,
        //     email: userInfo.email,
        //   }
        // }
      };

      const updateProfileResponse = await updateProfileApi(updateProfileParam);

      if (updateProfileResponse?.result?.success === false) {
        throw new Error(
          updateProfileResponse?.result?.content?.message ??
            "Please check your phone number and try again"
        );
      }

      const requestCodeParam = {
        phonenumber: formattedPhoneNumber,
      };
      const requestCodeResponse = await requestCodeApi(
        requestCodeParam,
        userInfo.id,
        "phonenumber"
      );
      if (requestCodeResponse?.success) {
        setToastMessage({
          isVisible: true,
          message: `Your OTP send successfully ${formattedPhoneNumber}.`,
        });
      }
      if (requestCodeResponse?.result?.success === false) {
        throw new Error(
          requestCodeResponse?.result?.content?.message ??
            "Please check your phone number and try again"
        );
      }

      navigation.navigate("PersonalInfoPhoneVerifyCode", {
        phonenumber: formattedPhoneNumber,
      });
    } catch (error) {
      setErrPhone(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNow = (phoneNumberStringInput) => {
    console.log("phoneNumberStringInput =>", phoneNumberStringInput);
    if (phoneNumberStringInput == null) {
    } else {
      setPhoneNumber(phoneNumberStringInput);
      const phoneNumberStringStr = phoneNumberStringInput;
      const phoneNumberString = phoneNumberStringStr.substring(2);
      console.log("before => " + phoneNumberString);
      console.log("heeree is now " + phoneNumberString);
      let newText = "";
      let cleaned = ("" + phoneNumberString).replace(/\D/g, "");
      for (var i = 0; i < cleaned.length; i++) {
        if (i == 0) {
          newText = "(";
        } else if (i == 3) {
          newText = newText + ") ";
        } else if (i == 6) {
          newText = newText + "-";
        }
        newText = newText + cleaned[i];
      }
      setPhone(newText);
      setDumpNumber(newText);
    }
  };

  const formatPhone = (phoneNumberString) => {
    setPhoneNumber(phoneNumberString);
    let newText = "";
    let cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    for (var i = 0; i < cleaned.length; i++) {
      if (i == 0) {
        newText = "(";
      } else if (i == 3) {
        newText = newText + ") ";
      } else if (i == 6) {
        newText = newText + "-";
      }
      newText = newText + cleaned[i];
    }
    setPhone(newText);
  };

  const numberChange = (number) => {
    formatPhone(number);
    setErrPhone("");
    setIsEdit(true);
    if (number == "" || number.length < 14 || dumpNumber == number) {
      setisButtonWorking(false);
    } else {
      setisButtonWorking(true);
    }
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.backgroundGrey,
          justifyContent: "space-between",
        }}
      >
        {toastMessage.isVisible && (
          <Toast
            autoHideMs={3000}
            isVisible={toastMessage.isVisible}
            message={toastMessage.message}
            success={true}
          />
        )}
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          keyboardShouldPersistTaps={"handled"}
        >
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontFamily: Fonts.family.regular,
                fontSize: 16,
              }}
            >
              Enter Your Phone Number
            </Text>
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                height: 42,
                justifyContent: "flex-end",
                borderBottomColor: "black",
                width: "100%",
              }}
            >
              <View
                style={{
                  width: "20%",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../../../assets/icons/usFlagIcon.png")}
                  style={{ width: 25, height: 25, resizeMode: "contain" }}
                />
              </View>
              <View
                style={{
                  width: "10%",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: Platform.OS === "ios" ? 2 : 0,
                }}
              >
                <Text style={{ fontFamily: Fonts.family.bold }}>+1</Text>
              </View>
              <View
                style={{
                  width: "70%",
                  marginTop: Platform.OS === "ios" ? 12 : 0,
                }}
              >
                <TextInput
                  placeholder="(###) ###-####"
                  maxLength={14}
                  style={{
                    width: "100%",
                    //textAlign: 'center',
                    fontFamily: Fonts.family.bold,
                  }}
                  keyboardType="phone-pad"
                  blurOnSubmit
                  value={phone}
                  // new state => formateed
                  onChangeText={(number) => {
                    numberChange(number);
                  }}
                />
              </View>
            </View>
            <Text
              style={{
                width: "100%",
                textAlign: "center",
                marginTop: 10,
                fontFamily: Fonts.family.semiBold,
                fontSize: 12,
              }}
            >
              {userInfo &&
              userInfo?.phonenumbervalidated != null &&
              userInfo?.phonenumbervalidated &&
              !isbuttonworking
                ? "Phone number already verified."
                : "We will send you a verification code via SMS."}
            </Text>
          </View>
          <View
            style={{
              width: "92%",
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: Fonts.family.regular,
                color: "red",
              }}
            >
              {errPhone}
            </Text>
          </View>
        </ScrollView>
        <View style={{ backgroundColor: "white", padding: 10 }}>
          <Button
            label="Send Code"
            size="large"
            onPress={handleRequestCode}
            disabled={
              isLoading === true
                ? true
                : isbuttonworking === true
                ? false
                : true
            }
          />
        </View>
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default PersonalInfoPhoneVerificationScreen;
