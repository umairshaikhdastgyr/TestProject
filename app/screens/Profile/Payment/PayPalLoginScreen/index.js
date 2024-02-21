import React, { useState, useEffect } from 'react';
import { Text, View , SafeAreaView} from 'react-native';
import { NormalButton } from '#components';
import { Utilities } from '#styles';
import { checkEmail } from '#utils';
import Input from '../BankTransferScreen/Input';
import { styles } from './styles';

const PayPalLoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabledBtn, setDisableBtn] = useState(true);

  useEffect(() => {
    if (checkEmail(email) && password !== '') {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [email, password]);

  const onContinue = () => navigation.navigate('ConfirmPayPal');

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContainer}>
          <Text style={styles.blackText}>
            Please enter your PayPal account information below
          </Text>
          <Input
            label="E-mail Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="your@mail.com"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.bottomBtnContainer}>
          <NormalButton
            label="Continue"
            onPress={onContinue}
            buttonStyle={
              isDisabledBtn ? styles.btnContainer1 : styles.btnContainer
            }
            disabled={isDisabledBtn}
          />
        </View>
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default PayPalLoginScreen;
