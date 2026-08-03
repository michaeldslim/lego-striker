import React from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { TEAM_COLORS } from '../constants/game';
import { Gender } from '../types/game';

interface Props {
  x: number;
  y: number;
  shirtColor: string;
  pantsColor: string;
  gender?: Gender;
  scale?: number;
  selected?: boolean;
  /** 차징 중 — 공 차기 직전 포즈 */
  active?: boolean;
  facing?: 'left' | 'right';
}

const HAIR = '#6b3a2a';
const MALE_HAIR = '#5c3d1e';

/** 2D Lego minifigure silhouette — side view */
export function LegoCharacter({
  x,
  y,
  shirtColor,
  pantsColor,
  gender = 'male',
  scale = 1,
  selected = false,
  active = false,
  facing = 'right',
}: Props) {
  const flip = facing === 'left' ? -1 : 1;
  const skin = TEAM_COLORS.player.skin;
  const isFemale = gender === 'female';

  return (
    <G transform={`translate(${x}, ${y}) scale(${scale * flip}, ${scale})`}>
      {active && (
        <Circle cx={0} cy={4} r={32} fill="rgba(0,180,216,0.12)" stroke="#00b4d8" strokeWidth={2} opacity={0.95} />
      )}
      {!active && selected && (
        <Circle cx={0} cy={4} r={30} fill="none" stroke="#ffd700" strokeWidth={2.5} opacity={0.9} />
      )}

      <Ellipse cx={active ? 4 : 0} cy={28} rx={14} ry={4} fill="rgba(0,0,0,0.25)" />

      <G transform={active ? 'rotate(-12 0 18)' : undefined}>
        {/* 다리 */}
        {active ? (
          <G>
            {/* 뒷다리 — 뒤로 뻗음 */}
            <Rect x={-10} y={12} width={7} height={14} rx={2} fill={pantsColor} transform="rotate(28 -6 12)" />
            {/* 앞다리 — 무릎 들어 킥 준비 */}
            <Rect x={4} y={8} width={7} height={11} rx={2} fill={pantsColor} transform="rotate(-38 7 19)" />
            <Rect x={10} y={16} width={7} height={10} rx={2} fill={pantsColor} transform="rotate(-12 13 16)" />
          </G>
        ) : (
          <G>
            <Rect x={-9} y={14} width={7} height={12} rx={2} fill={pantsColor} />
            <Rect x={2} y={14} width={7} height={12} rx={2} fill={pantsColor} />
          </G>
        )}

        {/* 몸통 */}
        <Rect x={-11} y={-2} width={22} height={17} rx={4} fill={shirtColor} />
        <Rect x={-11} y={-2} width={22} height={4} rx={2} fill="rgba(255,255,255,0.15)" />

        {/* 팔 */}
        {active ? (
          <G>
            <Rect x={-18} y={-4} width={6} height={13} rx={3} fill={shirtColor} transform="rotate(32 -15 2)" />
            <Rect x={12} y={-6} width={6} height={13} rx={3} fill={shirtColor} transform="rotate(-24 15 0)" />
            <Circle cx={-20} cy={6} r={3.5} fill={skin} />
            <Circle cx={17} cy={2} r={3.5} fill={skin} />
          </G>
        ) : (
          <G>
            <Rect x={-17} y={0} width={6} height={13} rx={3} fill={shirtColor} />
            <Rect x={11} y={0} width={6} height={13} rx={3} fill={shirtColor} />
            <Circle cx={-14} cy={14} r={3.5} fill={skin} />
            <Circle cx={14} cy={14} r={3.5} fill={skin} />
          </G>
        )}

        <Rect x={-3} y={-6} width={6} height={5} rx={1} fill={skin} />

        {/* 머리 */}
        <Circle cx={active ? 2 : 0} cy={-14} r={11} fill={skin} />
        <Circle cx={active ? 2 : 0} cy={-14} r={11} fill="none" stroke="#d4a574" strokeWidth={0.8} />

        <Circle cx={active ? 6 : 4} cy={-15} r={1.8} fill="#333" />
        {isFemale ? (
          <Path
            d={active ? 'M 4 -11 Q 7 -9 8 -11' : 'M 2 -11 Q 5 -9 6 -11'}
            stroke="#333"
            strokeWidth={0.9}
            fill="none"
          />
        ) : (
          <Path
            d={active ? 'M 3 -11 Q 7 -8 9 -11' : 'M 1 -11 Q 5 -8 7 -11'}
            stroke="#333"
            strokeWidth={1}
            fill="none"
          />
        )}

        {isFemale ? (
          <G>
            <Ellipse cx={active ? -7 : -9} cy={-15} rx={5} ry={9} fill={HAIR} />
            <Ellipse cx={active ? 2 : 0} cy={-19} rx={11} ry={7} fill={HAIR} />
            <Ellipse cx={active ? 5 : 3} cy={-22} rx={8} ry={5} fill={HAIR} />
          </G>
        ) : (
          <Ellipse cx={active ? 2 : 0} cy={-20} rx={10} ry={5} fill={MALE_HAIR} />
        )}
      </G>
    </G>
  );
}
