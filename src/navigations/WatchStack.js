// App.js
import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import WatchScreen from '../screens/WatchScreen';
import SearchScreen from '../screens/SearchScreen';
const Stack = createStackNavigator();

const WatchStack = () => (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WatchScreen" component={WatchScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />

    </Stack.Navigator>
);


export default WatchStack;
