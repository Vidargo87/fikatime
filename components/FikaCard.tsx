import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import Card from './Card';
import { CoffeeIcon, UsersIcon, UserIcon } from './icons';

interface FikaCardProps {
  title: string;
  description: string;
  type: 'solo' | 'duo' | 'group';
  onPress: () => void;
  isPremium?: boolean;
}

export default function FikaCard({ 
  title, 
  description, 
  type, 
  onPress,
  isPremium = false
}: FikaCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'solo':
        return <UserIcon size={24} color={Colors.primary} />;
      case 'duo':
        return <UsersIcon size={24} color={Colors.primary} />;
      case 'group':
        return <UsersIcon size={24} color={isPremium ? Colors.primary : Colors.inactive} />;
      default:
        return <CoffeeIcon size={24} color={Colors.primary} />;
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={type === 'group' && !isPremium}
      activeOpacity={0.7}
    >
      <Card variant="elevated" style={styles.card}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          
          {type === 'group' && !isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
  },
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  }
});