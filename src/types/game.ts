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
