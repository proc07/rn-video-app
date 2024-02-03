import React from 'react';
import {StyleSheet, StatusBar, useColorScheme, View} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PersonScreen from './src/person';
import HomeScreen from './src/home';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({});

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333' : '#fff',
  };
  // const textStyle = {
  //   color: isDarkMode ? '#fff' : 'blue',
  // };
  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: backgroundStyle,
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarBadge: 3,
            // tabBarLabelStyle: textStyle,
          }}
        />
        <Tab.Screen name="Person" component={PersonScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
