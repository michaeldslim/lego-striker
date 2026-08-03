import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenBackground({ children, style }: Props) {
  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundLight, colors.background]}
      locations={[0, 0.5, 1]}
      style={[styles.bg, style]}
    >
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    left: '20%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0,229,255,0.08)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -60,
    right: '10%',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,215,0,0.06)',
  },
});
