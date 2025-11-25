import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import MapView, { Overlay, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import QRCode from 'react-native-qrcode-svg';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; 
import { MUSEUMS } from '@/constants/data';

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
  const currentStep = 1; 
  const totalStep = museum?.checkpoints.length || 3;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') Alert.alert('Izin Ditolak', 'Butuh izin lokasi.');
    })();
  }, []);

  if (!museum) return null;

  return (
    <View style={styles.container}>
      {/* Back Button Overlay (Penting untuk Map Fullscreen) */}
      <TouchableOpacity 
        onPress={() => router.replace(`/(main)/(jelajah-museum)/${id}`)} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

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
          // Casting type bounds agar tidak error TypeScript
          bounds={museum.overlayBounds as [[number, number], [number, number]]} 
          opacity={1.0} 
        />
        <Marker coordinate={{latitude: museum.latitude, longitude: museum.longitude}}>
             <Ionicons name="location-sharp" size={40} color={Colors.red.base} />
        </Marker>
      </MapView>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
            <View>
                <Text style={styles.labelLokasi}>Lokasi Anda Sekarang:</Text>
                <Text style={styles.lokasiValue}>Ruang Tarumanegara</Text>
            </View>
            <Text style={styles.progressText}>{currentStep + 1}<Text style={{color: '#ccc', fontSize: 24}}>/{totalStep}</Text></Text>
        </View>
        <TouchableOpacity style={styles.checkpointButton} onPress={() => setShowQR(true)}>
            <Text style={styles.buttonText}>Checkpoint</Text>
        </TouchableOpacity>
        <Text style={styles.nextInfo}>Checkpoint berikutnya:{"\n"}Ruang Jayakarta</Text>
      </View>

      <Modal visible={showQR} transparent={true} animationType="fade" onRequestClose={() => setShowQR(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Scan Checkpoint</Text>
                <View style={styles.qrWrapper}>
                    <QRCode value={`MUSEUM-${id}-CP-${currentStep}`} size={180} />
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowQR(false)}>
                    <Text style={styles.closeText}>Tutup</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: 20 },
  map: { width: '100%', height: '60%' }, // Map ambil 60% layar
  infoContainer: { flex: 1, padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  labelLokasi: { fontSize: 12, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  lokasiValue: { fontSize: 18, color: '#333' },
  progressText: { fontSize: 42, fontWeight: 'bold', color: Colors.cokelatTua.base }, 
  checkpointButton: { backgroundColor: '#5D4037', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 15, shadowColor: "#5D4037", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  nextInfo: { textAlign: 'center', fontSize: 12, color: '#666' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', padding: 30, borderRadius: 20, alignItems: 'center', width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  qrWrapper: { marginBottom: 20, padding: 10, backgroundColor: '#FFF' },
  closeButton: { padding: 10 },
  closeText: { color: 'red', fontWeight: 'bold' }
});