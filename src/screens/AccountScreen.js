import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Styless, WP } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, loginAsync, selectUser } from '../slices/userSlice';
import { PButton } from '../components/Pressable';
import { InputPassword, InputText } from '../components/InputText';

const AccountScreen = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userInfo } = useSelector(selectUser);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    dispatch(loginAsync({ username, password }, "auth/login"));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <View style={styles.userInfoContainer}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.info}>{userInfo?.username}</Text>
          
          <Text style={styles.label}>Email</Text>
          <Text style={styles.info}>{userInfo?.email}</Text>
          
          <Text style={styles.label}>Full name</Text>
          <Text style={styles.info}>{`${userInfo?.firstName} ${userInfo?.lastName}`}</Text>
          
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.info}>{userInfo?.gender}</Text>

          <PButton
            style={styles.logoutButton}
            text={'Logout'}
            onPress={handleLogout}
          />
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <InputText
            containerStyle={styles.inputContainer}
            inputProps={{
              placeholder: "Enter username",
            }}
            onChangeText={(text) => setUsername(text)}
          />

          <InputPassword
            containerStyle={styles.inputContainer}
            inputProps={{
              placeholder: "Password",
            }}
            onChangeText={(text) => setPassword(text)}
          />

          <PButton
            disabled={userInfo === ''}
            style={styles.loginButton}
            text={'Login'}
            onPress={handleLogin}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingHorizontal: WP(7),
  },
  userInfoContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: WP(5),
  },
  loginContainer: {
    flex: 1,
    marginTop: WP(5),
  },
  label: Styless.regular(3, Colors.white),
  info: Styless.regular(4, Colors.white),
  inputContainer: {
    marginTop: WP(5),
  },
  loginButton: {
    marginTop: WP(6),
  },
  logoutButton: {
    marginTop: WP(6),
    width: "100%",
  },
});

export default AccountScreen;
