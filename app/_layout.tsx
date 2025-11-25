import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState(); // <--- INI KUNCINYA

  // 1. Cek Status Firebase
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (userState) => {
      setUser(userState);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  // 2. Logic Redirect yang Aman
  useEffect(() => {
    if (initializing || !navigationState?.key) return; // Tunggu sampai navigasi siap

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      // User ada, tapi masih di halaman login -> Tendang ke Home
      router.replace('/(main)/(homepage)');
    } else if (!user && segments[0] !== '(auth)') {
      // User gak ada, tapi coba masuk main -> Tendang ke Login
      router.replace('/(auth)/login');
    }
  }, [user, initializing, segments, navigationState?.key]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#895737" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}