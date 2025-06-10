// Type definitions for the app

export type FikaSession = {
  id: string;
  date: string;
  duration: number; // in minutes
  type: 'solo' | 'duo' | 'group';
  topic: string;
  reflection?: string;
  mood?: 1 | 2 | 3 | 4 | 5; // 1-5 rating
  participants?: string[]; // User IDs for duo/group sessions
};

export type UserProfile = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  fikaStreak: number;
  lastFikaDate?: string;
  preferredFikaTime?: string; // HH:mm format
  isPremium: boolean;
  totalSessions: number;
  joinedDate: string;
  language?: string; // Language code (en, fr, pl, uk)
  preferredConnectionLanguages?: string[]; // Array of language codes for matchmaking
  allowFikaTimeVisible?: boolean; // Whether to show fika time to friends
  friends?: string[]; // Array of friend user IDs
};

export type AppSettings = {
  language: string;
  notifications: boolean;
  darkMode: boolean;
  soundEnabled: boolean;
};

export type FikaInvitation = {
  id: string;
  from: string; // User ID
  to: string; // User ID
  time: string; // ISO date string
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
};