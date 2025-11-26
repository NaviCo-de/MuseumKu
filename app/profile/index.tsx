import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { db, auth } from '@/firebaseConfig'; // Pastikan path sesuai
import { collection, query, where, onSnapshot, doc, getDoc, orderBy } from 'firebase/firestore';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useAchievements } from '@/hooks/useAchievements';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { achievements } = useAchievements();
  
  // 1. State yang sudah ada (Teman)
  const [friendCount, setFriendCount] = useState(0);
  // 2. State BARU (History Kunjungan)
  const [visits, setVisits] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const myUid = auth.currentUser.uid;

    // A. Ambil Data Profil
    const fetchProfile = async () => {
      const uDoc = await getDoc(doc(db, "users", myUid));
      if (uDoc.exists()) setUser(uDoc.data());
    };
    fetchProfile();

    // B. Ambil Postingan (Realtime)
    const q = query(
      collection(db, "posts"), 
      where("userId", "==", myUid),
      orderBy("createdAt", "desc") 
    );

    const unsubPosts = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMyPosts(data);
      setLoading(false);
    }, (error) => {
      console.error("Error posts:", error);
      setLoading(false);
    });

    // C. Hitung Jumlah Teman (Realtime) - LOGIC ANDA TETAP
    const unsubFriends = onSnapshot(collection(db, "users", myUid, "friends"), (snapshot) => {
      setFriendCount(snapshot.size);
    });

    // D. Ambil History Kunjungan (LOGIC BARU)
    const qVisits = query(
      collection(db, "users", myUid, "visits"),
      orderBy("visitedAt", "desc")
    );
    const unsubVisits = onSnapshot(qVisits, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setVisits(data);
    });

    return () => {
      unsubPosts();
      unsubFriends();
      unsubVisits(); // Cleanup listener baru
    };
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

  const medalColors = ['#CD7F32', '#C0C0C0', '#D4AF37'];
  const medalLabels = ['Bronze', 'Silver', 'Gold'];

  const displayedMedals = useMemo(() => {
    const claimed = achievements
      .filter(item => item.isClaimed)
      .sort((a, b) => (b.stageTier ?? -1) - (a.stageTier ?? -1))
      .slice(0, 3);

    if (claimed.length === 3) return claimed;

    const placeholders = Array.from({ length: 3 - claimed.length }).map((_, idx) => ({
      id: `placeholder-${idx}`,
      title: 'Belum dimiliki',
      stageTier: -1,
      isPlaceholder: true,
    }));

    return [...claimed, ...placeholders];
  }, [achievements]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.headerBackground}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.badge}>
            <Ionicons name="medal" size={16} color={Colors.cokelatTua.base} />
            <Text style={styles.badgeText}>Penjelajah Awal</Text>
          </View>
        </View>

        <View style={styles.userInfoContainer}>
          <View style={{ width: 150 }} /> 
          <View style={{ flex: 1 }}>
            <Text style={styles.headerName}>Hi, {user?.username || "User"}!</Text>
            <Text style={styles.headerHandle}>@{user?.username?.toLowerCase() || "user"}</Text>
          </View>
          <View style={styles.statsContainer}>
            {/* Logic Teman Tetap Ada */}
            <Text style={styles.statsNumber}>{friendCount}</Text>
            <Text style={styles.statsLabel}>Teman</Text>
          </View>
        </View>
      </View>

      <View style={styles.avatarWrapper}>
        <Image 
          source={{ uri: user?.photoProfile || "https://i.pravatar.cc/150" }} 
          style={styles.bigAvatar} 
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Postingan Anda</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/create-post')}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.cokelatTua.base} style={{marginTop: 20}} />
        ) : myPosts.length === 0 ? (
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

        {/* --- BAGIAN INI YANG DIUBAH (DARI HARDCODE KE DINAMIS) --- */}
        <View style={[styles.sectionHeader, {marginTop: 10}]}>
          <Text style={styles.sectionTitle}>Histori Kunjungan</Text>
          <Text style={{color: Colors.cokelatTua.base}}>Lihat semua</Text>
        </View>
        
        {visits.length === 0 ? (
           <Text style={{textAlign: 'center', color: '#aaa', marginTop: 10, marginBottom: 30}}>Belum ada riwayat kunjungan.</Text>
        ) : (
           visits.map((visit) => (
             <View key={visit.id} style={styles.historyCard}>
               <View style={{flex: 1}}>
                 <Text style={{fontWeight: 'bold'}}>{visit.museumName}</Text>
                 <Text style={{fontSize: 10, color: 'gray', marginTop: 4}}>
                    {visit.visitedAt?.seconds ? new Date(visit.visitedAt.seconds * 1000).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    }) : 'Baru saja'}
                 </Text>
               </View>
               <View style={styles.ptsBadge}>
                   <Text style={{color:'white', fontSize:10}}>{visit.points} PTS</Text>
               </View>
             </View>
           ))
        )}
        {/* --------------------------------------------------------- */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medali Kamu</Text>
          <TouchableOpacity onPress={() => router.push('/(main)/(achievement)/medals')}>
            <Text style={{color: Colors.cokelatTua.base}}>Lihat semua</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingBottom: 12 }}
        >
          {displayedMedals.map(item => {
            const isPlaceholder = (item as any).isPlaceholder;
            const tier = item.stageTier ?? -1;
            const owned = !isPlaceholder;
            const medalColor = owned ? (tier >= 0 ? medalColors[tier] : Colors.cokelatTua.base) : Colors.neutral[60];
            const medalLabel = owned ? (tier >= 0 ? medalLabels[tier] : 'Sudah diklaim') : 'Belum dimiliki';
            return (
              <View key={item.id} style={[styles.medalCard, isPlaceholder && styles.medalCardDisabled]}>
                <Ionicons name="medal" size={28} color={medalColor} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.medalTitle}>{isPlaceholder ? 'Medal kosong' : item.title}</Text>
                  <Text style={styles.medalSubtitle}>{medalLabel}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        
        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
}

// Styles tetap sama persis dengan punya Anda
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: {
    backgroundColor: Colors.cokelatMuda.base,
    paddingTop: 50, 
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
  userInfoContainer: { flexDirection: 'row', alignItems: 'center' },
  headerName: { fontSize: 30, fontWeight: 'bold', color: 'white' },
  headerHandle: { color: '#E0E0E0', fontSize: 12 },
  statsContainer: { alignItems: 'center' },
  statsNumber: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  statsLabel: { fontSize: 12, color: '#E0E0E0' },
  avatarWrapper: { paddingHorizontal: 20, marginTop: -57, marginBottom: 10 },
  bigAvatar: { width: 114, height: 114, borderRadius: 57, borderWidth: 4, borderColor: '#FFF' }, // Ditambah border putih biar rapi
  content: { flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  addBtn: { backgroundColor: Colors.cokelatTua.base, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  medalCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#f0f0f0', minWidth: 200, gap: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  medalCardDisabled: { opacity: 0.5 },
  medalTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  medalSubtitle: { fontSize: 12, color: '#666' },
  postCard: { width: 280, backgroundColor: 'white', borderRadius: 16, marginRight: 15, padding: 12, borderWidth: 1, borderColor: '#f0f0f0', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tinyAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  tinyUsername: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  postImage: { width: '100%', height: 160, borderRadius: 10, marginBottom: 10, backgroundColor: '#eee' },
  postCaption: { fontSize: 13, color: '#444', marginBottom: 10, lineHeight: 18 },
  postActions: { flexDirection: 'row', gap: 16, justifyContent: 'flex-end', paddingRight: 5 },
  historyCard: { flexDirection: 'row', marginHorizontal: 20, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#eee', alignItems: 'center', marginBottom: 10, backgroundColor: '#fafafa' },
  ptsBadge: { backgroundColor: '#555', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }
});
