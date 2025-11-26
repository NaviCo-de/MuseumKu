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
import { useAchievements } from '@/hooks/useAchievements';

type FilterKey = 'semua' | 'aktif' | 'selesai';

type AchievementItem = ReturnType<typeof useAchievements>['achievements'][number];

export default function AchievementScreen() {
  const router = useRouter();
  const {
    achievements,
    completedCount,
    points,
    stats,
    hasCheckedInToday,
    claimAchievement,
    recordDailyCheckIn,
  } = useAchievements();
  const [filter, setFilter] = useState<FilterKey>('semua');

  const filteredAchievements = useMemo(() => {
    return achievements.filter(item => {
      const isDone = item.isComplete || item.isClaimed;
      if (filter === 'aktif') return !isDone;
      if (filter === 'selesai') return isDone;
      return true;
    });
  }, [achievements, filter]);

  const handleClaim = (achievement: AchievementItem) => {
    const result = claimAchievement(achievement.id);
    if (!result.success) {
      const message =
        result.reason === 'Belum selesai'
          ? 'Selesaikan pencapaian ini dulu sebelum klaim hadiah.'
          : result.reason === 'Sudah diklaim'
          ? 'Reward sudah kamu dapatkan.'
          : 'Achievement tidak ditemukan.';
      Alert.alert('Tidak bisa klaim', message);
      return;
    }

    const rewardText =
      achievement.rewardPoints && achievement.rewardPoints > 0
        ? `Reward ${achievement.reward} berhasil ditambahkan.`
        : 'Reward berhasil ditambahkan.';
    Alert.alert('Hadiah diklaim', rewardText);
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

  const handleDailyCheckIn = () => {
    const updated = recordDailyCheckIn();
    if (updated) {
      Alert.alert('Check-in tersimpan', 'Streak kamu sudah diperbarui.');
    } else {
      Alert.alert('Check-in sudah dilakukan', 'Kamu sudah check-in hari ini.');
    }
  };

  const renderAchievement = (achievement: AchievementItem) => {
    const isClaimed = achievement.isClaimed;
    const isComplete = achievement.isComplete;
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
              <Text style={styles.statText}>Streak {stats.streak} hari</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.checkInButton,
                hasCheckedInToday && styles.checkInButtonDone,
              ]}
              onPress={handleDailyCheckIn}
              disabled={hasCheckedInToday}
            >
              <Ionicons
                name="calendar"
                size={14}
                color={hasCheckedInToday ? Colors.neutral[80] : Colors.cokelatTua.base}
              />
              <Text
                style={[
                  styles.checkInText,
                  hasCheckedInToday && { color: Colors.neutral[80] },
                ]}
              >
                {hasCheckedInToday ? 'Sudah check-in hari ini' : 'Check-in harian'}
              </Text>
            </TouchableOpacity>
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
    flexWrap: 'wrap',
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
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.cokelatTua.base,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  checkInButtonDone: {
    borderColor: Colors.neutral[60],
    backgroundColor: Colors.neutral[30],
  },
  checkInText: {
    color: Colors.cokelatTua.base,
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
