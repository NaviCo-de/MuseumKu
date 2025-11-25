import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { db, auth } from '@/firebaseConfig'; // Pastikan path ../ benar
import { collection, query, where, getDocs, doc, getDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    // 1. Ambil Data User Profil (Sekali saja cukup, jarang berubah)
    const fetchProfile = async () => {
      const uDoc = await getDoc(doc(db, "users", auth.currentUser!.uid));
      if (uDoc.exists()) setUser(uDoc.data());
    };

    fetchProfile();

    // 2. Ambil Postingan SAYA secara REALTIME (CCTV)
    // Tambah orderBy biar yang baru ada di kiri
    const q = query(
      collection(db, "posts"), 
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc") 
    );

    // Pasang Listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMyPosts(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetch profile posts:", error);
      setLoading(false);
    });

    // Cabut Listener saat keluar halaman
    return () => unsubscribe();
  }, []);

  const renderMyPost = ({ item }: { item: any }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.userPhoto }} style={styles.tinyAvatar} />
        <Text style={styles.tinyUsername}>{item.username}</Text>
      </View>
      <Image source={{ uri: item.imageURL }} style={styles.postImage} />
      <Text style={styles.postCaption} numberOfLines={2}>{item.caption}</Text>
      <View style={styles.postActions}>
        <Ionicons name="heart-outline" size={20} />
        <Ionicons name="chatbubble-outline" size={20} />
        <Ionicons name="share-social-outline" size={20} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* --- HEADER COKELAT (Background) --- */}
      <View style={styles.headerBackground}>
        {/* Baris 1: Tombol Back & Badge */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.badge}>
            <Ionicons name="medal" size={16} color={Colors.cokelatTua.base} />
            <Text style={styles.badgeText}>Penjelajah Awal</Text>
          </View>
        </View>

        {/* Baris 2: Info User (Nama & Stats) */}
        <View style={styles.userInfoContainer}>
          {/* Placeholder kosong di kiri untuk tempat Avatar nanti */}
          <View style={{ width: 150 }} /> 

          {/* Nama & Handle */}
          <View style={{ flex: 1 }}>
            <Text style={styles.headerName}>Hi, {user?.username || "User"}!</Text>
            <Text style={styles.headerHandle}>@{user?.username?.toLowerCase() || "user"}</Text>
          </View>

          {/* Stats Teman */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsNumber}>99</Text>
            <Text style={styles.statsLabel}>Teman</Text>
          </View>
        </View>
      </View>

      {/* --- AVATAR OVERLAP (Tenggelam Setengah) --- */}
      <View style={styles.avatarWrapper}>
        <Image 
          source={{ uri: user?.photoProfile || "https://i.pravatar.cc/150" }} 
          style={styles.bigAvatar} 
        />
      </View>

      {/* --- KONTEN --- */}
      <ScrollView style={styles.content}>
        
        {/* POSTINGAN ANDA */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Postingan Anda</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/create-post')}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {myPosts.length === 0 ? (
          <Text style={{textAlign: 'center', color: '#aaa', marginTop: 20}}>Belum ada postingan.</Text>
        ) : (
          <FlatList 
            data={myPosts}
            renderItem={renderMyPost}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          />
        )}

        {/* HISTORI KUNJUNGAN */}
        <View style={[styles.sectionHeader, {marginTop: 10}]}>
          <Text style={styles.sectionTitle}>Histori Kunjungan</Text>
          <Text style={{color: Colors.cokelatTua.base}}>Lihat semua</Text>
        </View>
        
        <View style={styles.historyCard}>
          <View style={{flex: 1}}>
            <Text style={{fontWeight: 'bold'}}>Museum Wayang Jakarta</Text>
            <Text style={{fontSize: 10, color: 'gray', marginTop: 4}}>06 November 2025</Text>
          </View>
          <View style={styles.ptsBadge}><Text style={{color:'white', fontSize:10}}>21 PTS</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // HEADER STYLES
  headerBackground: {
    backgroundColor: Colors.cokelatMuda.base,
    paddingTop: 50, // Safe area
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: { 
    flexDirection: 'row', backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center', gap: 5 
  },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: Colors.cokelatTua.base },
  
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  headerHandle: {
    color: '#E0E0E0',
    fontSize: 12,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statsLabel: {
    fontSize: 12,
    color: '#E0E0E0',
  },

  // AVATAR STYLES
  avatarWrapper: {
    paddingHorizontal: 20,
    marginTop: -57,
    marginBottom: 10,
  },
  bigAvatar: {
    width: 114,
    height: 114,
    borderRadius: 60,
  },

  // CONTENT STYLES
  content: { flex: 1 },
  sectionHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15, marginTop: 10 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  addBtn: { 
    backgroundColor: Colors.cokelatTua.base, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' 
  },

  // POST CARD
  postCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 16,
    marginRight: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 3, // Shadow Android
    shadowColor: '#000', // Shadow iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tinyAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  tinyUsername: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  postImage: { width: '100%', height: 160, borderRadius: 10, marginBottom: 10, backgroundColor: '#eee' },
  postCaption: { fontSize: 13, color: '#444', marginBottom: 10, lineHeight: 18 },
  postActions: { flexDirection: 'row', gap: 16, justifyContent: 'flex-end', paddingRight: 5 },

  // HISTORY CARD
  historyCard: {
    flexDirection: 'row', marginHorizontal: 20, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#eee', alignItems: 'center', marginBottom: 30, backgroundColor: '#fafafa'
  },
  ptsBadge: { backgroundColor: '#555', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }
});