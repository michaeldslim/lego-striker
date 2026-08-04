import React from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { CountryCode } from '../types/customize';

interface Props {
  code: CountryCode;
  width: number;
  height: number;
}

/** Simplified 3:2 flag SVGs for picker thumbnails and field watermark */
export function FlagIcon({ code, width, height }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 60 40">
      <FlagArt code={code} />
    </Svg>
  );
}

/** Simplified 3:2 flag artwork (60×40 viewBox) — use inside a parent Svg */
export function FlagArt({ code }: { code: CountryCode }) {
  switch (code) {
    case 'KR':
      return (
        <G>
          <Rect width={60} height={40} fill="#ffffff" />
          <Circle cx={30} cy={20} r={9} fill="#cd2e3a" />
          <Path d="M 30 11 A 9 9 0 0 0 30 29 A 4.5 4.5 0 0 1 30 20 A 4.5 4.5 0 0 0 30 11 Z" fill="#0047a0" />
          <G fill="#000000" opacity={0.85}>
            <Rect x={8} y={6} width={3} height={8} rx={0.5} />
            <Rect x={49} y={6} width={3} height={8} rx={0.5} />
            <Rect x={8} y={26} width={3} height={8} rx={0.5} />
            <Rect x={49} y={26} width={3} height={8} rx={0.5} />
          </G>
        </G>
      );
    case 'BR':
      return (
        <G>
          <Rect width={60} height={40} fill="#009b3a" />
          <Path d="M 30 4 L 56 20 L 30 36 L 4 20 Z" fill="#fedf00" />
          <Circle cx={30} cy={20} r={8} fill="#002776" />
          <Path d="M 22 20 Q 30 14 38 20 Q 30 26 22 20" fill="#ffffff" opacity={0.9} />
        </G>
      );
    case 'JP':
      return (
        <G>
          <Rect width={60} height={40} fill="#ffffff" />
          <Circle cx={30} cy={20} r={10} fill="#bc002d" />
        </G>
      );
    case 'US':
      return (
        <G>
          {Array.from({ length: 7 }).map((_, i) => (
            <Rect key={i} y={i * 5.7} width={60} height={2.85} fill={i % 2 === 0 ? '#b22234' : '#ffffff'} />
          ))}
          <Rect width={24} height={20} fill="#3c3b6e" />
          {Array.from({ length: 9 }).map((_, i) => (
            <Circle key={i} cx={4 + (i % 3) * 8} cy={3 + Math.floor(i / 3) * 5} r={1.1} fill="#ffffff" />
          ))}
        </G>
      );
    case 'GB':
      return (
        <G>
          <Rect width={60} height={40} fill="#012169" />
          <Path d="M 0 0 L 60 40 M 60 0 L 0 40" stroke="#ffffff" strokeWidth={7} />
          <Path d="M 0 0 L 60 40 M 60 0 L 0 40" stroke="#c8102e" strokeWidth={3} />
          <Path d="M 30 0 V 40 M 0 20 H 60" stroke="#ffffff" strokeWidth={11} />
          <Path d="M 30 0 V 40 M 0 20 H 60" stroke="#c8102e" strokeWidth={6} />
        </G>
      );
    case 'ES':
      return (
        <G>
          <Rect width={60} height={40} fill="#aa1511" />
          <Rect y={10} width={60} height={20} fill="#f1bf00" />
        </G>
      );
    case 'DE':
      return (
        <G>
          <Rect width={60} height={13.3} fill="#000000" />
          <Rect y={13.3} width={60} height={13.4} fill="#dd0000" />
          <Rect y={26.7} width={60} height={13.3} fill="#ffce00" />
        </G>
      );
    case 'FR':
      return (
        <G>
          <Rect width={20} height={40} fill="#002395" />
          <Rect x={20} width={20} height={40} fill="#ffffff" />
          <Rect x={40} width={20} height={40} fill="#ed2939" />
        </G>
      );
    case 'AR':
      return (
        <G>
          <Rect width={60} height={40} fill="#74acdf" />
          <Rect y={13.3} width={60} height={13.4} fill="#ffffff" />
          <Circle cx={30} cy={20} r={5} fill="#f6b40e" />
        </G>
      );
    case 'IT':
      return (
        <G>
          <Rect width={20} height={40} fill="#009246" />
          <Rect x={20} width={20} height={40} fill="#ffffff" />
          <Rect x={40} width={20} height={40} fill="#ce2b37" />
        </G>
      );
    case 'PT':
      return (
        <G>
          <Rect width={24} height={40} fill="#006600" />
          <Rect x={24} width={36} height={40} fill="#ff0000" />
          <Circle cx={24} cy={20} r={7} fill="#ffcc29" opacity={0.9} />
        </G>
      );
    case 'MX':
      return (
        <G>
          <Rect width={20} height={40} fill="#006847" />
          <Rect x={20} width={20} height={40} fill="#ffffff" />
          <Rect x={40} width={20} height={40} fill="#ce1126" />
          <Circle cx={30} cy={20} r={4} fill="#8c5418" />
        </G>
      );
    default:
      return <Rect width={60} height={40} fill="#cccccc" />;
  }
}
