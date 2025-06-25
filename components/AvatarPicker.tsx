import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload, User } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface AvatarPickerProps {
  currentAvatar?: string;
  onAvatarSelected: (uri: string) => void;
  size?: number;
}

export default function AvatarPicker({ 
  currentAvatar, 
  onAvatarSelected, 
  size = 80 
}: AvatarPickerProps) {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      setLoading(true);
      
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to select an avatar.');
        setLoading(false);
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        onAvatarSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Camera is not available on web.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your camera to take a photo.');
        setLoading(false);
        return;
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        onAvatarSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showImageOptions = () => {
    if (Platform.OS === 'web') {
      pickImage();
      return;
    }
    
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]} 
      onPress={showImageOptions}
      disabled={loading}
    >
      {currentAvatar ? (
        <Image 
          source={{ uri: currentAvatar }} 
          style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} 
        />
      ) : (
        <User size={size * 0.5} color={Colors.primary} />
      )}
      
      <View style={styles.uploadIcon}>
        <Upload size={size * 0.25} color={Colors.cardBackground} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  uploadIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 4,
  },
});