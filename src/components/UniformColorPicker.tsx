import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg from 'react-native-svg';
import { DEFAULT_PLAYER_COLORS, UNIFORM_KITS } from '../constants/skins';
import { colors, spacing } from '../constants/theme';
import { TeamColors } from '../types/customize';
import { LegoCharacter } from './LegoCharacter';

interface Props {
  value: TeamColors;
  onChange: (colors: TeamColors) => void;
  compact?: boolean;
  align?: 'left' | 'center';
}

export function UniformColorPicker({ value, onChange, compact = false, align = 'center' }: Props) {
  const { t } = useTranslation();
  const shirt = value.shirt ?? DEFAULT_PLAYER_COLORS.shirt;
  const pants = value.pants ?? DEFAULT_PLAYER_COLORS.pants;

  const isLeft = align === 'left';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isLeft && styles.labelLeft]}>{t('customize.uniform')}</Text>
      <View style={styles.row}>
        <View style={[styles.swatches, isLeft && styles.swatchesLeft]}>
          {UNIFORM_KITS.map((kit) => {
            const selected = kit.shirt === shirt && kit.pants === pants;
            return (
              <Pressable
                key={kit.id}
                onPress={() => onChange({ shirt: kit.shirt, pants: kit.pants })}
                accessibilityLabel={kit.label}
                style={[styles.swatch, compact && styles.swatchCompact, selected && styles.swatchSelected]}
              >
                <View style={[styles.dot, { backgroundColor: kit.shirt }]} />
                <View style={[styles.dot, styles.dotPants, { backgroundColor: kit.pants }]} />
              </Pressable>
            );
          })}
        </View>
        {!compact && (
          <View style={styles.preview}>
            <Svg width={44} height={52} viewBox="-28 -32 56 64">
              <LegoCharacter
                x={0}
                y={8}
                shirtColor={shirt}
                pantsColor={pants}
                scale={0.75}
                facing="right"
              />
            </Svg>
          </View>
        )}
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
    alignItems: 'center',
    gap: spacing.sm,
  },
  swatches: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  swatchesLeft: {
    justifyContent: 'flex-start',
  },
  swatch: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    gap: 2,
  },
  swatchCompact: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  swatchSelected: {
    borderColor: colors.neonCyan,
    backgroundColor: 'rgba(0,229,255,0.12)',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dotPants: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  preview: {
    width: 48,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
});
