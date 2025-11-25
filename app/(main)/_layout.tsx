import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import { Colors } from '../../constants/Colors';
import CustomHeader from '../../components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.cokelatMuda.base,
        tabBarInactiveTintColor: '#000000',
        headerShown: true,
        header: () => <CustomHeader />,
        tabBarStyle: {
          height: 60 + insets.bottom, // Agak tinggi biar enak dipencet
          paddingBottom: insets.bottom + 5,
          paddingTop: 10,
          backgroundColor: Colors.neutral[10],
        },
      }}
    >
      {/* TAB 1: BERANDA */}
      <Tabs.Screen
        // Cukup panggil nama foldernya saja!
        name="(homepage)/index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/home_not_chosen.png')}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />

      {/* TAB 2: JELAJAH */}
      <Tabs.Screen
        name="(jelajah-museum)"
        options={{
          title: 'Museum',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/museum_not_chosen.png')}
              style={{ width: 45, height: 45, tintColor: color }}
            />
          ),
        }}
      />

      {/* TAB 3: ACHIEVEMENT */}
      <Tabs.Screen
        name="(achievement)/index"
        options={{
          title: 'Achievement',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/achievement_not_chosen.png')}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />

      {/* TAB 4: ADD FRIEND */}
      <Tabs.Screen
        name="(add-friend)/index"
        options={{
          title: 'Add friend',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/add_friend_not_chosen.png')}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}