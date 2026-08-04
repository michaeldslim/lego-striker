import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg from 'react-native-svg';
import { BALL_SKINS } from '../constants/skins';
import { colors, spacing } from '../constants/theme';
import { BallSkin } from '../types/customize';
import { SoccerBall } from './SoccerBall';

interface Props {
  value: BallSkin;
  onChange: (skin: BallSkin) => void;
  compact?: boolean;
  align?: 'left' | 'center';
}

const PREVIEW_RADIUS = 13;

export function BallSkinPicker({ value, onChange, compact = false, align = 'center' }: Props) {
  const isLeft = align === 'left';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isLeft && styles.labelLeft]}>공 디자인</Text>
      <View style={[styles.row, compact && styles.rowCompact, isLeft && styles.rowLeft]}>
        {BALL_SKINS.map((skin) => {
          const selected = value === skin.id;
          return (
            <Pressable
              key={skin.id}
              onPress={() => onChange(skin.id)}
              accessibilityLabel={skin.label}
              style={[
                styles.option,
                compact && styles.optionCompact,
                isLeft && styles.optionLeft,
                selected && styles.optionSelected,
              ]}
            >
              <Svg
                width={compact ? 30 : 34}
                height={compact ? 30 : 34}
                viewBox={`${-PREVIEW_RADIUS - 4} ${-PREVIEW_RADIUS - 4} ${(PREVIEW_RADIUS + 4) * 2} ${(PREVIEW_RADIUS + 4) * 2}`}
              >
                <SoccerBall x={0} y={0} radius={PREVIEW_RADIUS} variant={skin.id} />
              </Svg>
              {!compact && <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{skin.label}</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  labelLeft: {
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  rowCompact: {
    gap: spacing.xs,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    gap: 4,
    minHeight: 56,
  },
  optionCompact: {
    paddingVertical: spacing.xs,
    minHeight: 44,
    borderRadius: 10,
  },
  optionLeft: {
    flex: 0,
    minWidth: 52,
  },
  optionSelected: {
    borderColor: colors.neonCyan,
    backgroundColor: 'rgba(0,229,255,0.12)',
  },
  optionLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  optionLabelSelected: {
    color: colors.neonCyan,
  },
});
