import { TEAM_COLORS } from './game';
import { BallSkin, BallSkinOption, CountryCode, CountryOption, TeamColors, UniformKit } from '../types/customize';

export const DEFAULT_PLAYER_COLORS: TeamColors = {
  shirt: TEAM_COLORS.player.shirt,
  pants: TEAM_COLORS.player.pants,
};

export const DEFAULT_COUNTRY: CountryCode = 'KR';

export const COUNTRIES: CountryOption[] = [
  { code: 'KR', name: '대한민국' },
  { code: 'BR', name: '브라질' },
  { code: 'JP', name: '일본' },
  { code: 'US', name: '미국' },
  { code: 'GB', name: '잉글랜드' },
  { code: 'ES', name: '스페인' },
  { code: 'DE', name: '독일' },
  { code: 'FR', name: '프랑스' },
  { code: 'AR', name: '아르헨티나' },
  { code: 'IT', name: '이탈리아' },
  { code: 'PT', name: '포르투갈' },
  { code: 'MX', name: '멕시코' },
];

const VALID_COUNTRY_CODES = new Set<CountryCode>(COUNTRIES.map((c) => c.code));

export function parseCountryCode(raw: unknown): CountryCode {
  return typeof raw === 'string' && VALID_COUNTRY_CODES.has(raw as CountryCode)
    ? (raw as CountryCode)
    : DEFAULT_COUNTRY;
}

export function findCountry(code: CountryCode): CountryOption | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

/** Random AI opponent country; excludes player pick when possible */
export function pickRandomCountry(exclude?: CountryCode): CountryCode {
  const pool = exclude ? COUNTRIES.filter((c) => c.code !== exclude) : COUNTRIES;
  return pool[Math.floor(Math.random() * pool.length)].code;
}

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
  { id: 'blue', label: 'Blue', shirt: '#2563eb', pants: '#1e3a8a' },
  { id: 'red', label: 'Red', shirt: '#e63946', pants: '#1a1a1a' },
  { id: 'orange', label: 'Orange', shirt: '#ff8500', pants: '#c2410c' },
  { id: 'navy', label: 'Navy', shirt: '#f0f0f0', pants: '#1e3a5f' },
  { id: 'teal', label: 'Teal', shirt: '#80ed99', pants: '#007f5f' },
];

export function findKitByColors(colors: TeamColors): UniformKit | undefined {
  return UNIFORM_KITS.find((k) => k.shirt === colors.shirt && k.pants === colors.pants);
}

const DEFAULT_AI_COLORS: TeamColors = {
  shirt: TEAM_COLORS.ai.shirt,
  pants: TEAM_COLORS.ai.pants,
};

function isSameShirt(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

/** AI kit — default red unless it clashes with the player's shirt */
export function pickAiTeamColors(playerColors: TeamColors): TeamColors {
  if (!isSameShirt(DEFAULT_AI_COLORS.shirt, playerColors.shirt)) {
    return DEFAULT_AI_COLORS;
  }
  const alternatives = UNIFORM_KITS.filter((k) => !isSameShirt(k.shirt, playerColors.shirt));
  if (alternatives.length === 0) {
    return { shirt: '#9d0208', pants: '#5c0000' };
  }
  const kit = alternatives[Math.floor(Math.random() * alternatives.length)];
  return { shirt: kit.shirt, pants: kit.pants };
}
