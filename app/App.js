import React, { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { Text } from "react-native";
import "intl";
import "intl/locale-data/jsonp/en";
import makeStore from "#modules/makeStore";
import { AppContainer } from "./navigators";
import { NotifierWrapper } from "react-native-notifier";
import GeolocationService from "react-native-geolocation-service";
import NavigationService from "./navigators/navigationRef";
import { firebase } from "@react-native-firebase/dynamic-links";
import * as Sentry from "@sentry/react-native";
import FlashMessage from "react-native-flash-message";
import DeviceInfo from "react-native-device-info";
import config from "#config";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { ModalPortal } from 'react-native-modals';
import { initializeStripe } from "#config/configStripe";

const { ENV } = config;

if (!__DEV__) {
  Sentry.init({
    dsn: "https://c55ec71218854ca8ab3e81bf26600679@o1212592.ingest.sentry.io/4505436986277888",
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    environment: ENV,
  });
}

var firebaseConfig = {
  apiKey: "AIzaSyBHN8w20bv_tZE5omEGEWHgIoGmcZeLyKw",
  databaseURL: "https://homitag-dev.firebaseio.com",
  projectId: "homitag-dev",
  storageBucket: "homitag-dev.appspot.com",
  appId: "com.homitag.app",
  messagingSenderId: "654933660611",
};
const reduxStore = makeStore(window.REDUX_INITIAL_DATA);
navigator.geolocation = GeolocationService;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
if (Text.defaultProps == null) {
  Text.defaultProps = {};
}
Text.defaultProps.allowFontScaling = false;
const App = () => {
  let hasDynamicIsland = DeviceInfo.hasDynamicIsland();

  useEffect(() => {
    initializeStripe();
  },[])

  const AppComponent = () => {
    return (
      <NotifierWrapper>
        <ReduxProvider store={reduxStore}>
          <NavigationContainer>
            <AppContainer
              ref={(navigatorRef) => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
            <ModalPortal />
          </NavigationContainer>
        </ReduxProvider>
      </NotifierWrapper>
    );
  };

  return (
    <>
      {hasDynamicIsland ? (
        <SafeAreaView style={{ flex: 1 }}>
          <AppComponent />
        </SafeAreaView>
      ) : (
        <AppComponent />
      )}
      <FlashMessage position="top" />
    </>
  );
};
export default App;