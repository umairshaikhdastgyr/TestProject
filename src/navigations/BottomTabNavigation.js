import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EmptyScreen from '../screens/EmptyScreen';
import Colors from '../theme/Colors';
import { WP } from '../theme/Dimensions';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Styless from '../constants/Styless';
import WatchStack from './WatchStack';
import { SliceUpdateOrientation } from '../redux/slices/OrientationSlice';
import { useSelector } from 'react-redux';
import { Orientation } from '../utils';

const Tab = createBottomTabNavigator();

const TABS = {
  Dashboard: require("../assets/dashboard.png"),
  Watch: require("../assets/watch.png"),
  "Media Library": require("../assets/ML.png"),
  More: require("../assets/List.png"),
};

function MyTabBar({ state, descriptors, navigation, orientation }) {
  return (
    <View style={[styles.tabBarContainer, orientation === Orientation.Landscape ? styles.tabBarContainerLandscape : {}]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        const color = isFocused ? Colors.white : Colors.grayDark;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            key={index}
          >
            <Image
              style={{ ...styles.tabImage, tintColor: color }}
              source={TABS[label]}
            />
            <Text style={{ ...styles.tabText, color }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const BottomTabNavigation = () => {
  const { orientation } = useSelector(SliceUpdateOrientation);

  return (
    <View style={{flex:1, paddingLeft: orientation == Orientation.Landscape ? WP(20) : 0}}>
    <Tab.Navigator
      initialRouteName='Watch'
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.grayDark,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopRightRadius: WP(8),
          borderTopLeftRadius: WP(8),
          height: "100%",
          width: WP(18),
        },
      }}
      tabBar={props => <MyTabBar {...props} orientation={orientation} />}
    >
      <Tab.Screen name="Dashboard" component={EmptyScreen} />
      <Tab.Screen name="Watch" component={WatchStack} />
      <Tab.Screen name="Media Library" component={EmptyScreen} />
      <Tab.Screen name="More" component={EmptyScreen} />
    </Tab.Navigator>
    </View>
  );
};


const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    borderTopRightRadius: WP(8),
    borderTopLeftRadius: WP(8),
    height: WP(20),
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarContainerLandscape: {
    flexDirection: "column",
    position: "absolute",
    width: WP(25),
    height: "100%",
    borderTopLeftRadius: 0,
    borderBottomRightRadius: WP(8),
    paddingTop: WP(10),
    left: -WP(22)
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  tabImage: {
    width: WP(4.5),
    height: WP(4.5),
    resizeMode: "contain",
  },
  tabText: {
    ...Styless.regular(2.8, Colors.grayDark),
    marginTop: WP(2),
    marginBottom: WP(1),
  },
});


export default BottomTabNavigation;
