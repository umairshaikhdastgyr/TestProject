import { StackActions } from "@react-navigation/native";

export const MainAuthStackNavigation = (navigation) => {
  const resetAction = StackActions.push("MainAuth", { isGuest: true });
  navigation.dispatch(resetAction);
};
