import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; 
import { MUSEUMS } from '@/constants/data'; 
import { useMuseumFavorites } from '@/hooks/useMuseumFavorites';

export default function JelajahMuseumScreen() {
  const router = useRouter();
  
  // State Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMuseums, setFilteredMuseums] = useState(MUSEUMS);
  
  // Logic Favorit
  const { favoriteIds, toggleFavorite } = useMuseumFavorites();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const newData = MUSEUMS.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredMuseums(newData);
    } else {
      setFilteredMuseums(MUSEUMS);
    }
  };

  // Ini adalah KONTEN ATAS (Judul & Search), bukan Header Navigasi
  const renderTopContent = () => (
    <View style={styles.topContentContainer}>
      <Text style={styles.heroTitle}>Ayo, Lengkapi Kunjungan MuseumMu!</Text>
      <Text style={styles.heroSubtitle}>Kunjungi museum untuk memperoleh poin dan lencana!</Text>

      {/* Search Bar Section */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.neutral[80]} style={{marginRight: 8}} />
          <TextInput 
            placeholder="Cari Museum" 
            style={styles.searchInput}
            placeholderTextColor={Colors.neutral[60]}
            value={searchQuery}
            onChangeText={(text) => handleSearch(text)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
               <Ionicons name="close-circle" size={20} color={Colors.neutral[60]} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Tombol List Favorit */}
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={() => router.push('/(main)/(jelajah-museum)/favorites')}
        >
          <Ionicons name="list" size={32} color="#000" /> 
          {favoriteIds.length > 0 && (
            <View style={styles.badgeNotification}>
              <Text style={styles.badgeText}>{favoriteIds.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Rekomendasi Museum Untukmu</Text>
    </View>
  );

  const renderItem = ({ item }: { item: typeof MUSEUMS[0] }) => {
    const isLiked = favoriteIds.includes(item.id);

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => router.push(`/(main)/(jelajah-museum)/${item.id}`)}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <View style={{flex: 1, marginRight: 10}}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardAddress} numberOfLines={2}>{item.address}</Text>
          </View>

          <View style={{alignItems: 'center', justifyContent: 'space-between', gap: 15}}>
             <View style={styles.pointBadge}>
                <Text style={styles.pointText}>24 PTS</Text>
             </View>
             <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                <Ionicons 
                    name={isLiked ? "heart" : "heart-outline"} 
                    size={24} 
                    color={isLiked ? Colors.red.base : "#000"} 
                />
             </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMuseums}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        
        // Bagian atas list (Search & Judul)
        ListHeaderComponent={renderTopContent()}
        
        // Styling agar konsisten dengan Home
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        
        ListEmptyComponent={
          <View style={styles.centerEmpty}>
            <Text style={{ color: '#888' }}>Tidak ada museum ditemukan.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Menggunakan background abu-abu (#F5F5F5) agar SAMA dengan Home
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  

  // Container untuk Judul & Search (bukan Header Navigasi)
  topContentContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  heroTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#000', marginBottom: 5 },
  heroSubtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 },
  
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, gap: 15 },
  
  searchBar: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', // Search bar tetap putih
    borderWidth: 1, 
    borderColor: '#DDD', // Border lebih halus
    borderRadius: 25, 
    paddingHorizontal: 15, 
    height: 45 
  },
  searchInput: { flex: 1, fontSize: 14, color: '#000' },
  
  bookmarkButton: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
  badgeNotification: { position: 'absolute', top: -5, right: -5, backgroundColor: '#8D2424', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#F5F5F5' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#000' },
  
  // Card Style (Sama seperti Home)
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    marginHorizontal: 20, // Margin kiri kanan agar tidak nempel layar
    marginBottom: 15, 
    padding: 15, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4 
  },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#000' },
  cardAddress: { fontSize: 12, color: '#666', lineHeight: 18 },
  
  pointBadge: { backgroundColor: '#5D4037', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, minWidth: 60, alignItems: 'center' },
  pointText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  centerEmpty: { alignItems: 'center', marginTop: 50 }
});