import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MUSEUMS } from '@/constants/data';

export default function CompletionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const museum = MUSEUMS.find(m => m.id === id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5D4037" />
    

      <View style={styles.content}>
        <Text style={styles.title}>Selamat!</Text>
        <Text style={styles.subtitle}>
          Anda telah menyelesaikan kunjungan di{"\n"}{museum?.name || 'Museum'}!
        </Text>

        <View style={styles.pointContainer}>
            <Text style={styles.pointLabel}>Poin diperoleh:</Text>
            <View style={styles.pointRow}>
                <Text style={styles.pointValue}>24</Text>
                {/* Icon Bintang Coklat */}
                <Ionicons name="star" size={48} color="#6D4C41" style={styles.starIcon} />
            </View>
        </View>

        <View style={styles.spacer} />

        <Text style={styles.quizDesc}>
            Jawab kuis mengenai <Text style={{fontWeight:'bold'}}>Museum Sejarah Jakarta</Text> untuk mendapatkan poin tambahan dan membuka lencana!
        </Text>

        <TouchableOpacity 
            style={styles.quizButton}
            // Lanjut ke halaman Kuis AI
            onPress={() => router.push(`/(main)/(jelajah-museum)/${id}/quiz`)}
        >
            <Text style={styles.quizButtonText}>Kerjakan Kuis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#8D6E63', paddingBottom: 15 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#FFF' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', fontFamily: Platform.OS === 'ios' ? 'serif' : 'Roboto' },
  
  content: { flex: 1, alignItems: 'center', padding: 30, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  subtitle: { textAlign: 'center', fontSize: 16, color: '#000', lineHeight: 24, marginBottom: 40 },
  
  pointContainer: { alignItems: 'center' },
  pointLabel: { fontSize: 16, color: '#000', marginBottom: 5 },
  pointRow: { flexDirection: 'row', alignItems: 'center' },
  pointValue: { fontSize: 80, fontWeight: 'bold', color: '#6D4C41', marginRight: 5 }, // Coklat tua
  starIcon: { marginTop: 10 },

  spacer: { flex: 1 }, // Dorong konten bawah ke bawah

  quizDesc: { textAlign: 'center', fontSize: 14, color: '#000', marginBottom: 20, lineHeight: 20 },
  quizButton: { backgroundColor: '#3E2723', paddingVertical: 15, width: '60%', borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  quizButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
