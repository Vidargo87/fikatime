import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ScrollView 
} from 'react-native';
import Colors from '@/constants/colors';
import { Friend } from '@/store/friendsStore';
import Button from './Button';
import Card from './Card';
import { XIcon, CheckIcon, UsersIcon } from './icons';

interface CreateGroupModalProps {
  friends: Friend[];
  onClose: () => void;
  onCreate: (name: string, memberIds: string[]) => void;
}

export default function CreateGroupModal({ 
  friends, 
  onClose, 
  onCreate 
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  
  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };
  
  const handleCreate = () => {
    onCreate(groupName, selectedFriends);
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalContent}>
          <View style={styles.header}>
            <UsersIcon size={24} color={Colors.primary} />
            <Text style={styles.title}>Create Fika Group</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <XIcon size={24} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.inputLabel}>Group Name</Text>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            placeholderTextColor={Colors.textLight}
          />
          
          <Text style={styles.sectionTitle}>Select Friends</Text>
          
          {friends.length === 0 ? (
            <Text style={styles.emptyText}>
              You don't have any friends yet. Add friends to create a group.
            </Text>
          ) : (
            <ScrollView style={styles.friendsList}>
              {friends.map(friend => (
                <TouchableOpacity
                  key={friend.id}
                  style={[
                    styles.friendItem,
                    selectedFriends.includes(friend.id) && styles.selectedFriend
                  ]}
                  onPress={() => toggleFriendSelection(friend.id)}
                >
                  <View style={styles.friendInfo}>
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>
                        {friend.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.friendName}>{friend.name}</Text>
                  </View>
                  
                  {selectedFriends.includes(friend.id) && (
                    <CheckIcon size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          
          <View style={styles.buttonContainer}>
            <Button
              title="Create Group"
              onPress={handleCreate}
              disabled={!groupName.trim() || selectedFriends.length === 0}
              style={styles.createButton}
            />
            <Button
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={styles.cancelButton}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  friendsList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedFriend: {
    backgroundColor: Colors.primary + '15',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  friendName: {
    fontSize: 16,
    color: Colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
});