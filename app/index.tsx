import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';
import { CoffeeIcon } from '@/components/icons';

export default function IndexScreen() {
  const { isLoggedIn, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <CoffeeIcon size={64} color={Colors.primary} />
      <Text style={styles.appName}>FikaTime</Text>
      <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      <Text style={styles.loadingText}>Loading your Fika...</Text>
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