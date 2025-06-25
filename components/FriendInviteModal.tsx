import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  TextInput,
  Platform
} from 'react-native';
import Colors from '@/constants/colors';
import { Friend } from '@/types/friends';
import Card from './Card';
import Button from './Button';
import { XIcon, CoffeeIcon, ClockIcon, CalendarIcon } from './icons';

interface FriendInviteModalProps {
  friends: Friend[];
  onClose: () => void;
}

export default function FriendInviteModal({ 
  friends, 
  onClose 
}: FriendInviteModalProps) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [inviteTime, setInviteTime] = useState('');
  const [inviteDate, setInviteDate] = useState('');
  const [step, setStep] = useState<'select' | 'schedule'>('select');
  
  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    setStep('schedule');
    
    // Default to current time + 30 minutes, rounded to nearest 5 minutes
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5);
    
    setInviteTime(
      `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    );
    
    // Default to today's date
    setInviteDate(now.toISOString().split('T')[0]);
  };
  
  const handleSendInvite = () => {
    if (!selectedFriend) return;
    
    // In a real app, this would create a notification in Firestore
    // and potentially send a push notification to the friend
    
    Alert.alert(
      'Invitation Sent',
      `Your Fika invitation has been sent to ${selectedFriend.name}. We'll notify you when they respond.`,
      [{ text: 'OK', onPress: onClose }]
    );
  };
  
  const handleBack = () => {
    setStep('select');
    setSelectedFriend(null);
  };

  // For Android, we'll render the content directly since the parent component handles the Modal
  if (Platform.OS === 'android') {
    return (
      <Card style={styles.modalContent}>
        <View style={styles.header}>
          <CoffeeIcon size={24} color={Colors.primary} />
          <Text style={styles.title}>
            {step === 'select' ? 'Invite a Friend to Fika' : 'Schedule Fika'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <XIcon size={24} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        
        {step === 'select' ? (
          <>
            <Text style={styles.subtitle}>
              Choose a friend to invite for a Fika session
            </Text>
            
            {friends.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  You don't have any friends yet. Add friends to invite them for Fika.
                </Text>
                <Button
                  title="Find Friends"
                  onPress={() => {
                    onClose();
                    // Navigate to friends tab
                  }}
                  style={styles.findFriendsButton}
                />
              </View>
            ) : (
              <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.friendItem}
                    onPress={() => handleSelectFriend(item)}
                  >
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName}>{item.name}</Text>
                      {item.showFikaTime && item.preferredFikaTime && (
                        <View style={styles.fikaTimeContainer}>
                          <ClockIcon size={12} color={Colors.textLight} style={styles.fikaTimeIcon} />
                          <Text style={styles.fikaTimeText}>
                            Prefers Fika at {item.preferredFikaTime}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.friendsList}
              />
            )}
          </>
        ) : (
          <>
            <View style={styles.selectedFriendContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {selectedFriend?.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.selectedFriendName}>
                {selectedFriend?.name}
              </Text>
            </View>
            
            <Text style={styles.inputLabel}>Time</Text>
            <View style={styles.inputContainer}>
              <ClockIcon size={20} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={inviteTime}
                onChangeText={setInviteTime}
                placeholder="e.g. 15:30"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            
            <Text style={styles.inputLabel}>Date</Text>
            <View style={styles.inputContainer}>
              <CalendarIcon size={20} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={inviteDate}
                onChangeText={setInviteDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Back"
                variant="outline"
                onPress={handleBack}
                style={styles.backButton}
              />
              <Button
                title="Send Invite"
                onPress={handleSendInvite}
                style={styles.sendButton}
              />
            </View>
          </>
        )}
      </Card>
    );
  }

  // For iOS and other platforms, use the Modal component
  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalContent}>
          <View style={styles.header}>
            <CoffeeIcon size={24} color={Colors.primary} />
            <Text style={styles.title}>
              {step === 'select' ? 'Invite a Friend to Fika' : 'Schedule Fika'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <XIcon size={24} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
          
          {step === 'select' ? (
            <>
              <Text style={styles.subtitle}>
                Choose a friend to invite for a Fika session
              </Text>
              
              {friends.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    You don't have any friends yet. Add friends to invite them for Fika.
                  </Text>
                  <Button
                    title="Find Friends"
                    onPress={() => {
                      onClose();
                      // Navigate to friends tab
                    }}
                    style={styles.findFriendsButton}
                  />
                </View>
              ) : (
                <FlatList
                  data={friends}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.friendItem}
                      onPress={() => handleSelectFriend(item)}
                    >
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {item.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{item.name}</Text>
                        {item.showFikaTime && item.preferredFikaTime && (
                          <View style={styles.fikaTimeContainer}>
                            <ClockIcon size={12} color={Colors.textLight} style={styles.fikaTimeIcon} />
                            <Text style={styles.fikaTimeText}>
                              Prefers Fika at {item.preferredFikaTime}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  style={styles.friendsList}
                />
              )}
            </>
          ) : (
            <>
              <View style={styles.selectedFriendContainer}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {selectedFriend?.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.selectedFriendName}>
                  {selectedFriend?.name}
                </Text>
              </View>
              
              <Text style={styles.inputLabel}>Time</Text>
              <View style={styles.inputContainer}>
                <ClockIcon size={20} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={inviteTime}
                  onChangeText={setInviteTime}
                  placeholder="e.g. 15:30"
                  placeholderTextColor={Colors.textLight}
                />
              </View>
              
              <Text style={styles.inputLabel}>Date</Text>
              <View style={styles.inputContainer}>
                <CalendarIcon size={20} color={Colors.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={inviteDate}
                  onChangeText={setInviteDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textLight}
                />
              </View>
              
              <View style={styles.buttonContainer}>
                <Button
                  title="Back"
                  variant="outline"
                  onPress={handleBack}
                  style={styles.backButton}
                />
                <Button
                  title="Send Invite"
                  onPress={handleSendInvite}
                  style={styles.sendButton}
                />
              </View>
            </>
          )}
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
    maxHeight: Platform.OS === 'android' ? '90%' : '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  findFriendsButton: {
    marginTop: 8,
  },
  friendsList: {
    maxHeight: 300,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  fikaTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  fikaTimeIcon: {
    marginRight: 4,
  },
  fikaTimeText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  selectedFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedFriendName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: Colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    flex: 1,
    marginLeft: 8,
  },
});