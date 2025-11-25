import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Pastikan path import ini sesuai
import { Colors } from '@/constants/Colors'; 
import { MUSEUMS } from '@/constants/data'; 

export default function MuseumDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const museum = MUSEUMS.find(m => m.id === id);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!museum) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* 1. Tombol Back (Hitam, di kiri atas) */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={32} color="#000" />
        </TouchableOpacity>

        {/* 2. Judul & Alamat */}
        <View style={styles.titleSection}>
          <Text style={styles.museumName}>{museum.name}</Text>
          <Text style={styles.museumAddress}>{museum.address}</Text>
        </View>

        {/* 3. Gambar & Intro (Layout Sebelahan) */}
        <View style={styles.contentRow}>
          <Image source={{ uri: museum.image }} style={styles.mainImage} />
          
          <View style={styles.introTextContainer}>
            <Text style={styles.introText}>
              {/* Teks Hardcode/Data pendek sesuai gambar */}
              {museum.name}, juga dikenal sebagai Museum Fatahillah, terletak di kawasan Kota Tua Jakarta dan menempati bangunan bekas Balai Kota Batavia yang dibangun pada abad ke-18.
            </Text>
          </View>
        </View>

        {/* 4. Deskripsi Panjang */}
        <Text style={styles.fullDesc}>
          Di dalamnya terdapat artefak arkeologis, mebel antik bergaya kolonial, peta kuno, hingga peninggalan penting seperti meriam Si Jagur dan penjara bawah tanah yang dulu digunakan pada masa penjajahan. Selain sebagai tempat wisata edukatif, museum ini juga menjadi saksi perkembangan Jakarta dari kota pelabuhan kecil menjadi ibu kota Indonesia yang modern. Selain itu, museum ini juga menampilkan keramik dan gerabah dari berbagai negara yang menunjukkan hubungan dagang internasional pada masa lampau. Semua koleksi tersebut menggambarkan perkembangan sosial, budaya, dan pemerintahan Jakarta dari masa ke masa.
        </Text>

        {/* 5. Info Harga Tiket & Love */}
        <View style={styles.ticketSection}>
          <Text style={styles.ticketHeader}>Harga Tiket:</Text>
          
          <View style={styles.ticketRowContainer}>
            {/* List Harga */}
            <View style={styles.ticketPriceList}>
              <View style={styles.priceRow}>
                <Text style={styles.ticketLabel}>Senin - Jumat</Text>
                <Text style={styles.ticketValue}>Rp 7.500/orang</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.ticketLabel}>Sabtu - Minggu</Text>
                <Text style={styles.ticketValue}>Rp 12.000/orang</Text>
              </View>
            </View>

            {/* Icon Love (Disebelah Kanan) */}
            <TouchableOpacity onPress={() => setIsFavorited(!isFavorited)}>
               <Ionicons 
                 name={isFavorited ? "heart" : "heart-outline"} 
                 size={35} 
                 color={isFavorited ? Colors.red.base : "#000"} 
               />
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. Tombol Aksi */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push(`/(main)/(jelajah-museum)/${id}/payment`)}
          >
            <Text style={styles.primaryButtonText}>Kunjungi Sekarang</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Kunjungi Bersama Teman</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Tombol Back
  backButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },

  // Header Judul
  titleSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  museumName: {
    fontSize: 24, // Lebih besar dikit sesuai gambar
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },
  museumAddress: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  // Gambar + Intro
  contentRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 15,
    alignItems: 'flex-start'
  },
  mainImage: {
    width: 150,
    height: 150,
    borderRadius: 4, 
    backgroundColor: '#EEE',
  },
  introTextContainer: {
    flex: 1,
  },
  introText: {
    fontSize: 13,
    color: '#000',
    lineHeight: 18,
    textAlign: 'left', // Sesuai gambar (rata kiri/justify)
  },

  // Deskripsi Panjang
  fullDesc: {
    fontSize: 13,
    color: '#000',
    lineHeight: 18,
    textAlign: 'justify',
    marginBottom: 20,
  },

  // Bagian Tiket
  ticketSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  ticketHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  ticketRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Vertikal center dengan icon love
  },
  ticketPriceList: {
    flex: 1,
    marginRight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  ticketLabel: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  ticketValue: {
    fontSize: 14,
    color: '#000',
    flex: 1,
    textAlign: 'left', // Sesuai gambar
  },

  // Tombol
  actionButtons: {
    gap: 15,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3E2723', // Coklat Tua Gelap
    width: '80%', // Tidak full width sesuai gambar
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#6D4C41', // Coklat Sedang
    width: '90%', // Sedikit lebih lebar
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});