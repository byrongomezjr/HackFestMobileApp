import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Platform } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import StudentIDScreen from '../screens/StudentIDScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CardsScreen from '../screens/CardsScreen';
import AddCardScreen from '../screens/AddCardScreen';
import AdminDashboard from '../screens/AdminDashboard';

export type RootTabParamList = {
  Wallet: undefined;
  StudentID: undefined;
  Transactions: undefined;
  Chat: undefined;
  ProfileTab: undefined;
  Cards: undefined;
  AddCard: undefined;
  AdminDashboard: undefined;
};

export type WalletStackParamList = {
  Home: undefined;
  Cards: undefined;
  AddCard: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  AdminDashboard: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const WalletStack = createNativeStackNavigator<WalletStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// Wallet Stack Navigator (includes Home, Cards, AddCard)
function WalletStackNavigator() {
  return (
    <WalletStack.Navigator screenOptions={{ headerShown: false }}>
      <WalletStack.Screen name="Home" component={HomeScreen} />
      <WalletStack.Screen name="Cards" component={CardsScreen} />
      <WalletStack.Screen name="AddCard" component={AddCardScreen} />
    </WalletStack.Navigator>
  );
}

// Profile Stack Navigator (includes Profile, AdminDashboard)
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="AdminDashboard" component={AdminDashboard} />
    </ProfileStack.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            switch (route.name) {
              case 'Wallet':
                iconName = 'account-balance-wallet';
                break;
              case 'StudentID':
                iconName = 'badge';
                break;
              case 'Transactions':
                iconName = 'receipt-long';
                break;
              case 'Chat':
                iconName = 'chat';
                break;
              case 'ProfileTab':
                iconName = 'person';
                break;
              default:
                iconName = 'help';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#DC2626',  // Red theme
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 85 : 65,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            backgroundColor: '#FFFFFF',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen 
          name="Wallet" 
          component={WalletStackNavigator}
          options={{ title: 'Wallet' }}
        />
        <Tab.Screen 
          name="StudentID" 
          component={StudentIDScreen}
          options={{ title: 'ID Card' }}
        />
        <Tab.Screen 
          name="Transactions" 
          component={TransactionsScreen}
          options={{ title: 'Activity' }}
        />
        <Tab.Screen 
          name="Chat" 
          component={ChatScreen}
          options={{ title: 'AI Assistant' }}
        />
        <Tab.Screen 
          name="ProfileTab" 
          component={ProfileStackNavigator}
          options={{ title: 'Profile' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

