import React,{useEffect,useState} from "react";
import { Platform,Keyboard } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabNavigationIcon from "./components/tab-navigation-icon";
import TabLabel from "./components/tab-label";
import { MainScreen } from "#screens/Explore";
import { MainScreen as IdeasMain } from "../screens/Ideas";
import { MainScreen as SellMain } from "../screens/Sell";
import { MainScreen as ChatMain } from "../screens/Chat";
import { MainScreen as ProfileMain } from "../screens/Profile";
import DeviceInfo from "react-native-device-info";
import CloseButton from "./components/close-button.js";

const Tab = createBottomTabNavigator();

const AppTabNavigator = () => {
  const [keyBoardShown,setKeyBoardShown]=useState();
  useEffect(()=>{
    Keyboard.addListener("keyboardDidShow",()=>setKeyBoardShown(true))
    Keyboard.addListener("keyboardDidHide",()=>setKeyBoardShown(false))
  },)
  let hasDynamicIsland = DeviceInfo.hasDynamicIsland();
  return (
    <Tab.Navigator
      initialRouteName="ExploreMain"
      screenOptions={({ route }) => ({
        headerTitleAlign:'center',
        headerShown: false,
        activeTintColor: "active",
        tabBarStyle: {
          display:keyBoardShown?"none":"flex",
          backgroundColor: "white",
          borderTopColor: "white",
          height: hasDynamicIsland
            ? 72
            : Platform.OS == "android"
            ? "9%"
            : "11.5%",
          shadowColor: "black",
          shadowOpacity: 0.12,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 20,
          elevation: 3,
          
        },
        tabBarIcon: ({ focused }) => {
          return (
            <TabNavigationIcon
              icon={route.name.toLowerCase()}
              active={focused}
              routeName={route.name}
            />
          );
        },
        tabBarLabel: ({ focused }) => {
          let labelName =
            route.name == "ExploreMain"
              ? "Explore"
              : route.name == "IdeasMain"
              ? "Ideas"
              : route.name == "SellMain"
              ? "Sell"
              : route.name == "ChatMain"
              ? "Chat"
              : route.name == "ProfileMain"
              ? "Profile"
              : null;
          return (
            <TabLabel
              label={labelName}
              active={focused}
              routeName={route.name}
            />
          );
        },
      })}
    >
      <Tab.Screen name="ExploreMain" component={MainScreen} />
      <Tab.Screen
        name="IdeasMain"
        component={IdeasMain}
        options={({ route }) => ({
          headerShown: true,
          title: "My ideas Board",
        })}
      />
      <Tab.Screen
        name="SellMain"
        component={SellMain}
        options={({ navigation, route }) => ({
          headerShown: true,
          title: "Create a Post",
          tabBarStyle: { display: "none" },
          headerRight: () => (
            <CloseButton
              style={{ marginRight: 15 }}
              onPress={() => {
                route?.params?.handleMainCloseClick()
              }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="ChatMain"
        component={ChatMain}
        options={({ route }) => ({
          headerShown: true,
          title: "Chat",
        })}
      />
      <Tab.Screen name="ProfileMain" component={ProfileMain} />
    </Tab.Navigator>
  );
};

export default AppTabNavigator;
