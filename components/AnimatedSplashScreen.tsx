import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function AnimatedSplashScreen() {
  // Shared Values adalah "variabel reaktif" untuk animasi.
  // Opacity (Transparansi): Mulai dari 0 (hilang)
  const opacity = useSharedValue(0);
  // Scale (Ukuran): Mulai dari 0.5 (kecil)
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // LOGIKA ANIMASI:
    // 1. Opacity berubah jadi 1 (muncul) dalam 1 detik.
    opacity.value = withTiming(1, { duration: 1000 });

    // 2. Scale membesar dengan efek pegas (bouncy) biar terlihat hidup.
    scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 80 }), // Membesar sedikit berlebih
        withTiming(1, { duration: 500 }) // Kembali ke ukuran normal
    );
  }, [opacity, scale]);

  // Style animasi yang digabungkan ke komponen
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
          />
        </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Sesuaikan tema museum (Cokelat)
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: (width * 0.5) / 2, // Lingkaran sempurna
    elevation: 10, // Shadow Android
    shadowColor: '#000', // Shadow iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logo: {
    width: '70%', 
    height: '70%',
  }
});
