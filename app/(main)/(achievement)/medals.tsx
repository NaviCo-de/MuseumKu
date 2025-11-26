import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAchievements } from '@/hooks/useAchievements';

type AchievementItem = ReturnType<typeof useAchievements>['achievements'][number];

export default function MedalsScreen() {
  const router = useRouter();
  const { achievements } = useAchievements();

  const orderedAchievements = useMemo<AchievementItem[]>(() => {
    const order = [
      'culture-digger',
      'museum-point-guard',
      'explorer',
      'a-student',
      'partner',
    ];
    const map = new Map(achievements.map(item => [item.id, item]));
    return order
      .map(id => map.get(id))
      .filter((item): item is AchievementItem => Boolean(item));
  }, [achievements]);

  const renderMedals = (achievement: AchievementItem) => {
    const isOwned = achievement.isClaimed;
    const tier = isOwned ? achievement.stageTier ?? -1 : -1;
    const medalDisplay = [
      { color: '#D4AF37', label: '#1', requiredTier: 2 }, // Gold
      { color: '#C0C0C0', label: '#2', requiredTier: 1 }, // Silver
      { color: '#CD7F32', label: '#3', requiredTier: 0 }, // Bronze
    ];
    const rewardLabel =
      !isOwned
        ? 'Belum dimiliki'
        : tier >= 2
        ? 'Koleksi lengkap'
        : achievement.rewardPoints && achievement.rewardPoints > 0
        ? `+${achievement.rewardPoints} poin`
        : 'Medali';

    return (
      <View
        key={achievement.id}
        style={[styles.medalCard, !isOwned && styles.medalCardDisabled]}
      >
        <Text style={styles.medalTitle}>{achievement.title}</Text>
        <Text style={styles.medalSubtitle}>{achievement.description}</Text>
        <Text style={styles.rewardLabel}>{rewardLabel}</Text>
        <View style={styles.medalRow}>
          {medalDisplay.map((item, idx) => {
            const unlocked = isOwned && tier >= item.requiredTier;
            return (
              <View key={idx} style={styles.medalItem}>
                <Ionicons
                  name={unlocked ? 'medal' : 'medal-outline'}
                  size={36}
                  color={unlocked ? item.color : Colors.neutral[60]}
                />
                <Text style={[styles.medalStepLabel, { color: item.color }]}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Medali Saya</Text>
          <View style={{ width: 32 }} />
        </View>

        <Text style={styles.pageSubtitle}>Ayo, koleksi lebih banyak medali!</Text>

        <View style={{ gap: 16 }}>
          {orderedAchievements.map(renderMedals)}
        </View>
      </ScrollView>

      <View style={styles.footerCta}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/(main)/(jelajah-museum)')}
        >
          <Text style={styles.ctaText}>Kumpulkan Poin Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[20],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[40],
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  pageSubtitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
    color: Colors.neutral[90],
    fontSize: 13,
  },
  medalCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.neutral[40],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  medalCardDisabled: {
    opacity: 0.5,
  },
  medalTitle: {
    fontWeight: '800',
    fontSize: 15,
    color: Colors.cokelatTua.base,
    marginBottom: 4,
  },
  medalSubtitle: {
    color: Colors.neutral[90],
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  rewardLabel: {
    fontWeight: '700',
    color: Colors.cokelatTua.base,
    fontSize: 12,
    marginBottom: 12,
  },
  medalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medalItem: {
    alignItems: 'center',
    flex: 1,
  },
  medalStepLabel: {
    marginTop: 6,
    fontSize: 11,
    color: Colors.neutral[80],
  },
  footerCta: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[40],
    backgroundColor: Colors.neutral[20],
  },
  ctaButton: {
    backgroundColor: Colors.cokelatTua.base,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});
