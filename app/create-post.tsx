import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Sesuaikan path
import { uploadToCloudinary } from '../utils/cloudinaryHelper'; // Helper yang kita buat tadi
import { Colors } from '../constants/Colors';

export default function CreatePostScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // 1. Ambil data user yang sedang login (biar ketauan siapa yang posting)
  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchUser();
  }, []);

  // 2. Fungsi Buka Galeri
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.5, // Kompres biar upload cepet
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 3. Fungsi Submit Utama
  const handlePost = async () => {
    if (!imageUri) return Alert.alert("Error", "Wajib pakai foto dong!");
    if (!caption) return Alert.alert("Error", "Caption jangan kosong.");

    setLoading(true);
    try {
      // A. Upload Gambar ke Cloudinary
      const cloudUrl = await uploadToCloudinary(imageUri);
      if (!cloudUrl) throw new Error("Gagal upload gambar");

      // B. Simpan ke Firestore
      await addDoc(collection(db, "posts"), {
        userId: auth.currentUser?.uid,
        username: userData?.username || "Anonymous",
        userPhoto: userData?.photoProfile || "https://i.pravatar.cc/150", // Fallback image
        imageURL: cloudUrl, // Link dari Cloudinary
        location: location || "Unknown Location",
        caption: caption,
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: Timestamp.now()
      });

      Alert.alert("Sukses", "Postingan berhasil dibuat!");
      router.back(); // Kembali ke halaman sebelumnya

    } catch (error: any) {
      Alert.alert("Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Simple */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.cokelatTua.base} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Postingan</Text>
        <View style={{width: 24}} /> 
      </View>

      <View style={styles.content}>
        {/* User Info Kecil */}
        <View style={styles.userInfo}>
          <Image source={{ uri: userData?.photoProfile || "https://i.pravatar.cc/150" }} style={styles.smallAvatar} />
          <Text style={styles.username}>{userData?.username || "Loading..."}</Text>
        </View>

        {/* Upload Area */}
        <TouchableOpacity onPress={pickImage} style={styles.uploadArea}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="add" size={40} color="#aaa" />
              <Text style={{color: '#aaa'}}>Upload Foto/Video</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Inputs */}
        <Text style={styles.label}>Lokasi</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Di mana foto ini diambil?" 
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Caption</Text>
        <TextInput 
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
          placeholder="Ceritakan pengalamanmu..." 
          multiline 
          value={caption}
          onChangeText={setCaption}
        />

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handlePost}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Post</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.cokelatTua.base },
  content: { padding: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  smallAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 10, backgroundColor: '#ddd' },
  username: { fontWeight: 'bold' },
  uploadArea: { width: '100%', height: 200, backgroundColor: '#F2F2F2', borderRadius: 10, marginBottom: 20, overflow: 'hidden' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15, backgroundColor: '#fff' },
  submitBtn: { backgroundColor: Colors.cokelatTua.base, padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});