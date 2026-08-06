import { BALL_RADIUS, CHARACTER_RADIUS, MIN_KICK_SPEED } from '../constants/game';
import { GkDifficultyProfile } from '../constants/gkDifficulty';
import { DEFAULT_PLAYER_COLORS, pickAiTeamColors } from '../constants/skins';
import { TeamColors } from '../types/customize';
import { Ball, Character, FieldBounds, Gender, SquadSize, Team } from '../types/game';
import { createGkBars } from './gk';
import { computeBoardLayout, getGoalZone } from './layout';

export function getFieldBounds(
  width: number,
  height: number,
  gkProfile?: Pick<GkDifficultyProfile, 'goalHeightRatio'>
): FieldBounds {
  return {
    width,
    height,
    goalZone: getGoalZone(height, gkProfile?.goalHeightRatio),
  };
}

export function getBoardSize(viewWidth: number, viewHeight: number): { width: number; height: number } {
  return computeBoardLayout(viewWidth, viewHeight);
}

export { createGkBars };

const FORMATIONS: Record<SquadSize, number[]> = {
  2: [-0.12, 0.12],
  3: [-0.15, 0, 0.15],
};

function makeCharacter(
  id: string,
  team: Team,
  gender: Gender,
  x: number,
  y: number,
  colors: TeamColors
): Character {
  return {
    id,
    team,
    gender,
    x,
    y,
    vx: 0,
    vy: 0,
    radius: CHARACTER_RADIUS,
    shirtColor: colors.shirt,
    pantsColor: colors.pants,
  };
}

function createTeamCharacters(
  team: Team,
  prefix: string,
  fieldX: number,
  field: FieldBounds,
  squadSize: SquadSize,
  colors: TeamColors
): Character[] {
  const { height } = field;
  const cy = height / 2;
  const yOffsets = FORMATIONS[squadSize];

  return yOffsets.map((offset, index) =>
    makeCharacter(
      `${prefix}${index + 1}`,
      team,
      index === 0 ? 'female' : 'male',
      field.width * fieldX,
      cy + height * offset,
      colors
    )
  );
}

export function createInitialCharacters(
  field: FieldBounds,
  squadSize: SquadSize = 2,
  playerColors: TeamColors = DEFAULT_PLAYER_COLORS,
  aiColors: TeamColors = pickAiTeamColors(playerColors)
): Character[] {
  return [
    ...createTeamCharacters('player', 'p', 0.22, field, squadSize, playerColors),
    ...createTeamCharacters('ai', 'a', 0.78, field, squadSize, aiColors),
  ];
}

export function createInitialBall(field: FieldBounds): Ball {
  return {
    x: field.width / 2,
    y: field.height / 2,
    vx: 0,
    vy: 0,
    radius: BALL_RADIUS,
  };
}

export function resetAfterGoal(
  field: FieldBounds,
  squadSize: SquadSize,
  playerColors: TeamColors = DEFAULT_PLAYER_COLORS,
  aiColors: TeamColors = pickAiTeamColors(playerColors)
): { ball: Ball; characters: Character[] } {
  return {
    ball: createInitialBall(field),
    characters: createInitialCharacters(field, squadSize, playerColors, aiColors),
  };
}

export function findCharacterAt(
  characters: Character[],
  x: number,
  y: number,
  team: Team,
  extraRadius = 12
): Character | null {
  let closest: Character | null = null;
  let minDist = Infinity;
  for (const ch of characters) {
    if (ch.team !== team) continue;
    const d = Math.sqrt((x - ch.x) ** 2 + (y - ch.y) ** 2);
    if (d <= ch.radius + extraRadius && d < minDist) {
      minDist = d;
      closest = ch;
    }
  }
  return closest;
}

export function pickAiCharacter(characters: Character[], ball: Ball): Character {
  const aiChars = characters.filter((c) => c.team === 'ai');
  return aiChars.reduce((best, ch) => {
    const dBest = Math.sqrt((best.x - ball.x) ** 2 + (best.y - ball.y) ** 2);
    const dCh = Math.sqrt((ch.x - ball.x) ** 2 + (ch.y - ball.y) ** 2);
    return dCh < dBest ? ch : best;
  });
}

export function computeAiFlick(char: Character, ball: Ball): { vx: number; vy: number } {
  const dx = ball.x - char.x;
  const dy = ball.y - char.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const power = Math.min(Math.max(dist * 0.22, MIN_KICK_SPEED + 4), 22);
  const jitter = (Math.random() - 0.5) * 0.08;
  const angle = Math.atan2(dy, dx) + jitter;
  return {
    vx: Math.cos(angle) * power,
    vy: Math.sin(angle) * power,
  };
}
