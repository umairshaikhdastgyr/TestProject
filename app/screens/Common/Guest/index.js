import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { styles } from './styles';
import Images from '#assets/images';
import { NormalButton } from '#components';

import { SafeAreaView, TouchableOpacit, View, Image, ScrollView, Text } from 'react-native';


const GuestScreen = ({ navigation }) => {
  /* Selectors */
  //const { postDetail } = useSelector(selectPostsData());

  /* States */
  //const [isVisibleFavoriteModal, setIsVisibleFavoriteModal] = useState(false);

  /* Methods */
  onSignup = () => {navigation.navigate('MainAuth')};

  /* Components */
  renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Image source={Images.logo} style={styles.logoImg} />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      forceInset={{ bottom: 'never', top: 'never' }}
    >
      {this.renderHeader()}
      <View style={styles.scrollContainer}>
        <Text style={styles.textTitle}>Hello!</Text>
        <Text style={styles.textSubTitle}>You’ve logged in Homitag as a guest.</Text>
        <Text style={styles.text}>Please create your account to enjoy the full Homitag app features.</Text>
        <NormalButton label="Create account now" onPress={this.onSignup} />
      </View>
    </SafeAreaView>
  );
};

export default GuestScreen;
