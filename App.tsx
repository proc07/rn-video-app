import React from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PersonScreen from './src/person';
import HomeScreen from './src/home';
import SearchScreen from './src/home/search';
import PlayVideoScreen from './src/home/playVideo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({});

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // const textStyle = {
  //   color: isDarkMode ? '#fff' : 'blue',
  // };
  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTop}
          options={{headerShown: false}}
        />
        <Stack.Screen name="PlayVideo" component={PlayVideoScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function BottomTop() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333' : '#fff',
  };
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarStyle: backgroundStyle,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Person') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={`${iconName}`} size={size} color={color} />;
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={
          {
            // headerShown: false,
            // tabBarBadge: 3,
            // tabBarLabelStyle: textStyle,
          }
        }
      />
      <Tab.Screen name="Person" component={PersonScreen} />
    </Tab.Navigator>
  );
}
