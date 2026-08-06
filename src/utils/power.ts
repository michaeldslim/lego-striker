import {
  AIM_DIRECTION_MIN,
  CHARGE_CYCLE_MS,
  CURVE_AIM_MAX_DY,
  CURVE_AIM_MIN_DY,
  CURVE_MIN_POWER_RATIO,
  FLICK_HORIZONTAL_BIAS,
  FLICK_VERTICAL_DAMP,
  MAX_POWER,
  SUPER_POWER_RATIO,
  CANCEL_AIM_RADIUS,
} from '../constants/game';
import { colors } from '../constants/theme';
import { CurveDirection } from '../types/game';

export interface AimPower {
  power: number;
  ratio: number;
  isSuper: boolean;
  isCurveEligible: boolean;
  curveDirection: CurveDirection | null;
  curveStrength: number;
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

/** 손가락 수직 오프셋으로 커브 방향·강도 (플릭 각도와 독립) */
export function computeCurveFromDrag(
  character: { x: number; y: number },
  aimCurrent: { x: number; y: number },
  aimDraggedOut: boolean
): { direction: CurveDirection | null; strength: number } {
  if (!aimDraggedOut) return { direction: null, strength: 0 };

  const dy = aimCurrent.y - character.y;
  const absDy = Math.abs(dy);
  if (absDy < CURVE_AIM_MIN_DY) return { direction: null, strength: 0 };

  const direction: CurveDirection = dy < 0 ? -1 : 1;
  const t = (absDy - CURVE_AIM_MIN_DY) / (CURVE_AIM_MAX_DY - CURVE_AIM_MIN_DY);
  const strength = Math.min(1, Math.max(0.5, 0.5 + t * 0.5));

  return { direction, strength };
}

export function isCurveShotEligible(
  ratio: number,
  aimDraggedOut: boolean,
  curveDirection: CurveDirection | null
): boolean {
  return aimDraggedOut && ratio >= CURVE_MIN_POWER_RATIO && curveDirection !== null;
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

/**
 * 플릭 조준 각도 — 수직 드래그는 커브 전용, 조준은 수평 위주 또는 공 방향 유지
 */
export function computeFlickAngle(
  character: { x: number; y: number },
  aimCurrent: { x: number; y: number },
  ball: { x: number; y: number } | undefined,
  aimDraggedOut: boolean,
  cancelling: boolean
): number {
  const dx = aimCurrent.x - character.x;
  const dy = aimCurrent.y - character.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const defaultAngle = ball
    ? Math.atan2(ball.y - character.y, ball.x - character.x)
    : 0;

  if (cancelling || dist < AIM_DIRECTION_MIN) {
    return defaultAngle;
  }

  // 수직 위주 → 공 방향 조준 유지 (위/아래 움직임은 커브만)
  if (Math.abs(dx) <= Math.abs(dy) * FLICK_HORIZONTAL_BIAS) {
    return defaultAngle;
  }

  // 수평 위주 → 손가락 방향 (수직 성분은 약하게만 반영)
  return Math.atan2(dy * FLICK_VERTICAL_DAMP, dx);
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

  const angle = computeFlickAngle(character, aimCurrent, ball, aimDraggedOut, cancelling);

  const ratio = computeOscillatingChargeRatio(elapsedMs);
  const power = ratio * MAX_POWER;
  const { direction: curveDirection, strength: curveStrength } = computeCurveFromDrag(
    character,
    aimCurrent,
    aimDraggedOut
  );

  return {
    power,
    ratio,
    isSuper: ratio >= SUPER_POWER_RATIO,
    isCurveEligible: isCurveShotEligible(ratio, aimDraggedOut, curveDirection),
    curveDirection,
    curveStrength,
    angle,
    cancelling,
  };
}

/** 0~1 파워 비율에 따른 게이지 색 (커브와 무관 — 조준선 색 왜곡 방지) */
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
