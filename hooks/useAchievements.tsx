import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AchievementCategory = 'kunjungan' | 'kuis' | 'berbagi' | 'streak';

type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  target: number;
  reward: string;
  rewardPoints?: number;
  category: AchievementCategory;
};

type AchievementWithState = AchievementDefinition & {
  progress: number;
  isComplete: boolean;
  isClaimed: boolean;
};

type AchievementProgressState = {
  visitedMuseums: string[];
  quizCompleted: number;
  shares: number;
  streak: number;
  lastCheckInDate: string | null;
  claimed: Record<string, boolean>;
  points: number;
};

type ClaimResult = { success: true; addedPoints: number } | { success: false; reason: string };

type AchievementContextValue = {
  achievements: AchievementWithState[];
  completedCount: number;
  points: number;
  hasCheckedInToday: boolean;
  stats: {
    visits: number;
    quizzes: number;
    shares: number;
    streak: number;
  };
  loading: boolean;
  claimAchievement: (id: string) => ClaimResult;
  recordVisit: (museumId: string) => void;
  recordQuizCompletion: () => void;
  recordShare: () => void;
  recordDailyCheckIn: () => boolean;
};

const STORAGE_KEY = 'museumku:achievement-progress';

const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'visit-1',
    title: 'Kunjungan Perdana',
    description: 'Selesaikan perjalanan museum pertamamu.',
    target: 1,
    reward: '+50 poin',
    rewardPoints: 50,
    category: 'kunjungan',
  },
  {
    id: 'visit-3',
    title: 'Penjelajah Kota Tua',
    description: 'Kunjungi 3 museum berbeda di Jakarta.',
    target: 3,
    reward: 'Badge Perintis',
    category: 'kunjungan',
  },
  {
    id: 'quiz-3',
    title: 'Cendekia Museum',
    description: 'Selesaikan 3 kuis setelah kunjungan.',
    target: 3,
    reward: '+70 poin',
    rewardPoints: 70,
    category: 'kuis',
  },
  {
    id: 'share-1',
    title: 'Cerita Pertama',
    description: 'Bagikan 1 postingan perjalananmu.',
    target: 1,
    reward: 'Badge Storyteller',
    category: 'berbagi',
  },
  {
    id: 'streak-7',
    title: 'Streak Mingguan',
    description: 'Check-in 7 hari berturut-turut.',
    target: 7,
    reward: '+120 poin',
    rewardPoints: 120,
    category: 'streak',
  },
];

const DEFAULT_PROGRESS: AchievementProgressState = {
  visitedMuseums: [],
  quizCompleted: 0,
  shares: 0,
  streak: 0,
  lastCheckInDate: null,
  claimed: {},
  points: 320,
};

const AchievementContext = createContext<AchievementContextValue | undefined>(undefined);

const formatDate = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const daysBetween = (from: string, to: string) => {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

const getNextStreakState = (lastCheckInDate: string | null, currentStreak: number) => {
  const today = formatDate(new Date());
  if (!lastCheckInDate) {
    return { streak: 1, lastCheckInDate: today, didChange: true };
  }

  if (lastCheckInDate === today) {
    return { streak: currentStreak, lastCheckInDate, didChange: false };
  }

  const delta = daysBetween(lastCheckInDate, today);
  if (delta === 1) {
    return { streak: currentStreak + 1, lastCheckInDate: today, didChange: true };
  }

  return { streak: 1, lastCheckInDate: today, didChange: true };
};

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<AchievementProgressState>(DEFAULT_PROGRESS);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hydrate from storage
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setProgress(prev => ({ ...prev, ...JSON.parse(saved) }));
        }
      } catch (error) {
        console.warn('Gagal memuat progres achievement', error);
      } finally {
        setHydrated(true);
        setLoading(false);
      }
    };
    load();
  }, []);

  // Persist when progress changes
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)).catch(error => {
      console.warn('Gagal menyimpan progres achievement', error);
    });
  }, [progress, hydrated]);

  const derivedAchievements = useMemo<AchievementWithState[]>(() => {
    return ACHIEVEMENT_DEFINITIONS.map(def => {
      const baseProgress =
        def.category === 'kunjungan'
          ? progress.visitedMuseums.length
          : def.category === 'kuis'
          ? progress.quizCompleted
          : def.category === 'berbagi'
          ? progress.shares
          : progress.streak;

      const clampedProgress = Math.min(baseProgress, def.target);
      const isComplete = clampedProgress >= def.target;
      const isClaimed = Boolean(progress.claimed[def.id]);

      return {
        ...def,
        progress: clampedProgress,
        isComplete,
        isClaimed,
      };
    });
  }, [progress]);

  const completedCount = useMemo(
    () => derivedAchievements.filter(item => item.isComplete || item.isClaimed).length,
    [derivedAchievements]
  );

  const claimAchievement = useCallback(
    (id: string): ClaimResult => {
      const target = derivedAchievements.find(item => item.id === id);
      if (!target) {
        return { success: false, reason: 'Achievement tidak ditemukan' };
      }
      if (target.isClaimed) {
        return { success: false, reason: 'Sudah diklaim' };
      }
      if (!target.isComplete) {
        return { success: false, reason: 'Belum selesai' };
      }

      setProgress(prev => ({
        ...prev,
        claimed: { ...prev.claimed, [id]: true },
        points: prev.points + (target.rewardPoints ?? 0),
      }));

      return { success: true, addedPoints: target.rewardPoints ?? 0 };
    },
    [derivedAchievements]
  );

  const recordDailyCheckIn = useCallback(() => {
    let didUpdate = false;
    setProgress(prev => {
      const next = getNextStreakState(prev.lastCheckInDate, prev.streak);
      didUpdate = next.didChange;
      if (!next.didChange) return prev;
      return { ...prev, streak: next.streak, lastCheckInDate: next.lastCheckInDate };
    });
    return didUpdate;
  }, []);

  const recordVisit = useCallback(
    (museumId: string) => {
      setProgress(prev => {
        const alreadyVisited = prev.visitedMuseums.includes(museumId);
        const nextVisited = alreadyVisited ? prev.visitedMuseums : [...prev.visitedMuseums, museumId];
        const nextStreak = getNextStreakState(prev.lastCheckInDate, prev.streak);

        return {
          ...prev,
          visitedMuseums: nextVisited,
          streak: nextStreak.streak,
          lastCheckInDate: nextStreak.lastCheckInDate,
        };
      });
    },
    []
  );

  const recordQuizCompletion = useCallback(() => {
    setProgress(prev => ({ ...prev, quizCompleted: prev.quizCompleted + 1 }));
  }, []);

  const recordShare = useCallback(() => {
    setProgress(prev => ({ ...prev, shares: prev.shares + 1 }));
  }, []);

  const today = formatDate(new Date());

  const value: AchievementContextValue = {
    achievements: derivedAchievements,
    completedCount,
    points: progress.points,
    hasCheckedInToday: progress.lastCheckInDate === today,
    stats: {
      visits: progress.visitedMuseums.length,
      quizzes: progress.quizCompleted,
      shares: progress.shares,
      streak: progress.streak,
    },
    loading,
    claimAchievement,
    recordVisit,
    recordQuizCompletion,
    recordShare,
    recordDailyCheckIn,
  };

  return <AchievementContext.Provider value={value}>{children}</AchievementContext.Provider>;
}

export const useAchievements = () => {
  const ctx = useContext(AchievementContext);
  if (!ctx) {
    throw new Error('useAchievements harus dipakai di dalam AchievementProvider');
  }
  return ctx;
};
