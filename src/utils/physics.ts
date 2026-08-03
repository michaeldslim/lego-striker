import { Ball, Character, FieldBounds, GoalkeeperBar } from '../types/game';
import {
  BALL_FRICTION,
  BALL_LOW_SPEED,
  BALL_LOW_SPEED_FRICTION,
  BALL_MIN_SPEED,
  CHAR_FRICTION,
  CHAR_MIN_SPEED,
  CHAR_STOP_ON_KICK,
  KICK_TRANSFER,
  MIN_KICK_SPEED,
} from '../constants/game';
import { getGkBarRects, resolveBallGkBar } from './gk';

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

interface CircleBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

function speed(body: CircleBody): number {
  return Math.sqrt(body.vx * body.vx + body.vy * body.vy);
}

function applyBallFriction(ball: CircleBody): void {
  const s = speed(ball);
  if (s < BALL_MIN_SPEED) {
    ball.vx = 0;
    ball.vy = 0;
    return;
  }

  const friction = s < BALL_LOW_SPEED ? BALL_LOW_SPEED_FRICTION : BALL_FRICTION;
  ball.vx *= friction;
  ball.vy *= friction;

  if (speed(ball) < BALL_MIN_SPEED) {
    ball.vx = 0;
    ball.vy = 0;
  }
}

function applyCharFriction(ch: CircleBody): void {
  ch.vx *= CHAR_FRICTION;
  ch.vy *= CHAR_FRICTION;
  if (speed(ch) < CHAR_MIN_SPEED) {
    ch.vx = 0;
    ch.vy = 0;
  }
}

function separateCharacterBall(character: CircleBody, ball: CircleBody): { nx: number; ny: number } | null {
  const dx = ball.x - character.x;
  const dy = ball.y - character.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const minDist = character.radius + ball.radius;
  if (dist >= minDist || dist === 0) return null;

  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = minDist - dist;

  character.x -= nx * overlap * 0.3;
  character.y -= ny * overlap * 0.3;
  ball.x += nx * overlap * 0.7;
  ball.y += ny * overlap * 0.7;

  return { nx, ny };
}

/**
 * Football Striker 스타일 킥: 움직이는 캐릭터가 공을 치면
 * 캐릭터는 멈추고 운동량은 공으로 전달된다.
 */
function resolveKick(character: CircleBody, ball: CircleBody): void {
  const normal = separateCharacterBall(character, ball);
  if (!normal) return;

  const { nx, ny } = normal;
  const charSpeedN = character.vx * nx + character.vy * ny;

  // 캐릭터가 공 쪽으로 움직일 때만 킥
  if (charSpeedN < MIN_KICK_SPEED) {
    // 정지/느린 캐릭터 — 공만 살짝 밀어냄
    if (speed(ball) < 0.5 && speed(character) < CHAR_MIN_SPEED) return;
    const push = 0.4;
    ball.vx += nx * push;
    ball.vy += ny * push;
    return;
  }

  const kickPower = charSpeedN * KICK_TRANSFER;
  ball.vx += nx * kickPower;
  ball.vy += ny * kickPower;

  // 캐릭터는 킥 후 거의 멈춤
  character.vx *= CHAR_STOP_ON_KICK;
  character.vy *= CHAR_STOP_ON_KICK;
}

/** 캐릭터끼리 부딪힘 — 약한 반발, 빠르게 감속 */
function resolveCharacterBump(a: CircleBody, b: CircleBody): void {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const minDist = a.radius + b.radius;
  if (dist >= minDist || dist === 0) return;

  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = minDist - dist;

  a.x -= nx * overlap * 0.5;
  a.y -= ny * overlap * 0.5;
  b.x += nx * overlap * 0.5;
  b.y += ny * overlap * 0.5;

  const dvx = a.vx - b.vx;
  const dvy = a.vy - b.vy;
  const dvn = dvx * nx + dvy * ny;
  if (dvn <= 0) return;

  const impulse = dvn * 0.35;
  a.vx -= impulse * nx;
  a.vy -= impulse * ny;
  b.vx += impulse * nx;
  b.vy += impulse * ny;
}

