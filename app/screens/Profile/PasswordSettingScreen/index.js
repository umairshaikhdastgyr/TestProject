import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, Keyboard } from 'react-native';

import { styles } from './styles';
import { InputText, Button, SweetAlert } from '#components';
import { flex } from '#styles/utilities';
import { changePassword } from '#services/api';
import { useSelector } from 'react-redux';
import { userSelector } from '#modules/User/selectors';
import SmallLoader from '#components/Loader/SmallLoader';

const initialAlertState = {
  title: '',
  message: '',
  type: '',
  visible: false,
};

const initialInputError = {
  current: '',
  new: '',
  confirm: '',
};

const PasswordSettingScreen = ({navigation, route}) => {
  const {
    user: { information: userInfo },
  } = useSelector(userSelector);

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [inputError, setInputError] = useState(initialInputError);

  const [passwordHint, setPasswordHint] = useState('');

  const [alertContent, setAlertContent] = useState(initialAlertState);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (password.new.length > 0) {
      setPasswordHint(
        'Password must contain at least seven digits, one uppercase letter, one number and one special character',
      );
    }
  }, [password.new]);

  const handleChangeText = (type, text) => {
    setPassword(prevState => ({ ...prevState, [type]: text }));
  };

  const validate = () => {
    let validation = true;
    setInputError(initialInputError);

    if (password.current === '') {
      setInputError(prevState => ({
        ...prevState,
        current: 'Current password cannot be empty',
      }));
      validation = false;
    }

    if (password.new.length < 7) {
      setInputError(prevState => ({
        ...prevState,
        new: 'Password must contain at least 7 digits',
      }));
      validation = false;
    }

    if (password.confirm === '') {
      setInputError(prevState => ({
        ...prevState,
        confirm: 'Password confirmation cannot be empty',
      }));
      validation = false;
    }

    if (password.confirm !== password.new) {
      setInputError(prevState => ({
        ...prevState,
        confirm:
          'New password and confirmation is different. Please check them again',
      }));
      validation = false;
    }

    return validation;
  };

  const handleChangePasswordSubmit = async () => {
    const validated = validate();

    if (validated) {
      setIsLoading(true);
      const data = await changePassword(
        userInfo.id,
        password.current,
        password.new,
      );

      if (data?.result?.success === false) {
        setAlertContent({
          title: 'Oops',
          message: data?.result?.content?.message,
          type: 'error',
          visible: true,
        });
      } else {
        setAlertContent({
          title: 'Success',
          message: data?.message,
          type: 'success',
          visible: true,
        });
      }
      setIsLoading(false);
    }
  };

  const handleTouchAlert = () => {
    setAlertContent(initialAlertState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.mainContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Password</Text>
          <InputText
            style={styles.input}
            placeholder="Please input your current password"
            secureTextEntry
            value={password.current}
            onChangeText={text => handleChangeText('current', text)}
            bottomLine
            fullWidth
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <Text style={[styles.label, { marginTop: 20 }]}>New Password</Text>
          <InputText
            style={styles.input}
            placeholder="Please input your new password"
            secureTextEntry
            value={password.new}
            onChangeText={text => handleChangeText('new', text)}
            bottomLine
            fullWidth
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {passwordHint !== '' && (
            <Text style={styles.hintText}>{passwordHint.toUpperCase()}</Text>
          )}
          <Text style={[styles.label, { marginTop: 20 }]}>
            Confirm Password
          </Text>
          <InputText
            style={styles.input}
            placeholder="Please input your password confirmation"
            secureTextEntry
            value={password.confirm}
            onChangeText={text => handleChangeText('confirm', text)}
            bottomLine
            fullWidth
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {inputError.confirm !== '' && (
            <Text style={styles.hintText}>{inputError.confirm}</Text>
          )}
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
          {!isLoading && (
            <Button
              label="Change Password"
              size="large"
              fullWidth
              disabled={
                password.current === '' ||
                password.new === '' ||
                password.confirm === ''
              }
              onPress={handleChangePasswordSubmit}
            />
          )}
          {isLoading && <SmallLoader style={{ height: 20, flex: 1 }} />}
        </View>
      <SweetAlert
        title={alertContent.title}
        message={alertContent.message}
        type={alertContent.type}
        dialogVisible={alertContent.visible}
        onTouchOutside={handleTouchAlert}
      />
    </SafeAreaView>
  );
};

export default PasswordSettingScreen;
