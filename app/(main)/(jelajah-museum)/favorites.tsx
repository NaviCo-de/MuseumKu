import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { MUSEUMS } from '@/constants/data';
import { useMuseumFavorites } from '@/hooks/useMuseumFavorites';

export default function FavoriteScreen() {
  const router = useRouter();
  // Mengambil data favorit dari Hook
  const { favoriteIds, toggleFavorite, loading } = useMuseumFavorites();

  // Filter museum yang ID-nya ada di daftar favorit user
  const favoriteMuseums = MUSEUMS.filter(museum => favoriteIds.includes(museum.id));

  // --- Header Bagian Atas (Back, Judul, Subjudul) ---
  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Tombol Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      {/* Judul & Subjudul */}
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Museum To Visit</Text>
        <Text style={styles.pageSubtitle}>Ayo, Lengkapi Kunjungan Museummu!</Text>
      </View>
    </View>
  );

  // --- Render Item (Kartu Sesuai Desain) ---
  const renderItem = ({ item }: { item: typeof MUSEUMS[0] }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/(main)/(jelajah-museum)/${item.id}`)}
      activeOpacity={0.8}
    >
      {/* Kiri: Informasi Teks */}
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardAddress} numberOfLines={3}>
          {item.address}
        </Text>
      </View>

      {/* Kanan: Badge Poin & Icon Hati */}
      <View style={styles.rightActionContainer}>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>24 PTS</Text>
        </View>

        <TouchableOpacity 
          onPress={() => toggleFavorite(item.id)}
          style={styles.heartButton}
        >
          {/* Icon Hati Hitam Solid (Sesuai Gambar) */}
          <Ionicons name="heart" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Status Bar cokelat menyesuaikan header global */}
      <StatusBar barStyle="light-content" backgroundColor={Colors.cokelatTua.base} />

      {loading ? (
        <View style={styles.centerContainer}>
            <Text style={{color: '#888'}}>Memuat favorit...</Text>
        </View>
      ) : favoriteMuseums.length === 0 ? (
        <View style={styles.container}>
            {renderHeader()}
            <View style={styles.centerContainer}>
                <Ionicons name="heart-dislike-outline" size={60} color="#DDD" />
                <Text style={styles.emptyText}>Belum ada museum yang ditambahkan.</Text>
            </View>
        </View>
      ) : (
        <FlatList
          data={favoriteMuseums}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' // Background Putih Bersih
  },
  
  // --- Styles Header ---
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20, // Jarak dari atas (di bawah header global)
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  titleContainer: {
    alignItems: 'center', // Rata tengah sesuai desain
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },

  // --- Styles List & Card ---
  listContent: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 16,
    
    // Shadow / Elevation effect
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 0.5,
    borderColor: '#F0F0F0'
  },
  
  // Bagian Kiri (Teks)
  textContainer: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  cardAddress: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },

  // Bagian Kanan (Badge & Heart)
  rightActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pointsBadge: {
    backgroundColor: '#5D4037', // Cokelat tua/kemerahan (sesuai badge 24 PTS)
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pointsText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  heartButton: {
    padding: 5,
  },

  // Empty State
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14,
  }
});