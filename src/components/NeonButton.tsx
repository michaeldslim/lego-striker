import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  compact?: boolean;
}

const gradients: Record<string, [string, string]> = {
  primary: ['#ffd700', '#ff8c00'],
  secondary: ['rgba(0,229,255,0.22)', 'rgba(0,229,255,0.06)'],
  danger: ['#ff3b30', '#c0392b'],
};

export function NeonButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  compact = false,
}: Props) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const radius = compact ? 12 : 14;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.wrapper,
        { borderRadius: radius },
        isPrimary && styles.primaryWrapper,
        isSecondary && styles.secondaryWrapper,
        pressed && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={gradients[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          { borderRadius: radius },
          compact && styles.buttonCompact,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={isPrimary ? '#1a1a1a' : colors.neonCyan} />
        ) : (
          <Text
            style={[
              styles.text,
              compact && styles.textCompact,
              isPrimary ? styles.primaryText : styles.secondaryText,
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  primaryWrapper: {
    shadowColor: colors.neonGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryWrapper: {
    borderWidth: 1.5,
    borderColor: colors.neonCyan,
    backgroundColor: 'rgba(0,229,255,0.06)',
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCompact: {
    paddingVertical: 11,
    paddingHorizontal: 20,
  },
  text: {
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 2,
  },
  textCompact: {
    fontSize: 15,
    letterSpacing: 1.5,
  },
  primaryText: {
    color: '#1a1a1a',
  },
  secondaryText: {
    color: colors.neonCyan,
  },
});
