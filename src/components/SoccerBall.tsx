import React from 'react';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Polygon,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface Props {
  x: number;
  y: number;
  radius: number;
}

function pentagon(cx: number, cy: number, r: number, rotation = 0): string {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = ((Math.PI * 2 * i) / 5 - Math.PI / 2) + rotation;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(' ');
}

const BASE_RADIUS = 18;

/** Classic black-and-white truncated-icosahedron style soccer ball */
export function SoccerBall({ x, y, radius }: Props) {
  const scale = radius / BASE_RADIUS;

  return (
    <G>
      <Circle
        cx={x}
        cy={y + radius * 0.12}
        r={radius * 1.08}
        fill="rgba(0,0,0,0.22)"
      />

      <G transform={`translate(${x}, ${y}) scale(${scale})`}>
        <Defs>
          <RadialGradient
            id="soccerBallSphere"
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
          <ClipPath id="soccerBallClip">
            <Circle cx={0} cy={0} r={BASE_RADIUS} />
          </ClipPath>
        </Defs>

        <Circle cx={0} cy={0} r={BASE_RADIUS + 2} fill="rgba(255,255,255,0.14)" />
        <Circle
          cx={0}
          cy={0}
          r={BASE_RADIUS}
          fill="url(#soccerBallSphere)"
          stroke="#9e9e9e"
          strokeWidth={0.6}
        />

        <G clipPath="url(#soccerBallClip)">
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

        <Circle cx={-5.5} cy={-6.5} r={4.5} fill="rgba(255,255,255,0.5)" />
        <Circle cx={-3} cy={-4} r={1.8} fill="rgba(255,255,255,0.35)" />
      </G>
    </G>
  );
}
