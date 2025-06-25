import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Platform, RefreshControl } from 'react-native';
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
import { CoffeeIcon, UserPlusIcon, AwardIcon } from '@/components/icons';

export default function HomeScreen() {
  const { user, updateProfile } = useUser();
  const { startSession } = useSession();
  const { dailyTopic, refreshTopic } = useTopic();
  const { friends } = useFriends();
  
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFriendInviteModal, setShowFriendInviteModal] = useState(false);
  const [sessionType, setSessionType] = useState<'duo' | 'group' | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    user?.preferredConnectionLanguages || [user?.language || 'en']
  );
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user?.preferredConnectionLanguages) {
      setSelectedLanguages(user.preferredConnectionLanguages);
    }
  }, [user?.preferredConnectionLanguages]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshTopic();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [refreshTopic]);

  const handleStartSoloFika = () => {
    setIsLoading(true);
    startSession({
      type: 'solo',
      duration: 10,
      topic: dailyTopic
    });
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/timer');
    }, 500);
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
      setIsLoading(true);
      startSession({
        type: sessionType,
        duration: sessionType === 'duo' ? 15 : 20,
        topic: dailyTopic
      });
      setShowLanguageModal(false);
      
      setTimeout(() => {
        setIsLoading(false);
        router.push('/timer');
      }, 500);
    }
  };

  const handleLanguagesCancel = () => {
    setShowLanguageModal(false);
    setSessionType(null);
  };

  const handleInviteFriend = () => {
    setShowFriendInviteModal(true);
  };

  const getStreakMessage = () => {
    const streak = user?.fikaStreak || 0;
    if (streak === 0) {
      return "Start your first Fika today!";
    } else if (streak === 1) {
      return "🔥 1 day streak! Keep it going!";
    } else if (streak < 7) {
      return `🔥 ${streak} day streak! You're building a great habit!`;
    } else if (streak < 30) {
      return `🔥 ${streak} day streak! Amazing consistency!`;
    } else {
      return `🔥 ${streak} day streak! You're a Fika master!`;
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

  // Ensure we have valid data before rendering
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <CoffeeIcon size={48} color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your Fika...</Text>
        </View>
      </View>
    );
  }

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
          {user.fikaStreak > 0 && (
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
          <Text style={styles.topicTitle}>Today&apos;s Fika Topic</Text>
        </View>
        <Text style={styles.topicText}>
          {dailyTopic || 'Take a moment to reflect on your day'}
        </Text>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title="Invite a Friend"
          variant="outline"
          onPress={handleInviteFriend}
          icon={<UserPlusIcon size={18} color={Colors.primary} style={{ marginRight: 8 }} />}
          style={styles.inviteButton}
        />
      </View>

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
        isPremium={user.isPremium}
        onPress={handleStartGroupFika}
      />

      {/* Premium Upgrade Card */}
      {!user.isPremium && (
        <Card style={styles.premiumCard}>
          <View style={styles.premiumHeader}>
            <AwardIcon size={24} color={Colors.secondary} />
            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          </View>
          <Text style={styles.premiumDescription}>
            Unlock group sessions, custom themes, advanced analytics, and more!
          </Text>
          <Button 
            title="Get Premium" 
            variant="secondary"
            onPress={() => router.push('/profile')}
            style={styles.premiumButton}
          />
        </Card>
      )}

      {/* Quick Stats */}
      <Card style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Fika Journey</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.totalSessions || 0}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.fikaStreak || 0}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{friends.length}</Text>
            <Text style={styles.statLabel}>Fika Friends</Text>
          </View>
        </View>
      </Card>

      {/* Modals */}
      {Platform.OS === 'android' ? (
        <>
          {showLanguageModal && (
            <Modal
              visible={showLanguageModal}
              transparent={true}
              animationType="fade"
              hardwareAccelerated={true}
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
          )}

          {showFriendInviteModal && (
            <Modal
              visible={showFriendInviteModal}
              transparent={true}
              animationType="fade"
              hardwareAccelerated={true}
              onRequestClose={() => setShowFriendInviteModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FriendInviteModal
                    friends={friends}
                    onClose={() => setShowFriendInviteModal(false)}
                  />
                </View>
              </View>
            </Modal>
          )}
        </>
      ) : (
        <>
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
        </>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <Modal
          visible={isLoading}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingModal}>
              <CoffeeIcon size={48} color={Colors.primary} />
              <Text style={styles.loadingModalText}>Starting your Fika...</Text>
            </View>
          </View>
        </Modal>
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
    marginTop: 16,
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
    backgroundColor: Colors.accent + '30',
    marginTop: 16,
    marginBottom: 16,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  premiumButton: {
    alignSelf: 'flex-start',
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
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  loadingModalText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 16,
  },
});