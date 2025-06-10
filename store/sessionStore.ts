import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FikaSession } from '@/types';

interface SessionState {
  sessions: FikaSession[];
  currentSession: FikaSession | null;
  addSession: (session: FikaSession) => void;
  updateCurrentSession: (updates: Partial<FikaSession>) => void;
  startSession: (sessionData: Partial<FikaSession>) => void;
  endCurrentSession: (reflection?: string, mood?: 1 | 2 | 3 | 4 | 5) => void;
  clearCurrentSession: () => void;
  addParticipant: (userId: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      addSession: (session) => set((state) => ({ 
        sessions: [session, ...state.sessions] 
      })),
      updateCurrentSession: (updates) => set((state) => ({
        currentSession: state.currentSession 
          ? { ...state.currentSession, ...updates } 
          : null
      })),
      startSession: (sessionData) => {
        const newSession: FikaSession = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          duration: sessionData.duration || 10,
          type: sessionData.type || 'solo',
          topic: sessionData.topic || '',
          participants: sessionData.type !== 'solo' ? [] : undefined,
          ...sessionData
        };
        set({ currentSession: newSession });
      },
      endCurrentSession: (reflection, mood) => {
        const { currentSession } = get();
        if (currentSession) {
          const completedSession = {
            ...currentSession,
            reflection,
            mood
          };
          set((state) => ({
            sessions: [completedSession, ...state.sessions],
            currentSession: null
          }));
        }
      },
      clearCurrentSession: () => set({ currentSession: null }),
      addParticipant: (userId) => {
        const { currentSession } = get();
        if (currentSession && currentSession.type !== 'solo') {
          const participants = currentSession.participants || [];
          if (!participants.includes(userId)) {
            set({
              currentSession: {
                ...currentSession,
                participants: [...participants, userId]
              }
            });
          }
        }
      }
    }),
    {
      name: 'fika-session-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ sessions: state.sessions })
    }
  )
);