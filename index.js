import { AppRegistry, LogBox } from "react-native";
import App from "./app/App.js";

import { name as appName } from "./app.json";
import "react-native-gesture-handler";

LogBox.ignoreLogs(["Remote debugger"]);

LogBox.ignoreAllLogs();
if (!__DEV__) {
  console.log = () => {};
}

AppRegistry.registerComponent(appName, () => App);

LogBox.ignoreLogs([
  "Warning:",
  "Require cycle:",
  "Deprecation in",
  "VirtualizedList",
  "Animated: `useNativeDriver` was not specified.",
  "currentlyFocusedField is deprecated",
  "Non-serializable values were found in the navigation state",
]);
