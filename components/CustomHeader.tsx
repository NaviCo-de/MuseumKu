import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { Colors } from '@/constants/Colors';
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
    setMenuVisible(false);
    router.push('/profile'); 
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Kiri: Foto Profil (Dibungkus View fixed width agar seimbang) */}
        <View style={styles.sideContainerLeft}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100' }} 
            style={styles.profileImage} 
          />
        </View>
        
        {/* Tengah: Logo (Flex 1 agar mengisi ruang & rata tengah absolut) */}
        <Text style={styles.headerTitle}>MuseumKu</Text>
        
        {/* Kanan: Tombol Menu (Dibungkus View fixed width sama dengan kiri) */}
        <View style={styles.sideContainerRight}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Text style={styles.menuIcon}>⋮</Text> 
          </TouchableOpacity>
        </View>
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
    backgroundColor: Colors.cokelatMuda.base,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 10,
  },
  // Container Kiri & Kanan harus punya width sama biar tengahnya presisi
  sideContainerLeft: {
    width: 40, 
    alignItems: 'flex-start',
  },
  sideContainerRight: {
    width: 40, 
    alignItems: 'flex-end',
  },
  profileImage: {
    width: 40, 
    height: 40, 
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 30, // UPDATE: Font size jadi 30
    fontWeight: 'bold', 
    color: '#fff', 
    fontFamily: 'serif',
    flex: 1, // UPDATE: Mengisi ruang kosong
    textAlign: 'center', // UPDATE: Memastikan teks di tengah container
  },
  menuIcon: {
    fontSize: 24, 
    color: '#fff', 
    fontWeight: 'bold'
  },
  // Style Modal
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