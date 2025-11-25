import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

type FilterKey = 'semua' | 'aktif' | 'selesai';

type Achievement = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  rewardPoints?: number;
  category: 'kunjungan' | 'kuis' | 'berbagi' | 'streak';
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'visit-1',
    title: 'Kunjungan Perdana',
    description: 'Selesaikan perjalanan museum pertamamu.',
    progress: 1,
    target: 1,
    reward: '+50 poin',
    rewardPoints: 50,
    category: 'kunjungan',
  },
  {
    id: 'visit-3',
    title: 'Penjelajah Kota Tua',
    description: 'Kunjungi 3 museum berbeda di Jakarta.',
    progress: 2,
    target: 3,
    reward: 'Badge Perintis',
    category: 'kunjungan',
  },
  {
    id: 'quiz-3',
    title: 'Cendekia Museum',
    description: 'Selesaikan 3 kuis setelah kunjungan.',
    progress: 2,
    target: 3,
    reward: '+70 poin',
    rewardPoints: 70,
    category: 'kuis',
  },
  {
    id: 'share-1',
    title: 'Cerita Pertama',
    description: 'Bagikan 1 postingan perjalananmu.',
    progress: 1,
    target: 1,
    reward: 'Badge Storyteller',
    category: 'berbagi',
  },
  {
    id: 'streak-7',
    title: 'Streak Mingguan',
    description: 'Check-in 7 hari berturut-turut.',
    progress: 5,
    target: 7,
    reward: '+120 poin',
    rewardPoints: 120,
    category: 'streak',
  },
];

export default function AchievementScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>('semua');
  const [claimed, setClaimed] = useState<Record<string, boolean>>({
    'visit-1': true,
  });
  const [points, setPoints] = useState(320);

  const completedCount = useMemo(
    () =>
      ACHIEVEMENTS.filter(
        a => claimed[a.id] || a.progress >= a.target
      ).length,
    [claimed]
  );

  const filteredAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter(item => {
      const isDone = item.progress >= item.target || claimed[item.id];
      if (filter === 'aktif') return !isDone;
      if (filter === 'selesai') return isDone;
      return true;
    });
  }, [filter, claimed]);

  const handleClaim = (achievement: Achievement) => {
    const alreadyClaimed = claimed[achievement.id];
    const completed = achievement.progress >= achievement.target;
    if (alreadyClaimed || !completed) return;

    setClaimed(prev => ({ ...prev, [achievement.id]: true }));
    if (achievement.rewardPoints) {
      setPoints(prev => prev + achievement.rewardPoints);
    }
    Alert.alert('Hadiah diklaim', `Reward ${achievement.reward} berhasil ditambahkan.`);
  };

  const renderFilter = (key: FilterKey, label: string) => {
    const active = filter === key;
    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.filterChip,
          active && { backgroundColor: Colors.cokelatTua.base },
        ]}
        onPress={() => setFilter(key)}
      >
        <Text
          style={[
            styles.filterText,
            active && { color: '#FFF', fontWeight: '700' },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAchievement = (achievement: Achievement) => {
    const isClaimed = claimed[achievement.id];
    const isComplete = achievement.progress >= achievement.target;
    const progressPct = Math.min(achievement.progress / achievement.target, 1);

    const buttonLabel = isClaimed
      ? 'Sudah diklaim'
      : isComplete
      ? 'Klaim hadiah'
      : 'Dalam progres';

    return (
      <View key={achievement.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>{achievement.title}</Text>
            <Text style={styles.cardSubtitle}>{achievement.description}</Text>
          </View>
          <View style={styles.rewardPill}>
            <Ionicons name="star" size={14} color={Colors.cokelatTua.base} />
            <Text style={styles.rewardText}>{achievement.reward}</Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPct * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {achievement.progress}/{achievement.target}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.categoryTag}>
            <Ionicons
              name={
                achievement.category === 'kuis'
                  ? 'help-circle'
                  : achievement.category === 'berbagi'
                  ? 'share-social'
                  : achievement.category === 'streak'
                  ? 'flame'
                  : 'map'
              }
              size={14}
              color={Colors.cokelatTua.base}
            />
            <Text style={styles.categoryText}>{achievement.category}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.claimButton,
              (!isComplete || isClaimed) && { backgroundColor: Colors.neutral[40] },
            ]}
            disabled={!isComplete || isClaimed}
            onPress={() => handleClaim(achievement)}
          >
            <Text
              style={[
                styles.claimText,
                (!isComplete || isClaimed) && { color: Colors.neutral[80] },
              ]}
            >
              {buttonLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>Pencapaianmu</Text>
          <Text style={styles.heroSubtitle}>
            Kumpulkan poin, buka lencana, dan lanjutkan perjalanan museum.
          </Text>

          <View style={styles.heroBadges}>
            <View style={styles.statChip}>
              <Ionicons name="medal" size={16} color="#FFF" />
              <Text style={styles.statText}>{completedCount} selesai</Text>
            </View>
            <View style={styles.statChip}>
              <Ionicons name="flame" size={16} color="#FFF" />
              <Text style={styles.statText}>Streak 5 hari</Text>
            </View>
          </View>
        </View>

        <View style={styles.pointsBox}>
          <Text style={styles.pointsValue}>{points}</Text>
          <Text style={styles.pointsLabel}>Poin</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/(main)/(jelajah-museum)')}
          >
            <Text style={styles.ctaText}>Mulai jelajah</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.cokelatTua.base} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterRow}>
        {renderFilter('semua', 'Semua')}
        {renderFilter('aktif', 'Sedang berjalan')}
        {renderFilter('selesai', 'Selesai')}
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {filteredAchievements.map(renderAchievement)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[20],
  },
  hero: {
    margin: 20,
    padding: 18,
    borderRadius: 18,
    backgroundColor: Colors.cokelatMuda[30],
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.cokelatTua.base,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: Colors.neutral[90],
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.cokelatTua.base,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  pointsBox: {
    width: 130,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cokelatMuda[20],
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.cokelatTua.base,
  },
  pointsLabel: {
    color: Colors.neutral[80],
    fontSize: 12,
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: Colors.neutral.base,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaText: {
    color: Colors.cokelatTua.base,
    fontWeight: '700',
    fontSize: 12,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[50],
  },
  filterText: {
    color: Colors.neutral[90],
    fontWeight: '600',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[40],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.cokelatTua.base,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: Colors.neutral[80],
    fontSize: 12,
    lineHeight: 18,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.neutral.base,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardText: {
    color: Colors.cokelatTua.base,
    fontWeight: '700',
    fontSize: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: Colors.neutral[40],
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.cokelatTua.base,
    borderRadius: 999,
  },
  progressText: {
    fontSize: 12,
    color: Colors.neutral[90],
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.neutral.base,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  categoryText: {
    color: Colors.cokelatTua.base,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  claimButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.cokelatMuda.base,
    borderRadius: 10,
  },
  claimText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 12,
  },
});
