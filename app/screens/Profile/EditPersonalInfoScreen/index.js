import React, {useEffect, useCallback, useState} from 'react';

import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Utilities} from '#styles';
import {userSelector} from '#modules/User/selectors';
import {getUserInfo} from '#modules/User/actions';
import {styles} from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon} from '#components';
import ScreenLoader from '#components/Loader/ScreenLoader';
import {useFocusEffect} from '@react-navigation/native';

const EditPersonalInfoScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(userSelector);
  const {information: userInfo} = user;
  const email = userInfo?.email ?? '';
  //const phoneNumber = userInfo?.phonenumber ?? '';
  const [phone, setPhone] = useState('');

  const fetchUserInfo = useCallback(
    () => dispatch(getUserInfo({userId: userInfo.id})),
    [dispatch, userInfo.id],
  );

  useEffect(() => {
    formatPhone(userInfo?.phonenumber);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [fetchUserInfo]),
  );

  const formatPhone = phoneNumberStringInput => {
    if (phoneNumberStringInput == null) {
    } else {
      const phoneNumberStringStr = phoneNumberStringInput;
      const phoneNumberString = phoneNumberStringStr.substring(2);
      let newText = '';
      let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
      for (var i = 0; i < cleaned.length; i++) {
        if (i == 0) {
          newText = '(';
        } else if (i == 3) {
          newText = newText + ') ';
        } else if (i == 6) {
          newText = newText + '-';
        }
        newText = newText + cleaned[i];
      }
      setPhone('+1 ' + newText);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container} forceInset={{bottom: 'never'}}>
        {user.isFetching && <ScreenLoader />}
        <KeyboardAwareScrollView style={styles.scrollContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PersonalInfoEmailVerification')
            }>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <Text style={styles.inputText}>{email}</Text>
              {userInfo?.emailvalidated && (
                <Icon icon="confirm" color="active" style={styles.rightIcon} />
              )}
              {!userInfo?.emailvalidated && (
                <View style={styles.activeBtnContainer}>
                  <Text style={styles.activeText}>VERIFY</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PersonalInfoPhoneVerification')
            }>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <Text style={styles.inputText}>{phone}</Text>
              {phone === '' && (
                <View style={styles.activeBtnContainer}>
                  <Text style={styles.activeText}>ADD</Text>
                </View>
              )}
              {phone !== '' && userInfo?.phonenumbervalidated && (
                <Icon icon="confirm" color="active" style={styles.rightIcon} />
              )}
              {phone !== '' && !userInfo?.phonenumbervalidated && (
                <View style={styles.activeBtnContainer}>
                  <Text style={styles.activeText}>VERIFY</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default EditPersonalInfoScreen;
