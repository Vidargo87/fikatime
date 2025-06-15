import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '@/constants/colors';
import { languages } from '@/constants/languages';
import Button from './Button';
import Card from './Card';
import { GlobeIcon, CheckIcon } from './icons';

interface LanguageFilterProps {
  selectedLanguages: string[];
  onLanguagesSelected: (languages: string[]) => void;
  onContinue: () => void;
  onCancel: () => void;
}

export default function LanguageFilter({
  selectedLanguages,
  onLanguagesSelected,
  onContinue,
  onCancel
}: LanguageFilterProps) {
  const [localSelectedLanguages, setLocalSelectedLanguages] = useState<string[]>(selectedLanguages);

  const toggleLanguage = (code: string) => {
    setLocalSelectedLanguages(prev => {
      if (prev.includes(code)) {
        // Don't allow removing the last language
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter(c => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const handleContinue = () => {
    onLanguagesSelected(localSelectedLanguages);
    onContinue();
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <GlobeIcon size={24} color={Colors.primary} />
        <Text style={styles.title}>Language Preferences</Text>
      </View>
      
      <Text style={styles.description}>
        Select languages you'd like to use during your Fika session:
      </Text>
      
      <ScrollView style={styles.languageList}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageOption,
              localSelectedLanguages.includes(lang.code) && styles.selectedLanguage
            ]}
            onPress={() => toggleLanguage(lang.code)}
          >
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{lang.name}</Text>
              <Text style={styles.languageNative}>({lang.nativeName})</Text>
            </View>
            
            {localSelectedLanguages.includes(lang.code) && (
              <CheckIcon size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Text style={styles.hint}>
        You'll be matched with users who share at least one of your selected languages.
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          style={styles.continueButton}
        />
        <Button
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          style={styles.cancelButton}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  languageList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedLanguage: {
    backgroundColor: Colors.primary + '10', // 10% opacity
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageName: {
    fontSize: 16,
    color: Colors.text,
    marginRight: 8,
  },
  languageNative: {
    fontSize: 14,
    color: Colors.textLight,
  },
  hint: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  continueButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
});