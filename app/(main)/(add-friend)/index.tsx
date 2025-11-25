import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, 
  TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
import { Colors } from '../../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddFriendScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [allUsers, setAllUsers] = useState<any[]>([]); 
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedList, setAddedList] = useState<string[]>([]); 

  // 1. FETCH DATA (Realtime)
  // 1. FETCH DATA (Realtime)
  useEffect(() => {
    if (!auth.currentUser) return;
    const myUid = auth.currentUser.uid;

    // A. Listener User List
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
       const usersList = snapshot.docs
          // --- PERBAIKAN DI SINI (Tambah 'as any') ---
          // Kita paksa TS menganggap hasil map ini punya semua property (username, email, dll)
          .map(doc => ({ id: doc.id, ...doc.data() } as any)) 
          .filter(u => u.id !== myUid); 
       
       setAllUsers(usersList);
       
       // Update hasil search jika ada query
       if (searchQuery) {
         const lowerText = searchQuery.toLowerCase();
         // Sekarang 'user' sudah dianggap 'any', jadi .username tidak akan merah lagi
         const filtered = usersList.filter(user => 
           (user.username && user.username.toLowerCase().includes(lowerText))
         );
         setFilteredUsers(filtered);
       } else {
         setFilteredUsers(usersList);
       }
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

  // 2. SEARCH LOGIC
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      const lowerText = text.toLowerCase();
      const filtered = allUsers.filter(user => 
        (user.username && user.username.toLowerCase().includes(lowerText))
      );
      setFilteredUsers(filtered);
    }
  };

  // 3. ADD FRIEND LOGIC
  const handleAddFriend = async (targetUser: any) => {
    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid, "friends", targetUser.id), {
        addedAt: new Date(),
        username: targetUser.username,
        photoProfile: targetUser.photoProfile
      });
    } catch (error) {
      Alert.alert("Gagal", "Cek koneksi internet.");
    }
  };

  // 4. LOGIC PEMISAHAN LIST (Sudah Teman vs Belum Teman)
  const friendsResult = filteredUsers.filter(user => addedList.includes(user.id));
  const strangersResult = filteredUsers.filter(user => !addedList.includes(user.id));

  // COMPONENT CARD USER
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

        {/* TOMBOL ADD FRIEND (UPDATED: Dengan Teks) */}
        <TouchableOpacity 
          style={[styles.actionButton, isAdded ? styles.btnAdded : styles.btnAdd]}
          onPress={() => !isAdded && handleAddFriend(item)}
          disabled={isAdded}
        >
          {isAdded ? (
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Temukan Teman</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={{marginRight: 10}}/>
          <TextInput 
             placeholder="Cari nama..." 
             style={{flex:1}} 
             value={searchQuery}
             onChangeText={handleSearch}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.cokelatTua.base} style={{marginTop: 50}} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          
          {/* GROUP 1: SUDAH BERTEMAN */}
          {friendsResult.length > 0 && (
            <View>
              {friendsResult.map(user => (
                <UserItem key={user.id} item={user} isAdded={true} />
              ))}
            </View>
          )}

          {/* GARIS PEMISAH (Divider) */}
          {friendsResult.length > 0 && strangersResult.length > 0 && (
            <View style={styles.divider} />
          )}

          {/* GROUP 2: BELUM BERTEMAN */}
          {strangersResult.length > 0 && (
            <View>
              {strangersResult.map(user => (
                <UserItem key={user.id} item={user} isAdded={false} />
              ))}
            </View>
          )}

          {/* EMPTY STATE */}
          {filteredUsers.length === 0 && (
            <Text style={styles.emptyText}>User tidak ditemukan</Text>
          )}

        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.cokelatTua.base, marginBottom: 15 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0F0F0', borderRadius: 12,
    paddingHorizontal: 15, paddingVertical: 10
  },
  
  // CARD STYLES
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
  
  // TOMBOL STYLES (PILL SHAPE)
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    minWidth: 120, // Lebar minimal agar teks muat
  },
  btnAdd: {
    backgroundColor: Colors.cokelatTua.base,
  },
  btnAdded: {
    backgroundColor: '#E0E0E0',
  },
  btnTextAdd: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnTextAdded: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // DIVIDER
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
    marginHorizontal: 10
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50
  }
});