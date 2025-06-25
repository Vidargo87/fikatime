import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useSessionStore } from '@/store/sessionStore';
import { useTopicStore } from '@/store/topicStore';
import MoodSelector from '@/components/MoodSelector';
import Button from '@/components/Button';

export default function ReflectionScreen() {
  const { currentSession, endCurrentSession } = useSessionStore();
  const { refreshTopic } = useTopicStore();
  const [reflection, setReflection] = useState('');
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  
  const handleSaveReflection = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    endCurrentSession(reflection, mood);
    
    // Get a new topic for next time
    refreshTopic();
    
    router.replace('/');
  };
  
  const handleSkip = () => {
    endCurrentSession();
    
    // Get a new topic for next time
    refreshTopic();
    
    router.replace('/');
  };

  if (!currentSession) {
    router.replace('/');
    return null;
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Fika Complete!</Text>
      <Text style={styles.subtitle}>
        Great job taking time for yourself. How was your {currentSession.duration}-minute break?
      </Text>
      
      <MoodSelector selectedMood={mood} onSelect={setMood} />
      
      <Text style={styles.inputLabel}>Reflection (optional)</Text>
      <TextInput
        style={styles.input}
        value={reflection}
        onChangeText={setReflection}
        placeholder="What did you think about during your Fika?"
        placeholderTextColor={Colors.textLight}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      
      <View style={styles.topicContainer}>
        <Text style={styles.topicLabel}>Today's Topic</Text>
        <Text style={styles.topicText}>{currentSession.topic}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Save Reflection"
          onPress={handleSaveReflection}
          style={styles.saveButton}
        />
        <Button
          title="Skip"
          variant="outline"
          onPress={handleSkip}
          style={styles.skipButton}
        />
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
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
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
    minHeight: 120,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topicContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  topicLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  topicText: {
    fontSize: 16,
    color: Colors.text,
  },
  buttonContainer: {
    gap: 12,
  },
  saveButton: {
    marginBottom: 8,
  },
  skipButton: {},
});