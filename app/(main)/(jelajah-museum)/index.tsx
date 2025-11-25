import { Image } from 'expo-image';
import { Platform, StyleSheet, Alert, Button } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export default function JelajahMuseum() {

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert("Gagal Logout", error.message)
    }
  }
  return (
    <Button title="KELUAR (LOGOUT)" onPress={handleLogout} color="red" />
  );
}
