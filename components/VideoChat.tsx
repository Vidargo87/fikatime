import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { languages } from '@/constants/languages';
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, UsersIcon, GlobeIcon } from './icons';

interface VideoChatProps {
  sessionType: 'duo' | 'group';
  participants?: number;
  isGroupSession?: boolean;
}

export default function VideoChat({ sessionType, participants = 2, isGroupSession = false }: VideoChatProps) {
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const { user } = useUserStore();
  const [participantLanguages, setParticipantLanguages] = useState<string[]>([]);
  
  // In a real app, this would use Agora or Twilio SDK
  // For this demo, we'll simulate the video chat UI

  useEffect(() => {
    // Simulate fetching participant languages
    // In a real app, this would come from the matched users' profiles
    const simulateParticipantLanguages = () => {
      // Get user's preferred languages
      const userLanguages = user?.preferredConnectionLanguages || [user?.language || 'en'];
      
      // Simulate that we found a match with at least one common language
      const commonLanguage = userLanguages[0];
      
      // Simulate that participants might know additional languages
      const otherLanguages = languages
        .filter(lang => !userLanguages.includes(lang.code))
        .slice(0, 2)
        .map(lang => lang.code);
      
      setParticipantLanguages([commonLanguage, ...otherLanguages]);
    };
    
    simulateParticipantLanguages();
  }, [user]);

  const toggleMic = () => {
    setIsMicEnabled(!isMicEnabled);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webNotice}>
          <UsersIcon size={40} color={Colors.primary} />
          <Text style={styles.webNoticeText}>
            Video chat is available on mobile devices.
          </Text>
          <Text style={styles.webNoticeSubtext}>
            You are connected with {participants} {participants === 1 ? 'person' : 'people'}.
          </Text>
          
          {participantLanguages.length > 0 && (
            <View style={styles.languageInfo}>
              <GlobeIcon size={16} color={Colors.primary} style={styles.languageIcon} />
              <Text style={styles.languageText}>
                Common languages: {participantLanguages.map(getLanguageName).join(', ')}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoGrid}>
        {/* Main participant (current user) */}
        <View style={[styles.videoContainer, styles.mainVideo]}>
          {isVideoEnabled ? (
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoPlaceholderText}>You</Text>
            </View>
          ) : (
            <View style={styles.videoDisabled}>
              <UsersIcon size={40} color={Colors.primary} />
              <Text style={styles.videoDisabledText}>Camera Off</Text>
            </View>
          )}
        </View>
        
        {/* Other participants */}
        {sessionType === 'duo' ? (
          <View style={styles.videoContainer}>
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoPlaceholderText}>
                {isGroupSession ? "Emma" : "Partner"}
              </Text>
            </View>
            {participantLanguages.length > 0 && (
              <View style={styles.participantLanguageBadge}>
                <GlobeIcon size={12} color="#FFFFFF" />
                <Text style={styles.participantLanguageText}>
                  {participantLanguages.map(code => code.toUpperCase()).join(', ')}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <>
            <View style={styles.videoContainer}>
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoPlaceholderText}>
                  {isGroupSession ? "Emma" : "Person 1"}
                </Text>
              </View>
              <View style={styles.participantLanguageBadge}>
                <GlobeIcon size={12} color="#FFFFFF" />
                <Text style={styles.participantLanguageText}>
                  {participantLanguages.slice(0, 2).map(code => code.toUpperCase()).join(', ')}
                </Text>
              </View>
            </View>
            <View style={styles.videoContainer}>
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoPlaceholderText}>
                  {isGroupSession ? "Luca" : "Person 2"}
                </Text>
              </View>
              <View style={styles.participantLanguageBadge}>
                <GlobeIcon size={12} color="#FFFFFF" />
                <Text style={styles.participantLanguageText}>
                  {participantLanguages.slice(0, 1).map(code => code.toUpperCase()).join(', ')}
                </Text>
              </View>
            </View>
            {participants > 3 && (
              <View style={styles.videoContainer}>
                <View style={styles.videoPlaceholder}>
                  <Text style={styles.videoPlaceholderText}>
                    {isGroupSession ? "Sophie" : "Person 3"}
                  </Text>
                </View>
                <View style={styles.participantLanguageBadge}>
                  <GlobeIcon size={12} color="#FFFFFF" />
                  <Text style={styles.participantLanguageText}>
                    {participantLanguages.slice(1, 3).map(code => code.toUpperCase()).join(', ')}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>
      
      <View style={styles.languageInfoContainer}>
        <GlobeIcon size={16} color={Colors.primary} />
        <Text style={styles.languageInfoText}>
          Common languages: {participantLanguages.map(getLanguageName).join(', ')}
        </Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, !isMicEnabled && styles.controlButtonDisabled]} 
          onPress={toggleMic}
        >
          {isMicEnabled ? (
            <MicIcon size={24} color={Colors.text} />
          ) : (
            <MicOffIcon size={24} color={Colors.cardBackground} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, !isVideoEnabled && styles.controlButtonDisabled]} 
          onPress={toggleVideo}
        >
          {isVideoEnabled ? (
            <VideoIcon size={24} color={Colors.text} />
          ) : (
            <VideoOffIcon size={24} color={Colors.cardBackground} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  videoGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  videoContainer: {
    width: '48%',
    aspectRatio: 3/4,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: Colors.text + '10', // 10% opacity
    position: 'relative',
  },
  mainVideo: {
    width: '100%',
    aspectRatio: 16/9,
    marginBottom: 8,
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20', // 20% opacity
  },
  videoPlaceholderText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  videoDisabled: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.text + '10', // 10% opacity
  },
  videoDisabledText: {
    color: Colors.text,
    fontSize: 14,
    marginTop: 8,
  },
  participantLanguageBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantLanguageText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  languageInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  languageInfoText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlButtonDisabled: {
    backgroundColor: Colors.error,
  },
  webNotice: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webNoticeText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  webNoticeSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 8,
  },
  languageIcon: {
    marginRight: 8,
  },
  languageText: {
    fontSize: 14,
    color: Colors.text,
  },
});