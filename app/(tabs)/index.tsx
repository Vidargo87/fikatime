import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { useSession } from '@/contexts/SessionContext';
import { useTopic } from '@/contexts/TopicContext';
import FikaCard from '@/components/FikaCard';
import Card from '@/components/Card';
import { CoffeeIcon } from '@/components/icons';

export default function HomeScreen() {
  const { user } = useUser();
  const { startSession } = useSession();
  const { dailyTopic, refreshTopic } = useTopic();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshTopic();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [refreshTopic]);

  const handleStartSoloFika = () => {
    startSession({
      type: 'solo',
      duration: 10,
      topic: dailyTopic
    });
    router.push('/timer');
  };

  const handleStartDuoFika = () => {
    startSession({
      type: 'duo',
      duration: 15,
      topic: dailyTopic
    });
    router.push('/timer');
  };

  const handleStartGroupFika = () => {
    if (user?.isPremium) {
      startSession({
        type: 'group',
        duration: 20,
        topic: dailyTopic
      });
      router.push('/timer');
    }
  };

  const getStreakMessage = () => {
    const streak = user?.fikaStreak || 0;
    if (streak === 0) {
      return "Start your first Fika today!";
    } else if (streak === 1) {
      return "🔥 1 day streak! Keep it going!";
    } else if (streak < 7) {
      return `🔥 ${streak} day streak! You're building a great habit!`;
    } else {
      return `🔥 ${streak} day streak! Amazing consistency!`;
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const name = user?.name || 'Friend';
    
    if (hour < 12) {
      return `Good morning, ${name}`;
    } else if (hour < 17) {
      return `Good afternoon, ${name}`;
    } else {
      return `Good evening, ${name}`;
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getWelcomeMessage()}
        </Text>
        <Text style={styles.subtitle}>
          Take a mindful break and boost your wellbeing
        </Text>
      </View>

      {/* Streak Display */}
      <Card variant="elevated" style={styles.streakCard}>
        <View style={styles.streakContent}>
          <Text style={styles.streakMessage}>{getStreakMessage()}</Text>
          {user && user.fikaStreak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakNumber}>{user.fikaStreak}</Text>
              <Text style={styles.streakLabel}>days</Text>
            </View>
          )}
        </View>
      </Card>

      {/* Daily Topic */}
      <Card variant="elevated" style={styles.topicCard}>
        <View style={styles.topicHeader}>
          <CoffeeIcon size={20} color={Colors.primary} />
          <Text style={styles.topicTitle}>Today's Fika Topic</Text>
        </View>
        <Text style={styles.topicText}>
          {dailyTopic || 'Take a moment to reflect on your day'}
        </Text>
      </Card>

      {/* Fika Options */}
      <Text style={styles.sectionTitle}>Choose Your Fika</Text>
      
      <FikaCard
        title="Solo Fika"
        description="Take a peaceful 10-minute break on your own"
        type="solo"
        onPress={handleStartSoloFika}
      />
      
      <FikaCard
        title="Duo Fika"
        description="Share a 15-minute break with one other person"
        type="duo"
        onPress={handleStartDuoFika}
      />
      
      <FikaCard
        title="Group Fika"
        description="Enjoy a 20-minute break with up to 5 people"
        type="group"
        isPremium={user?.isPremium}
        onPress={handleStartGroupFika}
      />

      {/* Quick Stats */}
      <Card style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Fika Journey</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.totalSessions || 0}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.fikaStreak || 0}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Fika Friends</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  streakCard: {
    marginBottom: 16,
    backgroundColor: Colors.success + '15',
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: Colors.success,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  streakLabel: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  topicCard: {
    marginBottom: 24,
    backgroundColor: Colors.cardBackground,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  topicText: {
    fontSize: 18,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  statsCard: {
    marginTop: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
});