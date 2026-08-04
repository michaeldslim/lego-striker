import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COUNTRIES, findCountry } from '../constants/skins';
import { colors, spacing } from '../constants/theme';
import { CountryCode } from '../types/customize';
import { FlagIcon } from './FlagIcon';

interface Props {
  value: CountryCode;
  onChange: (code: CountryCode) => void;
}

const FLAG_W = 32;
const FLAG_H = 22;

export function CountryPicker({ value, onChange }: Props) {
  const selected = findCountry(value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>나라</Text>
      <View style={styles.grid}>
        {COUNTRIES.map((country) => {
          const isSelected = country.code === value;
          return (
            <Pressable
              key={country.code}
              onPress={() => onChange(country.code)}
              accessibilityLabel={country.name}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <FlagIcon code={country.code} width={FLAG_W} height={FLAG_H} />
            </Pressable>
          );
        })}
      </View>
      {selected && <Text style={styles.countryName}>{selected.name}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    alignItems: 'center',
    width: '100%',
    maxWidth: 260,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    width: '100%',
  },
  chip: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  chipSelected: {
    borderColor: colors.neonCyan,
    backgroundColor: 'rgba(0,229,255,0.12)',
  },
  countryName: {
    color: colors.neonCyan,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
