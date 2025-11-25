import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { db, auth } from '../../firebaseConfig'; 
import { collection, query, where, onSnapshot, doc, getDoc, setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OtherUserProfileScreen() {
  const { uid } = useLocalSearchParams(); 
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const targetUid = Array.isArray(uid) ? uid[0] : uid;

  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [friendLoading, setFriendLoading] = useState(false);

  useEffect(() => {
    if (!targetUid) return;

    const fetchUser = async () => {
      try {
        const uDoc = await getDoc(doc(db, "users", targetUid));
        if (uDoc.exists()) setUser(uDoc.data());
      } catch (e) { console.error(e); }
    };

    let unsubFriend = () => {};
    if (auth.currentUser) {
       const friendRef = doc(db, "users", auth.currentUser.uid, "friends", targetUid);
       unsubFriend = onSnapshot(friendRef, (doc) => {
          setIsFriend(doc.exists());
       });
    }

    const q = query(
      collection(db, "posts"), 
      where("userId", "==", targetUid),
      orderBy("createdAt", "desc")
    );

    const unsubPosts = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPosts(data);
      setLoading(false);
    }, (err) => {
        console.log("Index error?", err);
        setLoading(false);
    });

    fetchUser();

    return () => {
      unsubPosts();
      unsubFriend();
    };
  }, [targetUid]);

  const handleToggleFriend = async () => {
    if (!auth.currentUser || !user) return;
    setFriendLoading(true);

    try {
      const myUid = auth.currentUser.uid;
      const friendRef = doc(db, "users", myUid, "friends", targetUid);

      if (isFriend) {
        await deleteDoc(friendRef);
      } else {
        await setDoc(friendRef, {
          addedAt: new Date(),
          username: user.username,
          photoProfile: user.photoProfile
        });
      }
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan koneksi.");
    } finally {
      setFriendLoading(false);
    }
  };

  const renderPost = ({ item }: { item: any }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.userPhoto }} style={styles.tinyAvatar} />
        <Text style={styles.tinyUsername}>{item.username}</Text>
      </View>
      <Image source={{ uri: item.imageURL }} style={styles.postImage} />
      <Text style={styles.postCaption} numberOfLines={2}>{item.caption}</Text>
      
      <View style={styles.postActions}>
        <Ionicons name="heart-outline" size={20} color="#555" />
        <Ionicons name="chatbubble-outline" size={20} color="#555" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerBackground}>
        <View style={[styles.headerTop, { marginTop: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          
          <View style={styles.badge}>
            <Ionicons name="medal" size={16} color={Colors.cokelatTua.base} />
            <Text style={styles.badgeText}>Penjelajah</Text>
          </View>
        </View>

        <View style={styles.userInfoContainer}>
          {/* Spacer untuk Avatar (Tanpa Komentar Inline) */}
          <View style={{ width: 150 }} />
          
          <View style={{ flex: 1 }}>
            <Text style={styles.headerName}>{user?.username || "User"}</Text>
            <Text style={styles.headerHandle}>@{user?.username?.toLowerCase().replace(/\s/g, '')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.avatarWrapper}>
        <Image 
          source={{ uri: user?.photoProfile || "https://i.pravatar.cc/150" }} 
          style={styles.bigAvatar} 
        />
      </View>

      <ScrollView style={styles.content}>
        
        {/* TOMBOL ADD FRIEND */}
        <View style={{ alignItems: 'flex-end', paddingHorizontal: 20, marginTop: -45, marginBottom: 20 }}>
           <TouchableOpacity 
              style={[styles.actionBtn, isFriend ? styles.btnAdded : styles.btnAdd]}
              onPress={handleToggleFriend}
              disabled={friendLoading}
           >
              {friendLoading ? (
                <ActivityIndicator color={isFriend ? "black" : "white"} size="small" />
              ) : (
                <>
                  <Ionicons 
                    name={isFriend ? "checkmark" : "person-add"} 
                    size={18} 
                    color={isFriend ? "#333" : "white"} 
                  />
                  <Text style={[styles.btnText, isFriend && {color: '#333'}]}>
                    {isFriend ? "Teman" : "Add Friend"}
                  </Text>
                </>
              )}
           </TouchableOpacity>
        </View>

        {/* SECTION POSTINGAN */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Postingan {user?.username}</Text>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color={Colors.cokelatTua.base} />
        ) : userPosts.length === 0 ? (
          <Text style={{textAlign: 'center', color: '#aaa', marginTop: 20}}>Belum ada postingan.</Text>
        ) : (
          <FlatList 
            data={userPosts}
            renderItem={renderPost}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          />
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: {
    backgroundColor: Colors.cokelatMuda.base,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 
  },
  badge: { 
    flexDirection: 'row', backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center', gap: 5 
  },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: Colors.cokelatTua.base },
  userInfoContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  headerName: { fontSize: 30, fontWeight: 'bold', color: 'white' },
  headerHandle: { color: '#E0E0E0', fontSize: 12 },
  avatarWrapper: { paddingHorizontal: 20, marginTop: -57, marginBottom: 10 },
  bigAvatar: { 
    width: 114, height: 114, borderRadius: 57, 
  },
  content: { flex: 1 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, elevation: 2
  },
  btnAdd: { backgroundColor: Colors.cokelatTua.base },
  btnAdded: { backgroundColor: '#E0E0E0', borderWidth: 1, borderColor: '#ccc' },
  btnText: { fontWeight: 'bold', color: 'white', fontSize: 14 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  postCard: {
    width: 260, backgroundColor: 'white', borderRadius: 12,
    marginRight: 15, padding: 12, borderWidth: 1, borderColor: '#eee',
    elevation: 2
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tinyAvatar: { width: 24, height: 24, borderRadius: 12, marginRight: 8, backgroundColor:'#ddd' },
  tinyUsername: { fontSize: 12, fontWeight: 'bold', color:'#333' },
  postImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 8, backgroundColor: '#eee' },
  postCaption: { fontSize: 12, color: '#333', marginBottom: 8 },
  postActions: { flexDirection: 'row', gap: 15, justifyContent: 'flex-end' }
});