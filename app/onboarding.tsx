import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import Button from '@/components/Button';
import { CoffeeIcon } from '@/components/icons';

export default function OnboardingScreen() {
  const { user, updateProfile } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [step, setStep] = useState(1);
  const [preferredTime, setPreferredTime] = useState(user?.preferredFikaTime || '');
  
  const handleContinue = () => {
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2) {
      // Update user profile
      updateProfile({
        name: name.trim(),
        preferredFikaTime: preferredTime,
      });
      
      router.replace('/');
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
      
      {step === 1 ? (
        <>
          <Text style={styles.title}>Welcome to FikaTime</Text>
          <Text style={styles.subtitle}>
            Take mindful breaks to reduce stress and boost productivity.
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>What should we call you?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={Colors.textLight}
              autoFocus={Platform.OS !== 'web'}
            />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>When do you prefer your Fika?</Text>
          <Text style={styles.subtitle}>
            We can remind you to take a break at your preferred time.
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Preferred time (optional)</Text>
            <TextInput
              style={styles.input}
              value={preferredTime}
              onChangeText={setPreferredTime}
              placeholder="e.g. 10:30"
              placeholderTextColor={Colors.textLight}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>What is Fika?</Text>
        <Text style={styles.infoText}>
          Fika is a Swedish concept meaning "coffee break," but it's much more than that. 
          It's a moment to slow down, to appreciate the good things in life, and to connect 
          with yourself or others over a cup of coffee or tea.
        </Text>
      </View>
      
      <Button
        title={step === 1 ? "Continue" : "Get Started"}
        onPress={handleContinue}
        disabled={step === 1 && !name.trim()}
        style={styles.button}
      />
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
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
  },
  infoContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    width: '100%',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 22,
  },
  button: {
    width: '100%',
  },
});