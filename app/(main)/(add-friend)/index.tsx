import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, 
  TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// 1. UPDATE IMPORT: Tambahkan getDoc dan writeBatch
import { collection, doc, onSnapshot, getDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddFriendScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [allUsers, setAllUsers] = useState<any[]>([]); 
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedList, setAddedList] = useState<string[]>([]); 
  
  // State untuk loading saat tombol ditekan (biar user gak spam klik)
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 1. FETCH DATA (Realtime)
  useEffect(() => {
    if (!auth.currentUser) return;
    const myUid = auth.currentUser.uid;

    // A. Listener User List
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
       const usersList = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as any)) 
          .filter(u => u.id !== myUid); 
       
       setAllUsers(usersList);
       setFilteredUsers(usersList);
       setLoading(false);
    });

    // B. Listener Friend List
    const unsubFriends = onSnapshot(collection(db, "users", myUid, "friends"), (snapshot) => {
       const currentFriends = snapshot.docs.map(doc => doc.id);
       setAddedList(currentFriends);
    });

    return () => {
      unsubUsers();
      unsubFriends();
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(allUsers);
      return;
    }
    const lowerText = searchQuery.toLowerCase();
    const filtered = allUsers.filter(user => 
      (user.username && user.username.toLowerCase().includes(lowerText))
    );
    setFilteredUsers(filtered);
  }, [searchQuery, allUsers]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // 2. LOGIC ADD FRIEND YANG BENAR (TIMBAL BALIK)
  const handleAddFriend = async (targetUser: any) => {
    if (!auth.currentUser) return;
    
    setProcessingId(targetUser.id); // Set loading state spesifik untuk user ini
    try {
      const myUid = auth.currentUser.uid;
      const batch = writeBatch(db); // Gunakan Batch agar atomik (sukses semua atau gagal semua)

      // Langkah A: Ambil data diri SAYA dulu (username & fotonya)
      // Kita butuh ini untuk ditaruh di list teman si target
      const myProfileSnap = await getDoc(doc(db, "users", myUid));
      if (!myProfileSnap.exists()) {
        throw new Error("Data profil Anda tidak ditemukan.");
      }
      const myData = myProfileSnap.data();

      const now = new Date();

      // Langkah B: Siapkan Referensi Dokumen
      // 1. Masukkan Target ke List Teman SAYA
      const myFriendRef = doc(db, "users", myUid, "friends", targetUser.id);
      batch.set(myFriendRef, {
        addedAt: now,
        username: targetUser.username || "Unknown",
        photoProfile: targetUser.photoProfile || null
      });

      // 2. Masukkan SAYA ke List Teman TARGET (INI YANG DULU HILANG)
      const targetFriendRef = doc(db, "users", targetUser.id, "friends", myUid);
      batch.set(targetFriendRef, {
        addedAt: now,
        username: myData.username || "Unknown",
        photoProfile: myData.photoProfile || null
      });

      // Langkah C: Eksekusi Batch
      await batch.commit();

      // Tidak perlu Alert "Sukses" yang mengganggu, perubahan UI otomatis karena listener onSnapshot
    } catch (error: any) {
      Alert.alert("Gagal", error.message || "Cek koneksi internet.");
    } finally {
      setProcessingId(null);
    }
  };

  const friendsResult = filteredUsers.filter(user => addedList.includes(user.id));
  const strangersResult = filteredUsers.filter(user => !addedList.includes(user.id));

  const UserItem = ({ item, isAdded }: { item: any, isAdded: boolean }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/user-profile/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Image 
          source={{ uri: item.photoProfile || "https://i.pravatar.cc/150" }} 
          style={styles.avatar} 
        />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{item.username || "User"}</Text>
          <Text style={styles.handle}>@{item.username?.toLowerCase().replace(/\s/g, '')}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, isAdded ? styles.btnAdded : styles.btnAdd]}
          onPress={() => !isAdded && handleAddFriend(item)}
          disabled={isAdded || processingId === item.id}
        >
          {processingId === item.id ? (
             <ActivityIndicator size="small" color="white" />
          ) : isAdded ? (
            <>
              <Ionicons name="checkmark" size={16} color="#666" />
              <Text style={styles.btnTextAdded}>Berteman</Text>
            </>
          ) : (
            <>
              <Ionicons name="person-add" size={16} color="white" />
              <Text style={styles.btnTextAdd}>Tambah Teman</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Teman</Text>
          <Text>Ayo, Lengkapi Kunjungan Museummu!</Text>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.red[60]} style={{marginRight: 10}}/>
          <TextInput 
             placeholder="Cari nama..." 
             style={{flex:1}} 
             value={searchQuery}
             onChangeText={handleSearch}
          />
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: 20}}>Daftar Teman</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.cokelatTua.base} style={{marginTop: 50}} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {friendsResult.length > 0 && (
            <View>
              {friendsResult.map(user => (
                <UserItem key={user.id} item={user} isAdded={true} />
              ))}
            </View>
          )}

          {friendsResult.length > 0 && strangersResult.length > 0 && (
            <View style={styles.divider} />
          )}

          {strangersResult.length > 0 && (
            <View>
              {strangersResult.map(user => (
                <UserItem key={user.id} item={user} isAdded={false} />
              ))}
            </View>
          )}

          {filteredUsers.length === 0 && (
            <Text style={styles.emptyText}>User tidak ditemukan</Text>
          )}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, marginBottom: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'black' },
  subHeaderTitle: { fontSize: 12, fontWeight: 'semibold', color: 'black'},
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0F0F0', borderRadius: 28,
    paddingHorizontal: 15,
    borderColor: Colors.red[60], borderWidth: 2,
    height: 50, marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2, 
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee', marginRight: 15
  },
  textContainer: { flex: 1, marginRight: 10 },
  username: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  handle: { fontSize: 13, color: 'gray' },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    minWidth: 120, 
  },
  btnAdd: { backgroundColor: Colors.cokelatTua.base },
  btnAdded: { backgroundColor: '#E0E0E0' },
  btnTextAdd: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  btnTextAdded: { color: '#666', fontWeight: 'bold', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 15, marginHorizontal: 10 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 50 },
});
