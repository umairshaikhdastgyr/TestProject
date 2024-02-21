import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {UIManager, Platform, Image, View} from 'react-native';
import {safeAreaView} from '#styles/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useActions} from '#utils';
import {selectUserData} from '#modules/User/selectors';
import {getAlbumsIdeas} from '#modules/Ideas/actions';
import {getUserInfo} from '#modules/User/actions';
import {LocalStorage} from '#services';

import {loadUserFromStorage, loginWithToken} from '#modules/Auth/actions';
import OneSignal from 'react-native-onesignal';
import images from '#assets/images';
import CheckConnection from '#utils/connectivity';
import {setToken} from '#services/httpclient/clientHelper';
import {apiInstance} from '#services/httpclient';
import {getPosts, postsLoader} from '#modules/Posts/actions';
import SplashScreen from 'react-native-splash-screen';
import {isJsonString} from '#constants';
import {CommonActions} from '@react-navigation/native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MainScreen = ({navigation, route}) => {
  let network = CheckConnection();
  /* Selectors */
  const {information: userInfo} = useSelector(selectUserData());
  const dispatch = useDispatch();
  /* Actions */
  const actions = useActions({loadUserFromStorage, getUserInfo});

  /* Effects */
  useEffect(() => {
    getUserInfoIfExists();
    setUpOneSignal();
  }, []);

  const getUserInfoIfExists = async () => {
    let data = await LocalStorage.getUserInformation();
    if (data?.id && network == true) {
      actions.getUserInfo({userId: data?.id});
    }
  };

  const setUpOneSignal = () => {
    //OneSignal Init Code
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId('71d40cbd-7c32-43ec-ad31-12e703842842');
    //END OneSignal Init Code

    //Prompt for push on iOS
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log('Prompt response:', response);
    });
  };

  const onInitial = async () => {
    const user = await LocalStorage.getUserInformation();
    const tokens = await LocalStorage.getTokens();
    const isFirstOpen = await LocalStorage.checkIfFirstOpen();
    const is_complete_login = await AsyncStorage.getItem('@is_complete_login');
    setToken(tokens?.token);
    if (user && tokens) {
      dispatch(loginWithToken());
    }
    if (tokens) {
      navigation.navigate('App');
    } else {
      if (!isFirstOpen && isFirstOpen !== null) {
        if (isJsonString(is_complete_login)) {
          if (
            is_complete_login != null &&
            JSON.parse(is_complete_login) == true
          ) {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'AppAuth'}],
              }),
            );
          } else {
            navigation.navigate('MainAuth');
          }
        }
      } else {
        navigation.navigate('Intro');
      }
    }
  };

  const loadData = async () => {
    try {
      dispatch(postsLoader(true));
      await AsyncStorage.setItem('@is_call_auth_screen', JSON.stringify(true));
      const getPostData = await apiInstance.get(
        `catalog/v2/posts?postStatus=active&lat=0&lng=0&page=1&perPage=20`,
      );
      if (getPostData && getPostData?.data?.data?.length > 0) {
        dispatch(getPosts(getPostData?.data));
        dispatch(postsLoader(false));
      } else {
        await AsyncStorage.setItem(
          '@is_call_auth_screen',
          JSON.stringify(false),
        );
        dispatch(getPosts(getPostData?.data));
        dispatch(postsLoader(false));
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    loadData();
    onInitial();
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <Image
      source={images.splash_screen}
      style={{
        position: 'absolute',
        justifyContent: 'center',
        top: -1,
        bottom: 0,
        height: '112.5%',
        width: '100%',
        resizeMode: 'cover',
        alignSelf: 'center',
        overflow: 'hidden',
      }}
    />
  );
};

export default MainScreen;
