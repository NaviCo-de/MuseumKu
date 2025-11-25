import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.cokelatTua.base,
        tabBarInactiveTintColor: Colors.neutral[80],
        headerShown: false,
        tabBarStyle: {
          height: 70, // Agak tinggi biar enak dipencet
          paddingBottom: 10,
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
        name="(jelajah-museum)/index"
        options={{
          title: 'Museum',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/museum_not_chosen.png')}
              style={{ width: 24, height: 24, tintColor: color }}
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