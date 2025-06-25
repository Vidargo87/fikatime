// Type definitions for friends-related data

export interface Friend {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  preferredFikaTime?: string;
  showFikaTime: boolean;
  language?: string;
}

export interface FriendRequest {
  id: string;
  from: {
    id: string;
    name: string;
    avatar?: string;
  };
  to: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface FikaGroup {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
  createdAt: string;
  preferredFikaTime?: string;
}