import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, allUsers } from '../data/sampleData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@ru_broke_auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved auth state on mount
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const savedUserId = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (savedUserId) {
        // Find user by ID
        const foundUser = allUsers.find(u => u.user_id === savedUserId);
        if (foundUser) {
          setUser(foundUser);
        }
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Find user by email
      const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        // In a real app, you'd verify password against a hash
        // For demo purposes, we'll use a simple password check
        // Password format: first name + last part of student ID (after last hyphen)
        // e.g., "Alex001" for Alex Rivera (STU-2027-001)
        const idParts = foundUser.student_id.split('-');
        const lastPart = idParts[idParts.length - 1];
        const expectedPassword = foundUser.name.split(' ')[0] + lastPart;
        
        if (password === expectedPassword) {
          // Save auth state
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, foundUser.user_id);
          setUser(foundUser);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

