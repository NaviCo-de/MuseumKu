import { Stack } from 'expo-router';

export default function JelajahMuseumLayout() {
  return (
    // Ini membungkus semua halaman museum jadi satu paket (Stack)
    // headerShown: false agar header bawaan stack tidak dobel dengan header custom kita
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]/index" />
      <Stack.Screen name="[id]/payment" />
      <Stack.Screen name="[id]/journey" />
    </Stack>
  );
}