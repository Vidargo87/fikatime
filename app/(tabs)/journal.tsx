import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { useSessionStore } from '@/store/sessionStore';
import { useUserStore } from '@/store/userStore';
import SessionHistoryItem from '@/components/SessionHistoryItem';
import Card from '@/components/Card';
import { CalendarIcon, FilterIcon } from '@/components/icons';

export default function JournalScreen() {
  const { sessions } = useSessionStore();
  const { user } = useUserStore();
  const [filter, setFilter] = useState<'all' | 'solo' | 'duo' | 'group'>('all');

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.type === filter;
  });

  const renderEmptyState = () => (
    <Card style={styles.emptyStateCard}>
      <CalendarIcon size={48} color={Colors.textLight} style={styles.emptyStateIcon} />
      <Text style={styles.emptyStateTitle}>No Fika sessions yet</Text>
      <Text style={styles.emptyStateText}>
        Your Fika reflections will appear here after you complete your first session.
      </Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Fika Journal</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{sessions.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.fikaStreak || 0}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {sessions.reduce((total, session) => total + session.duration, 0)}
            </Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'solo' && styles.activeFilter]}
          onPress={() => setFilter('solo')}
        >
          <Text style={[styles.filterText, filter === 'solo' && styles.activeFilterText]}>
            Solo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'duo' && styles.activeFilter]}
          onPress={() => setFilter('duo')}
        >
          <Text style={[styles.filterText, filter === 'duo' && styles.activeFilterText]}>
            Duo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'group' && styles.activeFilter]}
          onPress={() => setFilter('group')}
        >
          <Text style={[styles.filterText, filter === 'group' && styles.activeFilterText]}>
            Group
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SessionHistoryItem session={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.cardBackground,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyStateCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});