import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { Turn } from '../types/game';

interface Props {
  playerGoals: number;
  aiGoals: number;
  turn: Turn;
  message: string | null;
  goalsToWin: number;
}

export function HUD({ playerGoals, aiGoals, turn, message, goalsToWin }: Props) {
  const isPlayerTurn = turn === 'player';

  return (
    <View style={styles.container}>
      <View style={styles.scoreGroup}>
        <Text style={styles.teamLabel}>YOU</Text>
        <Text style={[styles.score, styles.playerScore]}>{playerGoals}</Text>
      </View>

      <View style={styles.center}>
        <View style={[styles.turnBadge, isPlayerTurn ? styles.playerTurn : styles.aiTurn]}>
          <Text style={styles.turnText}>{isPlayerTurn ? 'YOUR TURN' : 'AI TURN'}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {message?.trim() ? message : `먼저 ${goalsToWin}골`}
        </Text>
      </View>

      <View style={[styles.scoreGroup, styles.right]}>
        <Text style={styles.teamLabel}>AI</Text>
        <Text style={[styles.score, styles.aiScore]}>{aiGoals}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(10,22,40,0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  scoreGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    minWidth: 56,
  },
  right: {
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  teamLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  score: {
    fontSize: 24,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  playerScore: {
    color: colors.neonCyan,
  },
  aiScore: {
    color: colors.neonPink,
  },
  turnBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
  },
  playerTurn: {
    backgroundColor: 'rgba(0,229,255,0.15)',
    borderColor: colors.neonCyan,
  },
  aiTurn: {
    backgroundColor: 'rgba(255,45,106,0.15)',
    borderColor: colors.neonPink,
  },
  turnText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
  },
  message: {
    marginTop: 2,
    minHeight: 14,
    color: colors.neonGold,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
