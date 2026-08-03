import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeaderboardEntry } from '../types/game';
import { LEADERBOARD_SIZE } from '../constants/game';

const STORAGE_KEY = '@lego_striker_leaderboard';
const SQUAD_SIZE_KEY = '@lego_striker_squad_size';

export async function getSquadSize(): Promise<2 | 3> {
  try {
    const raw = await AsyncStorage.getItem(SQUAD_SIZE_KEY);
    return raw === '3' ? 3 : 2;
  } catch {
    return 2;
  }
}

export async function setSquadSize(size: 2 | 3): Promise<void> {
  await AsyncStorage.setItem(SQUAD_SIZE_KEY, String(size));
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export async function saveMatch(entry: Omit<LeaderboardEntry, 'id'>): Promise<LeaderboardEntry[]> {
  const existing = await getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: Date.now().toString(),
  };
  const updated = [...existing, newEntry]
    .sort((a, b) => {
      const winsA = a.won ? 1 : 0;
      const winsB = b.won ? 1 : 0;
      if (winsB !== winsA) return winsB - winsA;
      const diffA = a.playerGoals - a.aiGoals;
      const diffB = b.playerGoals - b.aiGoals;
      if (diffB !== diffA) return diffB - diffA;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, LEADERBOARD_SIZE);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function getWinCount(): Promise<number> {
  const board = await getLeaderboard();
  return board.filter((e) => e.won).length;
}

export async function clearLeaderboard(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
