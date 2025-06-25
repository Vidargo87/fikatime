import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types';

interface UserContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile) => void;
  updateStreak: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a default user for demo purposes
const createDefaultUser = (): UserProfile => ({
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@fikatime.com',
  fikaStreak: 3,
  lastFikaDate: new Date().toISOString().split('T')[0],
  preferredFikaTime: '10:30',
  isPremium: false,
  totalSessions: 5,
  joinedDate: new Date().toISOString(),
  language: 'en',
  preferredConnectionLanguages: ['en'],
  allowFikaTimeVisible: true,
  friends: []
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from AsyncStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('fika-user-data');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserState(parsedData.user);
          setIsLoggedIn(parsedData.isLoggedIn);
        } else {
          // Create default user for demo
          const defaultUser = createDefaultUser();
          setUserState(defaultUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to default user
        const defaultUser = createDefaultUser();
        setUserState(defaultUser);
        setIsLoggedIn(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save user data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveUserData = async () => {
      try {
        if (!isLoading) {
          const userData = JSON.stringify({ user, isLoggedIn });
          await AsyncStorage.setItem('fika-user-data', userData);
        }
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };

    saveUserData();
  }, [user, isLoggedIn, isLoading]);

  const setUser = (newUser: UserProfile) => {
    setUserState(newUser);
    setIsLoggedIn(true);
  };

  const updateStreak = () => {
    if (user) {
      setUserState({
        ...user,
        fikaStreak: user.fikaStreak + 1,
        lastFikaDate: new Date().toISOString().split('T')[0],
        totalSessions: user.totalSessions + 1
      });
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      setUserState({ ...user, ...updates });
    }
  };

  const logout = () => {
    setUserState(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        setUser,
        updateStreak,
        updateProfile,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};