import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useFriendsStore } from '@/store/friendsStore';
import Card from '@/components/Card';
import Button from '@/components/Button';
import FriendItem from '@/components/FriendItem';
import FriendRequestItem from '@/components/FriendRequestItem';
import CreateGroupModal from '@/components/CreateGroupModal';
import { SearchIcon, UserPlusIcon, ClockIcon, XIcon, CheckIcon, CoffeeIcon, UsersIcon } from '@/components/icons';

export default function FriendsScreen() {
  const { user } = useUserStore();
  const { 
    friends, 
    friendRequests, 
    groups,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    createFikaGroup
  } = useFriendsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'groups'>('friends');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Please enter a username or email to search');
      return;
    }
    
    setIsSearching(true);
    try {
      // In a real app, this would call a Firebase function to search users
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search for users');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSendRequest = (userId: string) => {
    sendFriendRequest(userId);
    setSearchResults(prev => prev.filter(user => user.id !== userId));
    Alert.alert('Success', 'Friend request sent!');
  };
  
  const handleAcceptRequest = (requestId: string) => {
    acceptFriendRequest(requestId);
  };
  
  const handleDeclineRequest = (requestId: string) => {
    declineFriendRequest(requestId);
  };
  
  const handleCreateGroup = (groupName: string, memberIds: string[]) => {
    if (!groupName.trim() || memberIds.length === 0) {
      Alert.alert('Error', 'Please provide a group name and select at least one friend');
      return;
    }
    
    createFikaGroup({
      id: Date.now().toString(),
      name: groupName,
      createdBy: user?.id || '',
      members: [user?.id || '', ...memberIds],
      createdAt: new Date().toISOString()
    });
    
    setShowCreateGroup(false);
    Alert.alert('Success', `Group "${groupName}" created successfully!`);
  };
  
  const renderFriendsList = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Friends</Text>
        <Button 
          title="Create Group" 
          variant="secondary"
          size="small"
          onPress={() => setShowCreateGroup(true)}
          icon={<UserPlusIcon size={16} color={Colors.secondary} style={{ marginRight: 8 }} />}
        />
      </View>
      
      {friends.length === 0 ? (
        <Card style={styles.emptyState}>
          <UserPlusIcon size={40} color={Colors.textLight} />
          <Text style={styles.emptyStateTitle}>No friends yet</Text>
          <Text style={styles.emptyStateText}>
            Search for users to add them as friends
          </Text>
        </Card>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FriendItem 
              friend={item} 
              onInvite={() => Alert.alert('Invite', `Invitation sent to ${item.name}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </>
  );
  
  const renderRequestsList = () => (
    <>
      <Text style={styles.sectionTitle}>Friend Requests</Text>
      
      {friendRequests.length === 0 ? (
        <Card style={styles.emptyState}>
          <ClockIcon size={40} color={Colors.textLight} />
          <Text style={styles.emptyStateTitle}>No pending requests</Text>
          <Text style={styles.emptyStateText}>
            Friend requests will appear here
          </Text>
        </Card>
      ) : (
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FriendRequestItem 
              request={item}
              onAccept={() => handleAcceptRequest(item.id)}
              onDecline={() => handleDeclineRequest(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </>
  );
  
  const renderGroupsList = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Fika Groups</Text>
        <Button 
          title="New Group" 
          variant="secondary"
          size="small"
          onPress={() => setShowCreateGroup(true)}
          icon={<UserPlusIcon size={16} color={Colors.secondary} style={{ marginRight: 8 }} />}
        />
      </View>
      
      {groups.length === 0 ? (
        <Card style={styles.emptyState}>
          <UsersIcon size={40} color={Colors.textLight} />
          <Text style={styles.emptyStateTitle}>No groups yet</Text>
          <Text style={styles.emptyStateText}>
            Create a group to enjoy Fika with friends
          </Text>
        </Card>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.groupMembers}>
                  {item.members.length} members
                </Text>
              </View>
              <View style={styles.groupActions}>
                <Button 
                  title="Start Group Fika" 
                  variant="primary"
                  size="small"
                  icon={<CoffeeIcon size={16} color="#FFFFFF" style={{ marginRight: 8 }} />}
                  onPress={() => Alert.alert('Group Fika', `Starting Fika with ${item.name}`)}
                />
              </View>
            </Card>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by username or email"
            placeholderTextColor={Colors.textLight}
          />
        </View>
        <Button
          title="Search"
          variant="primary"
          size="small"
          onPress={handleSearch}
          loading={isSearching}
          style={styles.searchButton}
        />
      </View>
      
      {searchResults.length > 0 && (
        <View style={styles.searchResults}>
          <View style={styles.searchResultsHeader}>
            <Text style={styles.searchResultsTitle}>Search Results</Text>
            <TouchableOpacity 
              onPress={() => setSearchResults([])}
              style={styles.closeButton}
            >
              <XIcon size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.searchResultCard}>
                <View style={styles.searchResultInfo}>
                  <Text style={styles.searchResultName}>{item.name}</Text>
                  <Text style={styles.searchResultEmail}>{item.email}</Text>
                </View>
                <Button
                  title="Add Friend"
                  variant="outline"
                  size="small"
                  icon={<UserPlusIcon size={16} color={Colors.primary} style={{ marginRight: 8 }} />}
                  onPress={() => handleSendRequest(item.id)}
                />
              </Card>
            )}
            contentContainerStyle={styles.searchResultsList}
          />
        </View>
      )}
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests {friendRequests.length > 0 && `(${friendRequests.length})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
            Groups
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabContent}>
        {activeTab === 'friends' && renderFriendsList()}
        {activeTab === 'requests' && renderRequestsList()}
        {activeTab === 'groups' && renderGroupsList()}
      </View>
      
      {showCreateGroup && (
        <CreateGroupModal
          friends={friends}
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.text,
  },
  searchButton: {},
  searchResults: {
    backgroundColor: Colors.cardBackground,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 12,
    maxHeight: 300,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  searchResultsList: {
    paddingBottom: 8,
  },
  searchResultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    padding: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  searchResultEmail: {
    fontSize: 14,
    color: Colors.textLight,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  groupCard: {
    marginBottom: 12,
  },
  groupHeader: {
    marginBottom: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
    color: Colors.textLight,
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});