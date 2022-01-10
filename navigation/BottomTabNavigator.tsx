/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { translate } from '../i18n/scr/locales';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import CriarEditarCards from '../screens/CriarEditarCards';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator({ route, navigation }) {
  
  return (
    <BottomTab.Navigator
      initialRouteName="Criar"
     >
      <BottomTab.Screen
        name="Criar"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="duplicate-outline" color={color} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Root', {
                screen: 'Criar' ,
                params: {
                    screen: 'CriarEditarCards',
                    params: {
                        recarregar: false,
                    },
                }              
            });
          },
        })}
      />
      <BottomTab.Screen
        name="Cards"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="copy-outline" color={color} />,               
        }}  
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Root', {
                screen: 'Cards',
                params: {
                    screen: 'TabOneScreen',
                    params: {
                        nodeBanco: null,
                    },
                }
            });
          },
        })}      
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={20} style={{ marginBottom: -3}} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        initialParams={{ nodeBanco: null }}
        options={{ headerTitle: 'Cards' }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="CriarEditarCards"
        component={CriarEditarCards}
        initialParams={{ recarregar: true}}
        options={{ headerTitle: translate('CriarEditarCard') }}
      />
    </TabTwoStack.Navigator>
  );
}
