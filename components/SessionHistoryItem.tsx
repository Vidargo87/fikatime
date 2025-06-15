import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import Card from './Card';
import { FikaSession } from '@/types';
import { CoffeeIcon, UsersIcon, UserIcon } from './icons';

interface SessionHistoryItemProps {
  session: FikaSession;
}

export default function SessionHistoryItem({ session }: SessionHistoryItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getIcon = () => {
    switch (session.type) {
      case 'solo':
        return <UserIcon size={20} color={Colors.primary} />;
      case 'duo':
        return <UsersIcon size={20} color={Colors.primary} />;
      case 'group':
        return <UsersIcon size={20} color={Colors.primary} />;
      default:
        return <CoffeeIcon size={20} color={Colors.primary} />;
    }
  };

  const getMoodEmoji = () => {
    switch (session.mood) {
      case 1: return '😔';
      case 2: return '😐';
      case 3: return '🙂';
      case 4: return '😊';
      case 5: return '😁';
      default: return '';
    }
  };

  return (
    <Card variant="outline" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.sessionType}>
            {session.type.charAt(0).toUpperCase() + session.type.slice(1)} Fika
          </Text>
          <Text style={styles.date}>{formatDate(session.date)}</Text>
        </View>
        {session.mood && (
          <Text style={styles.mood}>{getMoodEmoji()}</Text>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.topicLabel}>Topic:</Text>
        <Text style={styles.topic}>{session.topic}</Text>
        
        {session.reflection && (
          <>
            <Text style={styles.reflectionLabel}>Reflection:</Text>
            <Text style={styles.reflection}>{session.reflection}</Text>
          </>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.duration}>{session.duration} minutes</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  sessionType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  date: {
    fontSize: 14,
    color: Colors.textLight,
  },
  mood: {
    fontSize: 20,
    marginLeft: 8,
  },
  content: {
    paddingLeft: 48,
  },
  topicLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  topic: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  reflectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  reflection: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  duration: {
    fontSize: 12,
    color: Colors.textLight,
  },
});