import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FikaSession } from '@/types';

interface SessionContextType {
  sessions: FikaSession[];
  currentSession: FikaSession | null;
  addSession: (session: FikaSession) => void;
  updateCurrentSession: (updates: Partial<FikaSession>) => void;
  startSession: (sessionData: Partial<FikaSession>) => void;
  endCurrentSession: (reflection?: string, mood?: 1 | 2 | 3 | 4 | 5) => void;
  clearCurrentSession: () => void;
  addParticipant: (userId: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<FikaSession[]>([]);
  const [currentSession, setCurrentSession] = useState<FikaSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session data from AsyncStorage on mount
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const sessionData = await AsyncStorage.getItem('fika-session-data');
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          setSessions(parsedData.sessions || []);
          // We don't restore currentSession from storage as it's transient
        }
      } catch (error) {
        console.error('Error loading session data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, []);

  // Save session data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveSessionData = async () => {
      try {
        const sessionData = JSON.stringify({ sessions });
        await AsyncStorage.setItem('fika-session-data', sessionData);
      } catch (error) {
        console.error('Error saving session data:', error);
      }
    };

    if (!isLoading) {
      saveSessionData();
    }
  }, [sessions, isLoading]);

  const addSession = (session: FikaSession) => {
    setSessions(prevSessions => [session, ...prevSessions]);
  };

  const updateCurrentSession = (updates: Partial<FikaSession>) => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, ...updates });
    }
  };

  const startSession = (sessionData: Partial<FikaSession>) => {
    const newSession: FikaSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: sessionData.duration || 10,
      type: sessionData.type || 'solo',
      topic: sessionData.topic || '',
      participants: sessionData.type !== 'solo' ? [] : undefined,
      ...sessionData
    };
    setCurrentSession(newSession);
  };

  const endCurrentSession = (reflection?: string, mood?: 1 | 2 | 3 | 4 | 5) => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        reflection,
        mood
      };
      setSessions(prevSessions => [completedSession, ...prevSessions]);
      setCurrentSession(null);
    }
  };

  const clearCurrentSession = () => {
    setCurrentSession(null);
  };

  const addParticipant = (userId: string) => {
    if (currentSession && currentSession.type !== 'solo') {
      const participants = currentSession.participants || [];
      if (!participants.includes(userId)) {
        setCurrentSession({
          ...currentSession,
          participants: [...participants, userId]
        });
      }
    }
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        currentSession,
        addSession,
        updateCurrentSession,
        startSession,
        endCurrentSession,
        clearCurrentSession,
        addParticipant
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};