import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useTopicStore } from '@/store/topicStore';
import Colors from '@/constants/colors';

export default function IndexScreen() {
  const { isLoggedIn, user } = useUserStore();
  const { refreshTopic } = useTopicStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the app
    const initializeApp = async () => {
      try {
        // Check if we need to refresh the topic
        refreshTopic();
        
        // Short delay to allow stores to hydrate
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (isLoggedIn && user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [isLoggedIn, user, refreshTopic]);

  if (isLoading) {
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