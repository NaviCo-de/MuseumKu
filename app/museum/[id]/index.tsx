import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// Sesuaikan path import ini
import { Colors } from '@/constants/Colors'; 
import { MUSEUMS } from '@/constants/data'; 

export default function MuseumDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const museum = MUSEUMS.find(m => m.id === id);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!museum) return null;

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.cokelatMuda.base} />

      {/* --- HEADER ATAS (Coklat) --- */}
      <SafeAreaView edges={['top']} style={styles.customHeader}>
        <View style={styles.headerInner}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100' }} 
            style={styles.avatar} 
          />
          <Text style={styles.headerTitleText}>MuseumKu</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tombol Back */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        {/* Judul & Alamat */}
        <View style={styles.titleSection}>
          <Text style={styles.museumName}>{museum.name}</Text>
          <Text style={styles.museumAddress}>{museum.address}</Text>
        </View>

        {/* Section Gambar & Intro */}
        <View style={styles.contentRow}>
          <Image source={{ uri: museum.image }} style={styles.mainImage} />
          <View style={styles.introTextContainer}>
            <Text style={styles.descText} numberOfLines={9}>
              {/* Mengambil sebagian teks dari deskripsi untuk simulasi layout kolom kanan */}
              {museum.description}
            </Text>
          </View>
        </View>

        {/* Deskripsi Lanjutan (Full Text) */}
        <Text style={[styles.descText, {marginTop: 15, textAlign: 'justify'}]}>
          Di dalamnya terdapat artefak arkeologis, mebel antik bergaya kolonial, peta kuno, hingga peninggalan penting seperti meriam Si Jagur dan penjara bawah tanah yang dulu digunakan pada masa penjajahan. Selain sebagai tempat wisata edukatif, museum ini juga menjadi saksi perkembangan Jakarta dari kota pelabuhan kecil menjadi ibu kota Indonesia yang modern.
        </Text>

        {/* Info Harga Tiket */}
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
            
            {/* Love Icon di sebelah harga (sesuai desain) */}
            <TouchableOpacity onPress={() => setIsFavorited(!isFavorited)} style={{justifyContent: 'center', paddingLeft: 20}}>
               <Ionicons 
                 name={isFavorited ? "heart" : "heart-outline"} 
                 size={32} 
                 color={isFavorited ? Colors.red.base : "#000"} 
               />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tombol Aksi */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push(`/museum/${id}/payment`)}
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
  // Header (Sama persis dengan halaman sebelumnya)
  customHeader: {
    backgroundColor: '#8D6E63',
    paddingBottom: 15,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#FFF'
  },
  headerTitleText: {
    fontSize: 24, fontWeight: 'bold', color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'serif' : 'Roboto', 
  },

  // Content Styles
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 15,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  museumName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },
  museumAddress: {
    fontSize: 13,
    textAlign: 'center',
    color: '#000',
    lineHeight: 18,
    paddingHorizontal: 10,
  },

  // Row Image & Text
  contentRow: {
    flexDirection: 'row',
    marginBottom: 5,
    gap: 15,
  },
  mainImage: {
    width: 160,
    height: 160, // Kotak sesuai desain
    borderRadius: 0, // Desain kotak tajam atau radius kecil
    backgroundColor: '#EEE',
  },
  introTextContainer: {
    flex: 1,
  },
  descText: {
    fontSize: 13,
    color: '#000',
    lineHeight: 19,
    textAlign: 'left', // Di gambar terlihat rata kiri/justify
  },

  // Ticket Info
  ticketSection: {
    marginTop: 25,
    marginBottom: 30,
  },
  ticketHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Biar icon love vertikal tengah
  },
  ticketLabel: {
    fontSize: 13,
    color: '#000',
    marginBottom: 4,
  },
  ticketPrice: {
    fontSize: 13,
    color: '#000',
    marginBottom: 4,
  },

  // Buttons
  actionButtons: {
    gap: 15,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3E2723', // Coklat sangat tua (mirip warna kopi)
    width: '80%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#795548', // Coklat lebih muda
    width: '80%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});