import React, { useEffect } from 'react';
import "./global.css";
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, User, MessageCircle, Clock } from 'lucide-react-native';
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
  CreateTask,
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
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = <LayoutDashboard size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = <User size={size} color={color} />;
          } else if (route.name === 'Chat') {
            iconName = <MessageCircle size={size} color={color} />;
          } else if (route.name === 'History') {
            iconName = <Clock size={size} color={color} />;
          }

          return iconName;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="History" component={History} />
    </Tab.Navigator>
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
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateTask"
          component={CreateTask}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Achievements"
          component={Achievements}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#020617' }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppContent />
          <Toast />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}