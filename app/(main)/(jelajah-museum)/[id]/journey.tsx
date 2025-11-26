import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  Platform, 
  Image
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; 
import { MUSEUMS } from '@/constants/data';
import QRCode from 'react-native-qrcode-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

// Ukuran Map Container
const MAP_WIDTH = 340; 
const MAP_HEIGHT = 250; 

// Dummy Koordinat Checkpoint (Pixel X, Y relatif terhadap gambar)
const CP_POSITIONS = [
  { x: 100, y: 120 }, 
  { x: 240, y: 180 }, 
  { x: 160, y: 80 },  
];

export default function JourneyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const museum = MUSEUMS.find(m => m.id === id);

  const [currentStep, setCurrentStep] = useState(0); 
  const [showQR, setShowQR] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  
  const totalStep = museum?.checkpoints.length || 0;
  const isFinished = currentStep >= totalStep;

  const currentTargetName = !isFinished 
    ? museum?.checkpoints[currentStep]?.name 
    : "Selesai!";

  const activePinPos = CP_POSITIONS[currentStep % CP_POSITIONS.length] || { x: MAP_WIDTH/2, y: MAP_HEIGHT/2 };

  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 500, easing: Easing.out(Easing.quad) }), 
        withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })     
      ),
      -1, 
      false 
    );
  }, []);

  const animatedPinStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

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

  const handleScanSuccess = () => {
    setShowQR(false);
    if (currentStep < totalStep - 1) {
        Alert.alert("Berhasil!", `Checkpoint ${currentStep + 1} selesai. Pin akan berpindah!`);
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
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => setShowPauseModal(true)} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Selamat Datang</Text>
            <Text style={styles.subtitleText}>di {museum.name}!</Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <Image 
            source={{uri : museum.floorPlanImage}} 
            style={styles.mapImage}
            resizeMode="contain"
        />

        {!isFinished && (
            <Animated.View 
                style={[
                    styles.pinWrapper, 
                    { 
                        left: activePinPos.x - 20, 
                        top: activePinPos.y - 40   
                    },
                    animatedPinStyle
                ]}
            >
                <Ionicons name="location-sharp" size={40} color={Colors.cokelatTua.base} />
                <View style={styles.pinShadow} />
            </Animated.View>
        )}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.textRow}>
            <View>
                <Text style={styles.label}>Lokasi Checkpoint:</Text>
                <Text style={styles.value}>
                    {!isFinished ? currentTargetName : "Semua Selesai"}
                </Text>
            </View>
            
            <View style={styles.counterRow}>
                <Text style={styles.counterBig}>
                    {isFinished ? totalStep : currentStep + 1}
                </Text>
                <Text style={styles.counterSmall}>/{totalStep}</Text>
            </View>
        </View>

        {!isFinished ? (
            <TouchableOpacity style={styles.mainButton} onPress={() => setShowQR(true)}>
                <Text style={styles.mainButtonText}>Scan Checkpoint</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity style={styles.mainButton} onPress={handleFinishJourney}>
                <Text style={styles.mainButtonText}>End Visit</Text>
            </TouchableOpacity>
        )}

        <Text style={styles.footerText}>
            {!isFinished 
                ? "Temukan QR Code di lokasi tersebut." 
                : "Wah, Anda telah sampai pada checkpoint terakhir!"}
        </Text>
      </View>

      <Modal visible={showQR} transparent animationType="fade" onRequestClose={() => setShowQR(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Scan Checkpoint {currentStep + 1}</Text>
                <Text style={styles.modalSubtitle}>Tunjukkan QR ke petugas di {currentTargetName}</Text>
                
                <View style={styles.qrWrapper}>
                    <QRCode value={`MUSEUM-${id}-CP-${currentStep}`} size={180} />
                </View>

                <TouchableOpacity style={styles.simulateButton} onPress={handleScanSuccess}>
                    <Text style={styles.simulateText}>[Simulasi] Petugas Scan Sukses</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{padding:10}} onPress={() => setShowQR(false)}>
                    <Text style={{color:'red', fontWeight:'bold'}}>Tutup</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      <Modal visible={showPauseModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.pauseModalCard}>
            <Text style={styles.pauseModalHeader}>Anda sedang dalam{'\n'}kunjungan</Text>
            <Text style={styles.pauseModalDesc}>Checkpoint Anda tetap akan tersimpan.</Text>
            
            {/* Tombol Lanjutkan (Primary) */}
            <TouchableOpacity 
                style={styles.primaryButtonModal} 
                onPress={() => setShowPauseModal(false)}
            >
              <Text style={styles.primaryButtonText}>Lanjutkan Kunjungan</Text>
            </TouchableOpacity>

            {/* Tombol Keluar (Secondary) - Ukuran Sama */}
            <TouchableOpacity 
                style={styles.secondaryButtonModal} 
                onPress={() => { setShowPauseModal(false); router.back(); }}
            >
              <Text style={styles.secondaryButtonText}>Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 20 },
  headerSection: { paddingHorizontal: 20, marginBottom: 40 },
  backIcon: { marginBottom: 20 },
  titleContainer: { alignItems: 'center' },
  titleText: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  subtitleText: { fontSize: 16, color: '#444' },
  mapContainer: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    alignSelf: 'center',
    marginBottom: 40,
    position: 'relative',
    backgroundColor: '#F9F9F9', 
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9, 
  },
  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  pinShadow: {
    width: 10,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 5,
    marginTop: -2,
  },
  infoSection: { paddingHorizontal: 30 },
  textRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 5 },
  value: { fontSize: 18, color: '#000' },
  counterRow: { flexDirection: 'row', alignItems: 'baseline' },
  counterBig: { fontSize: 48, fontWeight: 'bold', color: '#5D4037' },
  counterSmall: { fontSize: 24, color: '#888' },
  mainButton: {
    backgroundColor: '#4E342E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20
  },
  mainButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  footerText: { textAlign: 'center', fontSize: 12, color: '#444', lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', padding: 30, borderRadius: 20, alignItems: 'center', width: '85%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, color: Colors.cokelatTua.base },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  qrWrapper: { marginBottom: 20, padding: 15, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE', borderRadius: 10 },
  simulateButton: { marginBottom: 15, padding: 10, backgroundColor: '#E0F2F1', borderRadius: 8 },
  simulateText: { color: '#00695C', fontWeight: 'bold', fontSize: 12 },
  pauseModalCard: { width: '80%', backgroundColor: '#FFF', borderRadius: 24, padding: 25, alignItems: 'center', elevation: 5 },
  pauseModalHeader: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  pauseModalDesc: { fontSize: 14, textAlign: 'center', marginBottom: 25, lineHeight: 20 },
  
  // UPDATE MODAL BUTTON STYLES
  primaryButtonModal: { 
    backgroundColor: '#4E342E', 
    width: '100%', 
    paddingVertical: 14, 
    borderRadius: 16, // Radius 16
    alignItems: 'center', 
    marginBottom: 10 
  },
  primaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  secondaryButtonModal: { 
    backgroundColor: '#8D5B4C', 
    width: '100%', // Lebar disamakan
    paddingVertical: 14, 
    borderRadius: 16, // Radius 16
    alignItems: 'center' 
  },
  secondaryButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 } // Font size disamakan
});