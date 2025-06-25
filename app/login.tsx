import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Platform
} from 'react-native';
import { router, Link } from 'expo-router';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import Button from '@/components/Button';
import { defaultLanguage } from '@/constants/languages';
import { CoffeeIcon, MailIcon, LockIcon, LogInIcon } from '@/components/icons';

export default function LoginScreen() {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate Firebase authentication
      // In a real app, this would use Firebase Auth
      setTimeout(() => {
        // Create a mock user for demo purposes
        setUser({
          id: 'user-' + Date.now(),
          name: email.split('@')[0],
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
        
        router.replace('/');
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Please check your credentials and try again');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // In a real app, this would use Firebase Auth with Google provider
    Alert.alert('Google Sign In', 'This would connect to Google Authentication in a production app');
  };

  const handleAppleSignIn = () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Not Available', 'Apple Sign In is only available on iOS devices');
      return;
    }
    
    // In a real app, this would use Firebase Auth with Apple provider
    Alert.alert('Apple Sign In', 'This would connect to Apple Authentication in a production app');
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
      
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Sign in to continue your mindful breaks
      </Text>
      
      <View style={styles.form}>
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
        
        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          icon={<LogInIcon size={18} color="#FFFFFF" style={{ marginRight: 8 }} />}
          style={styles.loginButton}
        />
      </View>
      
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>
      
      <View style={styles.socialButtons}>
        <TouchableOpacity 
          style={styles.socialButton} 
          onPress={handleGoogleSignIn}
        >
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
        
        {Platform.OS === 'ios' && (
          <TouchableOpacity 
            style={styles.socialButton} 
            onPress={handleAppleSignIn}
          >
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/register" asChild>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Sign Up</Text>
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
  loginButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textLight,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 32,
  },
  socialButton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  socialButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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