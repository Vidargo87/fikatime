import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, Alert, Platform, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { useSession } from '@/contexts/SessionContext';
import Button from '@/components/Button';
import Card from '@/components/Card';
import AvatarPicker from '@/components/AvatarPicker';
import { languages } from '@/constants/languages';
import { UserIcon, SettingsIcon, LogOutIcon, AwardIcon, CoffeeIcon, GlobeIcon, UsersIcon } from '@/components/icons';

export default function ProfileScreen() {
  const { user, updateProfile, updateAvatar, updateLanguage, updatePreferredConnectionLanguages, logout } = useUser();
  const { sessions } = useSession();
  
  const [name, setName] = useState(user?.name || '');
  const [preferredTime, setPreferredTime] = useState(user?.preferredFikaTime || '');
  const [notifications, setNotifications] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showConnectionLanguages, setShowConnectionLanguages] = useState(false);
  const [showFikaTime, setShowFikaTime] = useState(user?.allowFikaTimeVisible ?? true);
  
  const handleSaveProfile = () => {
    updateProfile({
      name,
      preferredFikaTime: preferredTime,
      allowFikaTimeVisible: showFikaTime
    });
    Alert.alert('Success', 'Your profile has been updated');
  };

  const handleAvatarSelected = (uri: string) => {
    // In a real app, this would upload to Firebase Storage
    // and then update the user profile with the download URL
    updateAvatar(uri);
  };

  const handleLanguageChange = (languageCode: string) => {
    updateLanguage(languageCode);
    setShowLanguageSelector(false);
    Alert.alert('Language Updated', 'App language has been changed');
  };

  const handleToggleConnectionLanguage = (languageCode: string) => {
    const currentLanguages = user?.preferredConnectionLanguages || [];
    let newLanguages;
    
    if (currentLanguages.includes(languageCode)) {
      // Don't allow removing the last language
      if (currentLanguages.length === 1) {
        Alert.alert('Cannot Remove', 'You must have at least one preferred connection language');
        return;
      }
      newLanguages = currentLanguages.filter(code => code !== languageCode);
    } else {
      newLanguages = [...currentLanguages, languageCode];
    }
    
    updatePreferredConnectionLanguages(newLanguages);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => logout(), style: 'destructive' }
      ]
    );
  };

  const handleUpgradeToPremium = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Premium Upgrade', 'Please use our mobile app to upgrade to premium.');
      return;
    }
    
    // In a real app, this would integrate with RevenueCat or another payment provider
    Alert.alert(
      'Premium Upgrade',
      'Upgrade to FikaTime Premium for $4.99/month to unlock all features!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Upgrade', 
          onPress: () => {
            // Simulate successful purchase
            updateProfile({ isPremium: true });
            Alert.alert('Success', 'You are now a premium user!');
          }
        }
      ]
    );
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === user?.language);
    return lang ? lang.name : 'English';
  };

  const isConnectionLanguageSelected = (code: string) => {
    return user?.preferredConnectionLanguages?.includes(code) || false;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AvatarPicker
          currentAvatar={user?.avatar}
          onAvatarSelected={handleAvatarSelected}
          size={80}
        />
        <Text style={styles.name}>{user?.name || 'FikaTime User'}</Text>
        <Text style={styles.stats}>
          {sessions.length} sessions • {user?.fikaStreak || 0} day streak
        </Text>
      </View>

      {!user?.isPremium && (
        <Card style={styles.premiumCard}>
          <View style={styles.premiumHeader}>
            <AwardIcon size={24} color={Colors.secondary} />
            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          </View>
          <Text style={styles.premiumDescription}>
            Unlock group sessions, custom themes, and full journal history.
          </Text>
          <Button
            title="Upgrade Now"
            variant="secondary"
            onPress={handleUpgradeToPremium}
            style={styles.upgradeButton}
          />
        </Card>
      )}

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Settings</Text>
        
        <Text style={styles.inputLabel}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={Colors.textLight}
        />
        
        <Text style={styles.inputLabel}>Preferred Fika Time</Text>
        <TextInput
          style={styles.input}
          value={preferredTime}
          onChangeText={setPreferredTime}
          placeholder="e.g. 10:30"
          placeholderTextColor={Colors.textLight}
        />
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Share Fika Time with Friends</Text>
          <Switch
            value={showFikaTime}
            onValueChange={setShowFikaTime}
            trackColor={{ false: Colors.inactive, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <Button
          title="Save Profile"
          onPress={handleSaveProfile}
          style={styles.saveButton}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Daily Reminders</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: Colors.inactive, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>App Language</Text>
          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => {
              setShowLanguageSelector(!showLanguageSelector);
              setShowConnectionLanguages(false);
            }}
          >
            <Text style={styles.languageText}>{getCurrentLanguageName()}</Text>
            <GlobeIcon size={16} color={Colors.primary} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {showLanguageSelector && (
          <View style={styles.languageOptions}>
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  user?.language === lang.code && styles.selectedLanguage
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={[
                  styles.languageOptionText,
                  user?.language === lang.code && styles.selectedLanguageText
                ]}>
                  {lang.name} ({lang.nativeName})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Connection Languages</Text>
          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => {
              setShowConnectionLanguages(!showConnectionLanguages);
              setShowLanguageSelector(false);
            }}
          >
            <Text style={styles.languageText}>
              {user?.preferredConnectionLanguages?.length || 1} selected
            </Text>
            <GlobeIcon size={16} color={Colors.primary} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {showConnectionLanguages && (
          <View style={styles.connectionLanguagesContainer}>
            <Text style={styles.connectionLanguagesInfo}>
              Select languages you're comfortable speaking during Fika sessions:
            </Text>
            <View style={styles.languageOptions}>
              {languages.map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    isConnectionLanguageSelected(lang.code) && styles.selectedLanguage
                  ]}
                  onPress={() => handleToggleConnectionLanguage(lang.code)}
                >
                  <View style={styles.languageCheckbox}>
                    {isConnectionLanguageSelected(lang.code) && (
                      <View style={styles.languageCheckboxInner} />
                    )}
                  </View>
                  <Text style={[
                    styles.languageOptionText,
                    isConnectionLanguageSelected(lang.code) && styles.selectedLanguageText
                  ]}>
                    {lang.name} ({lang.nativeName})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {user?.isPremium && (
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Premium Status</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>Active</Text>
            </View>
          </View>
        )}
      </Card>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <CoffeeIcon size={24} color={Colors.primary} />
          <Text style={styles.statValue}>{sessions.length}</Text>
          <Text style={styles.statLabel}>Total Fikas</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {sessions.reduce((total, session) => total + session.duration, 0)}
          </Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        
        <View style={styles.statItem}>
          <UsersIcon size={24} color={Colors.primary} />
          <Text style={styles.statValue}>
            {/* In a real app, this would be the actual friend count */}
            2
          </Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
      </View>

      <Button
        title="Logout"
        variant="outline"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon={<LogOutIcon size={18} color={Colors.primary} style={{ marginRight: 8 }} />}
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
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    marginTop: 12,
  },
  stats: {
    fontSize: 14,
    color: Colors.textLight,
  },
  premiumCard: {
    backgroundColor: Colors.accent + '30', // 30% opacity
    marginBottom: 16,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  upgradeButton: {
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveButton: {
    marginTop: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  languageOptions: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: Colors.primary + '10', // 10% opacity
  },
  languageOptionText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedLanguageText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  connectionLanguagesContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  connectionLanguagesInfo: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  languageCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageCheckboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  premiumBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  logoutButton: {
    marginTop: 8,
  },
});