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
import { Colors } from '@/constants/Colors';
import { MUSEUMS } from '@/constants/data'; // Pastikan file data.ts sudah dibuat

export default function JelajahMuseumScreen() {
  const router = useRouter();

  // --- Header Component ---
  const renderHeader = () => (
    <View style={styles.mainContentContainer}>
      {/* 1. Teks Ajakkan */}
      <Text style={styles.heroTitle}>Ayo, Lengkapi Kunjungan MuseumMu!</Text>
      <Text style={styles.heroSubtitle}>Kunjungi museum untuk memperoleh poin dan lencana!</Text>

      {/* 2. Search Bar & Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.cokelatTua[100]} style={{marginRight: 8}} />
          <TextInput 
            placeholder="Cari Museum" 
            style={styles.searchInput}
            placeholderTextColor={Colors.neutral[60]}
          />
        </View>
        
        {/* Tombol Filter dengan Badge */}
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={28} color="#000" />
          <View style={styles.badgeNotification}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 3. Judul Section */}
      <Text style={styles.sectionTitle}>Rekomendasi Museum Untukmu</Text>
    </View>
  );

  // --- Card Item Component ---
  const renderItem = ({ item }: { item: typeof MUSEUMS[0] }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/museum/${item.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.cardContent}>
        {/* Kolom Kiri: Teks Info */}
        <View style={{flex: 1, marginRight: 10}}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardAddress} numberOfLines={2}>{item.address}</Text>
        </View>

        {/* Kolom Kanan: Badge Poin & Love */}
        <View style={{alignItems: 'center', justifyContent: 'space-between'}}>
           <View style={styles.pointBadge}>
              <Text style={styles.pointText}>24 PTS</Text>
           </View>
           <TouchableOpacity style={{marginTop: 10}}>
              <Ionicons name="heart-outline" size={24} color="#000" />
           </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.cokelatMuda.base} />
      
      {/* --- CUSTOM APP BAR (Coklat) --- */}
      <SafeAreaView edges={['top']} style={styles.customHeader}>
        <View style={styles.headerInner}>
          {/* Profile Picture (Placeholder) */}
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100' }} 
            style={styles.avatar} 
          />
          
          {/* Title Tengah */}
          <Text style={styles.headerTitleText}>MuseumKu</Text>
          
          {/* Menu Kanan */}
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* --- LIST CONTENT --- */}
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
  // Header Atas (Coklat)
  customHeader: {
    backgroundColor: '#8D6E63', // Sesuaikan dengan warna coklat di screenshot (mirip Colors.cokelatMuda.base)
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
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFF'
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'serif' : 'Roboto', // Biar fontnya agak klasik kayak di gambar
  },

  // Container Utama
  mainContentContainer: {
    padding: 20,
  },

  // Hero Section
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.cokelatTua.base, // Border coklat
    borderRadius: 25, // Bulat banget
    paddingHorizontal: 15,
    height: 45,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  filterButton: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeNotification: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#8D2424', // Merah tua
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },

  // Card Style
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 15,
    // Shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  cardAddress: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  pointBadge: {
    backgroundColor: '#75544B', // Coklat tua buat badge
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pointText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  }
});