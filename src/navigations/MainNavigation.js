// App.js
import React, { useEffect } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigation from './BottomTabNavigation';
import { NavigationContainer } from '@react-navigation/native';
import MovieDetailesScreen from '../screens/MovieDetailesScreen';
import { useDispatch } from 'react-redux';
import { mountOrientationListener } from '../utils';
import VideoScreen from '../screens/VideoScreen';
const Stack = createStackNavigator();

const MainNavigation = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    mountOrientationListener(dispatch);
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={BottomTabNavigation} />
        <Stack.Screen name="MovieDetailesScreen" component={MovieDetailesScreen} />
        <Stack.Screen name="VideoScreen" component={VideoScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default MainNavigation;
