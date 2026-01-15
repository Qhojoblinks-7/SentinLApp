import React, { useEffect } from 'react';
import "./global.css";
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadCredentials, logout } from './store/authSlice';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import {
  SplashScreen,
  Login,
  CreateAccount,
  Onboarding,
  Dashboard,
  Profile,
  Settings,
  TaskDetail,
  Chat,
  Achievements,
  History
} from './screens';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    Toast.show({
      type: 'info',
      text1: 'Logged Out',
      text2: 'You have been logged out successfully',
    });
    dispatch(logout());
    props.navigation.replace('Login');
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="History"
        onPress={() => {
          props.navigation.navigate('History');
        }}
      />
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
};

const MainDrawer = () => {
  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="TaskDetail" component={TaskDetail} />
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="Achievements" component={Achievements} />
      <Drawer.Screen name="History" component={History} options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer.Navigator>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('useEffect in App.jsx running');
    const loadStoredCredentials = async () => {
      console.log('loadStoredCredentials called');
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      console.log('Retrieved token:', token);
      console.log('Retrieved user:', user);
      if (token && user) {
        dispatch(loadCredentials({ token, user: JSON.parse(user) }));
      }
    };
    loadStoredCredentials();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccount}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainDrawer}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppContent />
          <Toast />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}