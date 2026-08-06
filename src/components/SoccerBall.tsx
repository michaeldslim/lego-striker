import React from 'react';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Path,
  Polygon,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { BallSkin } from '../types/customize';

interface Props {
  x: number;
  y: number;
  radius: number;
  variant?: BallSkin;
  curving?: boolean;
}

const BASE_RADIUS = 18;

function pentagon(cx: number, cy: number, r: number, rotation = 0): string {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2 + rotation;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(' ');
}

function BallShadow({ x, y, radius }: Pick<Props, 'x' | 'y' | 'radius'>) {
  return <Circle cx={x} cy={y + radius * 0.12} r={radius * 1.08} fill="rgba(0,0,0,0.22)" />;
}

function whiteSphereDefs(gradientId: string, clipId: string) {
  return (
    <Defs>
      <RadialGradient
        id={gradientId}
        cx="32%"
        cy="28%"
        rx="58%"
        ry="58%"
        fx="32%"
        fy="28%"
      >
        <Stop offset="0%" stopColor="#ffffff" />
        <Stop offset="55%" stopColor="#f4f4f4" />
        <Stop offset="100%" stopColor="#bdbdbd" />
      </RadialGradient>
      <ClipPath id={clipId}>
        <Circle cx={0} cy={0} r={BASE_RADIUS} />
      </ClipPath>
    </Defs>
  );
}

function sphereHighlight() {
  return (
    <>
      <Circle cx={-5.5} cy={-6.5} r={4.5} fill="rgba(255,255,255,0.5)" />
      <Circle cx={-3} cy={-4} r={1.8} fill="rgba(255,255,255,0.35)" />
    </>
  );
}

/** Legacy white-and-black truncated-icosahedron */
function LegacyBallBody() {
  return (
    <>
      {whiteSphereDefs('ballLegacySphere', 'ballLegacyClip')}
      <Circle cx={0} cy={0} r={BASE_RADIUS + 2} fill="rgba(255,255,255,0.14)" />
      <Circle
        cx={0}
        cy={0}
        r={BASE_RADIUS}
        fill="url(#ballLegacySphere)"
        stroke="#9e9e9e"
        strokeWidth={0.6}
      />
      <G clipPath="url(#ballLegacyClip)">
        <Polygon points={pentagon(0, 0, 6.8)} fill="#141414" />
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const dist = 11.2;
          const px = Math.cos(angle) * dist;
          const py = Math.sin(angle) * dist;
          return (
            <Polygon
              key={i}
              points={pentagon(px, py, 5.8, angle + Math.PI)}
              fill="#141414"
            />
          );
        })}
      </G>
      {sphereHighlight()}
    </>
  );
}

/** Premier League — Nike Flight–style purple / magenta / blue geometry */
function PlBallBody() {
  return (
    <>
      {whiteSphereDefs('ballPlSphere', 'ballPlClip')}
      <Circle cx={0} cy={0} r={BASE_RADIUS + 2} fill="rgba(61,25,91,0.12)" />
      <Circle
        cx={0}
        cy={0}
        r={BASE_RADIUS}
        fill="url(#ballPlSphere)"
        stroke="#c8c8c8"
        strokeWidth={0.5}
      />
      <G clipPath="url(#ballPlClip)">
        <Polygon points={pentagon(0, -2, 7.2)} fill="#3d195b" />
        <Path
          d="M -14 -4 Q -6 -12 4 -10 L 8 -2 Q 0 2 -8 4 Z"
          fill="#e90052"
          opacity={0.92}
        />
        <Path
          d="M 6 10 Q 14 4 12 -6 L 4 -2 Q 2 6 0 12 Z"
          fill="#00aeef"
          opacity={0.88}
        />
        <Path
          d="M -12 8 Q -4 14 6 10 L 2 4 Q -6 2 -10 0 Z"
          fill="#3d195b"
          opacity={0.85}
        />
        <Path
          d="M -2 14 Q 8 8 10 -2 L 2 2 Q -2 8 -4 12 Z"
          fill="#9b4f96"
          opacity={0.8}
        />
        <Path
          d="M -16 0 Q -10 -8 0 -14"
          fill="none"
          stroke="#3d195b"
          strokeWidth={1.8}
          opacity={0.7}
        />
      </G>
      {sphereHighlight()}
    </>
  );
}

const WC_ACCENTS: { points: string; fill: string }[] = [
  { points: '-2,-12 2,-8 0,-4', fill: '#e4002b' },
  { points: '12,-4 14,2 8,4', fill: '#009639' },
  { points: '-10,6 -6,10 -8,14', fill: '#ffd700' },
  { points: '4,12 8,14 6,8', fill: '#e4002b' },
  { points: '-14,-2 -10,2 -12,6', fill: '#009639' },
];

/** World Cup — Al Rihla–style bold black panels + tri-color accents */
function WorldCupBallBody() {
  return (
    <>
      {whiteSphereDefs('ballWcSphere', 'ballWcClip')}
      <Circle cx={0} cy={0} r={BASE_RADIUS + 2} fill="rgba(255,255,255,0.14)" />
      <Circle
        cx={0}
        cy={0}
        r={BASE_RADIUS}
        fill="url(#ballWcSphere)"
        stroke="#9e9e9e"
        strokeWidth={0.6}
      />
      <G clipPath="url(#ballWcClip)">
        <Path
          d="M -4 -14 Q 6 -10 8 0 Q 6 8 -2 10 Q -10 4 -8 -6 Z"
          fill="#141414"
        />
        <Path
          d="M 10 -8 Q 16 -2 14 8 Q 8 14 2 10 Q 4 0 6 -6 Z"
          fill="#141414"
        />
        <Path
          d="M -14 2 Q -8 10 0 14 Q -6 6 -10 -2 Z"
          fill="#141414"
          opacity={0.9}
        />
        <Polygon points={pentagon(2, 2, 4.5, 0.4)} fill="#141414" opacity={0.85} />
        {WC_ACCENTS.map((accent, i) => (
          <Polygon key={i} points={accent.points} fill={accent.fill} />
        ))}
      </G>
      {sphereHighlight()}
    </>
  );
}

function BallBody({ variant }: { variant: BallSkin }) {
  switch (variant) {
    case 'pl':
      return <PlBallBody />;
    case 'worldcup':
      return <WorldCupBallBody />;
    default:
      return <LegacyBallBody />;
  }
}

export function SoccerBall({ x, y, radius, variant = 'legacy', curving = false }: Props) {
  const scale = radius / BASE_RADIUS;

  return (
    <G>
      <BallShadow x={x} y={y} radius={radius} />
      {curving && (
        <Circle
          cx={x}
          cy={y}
          r={radius * 1.55}
          fill="none"
          stroke="#ff2d78"
          strokeWidth={3}
          opacity={0.7}
        />
      )}
      <G transform={`translate(${x}, ${y}) scale(${scale})`}>
        <BallBody variant={variant} />
      </G>
    </G>
  );
}
