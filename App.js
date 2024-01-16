import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import MainNavigation from './src/navigations/MainNavigation';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import Colors from './src/theme/Colors';


const App = () => {
  
  return (
    <Provider store={store}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <SafeAreaView style={styles.container}>
        <MainNavigation />
      </SafeAreaView>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});
