import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import MapView, { Overlay, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import QRCode from 'react-native-qrcode-svg';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Pastikan path ini sesuai dengan struktur foldermu
import { Colors } from '../../../constants/Colors'; 
import { MUSEUMS } from '../../../constants/data';

const { width } = Dimensions.get('window');

// Style JSON untuk menyembunyikan elemen Google Maps (Jalan, Label, dll) agar jadi putih bersih
const BLANK_MAP_STYLE = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "elementType": "labels",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "administrative",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "road",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "water",
    "stylers": [{ "color": "#e9e9e9" }]
  }
];

export default function JourneyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const museum = MUSEUMS.find(m => m.id === id);

  const [locationPermission, setLocationPermission] = useState(false);
  const [showQR, setShowQR] = useState(false); 
  
  // Progress Hardcode sesuai desain "2/3"
  // Nanti bisa dibikin dinamis berdasarkan state check-in
  const currentStep = 1; 
  const totalStep = museum?.checkpoints.length || 3;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Ditolak', 'Peta butuh izin lokasi untuk menampilkan posisi Anda.');
        return;
      }
      setLocationPermission(true);
    })();
  }, []);

  if (!museum) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
            <Text style={styles.headerTitle}>Selamat Datang</Text>
            <Text style={styles.headerSubtitle}>di {museum.name}</Text>
        </View>
        <View style={{width: 28}} /> 
      </View>

      {/* MAP AREA (Kotak Peta) */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={BLANK_MAP_STYLE} // Membuat peta jadi putih bersih
          showsUserLocation={true} 
          showsMyLocationButton={false}
          // Kamera map fokus ke area museum
          initialRegion={{
            latitude: museum.latitude,
            longitude: museum.longitude,
            latitudeDelta: 0.0008, // Zoom level sangat dekat
            longitudeDelta: 0.0008,
          }}
        >
          {/* Gambar Denah (Overlay) */}
          {/* FIX: Kita tambahkan 'as ...' di props bounds untuk memperbaiki error TypeScript */}
          <Overlay 
            image={{ uri: museum.floorPlanImage }}
            bounds={museum.overlayBounds as [[number, number], [number, number]]} 
            opacity={1.0} 
          />

          {/* Marker Pin Merah (Lokasi Target) */}
          <Marker 
            coordinate={{latitude: museum.latitude, longitude: museum.longitude}}
          >
             <Ionicons name="location-sharp" size={40} color={Colors.red.base} />
          </Marker>
        </MapView>
      </View>

      {/* INFO AREA (Bawah) */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
            <View>
                <Text style={styles.labelLokasi}>Lokasi Anda Sekarang:</Text>
                <Text style={styles.lokasiValue}>Ruang Tarumanegara</Text>
            </View>
            <Text style={styles.progressText}>
                {currentStep + 1}<Text style={{color: '#ccc', fontSize: 24}}>/{totalStep}</Text>
            </Text>
        </View>

        {/* TOMBOL CHECKPOINT (QR) */}
        <TouchableOpacity 
            style={styles.checkpointButton} 
            onPress={() => setShowQR(true)}
        >
            <Text style={styles.buttonText}>Checkpoint</Text>
        </TouchableOpacity>

        <Text style={styles.nextInfo}>Checkpoint berikutnya:{"\n"}Ruang Jayakarta</Text>
      </View>

      {/* MODAL QR CODE */}
      <Modal
        visible={showQR}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQR(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Scan Checkpoint</Text>
                <View style={styles.qrWrapper}>
                    <QRCode value={`MUSEUM-${id}-CP-${currentStep}`} size={180} />
                </View>
                <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setShowQR(false)}
                >
                    <Text style={styles.closeText}>Tutup</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 60, paddingHorizontal: 20 },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  headerSubtitle: { fontSize: 14, color: '#666' },

  // Map Styling
  mapContainer: {
    height: 300, 
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 20,
  },
  map: { width: '100%', height: '100%' },

  // Info Area
  infoContainer: { flex: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  labelLokasi: { fontSize: 12, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  lokasiValue: { fontSize: 18, color: '#333' },
  progressText: { fontSize: 42, fontWeight: 'bold', color: Colors.cokelatTua.base }, 

  // Button
  checkpointButton: {
    backgroundColor: '#5D4037', 
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#5D4037",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  nextInfo: { textAlign: 'center', fontSize: 12, color: '#666' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', padding: 30, borderRadius: 20, alignItems: 'center', width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  qrWrapper: { marginBottom: 20, padding: 10, backgroundColor: '#FFF' },
  closeButton: { padding: 10 },
  closeText: { color: 'red', fontWeight: 'bold' }
});

