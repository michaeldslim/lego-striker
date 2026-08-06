import { FIELD, GK_BAR_LENGTH_RATIO, GK_BAR_PERIOD_MS } from './game';

export type GkDifficulty = 'easy' | 'normal' | 'hard';

export interface GkDifficultyProfile {
  barPeriodMs: number;
  barLengthRatio: number;
  goalHeightRatio: number;
}

export const DEFAULT_GK_DIFFICULTY: GkDifficulty = 'normal';

export const GK_DIFFICULTY_OPTIONS: readonly GkDifficulty[] = ['easy', 'normal', 'hard'];

export const GK_DIFFICULTY_PRESETS: Record<GkDifficulty, GkDifficultyProfile> = {
  easy: {
    barPeriodMs: 1400,
    barLengthRatio: 0.62,
    goalHeightRatio: 0.42,
  },
  normal: {
    barPeriodMs: GK_BAR_PERIOD_MS,
    barLengthRatio: GK_BAR_LENGTH_RATIO,
    goalHeightRatio: FIELD.goalHeightRatio,
  },
  hard: {
    barPeriodMs: 800,
    barLengthRatio: 0.88,
    goalHeightRatio: 0.32,
  },
};

export function parseGkDifficulty(raw: unknown): GkDifficulty {
  if (raw === 'easy' || raw === 'hard') return raw;
  return DEFAULT_GK_DIFFICULTY;
}

export function getGkDifficultyProfile(difficulty: GkDifficulty): GkDifficultyProfile {
  return GK_DIFFICULTY_PRESETS[difficulty];
}
