import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { GK_BAR_THICKNESS } from '../constants/game';
import { colors } from '../constants/theme';
import { BallSkin, CountryCode } from '../types/customize';
import { Ball, Character, FieldBounds, GamePhase, Turn } from '../types/game';
import { computeAimPower } from '../utils/power';
import { useChargeTick } from '../hooks/useChargeTick';
import { FieldFlagWatermark } from './FieldFlagWatermark';
import { LegoCharacter } from './LegoCharacter';
import { PowerGauge } from './PowerGauge';
import { SoccerBall } from './SoccerBall';

interface Props {
  width: number;
  height: number;
  field: FieldBounds;
  ball: Ball;
  characters: Character[];
  gkBarYs: Record<Turn, number>;
  gkBarLength: number;
  selectedId: string | null;
  aimStart: { x: number; y: number } | null;
  aimCurrent: { x: number; y: number } | null;
  aimStartTime: number | null;
  aimDraggedOut: boolean;
  activeCharacterId: string | null;
  turn: Turn;
  phase: GamePhase;
  ballSkin?: BallSkin;
  playerCountryCode?: CountryCode;
  aiCountryCode?: CountryCode;
}

export function SideViewField({
  width,
  height,
  field,
  ball,
  characters,
  gkBarYs,
  gkBarLength,
  selectedId,
  aimStart,
  aimCurrent,
  aimStartTime,
  aimDraggedOut,
  activeCharacterId,
  turn,
  phase,
  ballSkin = 'legacy',
  playerCountryCode,
  aiCountryCode,
}: Props) {
  const { goalZone } = field;
  const goalTop = goalZone.top;
  const goalBottom = goalZone.bottom;
  const goalH = goalBottom - goalTop;
  const barLength = gkBarLength;
  const flagHeight = height * 0.055;
  const flagPadX = width * 0.04;
  const flagPadY = height * 0.05;

  const activeChar = characters.find((c) => c.id === activeCharacterId);
  const isCharging = !!(activeChar && aimStartTime && aimCurrent);
  const chargeNow = useChargeTick(isCharging);
  const aimPower =
    activeChar && aimStartTime && aimCurrent
      ? computeAimPower(activeChar, aimCurrent, chargeNow - aimStartTime, ball, aimDraggedOut)
      : null;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#2d6a4f" />
            <Stop offset="0.5" stopColor="#40916c" />
            <Stop offset="1" stopColor="#2d6a4f" />
          </LinearGradient>
        </Defs>

        <Rect x={0} y={0} width={width} height={height} fill="url(#grass)" />

        {/* Stripes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Rect
            key={`stripe-${i}`}
            x={(width / 8) * i}
            y={0}
            width={width / 16}
            height={height}
            fill="rgba(0,0,0,0.06)"
          />
        ))}

        {playerCountryCode && (
          <FieldFlagWatermark
            x={flagPadX}
            y={flagPadY}
            height={flagHeight}
            code={playerCountryCode}
            anchor="top-left"
          />
        )}
        {aiCountryCode && (
          <FieldFlagWatermark
            x={width - flagPadX}
            y={flagPadY}
            height={flagHeight}
            code={aiCountryCode}
            anchor="top-right"
          />
        )}

        {/* Center line & circle */}
        <Line x1={width / 2} y1={0} x2={width / 2} y2={height} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
        <Circle cx={width / 2} cy={height / 2} r={40} stroke="rgba(255,255,255,0.35)" strokeWidth={2} fill="none" />
        <Circle cx={width / 2} cy={height / 2} r={4} fill="rgba(255,255,255,0.5)" />

        {/* Field border */}
        <Rect
          x={1}
          y={1}
          width={width - 2}
          height={height - 2}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={2}
        />

        {/* Left goal */}
        <G>
          <Rect x={0} y={0} width={8} height={goalTop} fill="#1b4332" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
          <Rect x={0} y={goalBottom} width={8} height={height - goalBottom} fill="#1b4332" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
          <Rect x={0} y={goalTop} width={goalZone.width} height={goalH} fill="rgba(0,0,0,0.35)" stroke={colors.neonGold} strokeWidth={2} />
          {Array.from({ length: 4 }).map((_, i) => (
            <Line
              key={`lg-${i}`}
              x1={0}
              y1={goalTop + (goalH / 3) * i}
              x2={goalZone.width}
              y2={goalTop + (goalH / 3) * i}
              stroke="rgba(255,215,0,0.2)"
              strokeWidth={1}
            />
          ))}
          <SvgText x={6} y={goalTop - 6} fill={colors.textMuted} fontSize={9} fontWeight="700">
            YOU
          </SvgText>
        </G>

        {/* Right goal */}
        <G>
          <Rect x={width - 8} y={0} width={8} height={goalTop} fill="#1b4332" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
          <Rect x={width - 8} y={goalBottom} width={8} height={height - goalBottom} fill="#1b4332" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
          <Rect
            x={width - goalZone.width}
            y={goalTop}
            width={goalZone.width}
            height={goalH}
            fill="rgba(0,0,0,0.35)"
            stroke={colors.neonGold}
            strokeWidth={2}
          />
          {Array.from({ length: 4 }).map((_, i) => (
            <Line
              key={`rg-${i}`}
              x1={width - goalZone.width}
              y1={goalTop + (goalH / 3) * i}
              x2={width}
              y2={goalTop + (goalH / 3) * i}
              stroke="rgba(255,215,0,0.2)"
              strokeWidth={1}
            />
          ))}
          <SvgText x={width - 28} y={goalTop - 6} fill={colors.textMuted} fontSize={9} fontWeight="700">
            AI
          </SvgText>
        </G>

        {/* GK bars */}
        <G>
          <Rect
            x={(goalZone.width - barLength) / 2}
            y={gkBarYs.player - GK_BAR_THICKNESS / 2}
            width={barLength}
            height={GK_BAR_THICKNESS}
            rx={3}
            fill={colors.neonCyan}
            opacity={0.9}
          />
          <Rect
            x={width - goalZone.width + (goalZone.width - barLength) / 2}
            y={gkBarYs.ai - GK_BAR_THICKNESS / 2}
            width={barLength}
            height={GK_BAR_THICKNESS}
            rx={3}
            fill={colors.neonPink}
            opacity={0.9}
          />
        </G>

        <SoccerBall x={ball.x} y={ball.y} radius={ball.radius} variant={ballSkin} />

        {characters.map((ch) => {
          const isPlayerCharging =
            ch.id === activeCharacterId &&
            turn === 'player' &&
            aimStartTime != null &&
            aimPower != null &&
            !aimPower.cancelling;
          const isAiWindingUp =
            ch.id === activeCharacterId && turn === 'ai' && phase === 'aiming';

          return (
            <LegoCharacter
              key={ch.id}
              x={ch.x}
              y={ch.y}
              shirtColor={ch.shirtColor}
              pantsColor={ch.pantsColor}
              selected={ch.id === selectedId}
              active={isPlayerCharging || isAiWindingUp}
              facing={ch.team === 'player' ? 'right' : 'left'}
              gender={ch.gender}
            />
          );
        })}

        {/* 파워 게이지 — 캐릭터 위에 렌더 */}
        {activeChar && aimPower && (
          <PowerGauge
            x={activeChar.x}
            y={activeChar.y}
            angle={aimPower.angle}
            ratio={aimPower.ratio}
            cancelling={aimPower.cancelling}
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
});
