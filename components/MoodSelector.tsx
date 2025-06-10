import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';

interface MoodSelectorProps {
  selectedMood?: 1 | 2 | 3 | 4 | 5;
  onSelect: (mood: 1 | 2 | 3 | 4 | 5) => void;
}

export default function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  const moods = [
    { value: 1, emoji: '😔', label: 'Not great' },
    { value: 2, emoji: '😐', label: 'Okay' },
    { value: 3, emoji: '🙂', label: 'Good' },
    { value: 4, emoji: '😊', label: 'Great' },
    { value: 5, emoji: '😁', label: 'Amazing' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How do you feel after your Fika?</Text>
      <View style={styles.moodContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.moodButton,
              selectedMood === mood.value && styles.selectedMood,
            ]}
            onPress={() => onSelect(mood.value as 1 | 2 | 3 | 4 | 5)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={[
              styles.label,
              selectedMood === mood.value && styles.selectedLabel,
            ]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 64,
  },
  selectedMood: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10', // 10% opacity
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  selectedLabel: {
    color: Colors.primary,
    fontWeight: '500',
  },
});