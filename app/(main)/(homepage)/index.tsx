import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 1. Tambahkan doc dan getDoc untuk ambil data user spesifik
import { useAchievements } from '@/hooks/useAchievements';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Colors } from '../../../constants/Colors';
import { auth, db } from '../../../firebaseConfig.js'; // Pastikan auth diimport

export default function Homepage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { recordShare } = useAchievements();
  // 2. State untuk menyimpan nama user
  const [username, setUsername] = useState('');

  useEffect(() => {
      // A. Ambil Data User yang sedang Login
      const fetchUserData = async () => {
        if (auth.currentUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
            if (userDoc.exists()) {
              setUsername(userDoc.data().username);
            }
          } catch (e) {
            console.error("Gagal ambil nama user", e);
          }
        }
      };
      fetchUserData();

      // B. Ambil Postingan (Logika lama Anda)
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPosts(data);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });

      return () => unsubscribe();
  }, []);

  // Komponen Kartu Postingan (Sesuai Desain)
  const handleShare = async (item: any) => {
    try {
      const result = await Share.share({
        message: `${item.caption}\nLokasi: ${item.location}`,
      });
      if (result.action === Share.sharedAction) {
        recordShare();
      }
    } catch {
      Alert.alert('Gagal membagikan', 'Coba lagi beberapa saat lagi.');
    }
  };
  // 3. Komponen Header (Lokomotif) - Sesuai Gambar Referensi
  const renderHeader = () => (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeTitle}>Hi, {username || "Penjelajah"}!</Text>
      <Text style={styles.welcomeSubtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.userPhoto }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.subInfo}>
             {item.location} • {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : "Baru saja"}
          </Text>
        </View>
      </View>

      <Image source={{ uri: item.imageURL }} style={styles.postImage} resizeMode="cover" />

      <View style={styles.cardBody}>
        <Text style={styles.caption} numberOfLines={3}>
          {item.caption}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="heart-outline" size={24} color="black" />
          <Text style={styles.actionText}>{item.likes || 0}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={22} color="black" />
          <Text style={styles.actionText}>{item.comments || 0}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(item)}>
          <Ionicons name="share-social-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container]}>
      
      {loading ? (
        <ActivityIndicator size="large" color={Colors.cokelatTua.base} style={{marginTop: 50}}/>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderHeader} 
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
    backgroundColor: '#F5F5F5', 
  },
  // 5. Styling baru untuk bagian "Hi, Aldo!" agar sesuai gambar
  welcomeContainer: {
    paddingHorizontal: 20,
    marginTop: 20, // Jarak dari header atas
    marginBottom: 5, // Jarak ke kartu postingan pertama
  },
  welcomeTitle: {
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
    textAlign: 'left',
  },
  // ... Style kartu di bawah ini JANGAN DIUBAH (Sesuai permintaan)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.cokelatTua.base,
    height: 60,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  headerAvatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white'
  },
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
    justifyContent: 'flex-end',
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
