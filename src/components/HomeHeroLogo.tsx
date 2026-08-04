import React from 'react';
import Svg from 'react-native-svg';
import { BallSkin, TeamColors } from '../types/customize';
import { LegoCharacter } from './LegoCharacter';
import { SoccerBall } from './SoccerBall';

interface Props {
  teamColors: TeamColors;
  ballSkin: BallSkin;
}

/** SVG hero mark — avoids Android release emoji font gaps (🧍⚽). */
export function HomeHeroLogo({ teamColors, ballSkin }: Props) {
  return (
    <Svg width={80} height={44} viewBox="0 0 80 44">
      <LegoCharacter
        x={26}
        y={36}
        shirtColor={teamColors.shirt}
        pantsColor={teamColors.pants}
        scale={0.88}
        facing="right"
      />
      <SoccerBall x={60} y={26} radius={13} variant={ballSkin} />
    </Svg>
  );
}
