import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Platform,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; 
import { MUSEUMS } from '@/constants/data'; 

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // State untuk Checkbox
  const museum = MUSEUMS.find(m => m.id === id);

  // --- LOGIKA HIDE NAVBAR ---
  // Menyembunyikan Tab Bar saat halaman ini aktif, dan memunculkan lagi saat keluar
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' }
    });
    return () => {
      // Kembalikan Tab Bar saat user menekan Back
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 65, 
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          backgroundColor: '#FCFBFA',
          display: 'flex'
        }
      });
    };
  }, [navigation]);

  const handlePayment = () => {
    if (!isChecked) {
      Alert.alert("Penting", "Harap setujui Syarat & Ketentuan terlebih dahulu.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Pembayaran Berhasil!", 
        "Tiket Anda telah terbit.", 
        [
          { 
            text: "Mulai Jelajah", 
            onPress: () => router.replace(`/(main)/(jelajah-museum)/${id}/journey`) 
          }
        ]
      );
    }, 1000);
  };

  if (!museum) return null;

  return (
    <View style={styles.container}>
      
      {/* Header Sederhana (Back + Title) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beli Tiket</Text>
        <View style={{width: 28}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* CARD TIKET */}
        <View style={styles.card}>
          {/* Gambar Kiri */}
          <Image source={{ uri: museum.image }} style={styles.cardImage} />
          
          {/* Info Kanan */}
          <View style={styles.cardInfo}>
            <View>
              <Text style={styles.museumName}>{museum.name}</Text>
              <Text style={styles.address} numberOfLines={3}>{museum.address}</Text>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.priceValue}>Rp {museum.price.toLocaleString('id-ID')}</Text>
            </View>
          </View>
        </View>

        {/* METODE PEMBAYARAN */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentTextContainer}>
            <Text style={styles.paymentLabel}>Pembayaran</Text>
            <Text style={styles.paymentSubLabel}>Pilih Metode Pembayaran</Text>
          </View>

          <View style={styles.paymentIcons}>
            {/* Icon Wallet Biru */}
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#4FC3F7' }]}>
               <Ionicons name="wallet" size={24} color="#FFF" />
            </TouchableOpacity>
            
            {/* Icon Lingkaran Ungu */}
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#7E57C2' }]}>
               <Ionicons name="radio-button-on" size={24} color="#FFF" />
            </TouchableOpacity>

            {/* Tombol Others */}
            <TouchableOpacity style={styles.othersBtn}>
               <Text style={styles.othersText}>Others</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* FOOTER (Checkbox & Button) */}
      <View style={styles.footer}>
        
        {/* Checkbox Row */}
        <View style={styles.checkboxRow}>
          <TouchableOpacity 
            style={[styles.checkbox, isChecked && styles.checkboxChecked]} 
            onPress={() => setIsChecked(!isChecked)}
          >
            {isChecked && <Ionicons name="checkmark" size={14} color="#5D4037" />}
          </TouchableOpacity>
          <Text style={styles.tncText}>
            Saya telah membaca dan menyetujui <Text style={styles.boldLink}>Syarat & Ketentuan</Text> Pemesanan Tiket Melalui MuseumKu
          </Text>
        </View>

        {/* Tombol Buy Now */}
        <TouchableOpacity 
          style={[styles.buyButton, { opacity: isChecked ? 1 : 0.5 }]} 
          onPress={handlePayment}
          disabled={loading} // Disable kalau belum centang atau sedang loading
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buyButtonText}>Buy Now</Text>
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFBFA' }, // Background putih agak krem dikit
  
  // HEADER
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 50, // Safe Area manual
    paddingBottom: 20 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },

  // SCROLL CONTENT
  scrollContent: { paddingHorizontal: 20 },

  // CARD STYLE
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 40,
    // Shadow
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#EEE'
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between'
  },
  museumName: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  address: { fontSize: 11, color: '#666', lineHeight: 14 },
  priceContainer: { alignItems: 'flex-end', marginTop: 8 },
  totalLabel: { fontSize: 10, color: '#666' },
  priceValue: { fontSize: 16, fontWeight: 'bold', color: '#000' },

  // PAYMENT METHODS
  paymentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  paymentTextContainer: { flex: 1 },
  paymentLabel: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  paymentSubLabel: { fontSize: 12, color: '#666' },
  
  paymentIcons: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center'
  },
  othersBtn: {
    paddingHorizontal: 15, paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE'
  },
  othersText: { fontSize: 12, color: '#000' },

  // FOOTER
  footer: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF'
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  checkbox: {
    width: 20, height: 20,
    borderWidth: 1.5, borderColor: '#666', borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 2
  },
  checkboxChecked: { borderColor: '#5D4037' },
  tncText: { flex: 1, fontSize: 12, color: '#444', lineHeight: 18 },
  boldLink: { fontWeight: 'bold', color: '#8D2424' }, // Warna merah marun dikit

  buyButton: {
    backgroundColor: '#4E342E', // Coklat tua sesuai tombol Buy Now
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});