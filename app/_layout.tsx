import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Pastikan path ini benar
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const segments = useSegments();

  // 1. CCTV: Pantau status login Firebase
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (userState) => {
      setUser(userState);
      if (initializing) setInitializing(false);
    });
    return subscriber; // Cabut CCTV saat component mati
  }, []);

  // 2. SATPAM: Usir user ke halaman yang benar
  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (user && inAuthGroup) {
      // Kalau User ADA tapi lagi di halaman Login --> Pindahkan ke Home
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      // Kalau User KOSONG tapi lagi maksa masuk Home --> Tendang ke Login
      router.replace('/(auth)/login');
    }
  }, [user, initializing]);

  // Tampilkan loading muter-muter saat aplikasi baru dibuka (cek login)
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 3. DAFTAR PINTU (Stack)
  return (
    <Stack>
      {/* PINTU 1: Halaman Login/Register */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      
      {/* PINTU 2: Halaman Utama (Home, Profile) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* PINTU 3: Modal */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}