import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types';
import { defaultLanguage } from '@/constants/languages';

interface UserContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile) => void;
  updateStreak: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateAvatar: (avatarUri: string) => void;
  updateLanguage: (languageCode: string) => void;
  updatePreferredConnectionLanguages: (languageCodes: string[]) => void;
  toggleConnectionLanguage: (languageCode: string) => void;
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

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
        }
      } catch (error) {
        console.error('Error loading user data:', error);
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
        const userData = JSON.stringify({ user, isLoggedIn });
        await AsyncStorage.setItem('fika-user-data', userData);
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };

    if (!isLoading) {
      saveUserData();
    }
  }, [user, isLoggedIn, isLoading]);

  const setUser = (newUser: UserProfile) => {
    setUserState({
      ...newUser,
      language: newUser.language || defaultLanguage,
      preferredConnectionLanguages: newUser.preferredConnectionLanguages || [newUser.language || defaultLanguage],
      allowFikaTimeVisible: newUser.allowFikaTimeVisible !== undefined ? newUser.allowFikaTimeVisible : true,
      friends: newUser.friends || []
    });
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

  const updateAvatar = (avatarUri: string) => {
    if (user) {
      setUserState({ ...user, avatar: avatarUri });
    }
  };

  const updateLanguage = (languageCode: string) => {
    if (user) {
      setUserState({ ...user, language: languageCode });
    }
  };

  const updatePreferredConnectionLanguages = (languageCodes: string[]) => {
    if (user) {
      setUserState({ ...user, preferredConnectionLanguages: languageCodes });
    }
  };

  const toggleConnectionLanguage = (languageCode: string) => {
    if (user) {
      const currentLanguages = user.preferredConnectionLanguages || [];
      let newLanguages;
      
      if (currentLanguages.includes(languageCode)) {
        // Remove language if it's already selected
        newLanguages = currentLanguages.filter(code => code !== languageCode);
        // Ensure at least one language is selected
        if (newLanguages.length === 0) {
          newLanguages = [user.language || defaultLanguage];
        }
      } else {
        // Add language if it's not selected
        newLanguages = [...currentLanguages, languageCode];
      }
      
      setUserState({ ...user, preferredConnectionLanguages: newLanguages });
    }
  };

  const addFriend = (friendId: string) => {
    if (user) {
      const currentFriends = user.friends || [];
      if (!currentFriends.includes(friendId)) {
        setUserState({ 
          ...user, 
          friends: [...currentFriends, friendId] 
        });
      }
    }
  };

  const removeFriend = (friendId: string) => {
    if (user && user.friends) {
      setUserState({ 
        ...user, 
        friends: user.friends.filter(id => id !== friendId) 
      });
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
        updateAvatar,
        updateLanguage,
        updatePreferredConnectionLanguages,
        toggleConnectionLanguage,
        addFriend,
        removeFriend,
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