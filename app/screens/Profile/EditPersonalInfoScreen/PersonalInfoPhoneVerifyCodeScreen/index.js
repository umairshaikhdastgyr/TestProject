import React, { useState,  useEffect, useRef } from 'react';

import { SafeAreaView, Text, View ,TouchableOpacity} from 'react-native';
import { Utilities } from '#styles';
import { userSelector } from '#modules/User/selectors';
import { Button, Toast } from '#components';
import { Colors, Fonts } from '#themes';
import {
  requestCode as requestCodeApi,
  verifyCode as verifyCodeApi,
} from '#services/api';
import CodeInput from 'react-native-confirmation-code-input';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from '#modules/User/actions';

const PersonalInfoPhoneVerifyCodeScreen = ({ navigation, route }) => {
  const { user } = useSelector(userSelector);
  const { information: userInfo } = user;
  const otpRef = useRef(null);
  const [errPhone, setErrPhone] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const phonenumber = route?.params?.phonenumber ?? null;
  const [token, setToken] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    isVisible: false,
    message: '',
  });
  const dispatch = useDispatch();
  useEffect(() => {
    formatPhone(phonenumber)
}, []);

  const formatPhone = (phoneNumberStringInput) => {
    const phoneNumberStringStr=phoneNumberStringInput;
    const phoneNumberString=phoneNumberStringStr.substring(2);
    let newText = "";
    let cleaned =('' + phoneNumberString).replace(/\D/g, '');
    for(var i = 0; i < cleaned.length; i ++){
      if(i == 0){
        newText= '(';
      } else if(i == 3 ){
        newText = newText + ") ";
      } else if(i == 6){
        newText = newText + "-"
      }
      newText = newText + cleaned[i]
    }
    setPhone("+1 "+newText)
  }

  const handleRequestCode = async () => {
    otpRef.current.clear();
    setToken('')
    try {
      if (!phonenumber) {
        return;
      }

      if (isLoading) {
        return;
      }

      setIsLoading(true);
      setErrPhone('');

      const requestCodeParam = { email: userInfo.email, phonenumber };
      const requestCodeResponse = await requestCodeApi(
        requestCodeParam,
        userInfo.id,
        'phonenumber',
      );
      if(requestCodeResponse?.sucess){
        setToastMessage({
          isVisible: true,
          message: `Your OTP send successfully ${phonenumber}.`,
        })
      }
      if (requestCodeResponse?.result?.success === false) {
        setToken('')
        otpRef.current.clear();
        throw new Error(
          requestCodeResponse?.result?.content?.message ??
            'Please check your phone number and try again',
        );
      }
      setToken('');
    } catch (error) {
      setErrPhone(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      if (!phonenumber) {
        return;
      }

      if (isLoading) {
        return;
      }

      setIsLoading(true);
      setErrPhone('');

      const verifyCodeParam = { phonenumber, token };
      const verifyCodeResponse = await verifyCodeApi(
        userInfo.id,
        'phonenumber',
        verifyCodeParam,
      );
      if (verifyCodeResponse?.result?.success === false) {
        setToken('')
        otpRef.current.clear();
        throw new Error(
          verifyCodeResponse?.result?.content?.message ??
            'Please check your phone number and try again',
        );
      }

      setVerificationSuccess(true);
    } catch (error) {
      setErrPhone(error.message);
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
            justifyContent: 'space-between',
          }}
          forceInset={{ bottom: 'never' }}
        >
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontFamily: Fonts.family.regular,
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              Your phone number has been successfully verified.
            </Text>
          </View>
          <View style={{ backgroundColor: 'white', padding: 10 }}>
            <Button
              label="Done"
              size="large"
              onPress={() =>{dispatch(getUserInfo({ userId: userInfo.id })); navigation.navigate('ProfileMain')}}
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
          justifyContent: 'space-between',
        }}
        forceInset={{ bottom: 'never' }}
      >
      {toastMessage.isVisible &&  <Toast
          autoHideMs={3000}
          isVisible={toastMessage.isVisible}
          message={toastMessage.message}
          success={true}
        />}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontFamily: Fonts.family.regular,
              fontSize: 16,
              textAlign: 'center',
            }}
          >
            {`We have sent you a verification code to\n${phone}`}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#F5F5F5',
            height: 150,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <CodeInput
            ref={otpRef}
            secureTextEntry={hidePass ? true : false}
            className={'border-circle'}
            activeColor={Colors.inactiveText}
            inactiveColor={Colors.inactiveText}
            autoFocus={true}
            // ignoreCase
            inputPosition="center"
            size={20}
            space={14}
            onFulfill={isValid => console.info('isValid', isValid)}
            codeLength={6}
            keyboardType="numeric"
            textContentType="oneTimeCode"
            autoCompleteType={'off'}
            autoCorrect={false}
            onCodeChange={text => setToken(text)}
            returnKeyType={'done'}
          />
          <Text
            style={{
              width: '100%',
              borderTopWidth: 1,
              paddingTop: 10,
              borderColor: 'black',
              textAlign: 'center',
            }}
          >
            Enter the code {' '}
            <Text style={{textDecorationLine:'underline', color:'green'}} onPress={()=> setHidePass(!hidePass)}>{hidePass ? 'Show' : 'Hide'}</Text>
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.family.regular,
              color: 'red',
              paddingHorizontal:10,
              textAlign:'center'
            }}
          >
            {errPhone}
          </Text>
          <TouchableOpacity onPress={handleRequestCode}>
            <Text
              style={{
                fontFamily: Fonts.family.semiBold,
                fontSize: 11,
                color: '#00BDAA',
                textDecorationLine: 'underline',
              }}
            >
              Send verification code again
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: 'white', padding: 10 }}>
          <Button
            label="Verify"
            size="large"
            onPress={handleVerifyCode}
            disabled={isLoading || token?.length < 6}
          />
        </View>
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default PersonalInfoPhoneVerifyCodeScreen;
