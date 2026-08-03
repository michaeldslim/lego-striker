import { AIM_DIRECTION_MIN, CHARGE_CYCLE_MS, MAX_POWER, SUPER_POWER_RATIO, CANCEL_AIM_RADIUS } from '../constants/game';
import { colors } from '../constants/theme';

export interface AimPower {
  power: number;
  ratio: number;
  isSuper: boolean;
  angle: number;
  cancelling: boolean;
}

/** 홀드 경과 시간 → 0~1 왕복 파워 비율 (삼각파) */
export function computeOscillatingChargeRatio(elapsedMs: number): number {
  const cycle = Math.max(CHARGE_CYCLE_MS, 1);
  const t = ((elapsedMs % cycle) + cycle) % cycle;
  const half = cycle / 2;
  const phase = t / half;
  return phase <= 1 ? phase : 2 - phase;
}

/** 손가락이 캐릭터 위로 돌아왔는지 (조준 시작 후에만 취소) */
export function isAimCancelZone(
  character: { x: number; y: number },
  aimCurrent: { x: number; y: number },
  aimDraggedOut: boolean
): boolean {
  if (!aimDraggedOut) return false;
  const dx = aimCurrent.x - character.x;
  const dy = aimCurrent.y - character.y;
  return dx * dx + dy * dy <= CANCEL_AIM_RADIUS * CANCEL_AIM_RADIUS;
}

/** 캐릭터 위치·손가락 위치·홀드 시간으로 슛 파워·방향 계산 */
export function computeAimPower(
  character: { x: number; y: number },
  aimCurrent: { x: number; y: number },
  elapsedMs: number,
  ball?: { x: number; y: number },
  aimDraggedOut = false
): AimPower {
  const cancelling = isAimCancelZone(character, aimCurrent, aimDraggedOut);
  const dx = aimCurrent.x - character.x;
  const dy = aimCurrent.y - character.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const defaultAngle = ball
    ? Math.atan2(ball.y - character.y, ball.x - character.x)
    : 0;

  let angle: number;
  if (cancelling || dist < AIM_DIRECTION_MIN) {
    angle = defaultAngle;
  } else {
    angle = Math.atan2(dy, dx);
  }

  const ratio = computeOscillatingChargeRatio(elapsedMs);
  const power = ratio * MAX_POWER;

  return {
    power,
    ratio,
    isSuper: ratio >= SUPER_POWER_RATIO,
    angle,
    cancelling,
  };
}

/** 0~1 파워 비율에 따른 게이지 색 */
export function powerGaugeColor(ratio: number): string {
  if (ratio >= SUPER_POWER_RATIO) return colors.neonGold;
  if (ratio >= 0.55) return '#ff9f1c';
  if (ratio >= 0.28) return colors.neonCyan;
  return 'rgba(255,255,255,0.45)';
}

/** SVG arc path (시계 방향) */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const startX = cx + radius * Math.cos(startAngle);
  const startY = cy + radius * Math.sin(startAngle);
  const endX = cx + radius * Math.cos(endAngle);
  const endY = cy + radius * Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
}
