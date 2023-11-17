import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import React, { useEffect } from 'react';
import ScreenNavigator from './src/navigation/ScreenNavigator';
import {Colors} from './src/constants';
import { Provider } from 'react-redux';
import { store } from './src/slices/store';


const App = () => {

  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.secondary} barStyle="light-content" />
        <ScreenNavigator />
      </SafeAreaView>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
});
