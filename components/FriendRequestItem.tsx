import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { FriendRequest } from '@/store/friendsStore';
import Card from './Card';
import Button from './Button';
import { CheckIcon, XIcon } from './icons';

interface FriendRequestItemProps {
  request: FriendRequest;
  onAccept: () => void;
  onDecline: () => void;
}

export default function FriendRequestItem({ 
  request, 
  onAccept, 
  onDecline 
}: FriendRequestItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card style={styles.container}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {request.from.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{request.from.name}</Text>
        <Text style={styles.date}>
          Sent request on {formatDate(request.createdAt)}
        </Text>
      </View>
      
      <View style={styles.actions}>
        <Button
          title=""
          variant="outline"
          size="small"
          style={styles.declineButton}
          icon={<XIcon size={20} color={Colors.error} />}
          onPress={onDecline}
        />
        <Button
          title=""
          variant="outline"
          size="small"
          style={styles.acceptButton}
          icon={<CheckIcon size={20} color={Colors.success} />}
          onPress={onAccept}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.textLight,
  },
  actions: {
    flexDirection: 'row',
  },
  acceptButton: {
    marginLeft: 8,
    borderColor: Colors.success,
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0,
  },
  declineButton: {
    borderColor: Colors.error,
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0,
  },
});