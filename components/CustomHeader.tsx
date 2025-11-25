// components/CustomHeader.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

export default function CustomHeader() {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuVisible(false);
    } catch (error: any) {
      Alert.alert("Gagal Logout", error.message);
    }
  };

  const handleToProfile = () => {
    setMenuVisible(false); // Tutup menu dulu
    
    // Arahkan ke file profile kamu.
    // Berdasarkan gambar: app/(main)/(homepage)/profile/index.tsx
    // Maka rutenya adalah:
    router.push('/(main)/(homepage)/profile'); 
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Kiri: Foto Profil */}
        <Image 
          source={{ uri: 'https://i.pravatar.cc/100' }} 
          style={styles.profileImage} 
        />
        
        {/* Tengah: Logo */}
        <Text style={styles.headerTitle}>MuseumKu</Text>
        
        {/* Kanan: Tombol Menu */}
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuIcon}>⋮</Text> 
        </TouchableOpacity>
      </View>

      {/* MODAL MENU */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuBox}>
            <Text style={styles.menuLabel}>◈ Isi Menu</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleToProfile}>
              <Text style={styles.menuText}>Akun Saya</Text>
              <Text>👤</Text> 
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuText}>Keluar</Text>
              <Text>🚪</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.cokelatTua.base, // Warna background Header
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 10,
  },
  profileImage: {
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: '#fff'
  },
  headerTitle: {
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
    fontFamily: 'serif'
  },
  menuIcon: {
    fontSize: 24, 
    color: '#fff', 
    fontWeight: 'bold'
  },
  // Style Modal (Sama seperti sebelumnya)
  modalOverlay: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  menuBox: {
    position: 'absolute', 
    top: 60, 
    right: 20, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 15, 
    width: 200, 
    elevation: 5
  },
  menuLabel: {
    color: Colors.red[50], 
    fontWeight: 'bold', 
    marginBottom: 10
  },
  menuItem: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0'
  },
  menuText: { fontSize: 16, color: '#333' }
});