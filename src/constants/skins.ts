import { TEAM_COLORS } from './game';
import { BallSkin, BallSkinOption, TeamColors, UniformKit } from '../types/customize';

export const DEFAULT_PLAYER_COLORS: TeamColors = {
  shirt: TEAM_COLORS.player.shirt,
  pants: TEAM_COLORS.player.pants,
};

export const DEFAULT_BALL_SKIN: BallSkin = 'legacy';

export const BALL_SKINS: BallSkinOption[] = [
  { id: 'legacy', label: 'Legacy' },
  { id: 'pl', label: 'PL' },
  { id: 'worldcup', label: 'World Cup' },
];

const VALID_BALL_SKINS = new Set<BallSkin>(BALL_SKINS.map((s) => s.id));

/** Migrate pre-v1.4 ball skin ids */
const LEGACY_BALL_SKIN_IDS: Record<string, BallSkin> = {
  classic: 'legacy',
  neon: 'pl',
  lego: 'worldcup',
};

export function parseBallSkin(raw: unknown): BallSkin {
  if (typeof raw !== 'string') return DEFAULT_BALL_SKIN;
  if (VALID_BALL_SKINS.has(raw as BallSkin)) return raw as BallSkin;
  return LEGACY_BALL_SKIN_IDS[raw] ?? DEFAULT_BALL_SKIN;
}

/** Curated shirt + pants kits that read well on the green pitch */
export const UNIFORM_KITS: UniformKit[] = [
  { id: 'cyan', label: 'Cyan', shirt: '#00b4d8', pants: '#0077b6' },
  { id: 'gold', label: 'Gold', shirt: '#ffd60a', pants: '#9a6700' },
  { id: 'neon', label: 'Neon', shirt: '#39ff14', pants: '#1a7a0a' },
  { id: 'pink', label: 'Pink', shirt: '#ff2d6a', pants: '#9b1d42' },
  { id: 'purple', label: 'Purple', shirt: '#9b5de5', pants: '#5a189a' },
  { id: 'orange', label: 'Orange', shirt: '#ff8500', pants: '#c2410c' },
  { id: 'navy', label: 'Navy', shirt: '#f0f0f0', pants: '#1e3a5f' },
  { id: 'teal', label: 'Teal', shirt: '#80ed99', pants: '#007f5f' },
];

export function findKitByColors(colors: TeamColors): UniformKit | undefined {
  return UNIFORM_KITS.find((k) => k.shirt === colors.shirt && k.pants === colors.pants);
}
