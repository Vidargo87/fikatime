import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from './userStore';

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

interface FriendsState {
  friends: Friend[];
  friendRequests: FriendRequest[];
  groups: FikaGroup[];
  
  // Friend management
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
  updateFriend: (friendId: string, updates: Partial<Friend>) => void;
  
  // Friend requests
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  
  // Groups
  createFikaGroup: (group: FikaGroup) => void;
  updateFikaGroup: (groupId: string, updates: Partial<FikaGroup>) => void;
  removeFikaGroup: (groupId: string) => void;
  addGroupMember: (groupId: string, userId: string) => void;
  removeGroupMember: (groupId: string, userId: string) => void;
  
  // Search
  searchUsers: (query: string) => Promise<any[]>;
  
  // Fika invitations
  sendFikaInvite: (friendId: string, time?: string) => Promise<boolean>;
}

// Mock data for demo purposes
const mockFriends: Friend[] = [
  {
    id: 'friend1',
    name: 'Emma Johansson',
    email: 'emma@example.com',
    avatar: undefined,
    preferredFikaTime: '14:30',
    showFikaTime: true,
    language: 'sv'
  },
  {
    id: 'friend2',
    name: 'Luca Romano',
    email: 'luca@example.com',
    avatar: undefined,
    preferredFikaTime: '10:15',
    showFikaTime: true,
    language: 'it'
  }
];

const mockRequests: FriendRequest[] = [
  {
    id: 'req1',
    from: {
      id: 'user3',
      name: 'Sophie Martin',
      avatar: undefined
    },
    to: 'currentUser',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

const mockGroups: FikaGroup[] = [
  {
    id: 'group1',
    name: 'Coffee Lovers',
    createdBy: 'currentUser',
    members: ['currentUser', 'friend1', 'friend2'],
    createdAt: new Date().toISOString(),
    preferredFikaTime: '15:00'
  }
];

// Mock search results
const mockSearchResults = [
  {
    id: 'user4',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: undefined
  },
  {
    id: 'user5',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    avatar: undefined
  }
];

export const useFriendsStore = create<FriendsState>()(
  persist(
    (set, get) => ({
      friends: mockFriends,
      friendRequests: mockRequests,
      groups: mockGroups,
      
      addFriend: (friend) => set((state) => ({
        friends: [...state.friends, friend]
      })),
      
      removeFriend: (friendId) => set((state) => ({
        friends: state.friends.filter(f => f.id !== friendId)
      })),
      
      updateFriend: (friendId, updates) => set((state) => ({
        friends: state.friends.map(f => 
          f.id === friendId ? { ...f, ...updates } : f
        )
      })),
      
      sendFriendRequest: (userId) => {
        const currentUser = useUserStore.getState().user;
        if (!currentUser) return;
        
        // In a real app, this would create a document in Firestore
        const newRequest: FriendRequest = {
          id: `req-${Date.now()}`,
          from: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar
          },
          to: userId,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        // This is just for the mock UI
        // In a real app, the recipient would see this request, not the sender
      },
      
      acceptFriendRequest: (requestId) => {
        const { friendRequests } = get();
        const request = friendRequests.find(r => r.id === requestId);
        
        if (!request) return;
        
        // Add the requester as a friend
        const newFriend: Friend = {
          id: request.from.id,
          name: request.from.name,
          avatar: request.from.avatar,
          showFikaTime: true
        };
        
        set((state) => ({
          friends: [...state.friends, newFriend],
          friendRequests: state.friendRequests.filter(r => r.id !== requestId)
        }));
      },
      
      declineFriendRequest: (requestId) => set((state) => ({
        friendRequests: state.friendRequests.filter(r => r.id !== requestId)
      })),
      
      createFikaGroup: (group) => set((state) => ({
        groups: [...state.groups, group]
      })),
      
      updateFikaGroup: (groupId, updates) => set((state) => ({
        groups: state.groups.map(g => 
          g.id === groupId ? { ...g, ...updates } : g
        )
      })),
      
      removeFikaGroup: (groupId) => set((state) => ({
        groups: state.groups.filter(g => g.id !== groupId)
      })),
      
      addGroupMember: (groupId, userId) => set((state) => ({
        groups: state.groups.map(g => 
          g.id === groupId 
            ? { ...g, members: [...g.members, userId] } 
            : g
        )
      })),
      
      removeGroupMember: (groupId, userId) => set((state) => ({
        groups: state.groups.map(g => 
          g.id === groupId 
            ? { ...g, members: g.members.filter(id => id !== userId) } 
            : g
        )
      })),
      
      searchUsers: async (query) => {
        // In a real app, this would call a Firebase function
        // For demo purposes, return mock results after a delay
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(mockSearchResults.filter(user => 
              user.name.toLowerCase().includes(query.toLowerCase()) ||
              user.email?.toLowerCase().includes(query.toLowerCase())
            ));
          }, 1000);
        });
      },
      
      sendFikaInvite: async (friendId, time) => {
        const { friends } = get();
        const friend = friends.find(f => f.id === friendId);
        
        if (!friend) return false;
        
        // In a real app, this would create a notification in Firestore
        // and potentially send a push notification
        
        // For demo purposes, just return success
        return true;
      }
    }),
    {
      name: 'fika-friends-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);