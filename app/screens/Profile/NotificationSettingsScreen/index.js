import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, View,Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  getUserNotificationSettings,
  updateUserNotificationSettings,
} from '#modules/User/actions';
import { userSelector } from '#modules/User/selectors';
import { Switch } from 'react-native-switch';

import { ToggleItems, ToggleItem } from './ToggleItems';
import { styles } from './styles';
import { Colors } from '#themes';
import fonts from '#themes/fonts';

const NotificationSettingsScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {
    user: {
      information: { id },
      // accountSettingsState,
      notificationSettingsState,
    },
  } = useSelector(userSelector);
  // useEffect(() => {
  //   if (!id) {
  //     return;
  //   }
  //   // dispatch(getUserAccountSettings({ userId: id }));
  //   dispatch(getUserNotificationSettings({ userId: id }));
  // }, [dispatch, id]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.mainContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            minHeight: 40,
            alignItems: "center",
            paddingRight: 10,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontFamily: fonts.family.medium }}>
            You will receive emails from us for updates, You can toggle
            following setting.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            minHeight: 40,
            alignItems: "center",
            paddingRight: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontFamily: fonts.family.regular }}>
            Push Notifications
          </Text>
          <Switch
            circleActiveColor={Colors.switchThumbActive}
            circleInActiveColor={Colors.switchThumbInactive}
            backgroundActive={Colors.inactiveShape}
            backgroundInactive={Colors.inactiveShape}
            onValueChange={(value) => {
              dispatch(updateUserNotificationSettings({ userId: id, params:{...notificationSettingsState.data,push_notification:value} }));
            }}
            value={notificationSettingsState?.data?.push_notification}
            changeValueImmediately={true}
            circleBorderWidth={0}
            barHeight={16}
            switchWidthMultiplier={1.6}
            circleSize={25}
            renderActiveText={false}
            renderInActiveText={false}
            outerCircleStyle={Colors.switchCircle}
            innerCircleStyle={Colors.switchCircle}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            minHeight: 40,
            alignItems: "center",
            paddingRight: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontFamily: fonts.family.regular }}>
            Text Notifications
          </Text>
          <Switch
            circleActiveColor={Colors.switchThumbActive}
            circleInActiveColor={Colors.switchThumbInactive}
            backgroundActive={Colors.inactiveShape}
            backgroundInactive={Colors.inactiveShape}
            onValueChange={(value) => {
              dispatch(updateUserNotificationSettings({ userId: id, params:{...notificationSettingsState.data,sms_notification:value} }));

            }}
            value={notificationSettingsState?.data?.sms_notification}
            changeValueImmediately={true}
            circleBorderWidth={0}
            barHeight={16}
            switchWidthMultiplier={1.6}
            circleSize={25}
            renderActiveText={false}
            renderInActiveText={false}
            outerCircleStyle={Colors.switchCircle}
            innerCircleStyle={Colors.switchCircle}
          />
        </View>

        {/* <ToggleItems
          settingData={notificationSettingsState.data}
          updateSettingsAction={updateUserNotificationSettings}
          title="NOTIFICATION SETTINGS"
          userId={id}
          dispatch={dispatch}
          loading={notificationSettingsState.isFetching}
        /> */}
        {/* <ToggleItems
          settingData={accountSettingsState.data}
          updateSettingsAction={updateUserAccountSettings}
          title="PRIVACY SETTINGS"
          userId={id}
          dispatch={dispatch}
          loading={notificationSettingsState.isFetching}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationSettingsScreen;
