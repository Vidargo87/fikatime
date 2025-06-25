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
  
  const lastDate = new Date(lastUpdated).toDateString();
  const today = new Date().toDateString();
  
  return lastDate !== today;
};

export const TopicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyTopic, setDailyTopic] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load topic data from AsyncStorage on mount
  useEffect(() => {
    const loadTopicData = async () => {
      try {
        console.log('TopicContext: Loading topic data from storage');
        const topicData = await AsyncStorage.getItem('fika-topic-data');
        
        if (topicData) {
          console.log('TopicContext: Topic data found in storage');
          const parsedData = JSON.parse(topicData);
          
          // Check if we need to update the topic for a new day
          if (isNewDay(parsedData.lastUpdated) || !parsedData.dailyTopic) {
            console.log('TopicContext: Getting new topic for today');
            const newTopic = getTodayTopic();
            setDailyTopic(newTopic);
            setLastUpdated(new Date().toISOString());
          } else {
            console.log('TopicContext: Using existing topic');
            setDailyTopic(parsedData.dailyTopic);
            setLastUpdated(parsedData.lastUpdated);
          }
        } else {
          console.log('TopicContext: No topic data found, creating new');
          const newTopic = getTodayTopic();
          setDailyTopic(newTopic);
          setLastUpdated(new Date().toISOString());
        }
      } catch (error) {
        console.error('TopicContext: Error loading topic data:', error);
        // Fallback to getting a new topic
        const newTopic = getTodayTopic();
        setDailyTopic(newTopic);
        setLastUpdated(new Date().toISOString());
      } finally {
        console.log('TopicContext: Topic loading complete');
        setIsLoading(false);
      }
    };

    loadTopicData();
  }, []);

  // Save topic data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveTopicData = async () => {
      try {
        if (!isLoading && dailyTopic) {
          console.log('TopicContext: Saving topic data to storage');
          const topicData = JSON.stringify({ dailyTopic, lastUpdated });
          await AsyncStorage.setItem('fika-topic-data', topicData);
        }
      } catch (error) {
        console.error('TopicContext: Error saving topic data:', error);
      }
    };

    saveTopicData();
  }, [dailyTopic, lastUpdated, isLoading]);

  const refreshTopic = () => {
    console.log('TopicContext: Refreshing topic');
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