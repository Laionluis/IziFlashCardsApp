
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { translate } from '../i18n/scr/locales';

import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import CriarFlashCard from '../screens/CriarFlashCard';

export default function Navigation() {

  const MyTheme = {
    dark: false,
    colors: {
      primary: 'rgb(69, 162, 158)',
      background: 'rgb(242, 242, 242)',
      card: 'rgb(31, 40, 51)',
      text: 'rgb(194, 202, 208)',
      border: 'rgb(69, 162, 158)',
      notification: 'rgb(255, 69, 58)',
    },
  };

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={MyTheme}
      >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="CriarFlashCard" component={CriarFlashCard}  options={{ headerShown: true, title: translate('CriarCard') }}  />      
    </Stack.Navigator>
  );
}
