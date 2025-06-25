import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayTopic, resetTodayTopic } from '@/constants/topics';

interface TopicContextType {
  dailyTopic: string;
  lastUpdated: string | null;
  refreshTopic: () => void;
  isLoading: boolean;
}

const TopicContext = createContext<TopicContextType | undefined>(undefined);

// Helper to check if we need a new topic (different day)
const isNewDay = (lastUpdated: string | null): boolean => {
  if (!lastUpdated) return true;
  
  const lastDate = new Date(lastUpdated).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  
  return lastDate < today;
};

export const TopicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyTopic, setDailyTopic] = useState<string>(getTodayTopic());
  const [lastUpdated, setLastUpdated] = useState<string | null>(new Date().toISOString());
  const [isLoading, setIsLoading] = useState(true);

  // Load topic data from AsyncStorage on mount
  useEffect(() => {
    const loadTopicData = async () => {
      try {
        const topicData = await AsyncStorage.getItem('fika-topic-data');
        if (topicData) {
          const parsedData = JSON.parse(topicData);
          
          // Check if we need to update the topic for a new day
          if (isNewDay(parsedData.lastUpdated) || !parsedData.dailyTopic) {
            const newTopic = getTodayTopic();
            setDailyTopic(newTopic);
            setLastUpdated(new Date().toISOString());
          } else {
            setDailyTopic(parsedData.dailyTopic);
            setLastUpdated(parsedData.lastUpdated);
          }
        }
      } catch (error) {
        console.error('Error loading topic data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopicData();
  }, []);

  // Save topic data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveTopicData = async () => {
      try {
        const topicData = JSON.stringify({ dailyTopic, lastUpdated });
        await AsyncStorage.setItem('fika-topic-data', topicData);
      } catch (error) {
        console.error('Error saving topic data:', error);
      }
    };

    if (!isLoading) {
      saveTopicData();
    }
  }, [dailyTopic, lastUpdated, isLoading]);

  const refreshTopic = () => {
    const newTopic = resetTodayTopic();
    setDailyTopic(newTopic);
    setLastUpdated(new Date().toISOString());
  };

  return (
    <TopicContext.Provider
      value={{
        dailyTopic,
        lastUpdated,
        refreshTopic,
        isLoading
      }}
    >
      {children}
    </TopicContext.Provider>
  );
};

export const useTopic = (): TopicContextType => {
  const context = useContext(TopicContext);
  if (context === undefined) {
    throw new Error('useTopic must be used within a TopicProvider');
  }
  return context;
};