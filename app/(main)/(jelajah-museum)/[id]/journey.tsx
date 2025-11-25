import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import MapView, { Overlay, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import QRCode from 'react-native-qrcode-svg';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; 
import { MUSEUMS } from '@/constants/data';

// Style Peta Putih Bersih
const BLANK_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "elementType": "labels", "stylers": [{ "visibility": "off" }] },
  { "featureType": "administrative", "stylers": [{ "visibility": "off" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "road", "stylers": [{ "visibility": "off" }] },
  { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "stylers": [{ "color": "#e9e9e9" }] }
];

export default function JourneyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const museum = MUSEUMS.find(m => m.id === id);

  const [showQR, setShowQR] = useState(false); 
  const [showPauseModal, setShowPauseModal] = useState(false); // Modal Konfirmasi Keluar
  
  // --- LOGIC CHECKPOINT ---
  const [currentStep, setCurrentStep] = useState(0); 
  
  const totalStep = museum?.checkpoints.length || 0;
  const isFinished = currentStep >= totalStep;

  const currentTargetName = !isFinished 
    ? museum?.checkpoints[currentStep]?.name 
    : "Semua Checkpoint Selesai!";

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') Alert.alert('Izin Ditolak', 'Butuh izin lokasi.');
    })();
  }, []);

  const handleScanSuccess = () => {
    setShowQR(false);
    if (currentStep < totalStep - 1) {
        Alert.alert("Berhasil!", `Checkpoint ${currentStep + 1} selesai. Lanjut ke lokasi berikutnya!`);
        setCurrentStep(currentStep + 1);
    } else {
        Alert.alert("Selamat!", "Semua checkpoint telah diselesaikan!");
        setCurrentStep(currentStep + 1);
    }
  };

  const handleFinishJourney = () => {
    router.replace(`/(main)/(jelajah-museum)/${id}/completion`);
  };

  if (!museum) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Back Button Overlay -> Memicu Modal */}
      <TouchableOpacity 
        onPress={() => setShowPauseModal(true)} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* --- MAP VIEW --- */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={BLANK_MAP_STYLE}
        showsUserLocation={true} 
        showsMyLocationButton={false}
        initialRegion={{
          latitude: museum.latitude,
          longitude: museum.longitude,
          latitudeDelta: 0.0008,
          longitudeDelta: 0.0008,
        }}
      >
        <Overlay 
          image={{ uri: museum.floorPlanImage }}
          bounds={museum.overlayBounds as [[number, number], [number, number]]} 
          opacity={1.0} 
        />
        {!isFinished && (
            <Marker 
                coordinate={{
                    latitude: museum.latitude, 
                    longitude: museum.longitude 
                }}
                title={`Target: ${currentTargetName}`}
            >
                <Ionicons name="location-sharp" size={40} color={Colors.red.base} />
            </Marker>
        )}
      </MapView>

      {/* --- PANEL BAWAH --- */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
            <View style={{flex: 1}}>
                <Text style={styles.labelLokasi}>
                    {isFinished ? "Status:" : "Lokasi Target:"}
                </Text>
                <Text style={styles.lokasiValue}>{currentTargetName}</Text>
            </View>
            
            {!isFinished ? (
                <Text style={styles.progressText}>
                    {currentStep + 1}
                    <Text style={{color: '#ccc', fontSize: 24}}>/{totalStep}</Text>
                </Text>
            ) : (
                <Ionicons name="checkmark-circle" size={40} color="green" />
            )}
        </View>

        {!isFinished ? (
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowQR(true)}>
                <Ionicons name="qr-code-outline" size={24} color="#FFF" style={{marginRight: 8}} />
                <Text style={styles.buttonText}>Scan Checkpoint {currentStep + 1}</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity style={[styles.actionButton, styles.finishButton]} onPress={handleFinishJourney}>
                <Text style={styles.buttonText}>Selesai Kunjungan</Text>
                <Ionicons name="arrow-forward" size={24} color="#FFF" style={{marginLeft: 8}} />
            </TouchableOpacity>
        )}

        {!isFinished && currentStep < totalStep - 1 && (
             <Text style={styles.nextInfo}>
                Selanjutnya: {museum.checkpoints[currentStep + 1].name}
             </Text>
        )}
      </View>

      {/* --- MODAL QR CODE --- */}
      <Modal visible={showQR} transparent={true} animationType="fade" onRequestClose={() => setShowQR(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Scan Checkpoint {currentStep + 1}</Text>
                <Text style={styles.modalSubtitle}>Tunjukkan QR ini ke petugas di {currentTargetName}</Text>
                <View style={styles.qrWrapper}>
                    <QRCode value={`MUSEUM-${id}-CP-${currentStep}`} size={180} />
                </View>
                <TouchableOpacity style={styles.simulateButton} onPress={handleScanSuccess}>
                    <Text style={styles.simulateText}>[Simulasi] Petugas Scan Sukses</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowQR(false)}>
                    <Text style={styles.closeText}>Tutup</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* --- MODAL PAUSE / TUNDA KUNJUNGAN (BARU) --- */}
      <Modal visible={showPauseModal} transparent={true} animationType="fade" onRequestClose={() => setShowPauseModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.pauseModalCard}>
            <Text style={styles.pauseModalHeader}>Anda sedang dalam{'\n'}kunjungan</Text>
            <Text style={styles.pauseModalDesc}>
              Apabila ingin menunda kunjungan, <Text style={{fontWeight:'bold', color: '#5D4037'}}>Checkpoint</Text> Anda tetap akan tersimpan
            </Text>
            
            {/* Tombol Lanjutkan */}
            <TouchableOpacity 
                style={styles.primaryButtonModal} 
                onPress={() => setShowPauseModal(false)}
            >
              <Text style={styles.primaryButtonText}>Lanjutkan Kunjungan</Text>
            </TouchableOpacity>

            {/* Tombol Tunda (Keluar) */}
            <TouchableOpacity 
                style={styles.secondaryButtonModal} 
                onPress={() => {
                    setShowPauseModal(false);
                    router.back(); // Keluar dari halaman Journey
                }}
            >
              <Text style={styles.secondaryButtonText}>Tunda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  backButton: { 
    position: 'absolute', top: 50, left: 20, zIndex: 10, 
    backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 20,
    elevation: 5 
  },
  map: { width: '100%', height: '65%' }, 
  
  infoContainer: { 
    flex: 1, padding: 25, backgroundColor: '#FFF', 
    borderTopLeftRadius: 25, borderTopRightRadius: 25, 
    marginTop: -25, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  labelLokasi: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 4, textTransform: 'uppercase' },
  lokasiValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  progressText: { fontSize: 42, fontWeight: 'bold', color: Colors.cokelatTua.base }, 
  
  actionButton: { 
    backgroundColor: Colors.cokelatTua.base, 
    paddingVertical: 16, borderRadius: 16, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginBottom: 10, elevation: 4
  },
  finishButton: { backgroundColor: '#2E7D32' }, 
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  nextInfo: { textAlign: 'center', fontSize: 12, color: '#666', marginTop: 10 },

  // Modal Styles (QR)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', padding: 30, borderRadius: 20, alignItems: 'center', width: '85%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, color: Colors.cokelatTua.base },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  qrWrapper: { marginBottom: 20, padding: 15, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE', borderRadius: 10 },
  simulateButton: { marginBottom: 15, padding: 10, backgroundColor: '#E0F2F1', borderRadius: 8 },
  simulateText: { color: '#00695C', fontWeight: 'bold', fontSize: 12 },
  closeButton: { padding: 10 },
  closeText: { color: 'red', fontWeight: 'bold' },

  // Modal Styles (Pause/Tunda - Sesuai Desain)
  pauseModalCard: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  pauseModalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  pauseModalDesc: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
    marginBottom: 25,
    lineHeight: 20,
  },
  primaryButtonModal: {
    backgroundColor: '#4E342E', // Cokelat Tua
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButtonModal: {
    backgroundColor: '#8D5B4C', // Cokelat Kemerahan
    width: '60%', 
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  }
});