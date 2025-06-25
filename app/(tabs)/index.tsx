import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { useSession } from '@/contexts/SessionContext';
import { useTopic } from '@/contexts/TopicContext';
import { useFriends } from '@/contexts/FriendsContext';
import FikaCard from '@/components/FikaCard';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LanguageFilter from '@/components/LanguageFilter';
import FriendInviteModal from '@/components/FriendInviteModal';
import { CoffeeIcon, UserPlusIcon } from '@/components/icons';

export default function HomeScreen() {
  const { user, updateProfile } = useUser();
  const { startSession } = useSession();
  const { dailyTopic } = useTopic();
  const { friends } = useFriends();
  
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFriendInviteModal, setShowFriendInviteModal] = useState(false);
  const [sessionType, setSessionType] = useState<'duo' | 'group' | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    user?.preferredConnectionLanguages || [user?.language || 'en']
  );
  
  useEffect(() => {
    if (user?.preferredConnectionLanguages) {
      setSelectedLanguages(user.preferredConnectionLanguages);
    }
  }, [user?.preferredConnectionLanguages]);

  const handleStartSoloFika = () => {
    startSession({
      type: 'solo',
      duration: 10,
      topic: dailyTopic
    });
    router.push('/timer');
  };

  const handleStartDuoFika = () => {
    setSessionType('duo');
    setShowLanguageModal(true);
  };

  const handleStartGroupFika = () => {
    if (user?.isPremium) {
      setSessionType('group');
      setShowLanguageModal(true);
    }
  };

  const handleLanguagesContinue = () => {
    // Update user's preferred connection languages
    if (user) {
      updateProfile({
        preferredConnectionLanguages: selectedLanguages
      });
    }

    // Start the session with the selected type
    if (sessionType) {
      startSession({
        type: sessionType,
        duration: sessionType === 'duo' ? 15 : 20,
        topic: dailyTopic
      });
      setShowLanguageModal(false);
      router.push('/timer');
    }
  };

  const handleLanguagesCancel = () => {
    setShowLanguageModal(false);
    setSessionType(null);
  };

  const handleInviteFriend = () => {
    setShowFriendInviteModal(true);
  };

  // Ensure we have valid data before rendering
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {user.name ? `Hello, ${user.name}` : 'Welcome to FikaTime'}
        </Text>
        <Text style={styles.subtitle}>
          Take a mindful break and boost your wellbeing
        </Text>
      </View>

      <Card variant="elevated" style={styles.topicCard}>
        <View style={styles.topicHeader}>
          <CoffeeIcon size={20} color={Colors.primary} />
          <Text style={styles.topicTitle}>Today's Topic</Text>
        </View>
        <Text style={styles.topicText}>{dailyTopic || 'Take a moment to reflect'}</Text>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          title="Invite a Friend"
          variant="outline"
          onPress={handleInviteFriend}
          icon={<UserPlusIcon size={18} color={Colors.primary} style={{ marginRight: 8 }} />}
          style={styles.inviteButton}
        />
      </View>

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
        isPremium={user.isPremium}
        onPress={handleStartGroupFika}
      />

      {!user.isPremium && (
        <Card style={styles.premiumCard}>
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          <Text style={styles.premiumDescription}>
            Unlock group sessions, custom themes, and more!
          </Text>
          <Button 
            title="Get Premium" 
            variant="secondary"
            onPress={() => router.push('/profile')}
            style={styles.premiumButton}
          />
        </Card>
      )}

      {user.fikaStreak && user.fikaStreak > 0 && (
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>
            🔥 {user.fikaStreak} day{user.fikaStreak !== 1 ? 's' : ''} streak! Keep it up!
          </Text>
        </View>
      )}

      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LanguageFilter
              selectedLanguages={selectedLanguages}
              onLanguagesSelected={setSelectedLanguages}
              onContinue={handleLanguagesContinue}
              onCancel={handleLanguagesCancel}
            />
          </View>
        </View>
      </Modal>

      {showFriendInviteModal && (
        <FriendInviteModal
          friends={friends}
          onClose={() => setShowFriendInviteModal(false)}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textLight,
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
  actionButtons: {
    marginBottom: 24,
  },
  inviteButton: {
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  premiumCard: {
    backgroundColor: Colors.accent + '30', // 30% opacity
    marginTop: 16,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  premiumButton: {
    alignSelf: 'flex-start',
  },
  streakContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: Colors.success + '20', // 20% opacity
    borderRadius: 12,
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
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
  },
});