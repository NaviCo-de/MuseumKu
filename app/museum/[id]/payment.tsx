import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; // Pakai warna dari projectmu
import { MUSEUMS } from '@/constants/data'; // Pastikan file ini ada

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Ambil data museum
  const museum = MUSEUMS.find(m => m.id === id);

  const handlePayment = () => {
    setLoading(true);
    // Simulasi loading pembayaran...
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Pembayaran Berhasil!",
        "Tiket Anda telah terbit. Silakan masuk ke area jelajah.",
        [
          { 
            text: "Mulai Jelajah", 
            // Redirect ke halaman Journey
            onPress: () => router.replace(`/museum/${id}/journey`) 
          }
        ]
      );
    }, 1500);
  };

  if (!museum) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Konfirmasi Pesanan</Text>
        <View style={{width: 24}} /> 
      </View>

      {/* Card Info Tiket */}
      <View style={styles.ticketCard}>
        <Image source={{ uri: museum.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.museumName}>{museum.name}</Text>
          <Text style={styles.date}>Tiket Masuk Regular</Text>
          <Text style={styles.price}>Rp {museum.price.toLocaleString('id-ID')}</Text>
        </View>
      </View>

      {/* Detail Pembayaran */}
      <View style={styles.details}>
        <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Harga Tiket</Text>
          <Text style={styles.value}>Rp {museum.price.toLocaleString('id-ID')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Biaya Layanan</Text>
          <Text style={styles.value}>Rp 0</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Pembayaran</Text>
          <Text style={styles.totalValue}>Rp {museum.price.toLocaleString('id-ID')}</Text>
        </View>
      </View>

      {/* Tombol Bayar */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payButton} 
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.payButtonText}>Bayar Sekarang</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  ticketCard: { flexDirection: 'row', padding: 15, backgroundColor: Colors.neutral[10], borderRadius: 12, marginBottom: 30 },
  image: { width: 70, height: 70, borderRadius: 8, marginRight: 15, backgroundColor: '#ccc' },
  info: { flex: 1, justifyContent: 'center' },
  museumName: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  date: { fontSize: 12, color: '#666', marginBottom: 5 },
  price: { fontSize: 16, fontWeight: 'bold', color: Colors.cokelatTua.base },
  details: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: '#666' },
  value: { fontWeight: '500' },
  totalRow: { marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#EEE' },
  totalLabel: { fontWeight: 'bold', fontSize: 16 },
  totalValue: { fontWeight: 'bold', fontSize: 18, color: Colors.cokelatTua.base },
  footer: { paddingBottom: 20 },
  payButton: { backgroundColor: Colors.cokelatTua.base, padding: 18, borderRadius: 12, alignItems: 'center' },
  payButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});