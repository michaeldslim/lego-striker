import React from 'react';
import { Circle, G, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { CANCEL_AIM_RADIUS, SUPER_POWER_RATIO } from '../constants/game';
import { colors } from '../constants/theme';
import { powerGaugeColor } from '../utils/power';

interface Props {
  x: number;
  y: number;
  angle: number;
  ratio: number;
  cancelling?: boolean;
}

/** 취소 존보다 큰 파워 레인지 원 */
const POWER_RING_RADIUS = 56;
const POWER_RING_WIDTH = 6;
/** 킥 방향 가이드 길이 */
const AIM_LINE_LENGTH = 145;
const ARROW_SIZE = 10;

function circleDashLength(radius: number, portion: number): string {
  const circumference = 2 * Math.PI * radius;
  const filled = circumference * Math.min(Math.max(portion, 0), 1);
  return `${filled} ${circumference}`;
}

function aimArrowPoints(x: number, y: number, angle: number, tipDist: number): string {
  const tipX = x + Math.cos(angle) * tipDist;
  const tipY = y + Math.sin(angle) * tipDist;
  const backAngle1 = angle + Math.PI * 0.82;
  const backAngle2 = angle - Math.PI * 0.82;
  const x1 = tipX + Math.cos(backAngle1) * ARROW_SIZE;
  const y1 = tipY + Math.sin(backAngle1) * ARROW_SIZE;
  const x2 = tipX + Math.cos(backAngle2) * ARROW_SIZE;
  const y2 = tipY + Math.sin(backAngle2) * ARROW_SIZE;
  return `${tipX},${tipY} ${x1},${y1} ${x2},${y2}`;
}

export function PowerGauge({ x, y, angle, ratio, cancelling = false }: Props) {
  const { t } = useTranslation();
  const gaugeColor = cancelling ? colors.neonPink : powerGaugeColor(ratio);
  const isSuper = !cancelling && ratio >= SUPER_POWER_RATIO;

  const aimEndX = x + Math.cos(angle) * AIM_LINE_LENGTH;
  const aimEndY = y + Math.sin(angle) * AIM_LINE_LENGTH;

  if (cancelling) {
    return (
      <G>
        {/* 파워 레인지 (취소 중에도 바깥 원 유지) */}
        <Circle
          cx={x}
          cy={y}
          r={POWER_RING_RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={POWER_RING_WIDTH}
          strokeDasharray="8,6"
        />
        <Circle
          cx={x}
          cy={y}
          r={CANCEL_AIM_RADIUS}
          fill="rgba(255,45,120,0.08)"
          stroke={colors.neonPink}
          strokeWidth={POWER_RING_WIDTH}
          opacity={0.95}
        />
        <SvgText
          x={x}
          y={y + 4}
          fill={colors.neonPink}
          fontSize={11}
          fontWeight="900"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {t('game.cancel')}
        </SvgText>
      </G>
    );
  }

  return (
    <G>
      {/* 파워 레인지 — 바깥 원형 트랙 */}
      <Circle
        cx={x}
        cy={y}
        r={POWER_RING_RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={POWER_RING_WIDTH}
      />

      {/* SUPER 구간 (원 둘레 상단 구간) */}
      <Circle
        cx={x}
        cy={y}
        r={POWER_RING_RADIUS}
        fill="none"
        stroke="rgba(255,215,0,0.3)"
        strokeWidth={POWER_RING_WIDTH}
        strokeDasharray={circleDashLength(POWER_RING_RADIUS, 1 - SUPER_POWER_RATIO)}
        strokeDashoffset={2 * Math.PI * POWER_RING_RADIUS * SUPER_POWER_RATIO}
        transform={`rotate(-90 ${x} ${y})`}
      />

      {/* 현재 파워 채움 — 원형 */}
      {ratio > 0.01 && (
        <Circle
          cx={x}
          cy={y}
          r={POWER_RING_RADIUS}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={POWER_RING_WIDTH}
          strokeLinecap="round"
          strokeDasharray={circleDashLength(POWER_RING_RADIUS, ratio)}
          transform={`rotate(-90 ${x} ${y})`}
          opacity={0.95}
        />
      )}

      {/* 취소 존 안내 (안쪽 작은 원) */}
      <Circle
        cx={x}
        cy={y}
        r={CANCEL_AIM_RADIUS}
        fill="none"
        stroke="rgba(255,45,120,0.25)"
        strokeWidth={1.5}
        strokeDasharray="4,5"
      />

      {/* 킥 방향 — 최대 레인지 점선 */}
      <Line
        x1={x}
        y1={y}
        x2={aimEndX}
        y2={aimEndY}
        stroke="rgba(255,255,255,0.22)"
        strokeWidth={1.5}
        strokeDasharray="6,5"
      />

      {/* 킥 방향 — 현재 파워 길이 */}
      <Line
        x1={x}
        y1={y}
        x2={x + Math.cos(angle) * AIM_LINE_LENGTH * (0.25 + ratio * 0.75)}
        y2={y + Math.sin(angle) * AIM_LINE_LENGTH * (0.25 + ratio * 0.75)}
        stroke={gaugeColor}
        strokeWidth={2.5 + ratio * 3}
        strokeLinecap="round"
        opacity={0.95}
      />

      {/* 방향 화살표 */}
      <Polygon
        points={aimArrowPoints(x, y, angle, AIM_LINE_LENGTH)}
        fill={gaugeColor}
        opacity={0.9}
      />

      <Circle
        cx={aimEndX}
        cy={aimEndY}
        r={5}
        fill="none"
        stroke={gaugeColor}
        strokeWidth={2}
        opacity={0.85}
      />

      {isSuper && (
        <SvgText
          x={x}
          y={y - POWER_RING_RADIUS - 10}
          fill={colors.neonGold}
          fontSize={11}
          fontWeight="900"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {t('game.super')}
        </SvgText>
      )}
    </G>
  );
}
