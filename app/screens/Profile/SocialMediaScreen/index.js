import React, { useState } from 'react';
import { Text, View, Switch, Platform, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { userSelector } from '#modules/User/selectors';
import { BallIndicator } from 'react-native-indicators';
import { Utilities } from '#styles';
import { FacebookAuth, GoogleAuth } from '#services';
import { setUserInformation } from '#modules/User/actions';
import { updateProfile } from '#services/api';
import { Colors } from '#themes';
import { styles } from './styles';
import { SweetAlert } from '#components';

const Items = [{ id: 0, label: 'Facebook' }, { id: 1, label: 'Google' }];

const initialAlertState = {
  title: '',
  message: '',
  type: '',
  visible: false,
};

const SocialMediaScreen = ({navigation, route}) => {
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const [alertContent, setAlertContent] = useState(initialAlertState);
  const [values, setValues] = useState([
    !!_.get(user, 'information.allowFacebookShare', null),
    !!_.get(user, 'information.allowGoogleShare', null),
  ]);

  const [isFetching, setFetching] = useState(false);

  const onSwitchChange = async (value, index) => {
    const updatedSwitchValues = _.cloneDeep(values);
    updatedSwitchValues[index] = value;
    let params = null;
    if (index === 0) {
      if (value === true) {
        try {
          const res = await FacebookAuth.login();
          
          if (res.user) {
            params = {
              email: user.information.email,
              userId: user.information.id,
              facebookaccount: res.user.id,
              allowFacebookShare: true,
            };
          }
          if(res.error){
            setAlertContent({
              title: 'Oops',
              message: res.error,
              type: 'warning',
              visible: true,
            });
            return;
          }
        } catch (e) {
          console.info('unable to login', e);
        }
      } else {
        params = {
          email: user.information.email,
          userId: user.information.id,
          allowFacebookShare: false,
        };
      }
    } else if (index === 1) {
      if (value === true) {
        try {
          const res = await GoogleAuth.login();
          if (res.userInfo.user) {
            params = {
              email: user.information.email,
              userId: user.information.id,
              googleaccount: res.userInfo.user.id,
              allowGoogleShare: true,
            };
          }
          if(res.error){
            setAlertContent({
              title: 'Oops',
              message: res.error,
              type: 'warning',
              visible: true,
            });
            return;
          }
        } catch (e) {
          console.info('unable to login', e);
        }
      } else {
        params = {
          email: user.information.email,
          userId: user.information.id,
          allowGoogleShare: false,
        };
      }
    }

    setFetching(true);
    const res = await updateProfile(params);
    setFetching(false);
    const errorMsg = _.get(res, 'result.content.message', null);
    if (errorMsg) {
      setAlertContent({
        title: 'Oops',
        message: `The ${
          index === 0 ? 'facebook' : 'google'
        } account already in use. Please use other account to connect`,
        type: 'warning',
        visible: true,
      });
    } else {
      setValues(updatedSwitchValues);
      dispatch(setUserInformation({ information: res }));
      setAlertContent({
        title: 'Success',
        message:
          index === 0
            ? `Successfully ${
                value ? 'connect' : 'disconnect'
              } your Facebook connection`
            : `Successfully ${
                value ? 'connect' : 'disconnect'
              }  your Google connection`,
        type: 'success',
        visible: true,
      });
    }
  };

  const onAlertModalTouchOutside = () => {
    setAlertContent(initialAlertState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.descriptionText}>
          Connect with your social media accounts to make your profile more
          reliable.
        </Text>
        {Items.map((item, index) => (
          <View style={styles.toggleContainer} key={`key-${index}`}>
            <Text
              style={values[index] ? styles.activeItemText : styles.itemText}
            >
              {item.label}
            </Text>
            <Switch
              thumbColor={Colors.white}
              trackColor={{ true: Colors.active, false: Colors.inactiveShape }}
              onValueChange={value => onSwitchChange(value, index)}
              value={values[index]}
              ios_backgroundColor={Colors.inactiveShape}
              style={styles.switchContainer}
              // disabled={
              //   index === 0
              //     ? !!_.get(user, 'information.facebookaccount', null)
              //     : !!_.get(user, 'information.googleaccount', null)
              // }
            />
          </View>
        ))}
      </View>
      {isFetching && (
        <View style={Utilities.style.activityContainer}>
          <BallIndicator size={30} color={Colors.active} />
        </View>
      )}
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible}
        onTouchOutside={onAlertModalTouchOutside}
      />
    </SafeAreaView>
  );
};

export default SocialMediaScreen;
