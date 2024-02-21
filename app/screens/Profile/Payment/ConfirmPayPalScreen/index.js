import React from 'react';
import { ScrollView, Text, View, SafeAreaView } from 'react-native';
import { NormalButton } from '#components';
import { Utilities } from '#styles';
import { styles } from './styles';

const TextView = ({ label, value }) => {
  return (
    <View style={styles.textViewContainer}>
      <Text style={styles.blackBoldText}>{label}</Text>
      <Text style={styles.blackSmallText}>{value}</Text>
    </View>
  );
};

const ConfirmPayPalScreen = ({ navigation, route }) => {
  const onContinue = () => navigation.navigate('AddPaymentConfirm', { headerTitle: 'PayPal',titleMessage:'Set up complete!',subtitleMessage:'You’ve successfully added your paypal account.'});

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.blackText}>
              {'Confirm your account information'}
            </Text>
          </View>
          <TextView label="Payment Method" value="Paypal in US ($)" />
          <TextView label="Email Address" value="andres.farrow@gmail.com" />
          <TextView label="Account Address" value="5234 Fakestreet, Los Angeles, CA, 35210" />
        </ScrollView>
        <View style={styles.bottomBtnContainer}>
          <NormalButton
            label="Continue"
            onPress={onContinue}
            buttonStyle={styles.btnContainer}
          />
        </View>
      </SafeAreaView>
      <SafeAreaView style={Utilities.safeAreaNotchHelper} />
    </>
  );
};

export default ConfirmPayPalScreen;
