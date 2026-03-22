import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { getCurriculumForClass, normalizeClassLevel } from '@/data/learningContent';
import { REWARDS } from '@/data/rewards';
import { supabase } from '@/lib/supabase';
import { logoutUser } from '@/lib/auth';
import type { Island } from '@/data/learningContent';

export interface StudentProfile {
  id: string;
  name: string;
  class: string;
  division: string;
  rollNo: number;
  avatar: string;
  email?: string;
  mobile?: string;
}

interface Progress {
  completedStations: string[];
  stars: number;
  currentIsland: string | null;
  currentStation: number;
}

interface GameContextType {
  student: StudentProfile | null;
  progress: Progress;
  isLoggedIn: boolean;
  loading: boolean;
  pendingBiometric: StudentProfile | null;
  login: (profile: StudentProfile) => void;
  confirmBiometricLogin: () => void;
  logout: () => void;
  completeStation: (stationId: string) => void;
  addStars: (count: number) => void;
  setCurrentIsland: (islandId: string | null) => void;
  setCurrentStation: (index: number) => void;
  getIslandProgress: (islandId: string) => number;
  currentClassLevel: '1' | '2' | '3';
  currentIslands: Island[];
}

// Merge reward fields into context type
type FullGameContextType = GameContextType & RewardState;

interface RewardState {
  earnedRewards: string[];
  newlyEarnedRewards: string[];
  clearNewRewards: () => void;
}

const defaultProgress: Progress = {
  completedStations: [],
  stars: 0,
  currentIsland: null,
  currentStation: 0,
};

