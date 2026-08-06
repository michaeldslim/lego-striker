export type Team = 'player' | 'ai';
export type GamePhase = 'aiming' | 'simulating' | 'goalCelebration';
export type Turn = Team;
export type Gender = 'male' | 'female';
export type SquadSize = 2 | 3;

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  /** 커브 잔여 시간 (ms) — 0이면 비활성 */
  curveRemainingMs: number;
  /** 수직 가속 (화면 y+, 아래쪽) */
  curveAccelVy: number;
  /** 커브 비행 궤적 (렌더용) */
  curveTrail: { x: number; y: number }[];
}

export type CurveDirection = -1 | 1;

export interface CurveKick {
  direction: CurveDirection;
  /** 0.5–1.0 — 조준 각도 수직 성분에 비례 */
  strength: number;
}

export interface Character {
  id: string;
  team: Team;
  gender: Gender;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  shirtColor: string;
  pantsColor: string;
  /** 플릭 시 커브 예약 — 킥 순간 공으로 전달 */
  curveKick?: CurveKick;
}

export interface GoalZone {
  top: number;
  bottom: number;
  width: number;
}

export interface FieldBounds {
  width: number;
  height: number;
  goalZone: GoalZone;
}

export interface GoalkeeperBar {
  side: Team;
  centerX: number;
  length: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  playerGoals: number;
  aiGoals: number;
  won: boolean;
  date: string;
}

export interface GameResult {
  playerGoals: number;
  aiGoals: number;
  won: boolean;
}
