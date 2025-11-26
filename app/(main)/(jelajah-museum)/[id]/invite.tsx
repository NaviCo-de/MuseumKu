import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  StatusBar,
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dummy Data
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
  useLocalSearchParams(); 
  const [searchQuery, setSearchQuery] = useState('');
  
  // State undangan
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  
  // State Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInvite = (friendId: string) => {
    if (!invitedIds.includes(friendId)) {
      setInvitedIds(prev => [...prev, friendId]);
      // Tampilkan Modal Custom (Ganti Alert)
      setShowSuccessModal(true);
    }
  };

  const renderFriendItem = (item: { id: string, name: string }) => {
    const isInvited = invitedIds.includes(item.id);

    return (
      <View key={item.id} style={styles.friendCard}>
        <View style={styles.friendInfo}>
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

  const filteredClose = DUMMY_CLOSE_FRIENDS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAll = DUMMY_ALL_FRIENDS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>Visit with Friends</Text>
            <Text style={styles.pageSubtitle}>Ayo, Lengkapi Kunjungan Museummu!</Text>
          </View>
        </View>

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

        <Text style={styles.sectionTitle}>Teman Dekat</Text>
        <View style={styles.listContainer}>
          {filteredClose.map(renderFriendItem)}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Semua Teman</Text>
        <View style={styles.listContainer}>
          {filteredAll.map(renderFriendItem)}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* MODAL SUKSES INVITE */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeader}>Berhasil!</Text>
            <Text style={styles.modalDesc}>
              Undangan telah dikirim ke teman Anda.
            </Text>
            
            <TouchableOpacity 
                style={styles.primaryButtonModal} 
                onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.primaryButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFBFA' },
  scrollContent: { padding: 20, paddingTop: 20 },
  
  headerSection: { alignItems: 'center', marginBottom: 20, position: 'relative' },
  backButton: { position: 'absolute', left: 0, top: 0, zIndex: 10 },
  titleContainer: { alignItems: 'center', marginTop: 10 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  pageSubtitle: { fontSize: 14, color: '#444' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#5D4037', borderRadius: 25, paddingHorizontal: 15, height: 45, marginBottom: 25 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#000', height: '100%' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  listContainer: { gap: 10 },
  
  friendCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 10, paddingHorizontal: 15, borderRadius: 30, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, borderWidth: 1, borderColor: '#EEE' },
  friendInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0E0E0', marginRight: 12 },
  friendName: { fontSize: 14, color: '#000', fontWeight: '400' },
  
  inviteButton: { backgroundColor: '#5D4037', paddingVertical: 6, paddingHorizontal: 20, borderRadius: 20 },
  invitedButton: { backgroundColor: '#A1887F' },
  inviteButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  // --- MODAL STYLES (SAMA SEPERTI PAGE LAIN) ---
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalCard: { 
    width: '80%', 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 25, 
    alignItems: 'center', 
    elevation: 10 
  },
  modalHeader: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#000', 
    marginBottom: 10 
  },
  modalDesc: { 
    fontSize: 14, 
    textAlign: 'center', 
    color: '#000', 
    marginBottom: 25, 
    lineHeight: 20 
  },
  primaryButtonModal: { 
    backgroundColor: '#4E342E', 
    width: '100%', 
    paddingVertical: 14, 
    borderRadius: 16, // Radius 16 sesuai request
    alignItems: 'center'
  },
  primaryButtonText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});