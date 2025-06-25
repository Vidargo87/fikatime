import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types';
import { defaultLanguage } from '@/constants/languages';

interface UserState {
  user: UserProfile | null;
  isLoggedIn: boolean;
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

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({ 
        user: {
          ...user,
          language: user.language || defaultLanguage,
          preferredConnectionLanguages: user.preferredConnectionLanguages || [user.language || defaultLanguage],
          allowFikaTimeVisible: user.allowFikaTimeVisible !== undefined ? user.allowFikaTimeVisible : true,
          friends: user.friends || []
        }, 
        isLoggedIn: true 
      }),
      updateStreak: () => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              fikaStreak: user.fikaStreak + 1,
              lastFikaDate: new Date().toISOString().split('T')[0],
              totalSessions: user.totalSessions + 1
            }
          });
        }
      },
      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
      updateAvatar: (avatarUri) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, avatar: avatarUri } });
        }
      },
      updateLanguage: (languageCode) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, language: languageCode } });
        }
      },
      updatePreferredConnectionLanguages: (languageCodes) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, preferredConnectionLanguages: languageCodes } });
        }
      },
      toggleConnectionLanguage: (languageCode) => {
        const { user } = get();
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
          
          set({ user: { ...user, preferredConnectionLanguages: newLanguages } });
        }
      },
      addFriend: (friendId) => {
        const { user } = get();
        if (user) {
          const currentFriends = user.friends || [];
          if (!currentFriends.includes(friendId)) {
            set({ 
              user: { 
                ...user, 
                friends: [...currentFriends, friendId] 
              } 
            });
          }
        }
      },
      removeFriend: (friendId) => {
        const { user } = get();
        if (user && user.friends) {
          set({ 
            user: { 
              ...user, 
              friends: user.friends.filter(id => id !== friendId) 
            } 
          });
        }
      },
      logout: () => set({ user: null, isLoggedIn: false })
    }),
    {
      name: 'fika-user-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);