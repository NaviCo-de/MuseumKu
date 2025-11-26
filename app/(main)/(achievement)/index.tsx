import React, { useMemo } from 'react';
import {
  Alert,
  ActivityIndicator,
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

export default function AchievementScreen() {
  const router = useRouter();
  const { achievements, loading, claimAchievement, points } = useAchievements();

  const orderedAchievements = useMemo(() => {
    const order = [
      'culture-digger',
      'museum-point-guard',
      'explorer',
      'a-student',
      'partner',
    ];
    const map = new Map(achievements.map(item => [item.id, item]));
    const ordered = order.map(id => map.get(id)).filter(Boolean);
    // Fallback: append any achievement not in the predefined order so nothing is hidden
    const remaining = achievements.filter(item => !order.includes(item.id));
    return [...ordered, ...remaining];
  }, [achievements]);

  const getMedalTier = (pct: number) => {
    if (pct >= 1) return 2; // Gold
    if (pct >= 0.66) return 1; // Silver
    if (pct >= 0.33) return 0; // Bronze
    return -1; // None yet
  };

  const getRewardLabel = (achievement: ReturnType<typeof useAchievements>['achievements'][number]) => {
    if (achievement.rewardPoints && achievement.rewardPoints > 0) {
      return `+${achievement.rewardPoints} poin`;
    }
    return 'Medali';
  };

  const handleClaim = (achievement: ReturnType<typeof useAchievements>['achievements'][number]) => {
    const result = claimAchievement(achievement.id);
    if (!result.success) {
      Alert.alert(
        'Tidak bisa klaim',
        result.reason === 'Belum selesai'
          ? 'Selesaikan misi dulu sebelum klaim hadiah.'
          : 'Reward sudah diambil.'
      );
      return;
    }

    const rewardText = achievement.rewardPoints && achievement.rewardPoints > 0
      ? `+${achievement.rewardPoints} poin berhasil ditambahkan.`
      : 'Hadiah berhasil ditambahkan.';
    Alert.alert('Hadiah diklaim', rewardText);
  };

  const renderMission = (achievement: ReturnType<typeof useAchievements>['achievements'][number]) => {
    const progressPct = Math.min(achievement.progress / achievement.target, 1);
    const completed = achievement.isComplete || achievement.isClaimed;
    const medalTier = getMedalTier(progressPct);
    const medalColors = ['#CD7F32', '#C0C0C0', '#D4AF37']; // Bronze, Silver, Gold
    const medalColor = medalTier >= 0 ? medalColors[medalTier] : Colors.neutral[60];
    const buttonDisabled = !achievement.isComplete || achievement.isClaimed;
    const buttonLabel = achievement.isClaimed
      ? 'Sudah diklaim'
      : achievement.isComplete
      ? 'Klaim hadiah'
      : 'Dalam progres';

    return (
      <View key={achievement.id} style={styles.missionCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.missionTitle}>{achievement.title}</Text>
          <Text style={styles.missionSubtitle}>{achievement.description}</Text>

          <View style={styles.progressRow}>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPct * 100}%` }]} />
            </View>
            <Text style={styles.progressValue}>
              {achievement.progress}/{achievement.target}
            </Text>
          </View>
        </View>

        <View style={styles.medalWrapper}>
          <Ionicons
            name={completed ? 'medal' : 'medal-outline'}
            size={32}
            color={medalColor}
          />
          <Text style={styles.medalLabel}>{getRewardLabel(achievement)}</Text>
          <TouchableOpacity
            style={[
              styles.claimButton,
              buttonDisabled && styles.claimButtonDisabled,
            ]}
            onPress={() => handleClaim(achievement)}
            disabled={buttonDisabled}
          >
            <Text
              style={[
                styles.claimText,
                buttonDisabled && styles.claimTextDisabled,
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
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Achievements!</Text>
        <Text style={styles.heroSubtitle}>
          Peroleh badge untuk akunmu dengan mengerjakan misi dan mendapatkan medali!
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(main)/(achievement)/medals')}
        >
          <Text style={styles.primaryButtonText}>Lihat Medali Saya</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Misi Saya</Text>
        <Text style={styles.pointsText}>{points} pts</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.cokelatTua.base} style={{ marginTop: 20 }} />
      ) : (
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {orderedAchievements.map(renderMission)}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[20],
  },
  hero: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 22,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    gap: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.cokelatTua.base,
  },
  heroSubtitle: {
    textAlign: 'center',
    color: Colors.neutral[90],
    lineHeight: 20,
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: Colors.cokelatTua.base,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.cokelatTua.base,
  },
  missionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.neutral[40],
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  missionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.cokelatTua.base,
    marginBottom: 4,
  },
  missionSubtitle: {
    color: Colors.neutral[90],
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarTrack: {
    flex: 1,
    height: 10,
    borderRadius: 10,
    backgroundColor: Colors.neutral[40],
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.cokelatMuda.base,
  },
  progressValue: {
    fontWeight: '800',
    color: Colors.cokelatTua.base,
    fontSize: 12,
  },
  medalWrapper: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  medalLabel: {
    fontSize: 11,
    color: Colors.neutral[80],
    textAlign: 'center',
  },
  claimButton: {
    marginTop: 4,
    backgroundColor: Colors.cokelatTua.base,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButtonDisabled: {
    backgroundColor: Colors.neutral[40],
  },
  claimText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
  },
  claimTextDisabled: {
    color: Colors.neutral[80],
  },
  pointsText: {
    fontSize: 13,
    color: Colors.neutral[90],
    fontWeight: '700',
  },
});
