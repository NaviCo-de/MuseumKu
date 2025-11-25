import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TextInput, TouchableOpacity, ActivityIndicator, Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
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

  // 1. FETCH DATA
  useEffect(() => {
    if (!auth.currentUser) return;
    const myUid = auth.currentUser.uid;

    // A. Listener User List (Siapa tau ada user baru daftar)
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
       const usersList = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((u: any) => u.id !== myUid); // Jangan tampilkan diri sendiri
       
       setAllUsers(usersList);
       // Kalau sedang search, jangan timpa hasil search
       setFilteredUsers(prev => searchQuery ? prev : usersList);
       setLoading(false);
    });

    // B. Listener Friend List (Biar tombol Add/Added update realtime)
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

  // 4. RENDER ITEM
  const renderUserItem = ({ item }: { item: any }) => {
    const isAdded = addedList.includes(item.id);

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => router.push(`/user-profile/${item.id}`)} // <--- KE HALAMAN PROFIL BARU
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

          {/* Tombol Add Friend */}
          <TouchableOpacity 
            style={[styles.addButton, isAdded && styles.addButtonAdded]}
            onPress={() => !isAdded && handleAddFriend(item)}
            disabled={isAdded}
          >
            {isAdded ? (
               <Ionicons name="checkmark" size={20} color="#666" />
            ) : (
               <Ionicons name="person-add" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={{ padding: 20 }}
          ItemSeparatorComponent={() => <View style={{height: 12}} />}
          ListEmptyComponent={<Text style={{textAlign:'center', color:'#999', marginTop:50}}>User tidak ditemukan</Text>}
        />
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2, // Shadow Android
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee', marginRight: 15
  },
  textContainer: { flex: 1 },
  username: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  handle: { fontSize: 13, color: 'gray' },
  
  addButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.cokelatTua.base,
    alignItems: 'center', justifyContent: 'center',
  },
  addButtonAdded: {
    backgroundColor: '#E0E0E0',
  }
});