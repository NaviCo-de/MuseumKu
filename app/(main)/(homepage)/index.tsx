import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import { collection, getDocs, orderBy, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { Colors } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons'; // Icon Love, Comment, Share
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { seedDatabase } from '@/utils/seeder';

export default function Homepage() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data saat layar dibuka
  useEffect(() => {
      // 1. Buat Query
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

      // 2. Pasang "CCTV" (Realtime Listener)
      // onSnapshot akan jalan PERTAMA KALI, dan SETIAP KALI ada perubahan di database
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPosts(data);
        setLoading(false); // Matikan loading setelah data pertama didapat
      }, (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });

      // 3. Cabut CCTV saat halaman dihancurkan (Cleanup function)
      return () => unsubscribe();
  }, []);

  // Komponen Kartu Postingan (Sesuai Desain)
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* Header Post: Foto User, Nama, Lokasi/Tanggal */}
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.userPhoto }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.subInfo}>
             {item.location} • {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Gambar Postingan */}
      <Image source={{ uri: item.imageURL }} style={styles.postImage} resizeMode="cover" />

      {/* Caption */}
      <View style={styles.cardBody}>
        <Text style={styles.caption} numberOfLines={3}>
          {item.caption}
        </Text>
      </View>

      {/* Action Buttons (Like, Comment, Share) */}
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="heart-outline" size={24} color="black" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={22} color="black" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text>Hi, </Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.cokelatTua.base} style={{marginTop: 50}}/>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Background abu muda biar kartu menonjol
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.cokelatTua.base, // Cokelat header
    height: 60,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif', // Biar mirip font "MuseumKu"
  },
  headerAvatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white'
  },
  // Style Kartu Post
  card: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ddd'
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  subInfo: {
    fontSize: 10,
    color: 'gray',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#eee'
  },
  cardBody: {
    marginBottom: 10,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    color: '#333',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Icon di kanan sesuai desain
    gap: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  actionText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500'
  }
});