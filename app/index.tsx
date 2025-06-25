import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useTopicStore } from '@/store/topicStore';
import Colors from '@/constants/colors';

export default function IndexScreen() {
  const { isLoggedIn, user } = useUserStore();
  const { refreshTopic } = useTopicStore();

  useEffect(() => {
    // Check if we need to refresh the topic
    refreshTopic();
    
    // Short delay to allow store to hydrate
    const timer = setTimeout(() => {
      if (isLoggedIn && user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, user]);

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
});