import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
  ScrollView,
  Modal
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MUSEUMS } from '@/constants/data'; 

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  
  // --- STATE UNTUK MODAL ---
  const [showTncModal, setShowTncModal] = useState(false); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  const museum = MUSEUMS.find(m => m.id === id);

  useEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => {
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
    if (!selectedPayment) {
      alert("Silakan pilih metode pembayaran terlebih dahulu.");
      return;
    }
    if (!isChecked) {
      alert("Harap setujui Syarat & Ketentuan terlebih dahulu.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const handleStartJourney = () => {
    setShowSuccessModal(false);
    router.replace(`/(main)/(jelajah-museum)/${id}/journey`);
  };

  if (!museum) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beli Tiket</Text>
        <View style={{width: 28}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image source={{ uri: museum.image }} style={styles.cardImage} />
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

        <View style={styles.paymentSection}>
          <View style={styles.paymentTextContainer}>
            <Text style={styles.paymentLabel}>Pembayaran</Text>
            <Text style={styles.paymentSubLabel}>Pilih Metode Pembayaran</Text>
          </View>

          <View style={styles.paymentIcons}>
            <TouchableOpacity 
                style={[styles.iconBtn, { backgroundColor: '#4FC3F7' }, selectedPayment === 'Wallet' && styles.selectedBorder]}
                onPress={() => setSelectedPayment('Wallet')}
            >
               <Ionicons name="wallet" size={24} color="#FFF" />
               {selectedPayment === 'Wallet' && <View style={styles.checkBadge}><Ionicons name="checkmark" size={12} color="white" /></View>}
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.iconBtn, { backgroundColor: '#7E57C2' }, selectedPayment === 'OVO' && styles.selectedBorder]}
                onPress={() => setSelectedPayment('OVO')}
            >
               <Ionicons name="radio-button-on" size={24} color="#FFF" />
               {selectedPayment === 'OVO' && <View style={styles.checkBadge}><Ionicons name="checkmark" size={12} color="white" /></View>}
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.othersBtn, selectedPayment === 'Others' && styles.selectedBorder]}
                onPress={() => setSelectedPayment('Others')}
            >
               <Text style={styles.othersText}>Others</Text>
               {selectedPayment === 'Others' && <View style={styles.checkBadge}><Ionicons name="checkmark" size={12} color="white" /></View>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.checkboxRow}>
          <TouchableOpacity 
            style={[styles.checkbox, isChecked && styles.checkboxChecked]} 
            onPress={() => setIsChecked(!isChecked)}
          >
            {isChecked && <Ionicons name="checkmark" size={14} color="#5D4037" />}
          </TouchableOpacity>
          <Text style={styles.tncText}>
            Saya telah membaca dan menyetujui{' '}
            <Text style={styles.boldLink} onPress={() => setShowTncModal(true)}>
              Syarat & Ketentuan
            </Text>{' '}
            Pemesanan Tiket Melalui MuseumKu
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.buyButton, { opacity: (isChecked && selectedPayment) ? 1 : 0.5 }]} 
          onPress={handlePayment}
          disabled={loading} 
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buyButtonText}>Buy Now</Text>}
        </TouchableOpacity>
      </View>

      {/* MODAL TNC */}
      <Modal visible={showTncModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentTnc}>
            <Text style={styles.modalTitle}>Syarat & Ketentuan</Text>
            <ScrollView style={{maxHeight: 300, marginVertical: 10}}>
              <Text style={styles.tncBody}>
                1. Tiket yang sudah dibeli tidak dapat dikembalikan.{'\n'}
                2. Jaga kebersihan museum.{'\n'}
                3. Dilarang membawa makanan/minuman.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.primaryButtonModal} onPress={() => setShowTncModal(false)}>
              <Text style={styles.primaryButtonText}>Saya Mengerti</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL SUKSES */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeader}>Pembelian Berhasil!</Text>
            <Text style={styles.modalDesc}>Sudah siap menjelajahi {museum.name}?</Text>
            <TouchableOpacity style={styles.primaryButtonModal} onPress={handleStartJourney}>
              <Text style={styles.primaryButtonText}>Mulai Sekarang</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButtonModal} onPress={() => setShowSuccessModal(false)}>
              <Text style={styles.secondaryButtonText}>Nanti Saja</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFBFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  scrollContent: { paddingHorizontal: 20 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 12, marginBottom: 40, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  cardImage: { width: 100, height: 100, borderRadius: 12, marginRight: 12, backgroundColor: '#EEE' },
  cardInfo: { flex: 1, justifyContent: 'space-between' },
  museumName: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  address: { fontSize: 11, color: '#666', lineHeight: 14 },
  priceContainer: { alignItems: 'flex-end', marginTop: 8 },
  totalLabel: { fontSize: 10, color: '#666' },
  priceValue: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  paymentSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  paymentTextContainer: { flex: 1 },
  paymentLabel: { fontSize: 14, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  paymentSubLabel: { fontSize: 12, color: '#666' },
  paymentIcons: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  othersBtn: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE' },
  othersText: { fontSize: 12, color: '#000' },
  selectedBorder: { borderWidth: 3, borderColor: '#5D4037' },
  checkBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: '#5D4037', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  footer: { padding: 20, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#FFF' },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  checkbox: { width: 20, height: 20, borderWidth: 1.5, borderColor: '#666', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  checkboxChecked: { borderColor: '#5D4037' },
  tncText: { flex: 1, fontSize: 12, color: '#444', lineHeight: 18 },
  boldLink: { fontWeight: 'bold', color: '#8D2424', textDecorationLine: 'underline' },
  buyButton: { backgroundColor: '#4E342E', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  buyButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContentTnc: { width: '85%', backgroundColor: '#FFF', borderRadius: 20, padding: 25, elevation: 5 },
  tncBody: { fontSize: 14, color: '#333', lineHeight: 22 },
  modalCard: { width: '80%', backgroundColor: '#FFF', borderRadius: 24, padding: 25, alignItems: 'center', elevation: 10 },
  modalHeader: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#000', marginBottom: 10 },
  modalDesc: { fontSize: 14, textAlign: 'center', color: '#000', marginBottom: 25, lineHeight: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#5D4037', marginBottom: 10, textAlign: 'center' },
  primaryButtonModal: { backgroundColor: '#4E342E', width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  primaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  secondaryButtonModal: { backgroundColor: '#8D5B4C', width: '60%', paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
  secondaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});