import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  StatusBar,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// Pastikan path ini benar
import { Colors } from '@/constants/Colors'; 
import { MUSEUMS } from '@/constants/data'; 

export default function JelajahMuseumScreen() {
  const router = useRouter();

  // --- Header & Search Component ---
  const renderHeader = () => (
    <View style={styles.mainContentContainer}>
      {/* 1. Teks Hero (Ajakkan) */}
      <Text style={styles.heroTitle}>Ayo, Lengkapi Kunjungan MuseumMu!</Text>
      <Text style={styles.heroSubtitle}>Kunjungi museum untuk memperoleh poin dan lencana!</Text>

      {/* 2. Search Bar & Bookmark Button */}
      <View style={styles.searchContainer}>
        {/* Search Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.cokelatTua[80]} style={{marginRight: 8}} />
          <TextInput 
            placeholder="Cari Museum" 
            style={styles.searchInput}
            placeholderTextColor={Colors.neutral[60]}
          />
        </View>
        
        {/* Tombol Bookmark/List (Sebelah Search) */}
        <TouchableOpacity style={styles.bookmarkButton}>
          {/* Ikon List/Bookmark sesuai desain */}
          <Ionicons name="list" size={32} color="#000" /> 
          
          {/* Badge Notifikasi (Angka 3) */}
          <View style={styles.badgeNotification}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 3. Judul List */}
      <Text style={styles.sectionTitle}>Rekomendasi Museum Untukmu</Text>
    </View>
  );

  // --- Card Item Museum ---
  const renderItem = ({ item }: { item: typeof MUSEUMS[0] }) => (
    <TouchableOpacity 
      style={styles.card} 
      // ALUR: Klik Card -> Masuk Detail Museum
      onPress={() => router.push(`/museum/${item.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.cardContent}>
        {/* Kiri: Informasi Teks */}
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardAddress} numberOfLines={2}>{item.address}</Text>
        </View>

        {/* Kanan: Badge Poin & Icon Love */}
        <View style={{alignItems: 'center', justifyContent: 'space-between', gap: 15}}>
           <View style={styles.pointBadge}>
              <Text style={styles.pointText}>24 PTS</Text>
           </View>
           <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color="#000" />
           </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.cokelatMuda.base} />
      {/* --- LIST MUSEUM --- */}
      <FlatList
        data={MUSEUMS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  // CONTENT STYLE
  mainContentContainer: {
    padding: 20,
    paddingTop: 30,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 25,
  },

  // SEARCH & BOOKMARK
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 15, // Jarak antara search bar dan icon list
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#5D4037', // Border coklat tua
    borderRadius: 25, 
    paddingHorizontal: 15,
    height: 45,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  bookmarkButton: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeNotification: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#8D2424', // Merah badge
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
    zIndex: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // LIST SECTION
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    // Shadow Effect
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000',
  },
  cardAddress: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  pointBadge: {
    backgroundColor: '#5D4037',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    alignItems: 'center'
  },
  pointText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  }
});