import AnimatedSplashScreen from '@/components/AnimatedSplashScreen';
import { AchievementProvider } from '@/hooks/useAchievements';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig.js';
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState(); // <--- INI KUNCINYA
  const [loaded, error] = useFonts({
    "CrimsonText-Regular": require("../assets/fonts/CrimsonText-Regular.ttf"),
    "CrimsonText-Bold": require("../assets/fonts/CrimsonText-Bold.ttf"),
  });

  // 1. Cek Status Firebase
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (userState) => {
      setUser(userState);
      setTimeout(() => {
        if (initializing) setInitializing(false);
      }, 2000)
    });
    return subscriber;
  }, [initializing]);

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
  }, [user, initializing, segments, navigationState?.key, router]);

  if (initializing) {
    return <AnimatedSplashScreen />;
  }

  return (
    <AchievementProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </AchievementProvider>
  );
}
