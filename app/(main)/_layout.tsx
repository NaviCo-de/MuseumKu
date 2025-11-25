import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import CustomHeader from '../../components/CustomHeader';

// --- KOMPONEN CUSTOM TAB ICON (DENGAN ANIMASI) ---
const AnimatedTabIcon = ({ focused, title, iconActive, iconInactive }: any) => {
  // Animasi Scale untuk lingkaran
  const scale = useSharedValue(0);

  useEffect(() => {
    // Jika aktif, lingkaran membesar (scale 1). Jika tidak, menghilang (scale 0)
    scale.value = withSpring(focused ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [focused]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.tabContainer}>
      <View style={styles.iconWrapper}>
        {/* Lingkaran Coklat (Background) - Muncul saat Active */}
        <Animated.View style={[styles.activeCircle, animatedCircleStyle]} />
        
        {/* Gambar Icon */}
        <Image
          source={focused ? iconActive : iconInactive}
          style={[
            styles.iconImage, 
            // Jika focused (ada lingkaran coklat), icon jadi putih (tintColor null/white). 
            // Jika tidak focused, icon hitam/abu (tintColor default).
            { tintColor: focused ? 'white' : undefined }
          ]}
          resizeMode="contain"
        />
      </View>
      
      {/* Label Text */}
      <Text style={[
        styles.tabLabel, 
        { color: focused ? Colors.cokelatTua.base : Colors.neutral[80] }
      ]}>
        {title}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <CustomHeader />,
        tabBarShowLabel: false, // Kita matikan label bawaan, ganti dengan custom di atas
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 60 + insets.bottom, // Tinggi disesuaikan
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          elevation: 10, // Shadow Android
          shadowColor: '#000', // Shadow iOS
          shadowOpacity: 0.1,
          shadowRadius: 10,
          paddingHorizontal: 5,
          paddingTop: 15,
        },
      }}
    >
      {/* TAB 1: BERANDA */}
      <Tabs.Screen
        name="(homepage)/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon 
              focused={focused}
              title="Home"
              // Anggap file _chosen (putih) sudah ada di folder images
              iconActive={require('../../assets/images/home_not_chosen.png')} // Ganti jadi home_chosen.png nanti
              iconInactive={require('../../assets/images/home_not_chosen.png')}
            />
          ),
        }}
      />

      {/* TAB 2: JELAJAH */}
      <Tabs.Screen
        name="(jelajah-museum)/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon 
              focused={focused}
              title="Museum"
              iconActive={require('../../assets/images/museum_not_chosen.png')} // Ganti jadi museum_chosen.png nanti
              iconInactive={require('../../assets/images/museum_not_chosen.png')}
            />
          ),
        }}
      />

      {/* TAB 3: ACHIEVEMENT */}
      <Tabs.Screen
        name="(achievement)/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon 
              focused={focused}
              title="Pencapaian"
              iconActive={require('../../assets/images/achievement_not_chosen.png')} // Ganti jadi achievement_chosen.png nanti
              iconInactive={require('../../assets/images/achievement_not_chosen.png')}
            />
          ),
        }}
      />

      {/* TAB 4: ADD FRIEND */}
      <Tabs.Screen
        name="(add-friend)/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon 
              focused={focused}
              title="Teman"
              iconActive={require('../../assets/images/add_friend_not_chosen.png')} // Ganti jadi add_friend_chosen.png nanti
              iconInactive={require('../../assets/images/add_friend_not_chosen.png')}
            />
          ),
        }}
      />

      {/* HIDE PROFILE (Supaya gak muncul jadi tab ke-5) */}
      <Tabs.Screen
        name="(profile)/index"
        options={{ href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 5, // Turunin dikit biar pas tengah
    width: 70, // Area sentuh lebar
  },
  iconWrapper: {
    width: 45, // Ukuran Figma
    height: 45, // Ukuran Figma
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeCircle: {
    position: 'absolute',
    width: 45,
    height: 45,
    borderRadius: 22.5, // Biar bulat sempurna
    backgroundColor: Colors.cokelatTua.base, // Warna Coklat saat aktif
  },
  iconImage: {
    width: 24, // Ukuran icon di dalam lingkaran
    height: 24,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  }
});