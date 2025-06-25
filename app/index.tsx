import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { useTopic } from '@/contexts/TopicContext';
import Colors from '@/constants/colors';
import { CoffeeIcon } from '@/components/icons';

export default function IndexScreen() {
  const { isLoggedIn, user, isLoading: userLoading } = useUser();
  const { dailyTopic, refreshTopic, isLoading: topicLoading } = useTopic();
  const [isLoading, setIsLoading] = useState(true);
  const [navigationAttempted, setNavigationAttempted] = useState(false);

  useEffect(() => {
    // Initialize the app
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Make sure we have a topic
        if (!dailyTopic) {
          console.log('Refreshing topic...');
          refreshTopic();
        }
        
        // Wait for contexts to be ready
        let attempts = 0;
        const maxAttempts = 20; // 2 seconds max
        
        while ((userLoading || topicLoading) && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        console.log('Contexts ready, navigating...');
        
        // Navigate based on login state
        if (isLoggedIn && user) {
          console.log('User is logged in, navigating to tabs');
          setNavigationAttempted(true);
          router.replace('/(tabs)');
        } else {
          console.log('User not logged in, navigating to login');
          setNavigationAttempted(true);
          router.replace('/login');
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

    // Start initialization after a short delay to ensure contexts are mounted
    const timer = setTimeout(() => {
      initializeApp();
    }, 300);

    return () => clearTimeout(timer);
  }, [isLoggedIn, user, dailyTopic, userLoading, topicLoading]);

  // Safety mechanism: if we're still on this screen after 4 seconds, force navigation
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (!navigationAttempted) {
        console.log('Safety timer triggered - forcing navigation');
        setNavigationAttempted(true);
        if (isLoggedIn && user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      }
    }, 4000);

    return () => clearTimeout(safetyTimer);
  }, [navigationAttempted, isLoggedIn, user]);

  return (
    <View style={styles.container}>
      <CoffeeIcon size={64} color={Colors.primary} />
      <Text style={styles.appName}>FikaTime</Text>
      <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      <Text style={styles.loadingText}>
        {userLoading || topicLoading ? 'Loading your Fika...' : 'Starting FikaTime...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 32,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
});