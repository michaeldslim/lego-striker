import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SQUAD_SIZE, LEADERBOARD_SIZE } from '../constants/game';
import { DEFAULT_BALL_SKIN, DEFAULT_COUNTRY, DEFAULT_PLAYER_COLORS, parseBallSkin, parseCountryCode } from '../constants/skins';
import { BallSkin, CountryCode, TeamColors } from '../types/customize';
import { LeaderboardEntry, SquadSize } from '../types/game';

const STORAGE_KEY = '@lego_striker_leaderboard';
const SQUAD_SIZE_KEY = '@lego_striker_squad_size';
const PREFS_KEY = '@lego_striker_prefs';

export interface GamePreferences {
  squadSize: SquadSize;
  teamColors: TeamColors;
  ballSkin: BallSkin;
  countryCode: CountryCode;
}

const DEFAULT_PREFS: GamePreferences = {
  squadSize: DEFAULT_SQUAD_SIZE,
  teamColors: DEFAULT_PLAYER_COLORS,
  ballSkin: DEFAULT_BALL_SKIN,
  countryCode: DEFAULT_COUNTRY,
};

function isValidHex(color: unknown): color is string {
  return typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color);
}

function parseTeamColors(raw: unknown): TeamColors {
  if (!raw || typeof raw !== 'object') return DEFAULT_PLAYER_COLORS;
  const colors = raw as Record<string, unknown>;
  if (isValidHex(colors.shirt) && isValidHex(colors.pants)) {
    return { shirt: colors.shirt, pants: colors.pants };
  }
  return DEFAULT_PLAYER_COLORS;
}

async function loadLegacySquadSize(): Promise<SquadSize> {
  try {
    const raw = await AsyncStorage.getItem(SQUAD_SIZE_KEY);
    return raw === '3' ? 3 : 2;
  } catch {
    return DEFAULT_SQUAD_SIZE;
  }
}

export async function loadPreferences(): Promise<GamePreferences> {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GamePreferences>;
      return {
        squadSize: parsed.squadSize === 3 ? 3 : 2,
        teamColors: parseTeamColors(parsed.teamColors),
        ballSkin: parseBallSkin(parsed.ballSkin),
        countryCode: parseCountryCode(parsed.countryCode),
      };
    }
  } catch {
    // fall through to legacy migration
  }

  const squadSize = await loadLegacySquadSize();
  return {
    squadSize,
    teamColors: DEFAULT_PLAYER_COLORS,
    ballSkin: DEFAULT_BALL_SKIN,
    countryCode: DEFAULT_COUNTRY,
  };
}

export async function savePreferences(patch: Partial<GamePreferences>): Promise<GamePreferences> {
  const current = await loadPreferences();
  const updated: GamePreferences = {
    squadSize: patch.squadSize === 3 ? 3 : patch.squadSize === 2 ? 2 : current.squadSize,
    teamColors: patch.teamColors ? parseTeamColors(patch.teamColors) : current.teamColors,
    ballSkin: patch.ballSkin ? parseBallSkin(patch.ballSkin) : current.ballSkin,
    countryCode: patch.countryCode ? parseCountryCode(patch.countryCode) : current.countryCode,
  };
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(updated));
  await AsyncStorage.setItem(SQUAD_SIZE_KEY, String(updated.squadSize));
  return updated;
}

export async function getSquadSize(): Promise<SquadSize> {
  const prefs = await loadPreferences();
  return prefs.squadSize;
}

export async function setSquadSize(size: SquadSize): Promise<void> {
  await savePreferences({ squadSize: size });
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
