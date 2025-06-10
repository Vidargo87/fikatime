import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Coffee, Clock, Globe } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Friend } from '@/store/friendsStore';
import Card from './Card';
import { languages } from '@/constants/languages';

interface FriendItemProps {
  friend: Friend;
  onInvite: () => void;
}

export default function FriendItem({ friend, onInvite }: FriendItemProps) {
  const getLanguageName = (code?: string) => {
    if (!code) return 'English';
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  return (
    <Card style={styles.container}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {friend.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{friend.name}</Text>
        
        <View style={styles.infoRow}>
          <Globe size={14} color={Colors.textLight} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            {getLanguageName(friend.language)}
          </Text>
        </View>
        
        {friend.showFikaTime && friend.preferredFikaTime && (
          <View style={styles.infoRow}>
            <Clock size={14} color={Colors.textLight} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Prefers Fika at {friend.preferredFikaTime}
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity style={styles.inviteButton} onPress={onInvite}>
        <Coffee size={20} color={Colors.primary} />
        <Text style={styles.inviteText}>Invite</Text>
      </TouchableOpacity>
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  inviteText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 6,
  },
});