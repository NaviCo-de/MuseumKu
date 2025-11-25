import React from 'react';
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

export default function JelajahMuseumScreen() {
  const router = useRouter();

  // --- Header Component (Search & Hero) ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.heroTitle}>Ayo, Lengkapi Kunjungan MuseumMu!</Text>
      <Text style={styles.heroSubtitle}>Kunjungi museum untuk memperoleh poin dan lencana!</Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.neutral[80]} style={{marginRight: 8}} />
          <TextInput 
            placeholder="Cari Museum" 
            style={styles.searchInput}
            placeholderTextColor={Colors.neutral[60]}
          />
        </View>
        
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="list" size={32} color="#000" /> 
          <View style={styles.badgeNotification}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Rekomendasi Museum Untukmu</Text>
    </View>
  );

  // --- Card Item ---
  const renderItem = ({ item }: { item: typeof MUSEUMS[0] }) => (
    <TouchableOpacity 
      style={styles.card} 
      // UPDATE ROUTING: Mengarah ke folder [id] di dalam (jelajah-museum)
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
           <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color="#000" />
           </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
  container: { flex: 1, backgroundColor: '#FFF' },
  headerContainer: { padding: 20, paddingTop: 20 },
  heroTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#000', marginBottom: 5 },
  heroSubtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 25 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 15 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#5D4037', borderRadius: 25, paddingHorizontal: 15, height: 45 },
  searchInput: { flex: 1, fontSize: 14, color: '#000' },
  bookmarkButton: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
  badgeNotification: { position: 'absolute', top: -5, right: -5, backgroundColor: '#8D2424', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FFF' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#000' },
  card: { backgroundColor: '#FFF', borderRadius: 16, marginHorizontal: 20, marginBottom: 15, padding: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 1, borderColor: '#EEE' },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#000' },
  cardAddress: { fontSize: 12, color: '#666', lineHeight: 18 },
  pointBadge: { backgroundColor: '#5D4037', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, minWidth: 60, alignItems: 'center' },
  pointText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' }
});
