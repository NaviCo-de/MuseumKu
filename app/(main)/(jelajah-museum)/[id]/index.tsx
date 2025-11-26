import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; 
import { MUSEUMS } from '@/constants/data'; 
import { useMuseumFavorites } from '@/hooks/useMuseumFavorites';

export default function MuseumDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const museum = MUSEUMS.find(m => m.id === id);
  const { favoriteIds, toggleFavorite } = useMuseumFavorites();
  const isFavorited = typeof id === 'string' && favoriteIds.includes(id);

  if (!museum) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <View style={{width: 28}} />
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.museumName}>{museum.name}</Text>
          <Text style={styles.museumAddress}>{museum.address}</Text>
        </View>

        <View style={styles.contentRow}>
          <Image source={{ uri: museum.image }} style={styles.mainImage} />
          
          <View style={styles.introTextContainer}>
            <Text style={styles.introText}>
              {museum.name}, juga dikenal sebagai Museum Fatahillah, terletak di kawasan Kota Tua Jakarta dan menempati bangunan bekas Balai Kota Batavia yang dibangun pada abad ke-18.
            </Text>
          </View>
        </View>

        <Text style={styles.fullDesc}>
          Di dalamnya terdapat artefak arkeologis, mebel antik bergaya kolonial, peta kuno, hingga peninggalan penting seperti meriam Si Jagur dan penjara bawah tanah yang dulu digunakan pada masa penjajahan. Selain sebagai tempat wisata edukatif, museum ini juga menjadi saksi perkembangan Jakarta dari kota pelabuhan kecil menjadi ibu kota Indonesia yang modern.
        </Text>

        <View style={styles.ticketSection}>
          <Text style={styles.ticketHeader}>Harga Tiket:</Text>
          
          <View style={styles.ticketRowContainer}>
            <View style={styles.ticketPriceList}>
              <View style={styles.priceRow}>
                <Text style={styles.ticketLabel}>Senin - Jumat</Text>
                <Text style={styles.ticketValue}>Rp 7.500/orang</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.ticketLabel}>Sabtu - Minggu</Text>
                <Text style={styles.ticketValue}>Rp 12.000/orang</Text>
              </View>
            </View>

            <TouchableOpacity 
                onPress={() => toggleFavorite(museum.id)}
                style={styles.favButton}
            >
               <Ionicons 
                 name={isFavorited ? "heart" : "heart-outline"} 
                 size={35} 
                 color={isFavorited ? Colors.red.base : "#000"} 
               />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push(`/(main)/(jelajah-museum)/${id}/payment`)}
          >
            <Text style={styles.primaryButtonText}>Kunjungi Sekarang</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} 
            onPress={() => router.push(`/(main)/(jelajah-museum)/${id}/invite`)} 
            >
            <Text style={styles.secondaryButtonText}>Kunjungi Bersama Teman</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  // Header
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20
  },
  backButton: { 
    padding: 5 
  },

  scrollContent: { 
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40 
  },
  
  titleSection: { 
    alignItems: 'center', 
    marginBottom: 25 
  },
  museumName: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 8, 
    color: '#000' 
  },
  museumAddress: { 
    fontSize: 12, 
    textAlign: 'center', 
    color: '#000', 
    lineHeight: 20, 
    paddingHorizontal: 10 
  },
  contentRow: { 
    flexDirection: 'row', 
    marginBottom: 15, 
    gap: 15, 
    alignItems: 'flex-start' 
  },
  mainImage: { 
    width: 150, 
    height: 150, 
    borderRadius: 4, 
    backgroundColor: '#EEE' 
  },
  introTextContainer: { 
    flex: 1 
  },
  introText: { 
    fontSize: 13, 
    color: '#000', 
    lineHeight: 18, 
    textAlign: 'left', 
    fontWeight: 'semibold' 
  },
  fullDesc: { 
    fontSize: 13, 
    color: '#000', 
    lineHeight: 18, 
    textAlign: 'justify', 
    marginBottom: 20, 
    fontWeight: 'semibold' 
  },
  ticketSection: { 
    marginTop: 10, 
    marginBottom: 30 
  },
  ticketHeader: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#000' 
  },
  ticketRowContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  ticketPriceList: { 
    flex: 1, 
    marginRight: 20 
  },
  priceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 5 
  },
  ticketLabel: { 
    fontSize: 14, 
    color: '#000', 
    flex: 1 
  },
  ticketValue: { 
    fontSize: 14, 
    color: '#000', 
    flex: 1, 
    textAlign: 'left' 
  },
  favButton: { 
    padding: 5 
  },
  actionButtons: { 
    gap: 15, 
    alignItems: 'center' 
  },
  primaryButton: { 
    backgroundColor: '#3E2723', 
    width: '80%', 
    paddingVertical: 15, 
    borderRadius: 25, 
    alignItems: 'center' 
  },
  primaryButtonText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16,
  },
  secondaryButton: { 
    backgroundColor: '#6D4C41', 
    width: '90%', 
    paddingVertical: 15, 
    borderRadius: 25, 
    alignItems: 'center' 
  },
  secondaryButtonText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});