function isInGoalMouth(y: number, radius: number, field: FieldBounds): boolean {
  const { top, bottom } = field.goalZone;
  return y - radius > top && y + radius < bottom;
}

function bounceBallOffWalls(ball: CircleBody, field: FieldBounds): void {
  const { width, height, goalZone } = field;
  const goalTop = goalZone.top;
  const goalBottom = goalZone.bottom;

  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.vy = Math.abs(ball.vy) * 0.65;
  }
  if (ball.y + ball.radius > height) {
    ball.y = height - ball.radius;
    ball.vy = -Math.abs(ball.vy) * 0.65;
  }

  if (ball.x - ball.radius < 0 && !isInGoalMouth(ball.y, ball.radius, field)) {
    ball.x = ball.radius;
    ball.vx = Math.abs(ball.vx) * 0.6;
  }
  if (ball.x + ball.radius > width && !isInGoalMouth(ball.y, ball.radius, field)) {
    ball.x = width - ball.radius;
    ball.vx = -Math.abs(ball.vx) * 0.6;
  }
}

function clampCharacterToField(ch: CircleBody, field: FieldBounds): void {
  const { width, height } = field;
  if (ch.y - ch.radius < 0) {
    ch.y = ch.radius;
    ch.vy = Math.abs(ch.vy) * 0.3;
  }
  if (ch.y + ch.radius > height) {
    ch.y = height - ch.radius;
    ch.vy = -Math.abs(ch.vy) * 0.3;
  }
  if (ch.x - ch.radius < 0) {
    ch.x = ch.radius;
    ch.vx = Math.abs(ch.vx) * 0.3;
  }
  if (ch.x + ch.radius > width) {
    ch.x = width - ch.radius;
    ch.vx = -Math.abs(ch.vx) * 0.3;
  }
}

export function allSettled(ball: Ball, characters: Character[]): boolean {
  if (speed(ball) >= BALL_MIN_SPEED) return false;
  return characters.every((c) => speed(c) < CHAR_MIN_SPEED);
}

export type GoalScorer = 'player' | 'ai' | null;

export function stepPhysics(
  ball: Ball,
  characters: Character[],
  field: FieldBounds,
  gkBars: GoalkeeperBar[],
  elapsedMs: number
): { ball: Ball; characters: Character[]; goal: GoalScorer; saved: boolean } {
  const newBall: Ball = { ...ball };
  const newChars = characters.map((c) => ({ ...c }));
  let saved = false;

  // 1. 이동
  newBall.x += newBall.vx;
  newBall.y += newBall.vy;
  for (const ch of newChars) {
    ch.x += ch.vx;
    ch.y += ch.vy;
  }

  // 2. 벽
  bounceBallOffWalls(newBall, field);
  for (const ch of newChars) {
    clampCharacterToField(ch, field);
  }

  // 3. 골키퍼 막대 ↔ 공 (캐릭터는 통과)
  const barRects = getGkBarRects(gkBars, field, elapsedMs);
  for (const rect of barRects) {
    if (resolveBallGkBar(newBall, rect)) {
      saved = true;
    }
  }

  // 4. 캐릭터 → 공 킥 (축구 핵심)
  for (const ch of newChars) {
    resolveKick(ch, newBall);
  }

  // 5. 캐릭터끼리
  for (let i = 0; i < newChars.length; i++) {
    for (let j = i + 1; j < newChars.length; j++) {
      resolveCharacterBump(newChars[i], newChars[j]);
    }
  }

  // 6. 마찰 (캐릭터는 빠르게, 공은 천천히 감속)
  applyBallFriction(newBall);
  for (const ch of newChars) {
    applyCharFriction(ch);
  }

  let goal: GoalScorer = null;
  if (newBall.x - newBall.radius < -2 && isInGoalMouth(newBall.y, newBall.radius, field)) {
    goal = 'ai';
  } else if (newBall.x + newBall.radius > field.width + 2 && isInGoalMouth(newBall.y, newBall.radius, field)) {
    goal = 'player';
  }

  return { ball: newBall, characters: newChars, goal, saved };
}

export function formatScore(n: number): string {
  return n.toLocaleString();
}
