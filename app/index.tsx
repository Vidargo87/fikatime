import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { useTopic } from '@/contexts/TopicContext';
import Colors from '@/constants/colors';
import { CoffeeIcon } from '@/components/icons';

export default function IndexScreen() {
  const { isLoggedIn, user, isLoading: userLoading } = useUser();
  const { dailyTopic, isLoading: topicLoading } = useTopic();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Wait for contexts to be ready
    if (userLoading || topicLoading) {
      return;
    }

    // Prevent multiple navigation attempts
    if (hasNavigated) {
      return;
    }

    console.log('Navigation logic - isLoggedIn:', isLoggedIn, 'user:', !!user);

    // Navigate based on login state
    const navigate = () => {
      setHasNavigated(true);
      
      if (isLoggedIn && user) {
        console.log('Navigating to tabs');
        router.replace('/(tabs)');
      } else {
        console.log('Navigating to login');
        router.replace('/login');
      }
    };

    // Small delay to ensure smooth transition
    const timer = setTimeout(navigate, 500);
    
    return () => clearTimeout(timer);
  }, [isLoggedIn, user, userLoading, topicLoading, hasNavigated]);

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