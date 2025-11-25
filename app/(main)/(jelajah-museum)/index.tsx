import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors'; //
import { MUSEUMS } from '@/constants/data'; // Pastikan file data.ts sudah dibuat di Langkah 1

export default function JelajahMuseumScreen() {
  const router = useRouter();

  const handlePressMuseum = (id: string) => {
    // INI PENTING: Kita lempar user KELUAR dari folder (main) menuju folder museum/[id]
    // Tujuannya agar Tab Bar di bawah hilang saat user fokus menjelajah.
    router.push(`/museum/${id}`);
  };

  const renderItem = ({ item }: { item: typeof MUSEUMS[0] }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handlePressMuseum(item.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>24 PTS</Text>
            </View>
        </View>
        <Text style={styles.cardAddress} numberOfLines={2}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rekomendasi Museum</Text>
        <Text style={styles.headerSubtitle}>Untukmu</Text>
      </View>

      <FlatList
        data={MUSEUMS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[10], // Menggunakan warna dari konstanta Anda
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.cokelatTua.base,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.cokelatTua.base,
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3, // Shadow untuk Android
    shadowColor: '#000', // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: Colors.neutral[40],
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.neutral[30],
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.cokelatTua[100],
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.cokelatTua.base,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardAddress: {
    fontSize: 12,
    color: Colors.neutral[70],
  },
});