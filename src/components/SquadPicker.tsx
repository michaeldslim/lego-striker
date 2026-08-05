import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, fonts, spacing } from '../constants/theme';
import { SquadSize } from '../types/game';

interface Props {
  value: SquadSize;
  onChange: (size: SquadSize) => void;
  compact?: boolean;
}

export function SquadPicker({ value, onChange, compact = false }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('customize.squadSize')}</Text>
      <View style={styles.row}>
        {([2, 3] as const).map((size) => {
          const selected = value === size;
          return (
            <Pressable
              key={size}
              onPress={() => onChange(size)}
              style={[styles.option, compact && styles.optionCompact, selected && styles.optionSelected]}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {t('customize.squadPlayers', { count: size })}
              </Text>
              {!compact && (
                <>
                  <Text style={styles.optionEmoji}>{size === 2 ? '🧍🧍' : '🧍🧍🧍'}</Text>
                  <Text style={styles.optionHint}>{t('customize.squadHint')}</Text>
                </>
              )}
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
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    gap: 2,
  },
  optionCompact: {
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  optionSelected: {
    borderColor: colors.neonCyan,
    backgroundColor: 'rgba(0,229,255,0.12)',
  },
  optionEmoji: {
    fontSize: 14,
  },
  optionText: {
    color: colors.textMuted,
    fontSize: fonts.body,
    fontWeight: '800',
  },
  optionTextSelected: {
    color: colors.neonCyan,
  },
  optionHint: {
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.3,
  },
});
