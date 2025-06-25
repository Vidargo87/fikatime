import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';
import { useSession } from '@/contexts/SessionContext';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { CoffeeIcon, UserIcon } from '@/components/icons';

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useUser();
  const { sessions } = useSession();
  
  const [name, setName] = useState(user?.name || '');
  const [preferredTime, setPreferredTime] = useState(user?.preferredFikaTime || '');

  const handleSaveProfile = () => {
    updateProfile({
      name,
      preferredFikaTime: preferredTime,
    });
    Alert.alert('Success', 'Your profile has been updated');
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <UserIcon size={40} color={Colors.primary} />
        </View>
        <Text style={styles.name}>{user?.name || 'FikaTime User'}</Text>
        <Text style={styles.stats}>
          {sessions.length} sessions • {user?.fikaStreak || 0} day streak
        </Text>
      </View>

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
        
        <Button
          title="Save Profile"
          onPress={handleSaveProfile}
          style={styles.saveButton}
        />
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
          <Text style={styles.statValue}>{user?.fikaStreak || 0}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      <Button
        title="Logout"
        variant="outline"
        onPress={handleLogout}
        style={styles.logoutButton}
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
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  stats: {
    fontSize: 14,
    color: Colors.textLight,
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