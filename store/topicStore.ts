import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayTopic, resetTodayTopic } from '@/constants/topics';

interface TopicState {
  dailyTopic: string;
  lastUpdated: string | null;
  refreshTopic: () => void;
}

// Helper to check if we need a new topic (different day)
const isNewDay = (lastUpdated: string | null): boolean => {
  if (!lastUpdated) return true;
  
  const lastDate = new Date(lastUpdated).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  
  return lastDate < today;
};

export const useTopicStore = create<TopicState>()(
  persist(
    (set, get) => ({
      dailyTopic: getTodayTopic(), // Initialize with a topic right away
      lastUpdated: new Date().toISOString(),
      refreshTopic: () => {
        const newTopic = resetTodayTopic();
        set({
          dailyTopic: newTopic,
          lastUpdated: new Date().toISOString()
        });
      }
    }),
    {
      name: 'fika-topic-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Don't try to modify state directly in onRehydrateStorage
        // Instead, use the set function to update state if needed
        if (state && (isNewDay(state.lastUpdated) || !state.dailyTopic)) {
          set({
            dailyTopic: getTodayTopic(),
            lastUpdated: new Date().toISOString()
          });
        }
      }
    }
  )
);