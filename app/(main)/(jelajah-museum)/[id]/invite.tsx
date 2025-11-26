import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  StatusBar,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dummy Data (Sesuai screenshot kebanyakan shandy_darrell)
const DUMMY_CLOSE_FRIENDS = [
  { id: '1', name: 'shandy_darrell' },
  { id: '2', name: 'shandy_darrell' },
  { id: '3', name: 'shandy_darrell' },
];

const DUMMY_ALL_FRIENDS = [
  { id: '4', name: 'shandy_darrell' },
  { id: '5', name: 'shandy_darrell' },
  { id: '6', name: 'shandy_darrell' },
  { id: '7', name: 'shandy_darrell' },
  { id: '8', name: 'shandy_darrell' },
  { id: '9', name: 'shandy_darrell' },
];

export default function InviteFriendsScreen() {
  const router = useRouter();
  useLocalSearchParams(); // ID Museum jika nanti diperlukan
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk menyimpan ID teman yang sudah diajak
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  // Fungsi Handle Invite
  const handleInvite = (friendId: string) => {
    if (invitedIds.includes(friendId)) {
      // Kalau mau bisa cancel invite, aktifkan baris ini:
      // setInvitedIds(prev => prev.filter(id => id !== friendId));
    } else {
      setInvitedIds(prev => [...prev, friendId]);
      Alert.alert("Berhasil", "Undangan telah dikirim!");
    }
  };

  // Fungsi Render Item Teman
  const renderFriendItem = (item: { id: string, name: string }) => {
    const isInvited = invitedIds.includes(item.id);

    return (
      <View key={item.id} style={styles.friendCard}>
        <View style={styles.friendInfo}>
          {/* Avatar Bulat Abu-abu */}
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.friendName}>{item.name}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.inviteButton, isInvited && styles.invitedButton]} 
          onPress={() => handleInvite(item.id)}
          disabled={isInvited}
        >
          <Text style={styles.inviteButtonText}>
            {isInvited ? 'Terkirim' : 'Ajak'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Filter Logic (Untuk Search)
  const filteredClose = DUMMY_CLOSE_FRIENDS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAll = DUMMY_ALL_FRIENDS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Konten Scrollable */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Halaman */}
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>Visit with Friends</Text>
            <Text style={styles.pageSubtitle}>Ayo, Lengkapi Kunjungan Museummu!</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#5D4037" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Cari Teman"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Section: Teman Dekat */}
        <Text style={styles.sectionTitle}>Teman Dekat</Text>
        <View style={styles.listContainer}>
          {filteredClose.map(renderFriendItem)}
        </View>

        {/* Section: Semua Teman */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Semua Teman</Text>
        <View style={styles.listContainer}>
          {filteredAll.map(renderFriendItem)}
        </View>

        {/* Padding bawah agar tidak ketutup nav bar */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBFA', // Background agak krem/putih
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20, // Jarak dari atas
  },
  
  // HEADER
  headerSection: {
    alignItems: 'center', // Rata tengah
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 10, // Memberi ruang agar sejajar dengan back button secara visual
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#444',
  },

  // SEARCH BAR
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#5D4037', // Border Coklat
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    height: '100%',
  },

  // LIST & ITEMS
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  listContainer: {
    gap: 10,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 30, // Rounded Pill Shape
    // Shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0', // Lingkaran abu-abu
    marginRight: 12,
  },
  friendName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  inviteButton: {
    backgroundColor: '#5D4037', // Coklat Tua
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  invitedButton: {
    backgroundColor: '#A1887F', // Coklat lebih muda jika sudah diajak
  },
  inviteButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
