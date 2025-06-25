import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { Pause, Play, X, Volume2, VolumeX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useSessionStore } from '@/store/sessionStore';
import { useUserStore } from '@/store/userStore';
import ProgressCircle from '@/components/ProgressCircle';
import Button from '@/components/Button';
import VideoChat from '@/components/VideoChat';

export default function TimerScreen() {
  const { currentSession, clearCurrentSession } = useSessionStore();
  const { updateStreak } = useUserStore();
  const [timeRemaining, setTimeRemaining] = useState(
    currentSession ? currentSession.duration * 60 : 600
  ); // in seconds
  const [isActive, setIsActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(1);
  const totalTime = useRef(currentSession ? currentSession.duration * 60 : 600);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          const newTime = time - 1;
          setProgress(newTime / totalTime.current);
          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      // Session completed
      updateStreak();
      router.replace('/reflection');
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleTimer = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setIsActive(!isActive);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleCancel = () => {
    router.push({
      pathname: '/',
      params: { canceled: 'true' }
    });
    clearCurrentSession();
  };

  const isGroupSession = currentSession?.type === 'duo' || currentSession?.type === 'group';
  const sessionType = currentSession?.type as 'duo' | 'group';
  const participantCount = currentSession?.type === 'duo' ? 2 : 
                          currentSession?.type === 'group' ? 4 : 1;

  return (
    <LinearGradient
      colors={[Colors.primary + '40', Colors.background]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
          {isMuted ? (
            <VolumeX size={24} color={Colors.text} />
          ) : (
            <Volume2 size={24} color={Colors.text} />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>
          {currentSession?.type ? 
            `${currentSession.type.charAt(0).toUpperCase() + currentSession.type.slice(1)} Fika` : 
            'Fika Time'}
        </Text>
        
        {isGroupSession ? (
          <VideoChat 
            sessionType={sessionType} 
            participants={participantCount}
            isGroupSession={currentSession?.participants ? currentSession.participants.length > 0 : false}
          />
        ) : (
          <View style={styles.timerContainer}>
            <ProgressCircle
              progress={progress}
              size={240}
              strokeWidth={12}
              text={formatTime(timeRemaining)}
              textSize={40}
            />
            
            <TouchableOpacity 
              style={styles.playPauseButton}
              onPress={toggleTimer}
            >
              {isActive ? (
                <Pause size={32} color={Colors.primary} />
              ) : (
                <Play size={32} color={Colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.topicContainer}>
          <Text style={styles.topicLabel}>Today's Topic</Text>
          <Text style={styles.topicText}>{currentSession?.topic || 'Take a moment to reflect'}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          title="End Session Early"
          variant="outline"
          onPress={handleCancel}
          size="small"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 40,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  playPauseButton: {
    position: 'absolute',
    bottom: -20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topicContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  topicLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 12,
  },
  topicText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
});