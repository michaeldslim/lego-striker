import { GK_BAR_THICKNESS, GK_BOUNCE } from '../constants/game';
import { Ball, FieldBounds, GoalkeeperBar, GoalZone, Team } from '../types/game';

export interface GkBarRect {
  side: Team;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function createGkBars(field: FieldBounds, barLengthRatio: number): GoalkeeperBar[] {
  const { goalZone, width } = field;
  const barLength = goalZone.width * barLengthRatio;
  return [
    { side: 'player', centerX: goalZone.width / 2, length: barLength },
    { side: 'ai', centerX: width - goalZone.width / 2, length: barLength },
  ];
}

/** far post ↔ near post 사이 왕복 (삼각파) */
export function getGkBarCenterY(
  _side: Team,
  goalZone: GoalZone,
  elapsedMs: number,
  barPeriodMs: number
): number {
  const margin = GK_BAR_THICKNESS / 2 + 2;
  const minY = goalZone.top + margin;
  const maxY = goalZone.bottom - margin;
  const range = maxY - minY;
  const phase = (elapsedMs % barPeriodMs) / barPeriodMs;
  const t = phase < 0.5 ? phase * 2 : 2 - phase * 2;
  return minY + t * range;
}

export function getGkBarRects(
  bars: GoalkeeperBar[],
  field: FieldBounds,
  elapsedMs: number,
  barPeriodMs: number
): GkBarRect[] {
  return bars.map((bar) => {
    const centerY = getGkBarCenterY(bar.side, field.goalZone, elapsedMs, barPeriodMs);
    return {
      side: bar.side,
      x: bar.centerX - bar.length / 2,
      y: centerY - GK_BAR_THICKNESS / 2,
      width: bar.length,
      height: GK_BAR_THICKNESS,
    };
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** 원(공) ↔ AABB(막대) 충돌 — 막대는 무한 질량, 공만 반사 */
export function resolveBallGkBar(ball: Ball, rect: GkBarRect): boolean {
  const closestX = clamp(ball.x, rect.x, rect.x + rect.width);
  const closestY = clamp(ball.y, rect.y, rect.y + rect.height);
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  const distSq = dx * dx + dy * dy;

  if (distSq >= ball.radius * ball.radius) return false;

  const dist = Math.sqrt(distSq) || 0.001;
  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = ball.radius - dist;

  ball.x += nx * overlap;
  ball.y += ny * overlap;

  const vDotN = ball.vx * nx + ball.vy * ny;
  if (vDotN < 0) {
    ball.vx -= (1 + GK_BOUNCE) * vDotN * nx;
    ball.vy -= (1 + GK_BOUNCE) * vDotN * ny;
  }

  return true;
}
