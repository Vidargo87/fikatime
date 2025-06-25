import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Friend, FriendRequest, FikaGroup } from '@/types/friends';

interface FriendsContextType {
  friends: Friend[];
  friendRequests: FriendRequest[];
  groups: FikaGroup[];
  isLoading: boolean;
  
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

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(mockRequests);
  const [groups, setGroups] = useState<FikaGroup[]>(mockGroups);
  const [isLoading, setIsLoading] = useState(true);

  // Load friends data from AsyncStorage on mount
  useEffect(() => {
    const loadFriendsData = async () => {
      try {
        const friendsData = await AsyncStorage.getItem('fika-friends-data');
        if (friendsData) {
          const parsedData = JSON.parse(friendsData);
          setFriends(parsedData.friends || mockFriends);
          setFriendRequests(parsedData.friendRequests || mockRequests);
          setGroups(parsedData.groups || mockGroups);
        }
      } catch (error) {
        console.error('Error loading friends data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFriendsData();
  }, []);

  // Save friends data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveFriendsData = async () => {
      try {
        const friendsData = JSON.stringify({ friends, friendRequests, groups });
        await AsyncStorage.setItem('fika-friends-data', friendsData);
      } catch (error) {
        console.error('Error saving friends data:', error);
      }
    };

    if (!isLoading) {
      saveFriendsData();
    }
  }, [friends, friendRequests, groups, isLoading]);

  const addFriend = (friend: Friend) => {
    setFriends(prevFriends => [...prevFriends, friend]);
  };

  const removeFriend = (friendId: string) => {
    setFriends(prevFriends => prevFriends.filter(f => f.id !== friendId));
  };

  const updateFriend = (friendId: string, updates: Partial<Friend>) => {
    setFriends(prevFriends => 
      prevFriends.map(f => f.id === friendId ? { ...f, ...updates } : f)
    );
  };

  const sendFriendRequest = (userId: string) => {
    // In a real app, this would create a document in Firestore
    // For now, we'll just simulate the request
    console.log(`Friend request sent to user ${userId}`);
  };

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    
    if (!request) return;
    
    // Add the requester as a friend
    const newFriend: Friend = {
      id: request.from.id,
      name: request.from.name,
      avatar: request.from.avatar,
      showFikaTime: true
    };
    
    setFriends(prevFriends => [...prevFriends, newFriend]);
    setFriendRequests(prevRequests => prevRequests.filter(r => r.id !== requestId));
  };

  const declineFriendRequest = (requestId: string) => {
    setFriendRequests(prevRequests => prevRequests.filter(r => r.id !== requestId));
  };

  const createFikaGroup = (group: FikaGroup) => {
    setGroups(prevGroups => [...prevGroups, group]);
  };

  const updateFikaGroup = (groupId: string, updates: Partial<FikaGroup>) => {
    setGroups(prevGroups => 
      prevGroups.map(g => g.id === groupId ? { ...g, ...updates } : g)
    );
  };

  const removeFikaGroup = (groupId: string) => {
    setGroups(prevGroups => prevGroups.filter(g => g.id !== groupId));
  };

  const addGroupMember = (groupId: string, userId: string) => {
    setGroups(prevGroups => 
      prevGroups.map(g => 
        g.id === groupId 
          ? { ...g, members: [...g.members, userId] } 
          : g
      )
    );
  };

  const removeGroupMember = (groupId: string, userId: string) => {
    setGroups(prevGroups => 
      prevGroups.map(g => 
        g.id === groupId 
          ? { ...g, members: g.members.filter(id => id !== userId) } 
          : g
      )
    );
  };

  const searchUsers = async (query: string) => {
    // In a real app, this would call a Firebase function
    // For demo purposes, return mock results after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSearchResults.filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          (user.email?.toLowerCase().includes(query.toLowerCase()) || false)
        ));
      }, 1000);
    });
  };

  const sendFikaInvite = async (friendId: string, time?: string) => {
    const friend = friends.find(f => f.id === friendId);
    
    if (!friend) return false;
    
    // In a real app, this would create a notification in Firestore
    // and potentially send a push notification
    
    // For demo purposes, just return success
    return true;
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        friendRequests,
        groups,
        isLoading,
        addFriend,
        removeFriend,
        updateFriend,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        createFikaGroup,
        updateFikaGroup,
        removeFikaGroup,
        addGroupMember,
        removeGroupMember,
        searchUsers,
        sendFikaInvite
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = (): FriendsContextType => {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};