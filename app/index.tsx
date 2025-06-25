import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { useTopic } from '@/contexts/TopicContext';
import Colors from '@/constants/colors';

export default function IndexScreen() {
  const { isLoggedIn, user, isLoading: userLoading } = useUser();
  const { dailyTopic, refreshTopic, isLoading: topicLoading } = useTopic();
  const [isLoading, setIsLoading] = useState(true);
  const [navigationAttempted, setNavigationAttempted] = useState(false);

  useEffect(() => {
    // Initialize the app
    const initializeApp = async () => {
      try {
        // Make sure we have a topic
        if (!dailyTopic) {
          refreshTopic();
        }
        
        // Short delay to allow contexts to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Navigate based on login state
        if (!userLoading && !topicLoading) {
          if (isLoggedIn && user) {
            console.log('Navigating to tabs, user is logged in');
            setNavigationAttempted(true);
            
            // On Android, use a different approach to ensure navigation works
            if (Platform.OS === 'android') {
              setTimeout(() => {
                router.replace('/(tabs)');
              }, 300);
            } else {
              router.replace('/(tabs)');
            }
          } else {
            console.log('Navigating to login, user is not logged in');
            setNavigationAttempted(true);
            router.replace('/login');
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // Ensure we navigate away from splash screen even if there's an error
        setNavigationAttempted(true);
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay before initialization to ensure contexts are ready
    const timer = setTimeout(() => {
      initializeApp();
    }, Platform.OS === 'android' ? 800 : 500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, user, dailyTopic, userLoading, topicLoading]);

  // Safety mechanism: if we're still on this screen after 3 seconds, force navigation
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (!navigationAttempted) {
        console.log('Safety timer triggered - forcing navigation');
        if (isLoggedIn && user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      }
    }, 3000);

    return () => clearTimeout(safetyTimer);
  }, [navigationAttempted, isLoggedIn, user]);

  if (isLoading || userLoading || topicLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading FikaTime...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
  },
});