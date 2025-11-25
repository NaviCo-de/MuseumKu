import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; 
import { MUSEUMS } from '@/constants/data'; 

export default function MuseumDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const museum = MUSEUMS.find(m => m.id === id);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!museum) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Judul & Alamat */}
      <View style={styles.titleSection}>
        <Text style={styles.museumName}>{museum.name}</Text>
        <Text style={styles.museumAddress}>{museum.address}</Text>
      </View>

      {/* Gambar & Intro */}
      <View style={styles.contentRow}>
        <Image source={{ uri: museum.image }} style={styles.mainImage} />
        <View style={styles.introTextContainer}>
          <Text style={styles.descText} numberOfLines={8}>
            {museum.description}
          </Text>
        </View>
      </View>

      {/* Deskripsi Lengkap */}
      <Text style={styles.fullDesc}>
        Di dalamnya terdapat artefak arkeologis, mebel antik bergaya kolonial, peta kuno, hingga peninggalan penting seperti meriam Si Jagur dan penjara bawah tanah.
      </Text>

      {/* Info Tiket */}
      <View style={styles.ticketSection}>
        <Text style={styles.ticketHeader}>Harga Tiket:</Text>
        <View style={styles.ticketRow}>
          <View>
            <Text style={styles.ticketLabel}>Senin - Jumat</Text>
            <Text style={styles.ticketLabel}>Sabtu - Minggu</Text>
          </View>
          <View>
            <Text style={styles.ticketPrice}>Rp {museum.price.toLocaleString('id-ID')}/orang</Text>
            <Text style={styles.ticketPrice}>Rp 12.000/orang</Text>
          </View>
          <TouchableOpacity onPress={() => setIsFavorited(!isFavorited)}>
             <Ionicons 
               name={isFavorited ? "heart" : "heart-outline"} 
               size={28} 
               color={isFavorited ? Colors.red.base : "#000"} 
             />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tombol Aksi */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.primaryButton}
          // UPDATE ROUTING: Ke halaman payment di folder yang sama
          onPress={() => router.push(`/(main)/(jelajah-museum)/${id}/payment`)}
        >
          <Text style={styles.primaryButtonText}>Kunjungi Sekarang</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Kunjungi Bersama Teman</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 20, paddingBottom: 40 },
  titleSection: { alignItems: 'center', marginBottom: 20 },
  museumName: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  museumAddress: { fontSize: 12, textAlign: 'center', color: '#666', lineHeight: 18 },
  contentRow: { flexDirection: 'row', marginBottom: 15, gap: 12 },
  mainImage: { width: 130, height: 130, borderRadius: 8, backgroundColor: '#EEE' },
  introTextContainer: { flex: 1 },
  descText: { fontSize: 13, color: '#333', lineHeight: 19, textAlign: 'left' },
  fullDesc: { fontSize: 13, color: '#333', lineHeight: 19, textAlign: 'justify', marginBottom: 20 },
  ticketSection: { marginBottom: 30 },
  ticketHeader: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  ticketRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketLabel: { fontSize: 13, color: '#333', marginBottom: 4 },
  ticketPrice: { fontSize: 13, color: '#333', marginBottom: 4, fontWeight: '500' },
  actionButtons: { gap: 12, alignItems: 'center' },
  primaryButton: { backgroundColor: '#3E2723', width: '100%', paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { backgroundColor: '#8D6E63', width: '100%', paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
  secondaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});