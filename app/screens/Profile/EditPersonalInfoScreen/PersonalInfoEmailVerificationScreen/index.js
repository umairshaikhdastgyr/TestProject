import React, { useState, useEffect } from 'react';

import { SafeAreaView, Text, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Utilities } from '#styles';
import { userSelector } from '#modules/User/selectors';
import { checkEmail } from '#utils';
import { Button } from '#components';
import { Colors, Fonts } from '#themes';
import {
  requestCode as requestCodeApi,
} from '#services/api';

const PersonalInfoEmailVerificationScreen = ({ navigation, route }) => {
  const { user } = useSelector(userSelector);
  const { information: userInfo } = user;
  const [email, setEmail] = useState(userInfo?.email ?? '');
  const [dumpEmail, setDumpEmail] = useState(userInfo?.email ?? '');
  const [errEmail, setErrEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isbuttonworking, setisButtonWorking] = useState(false);

  useEffect(() => {
    if(userInfo?.emailvalidated===true){
      setisButtonWorking(false)
    }else{
      setisButtonWorking(true)
    }
}, []);

  const handleRequestCode = async () => {
    try {
      setIsLoading(true);
      setErrEmail('');

      const requestCodeParam = { email };
      const requestCodeResponse = await requestCodeApi(
        requestCodeParam,
        userInfo.id,
        'email',
      );
      if (requestCodeResponse?.result?.success === false) {
        throw new Error(
          requestCodeResponse?.result?.content?.message ??
            'Please check your email address and try again',
        );
      }

      navigation.navigate('PersonalInfoEmailVerifyCode', {
        email,
      });
    } catch (error) {
      setErrEmail(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const emailHandler=(text)=>{
    setEmail(text);
    setErrEmail('');
    if(text==dumpEmail){
      setisButtonWorking(false);
    }else{
      setisButtonWorking(true);
    }
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
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontFamily: Fonts.family.regular,
              fontSize: 16,
            }}
          >
            Enter Your Email Address
          </Text>
          <TextInput
            placeholder="Email Address"
            style={{
              width: '100%',
              borderBottomColor: 'black',
              borderBottomWidth: 1,
              textAlign: 'center',
              fontFamily: Fonts.family.bold,
            }}
            value={email}
            onChangeText={text => {
              emailHandler(text)
            }}
            returnKeyType={'done'}
          />
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: 10,
              fontFamily: Fonts.family.semiBold,
              fontSize: 12,
            }}
          >
            {userInfo &&
              userInfo?.emailvalidated != null &&
              userInfo?.emailvalidated &&
              !isbuttonworking
                ? "Email already verified."
                : "We will send you a verification code to your email account."}
          </Text>
        </View>
        <View
          style={{ flex: 1, width:'92%', alignSelf:'center', justifyContent: 'center', alignItems: 'center' }}
        >
          <Text
            style={{
              fontFamily: Fonts.family.regular,
              color: 'red',
              textAlign:'center'
            }}
          >
            {errEmail}
          </Text>
        </View>
        <View style={{ backgroundColor: 'white', padding: 10 }}>
          <Button
            label="Send Code"
            size="large"
            onPress={handleRequestCode}
            disabled={checkEmail(email) === false || isLoading===true ? true : isbuttonworking===true ? false : true }
          />
        </View>
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default PersonalInfoEmailVerificationScreen;