const GameContext = createContext<FullGameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingBiometric, setPendingBiometric] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  // Reward tracking
  const earnedRewardsRef = useRef<string[]>([]);
  const [earnedRewards, setEarnedRewards] = useState<string[]>([]);
  const [newlyEarnedRewards, setNewlyEarnedRewards] = useState<string[]>([]);
  const clearNewRewards = useCallback(() => setNewlyEarnedRewards([]), []);
  const currentClassLevel = normalizeClassLevel(student?.class);
  const currentIslands = getCurriculumForClass(student?.class);

  // Track whether progress has been loaded from DB to avoid overwriting on mount
  const progressLoaded = useRef(false);

  const login = useCallback((profile: StudentProfile) => {
    setStudent(profile);
    setIsLoggedIn(true);
    setPendingBiometric(null);

    // Log login history
    supabase.from('login_history').insert({
      user_id: profile.id,
      device_info: navigator.userAgent,
    }).then(() => {});
  }, []);

  const confirmBiometricLogin = useCallback(() => {
    if (pendingBiometric) {
      login(pendingBiometric);
    }
  }, [pendingBiometric, login]);

  const logout = useCallback(async () => {
    await logoutUser();
    setStudent(null);
    setIsLoggedIn(false);
    setProgress(defaultProgress);
    earnedRewardsRef.current = [];
    setEarnedRewards([]);
    setNewlyEarnedRewards([]);
    progressLoaded.current = false;
  }, []);

  // Restore session on mount — require biometric before auto-login
  useEffect(() => {
    const restoreSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const studentProfile: StudentProfile = {
            id: profile.id,
            name: profile.name,
            class: profile.class,
            division: profile.division,
            rollNo: profile.roll_no,
            avatar: profile.avatar,
            email: profile.email,
          };

          // If biometric is set up, require verification before login
          if (profile.biometric_credential_id) {
            setPendingBiometric(studentProfile);
          } else {
            // No biometric set up — auto-login
            login(studentProfile);
          }
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, [login]);

  // Load progress from Supabase when student logs in
  useEffect(() => {
    if (!student) return;

    const loadProgress = async () => {
      const { data } = await supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', student.id)
        .single();

      if (data) {
        setProgress({
          completedStations: data.completed_stations || [],
          stars: data.stars || 0,
          currentIsland: data.current_island,
          currentStation: data.current_station || 0,
        });
        earnedRewardsRef.current = data.earned_rewards || [];
        setEarnedRewards(data.earned_rewards || []);
      }
      progressLoaded.current = true;
    };

    loadProgress();
  }, [student]);

  // Save progress to Supabase (debounced)
  useEffect(() => {
    if (!student || !progressLoaded.current) return;

    const timeout = setTimeout(async () => {
      await supabase
        .from('game_progress')
        .upsert({
          user_id: student.id,
          completed_stations: progress.completedStations,
          stars: progress.stars,
          current_island: progress.currentIsland,
          current_station: progress.currentStation,
          earned_rewards: earnedRewards,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [student, progress, earnedRewards]);

  const completeStation = useCallback((stationId: string) => {
    setProgress(prev => {
      if (prev.completedStations.includes(stationId)) {
        return prev;
      }

      const currentIsland = currentIslands.find((island) => island.id === prev.currentIsland);
      const currentStationIndex = currentIsland?.stations.findIndex((station) => station.id === stationId) ?? -1;
      const nextStationIndex = currentIsland
        ? Math.min(currentStationIndex + 1, currentIsland.stations.length - 1)
        : prev.currentStation;

      // Log station activity to Supabase
      if (student && currentIsland) {
        const station = currentIsland.stations.find(s => s.id === stationId);
        supabase.from('station_activity').insert({
          user_id: student.id,
          station_id: stationId,
          island_id: currentIsland.id,
          game_type: station?.gameType || 'unknown',
          stars_earned: 3,
        }).then(() => {});
      }

      return {
        ...prev,
        completedStations: [...prev.completedStations, stationId],
        currentStation: currentStationIndex >= 0 ? nextStationIndex : prev.currentStation,
      };
    });
  }, [currentIslands, student]);

  const addStars = useCallback((count: number) => {
    setProgress(prev => ({ ...prev, stars: prev.stars + count }));
  }, []);

  const setCurrentIsland = useCallback((islandId: string | null) => {
    setProgress(prev => {
      if (!islandId) {
        return { ...prev, currentIsland: null, currentStation: 0 };
      }

      const island = currentIslands.find((entry) => entry.id === islandId);
      if (!island) {
        return { ...prev, currentIsland: islandId, currentStation: 0 };
      }

      const completedCount = island.stations.filter((station) => prev.completedStations.includes(station.id)).length;
      const nextStationIndex = Math.min(completedCount, island.stations.length - 1);

      return { ...prev, currentIsland: islandId, currentStation: nextStationIndex };
    });
  }, [currentIslands]);

  const setCurrentStation = useCallback((index: number) => {
    setProgress(prev => ({ ...prev, currentStation: index }));
  }, []);

  const getIslandProgress = useCallback((islandId: string) => {
    const island = currentIslands.find(i => i.id === islandId);
    if (!island) return 0;
    const completed = island.stations.filter(s => progress.completedStations.includes(s.id)).length;
    return Math.round((completed / island.stations.length) * 100);
  }, [currentIslands, progress.completedStations]);

  // Auto-award badges
  useEffect(() => {
    const newRewards = REWARDS.filter(
      r => !earnedRewardsRef.current.includes(r.id) &&
           r.check(progress.completedStations, progress.stars),
    );
    if (newRewards.length > 0) {
      const newIds = newRewards.map(r => r.id);
      earnedRewardsRef.current = [...earnedRewardsRef.current, ...newIds];
      setEarnedRewards(prev => [...prev, ...newIds]);
      setNewlyEarnedRewards(prev => [...prev, ...newIds]);
    }
  }, [progress.completedStations, progress.stars]);

  return (
    <GameContext.Provider value={{
      student, progress, isLoggedIn, loading, pendingBiometric, login, confirmBiometricLogin, logout,
      completeStation, addStars, setCurrentIsland, setCurrentStation, getIslandProgress,
      currentClassLevel, currentIslands,
      earnedRewards, newlyEarnedRewards, clearNewRewards,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext as React.Context<FullGameContextType | undefined>);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
