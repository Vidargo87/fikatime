import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { router, Link } from 'expo-router';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import Button from '@/components/Button';
import { defaultLanguage } from '@/constants/languages';
import { CoffeeIcon, UserIcon, MailIcon, LockIcon, UserPlusIcon } from '@/components/icons';

export default function RegisterScreen() {
  const { setUser } = useUserStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate Firebase authentication
      // In a real app, this would use Firebase Auth
      setTimeout(() => {
        // Create a new user
        setUser({
          id: 'user-' + Date.now(),
          name: name,
          email: email,
          avatar: undefined,
          fikaStreak: 0,
          preferredFikaTime: '10:00',
          isPremium: false,
          totalSessions: 0,
          joinedDate: new Date().toISOString(),
          language: defaultLanguage,
          preferredConnectionLanguages: [defaultLanguage]
        });
        
        router.replace('/onboarding');
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', 'Please try again later');
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoContainer}>
        <CoffeeIcon size={48} color={Colors.primary} />
        <Text style={styles.logoText}>FikaTime</Text>
      </View>
      
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Join FikaTime and start your mindfulness journey
      </Text>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <UserIcon size={20} color={Colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            placeholderTextColor={Colors.textLight}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <MailIcon size={20} color={Colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={Colors.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <LockIcon size={20} color={Colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={Colors.textLight}
            secureTextEntry
          />
        </View>
        
        <View style={styles.inputContainer}>
          <LockIcon size={20} color={Colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor={Colors.textLight}
            secureTextEntry
          />
        </View>
        
        <Button
          title="Create Account"
          onPress={handleRegister}
          loading={loading}
          icon={<UserPlusIcon size={18} color="#FFFFFF" style={{ marginRight: 8 }} />}
          style={styles.registerButton}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.text,
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: Colors.textLight,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});