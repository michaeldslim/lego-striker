import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useScreenPadding } from '../src/hooks/useScreenPadding';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ScreenBackground } from '../src/components/ScreenBackground';
import { NeonButton } from '../src/components/NeonButton';
import { SquadPicker } from '../src/components/SquadPicker';
import { DEFAULT_SQUAD_SIZE } from '../src/constants/game';
import { colors, fonts, spacing } from '../src/constants/theme';
import { SquadSize } from '../src/types/game';
import { getSquadSize, getWinCount, setSquadSize } from '../src/utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const screenPadding = useScreenPadding();
  const [wins, setWins] = useState(0);
  const [squadSize, setSquadSizeState] = useState<SquadSize>(DEFAULT_SQUAD_SIZE);
  const bounce = useSharedValue(0);

  useEffect(() => {
    getWinCount().then(setWins);
    getSquadSize().then(setSquadSizeState);
    bounce.value = withRepeat(
      withSequence(withTiming(-8, { duration: 700 }), withTiming(0, { duration: 700 })),
      -1,
      true
    );
  }, [bounce]);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const handleSquadChange = (size: SquadSize) => {
    setSquadSizeState(size);
    setSquadSize(size);
  };

  const startGame = () => {
    router.push({ pathname: '/game', params: { squadSize: String(squadSize) } });
  };

  return (
    <ScreenBackground>
      <View style={[styles.root, screenPadding]}>
        <View style={styles.heroPanel}>
          <Animated.Text style={[styles.emoji, heroStyle]}>🧍⚽</Animated.Text>
          <Text style={styles.title}>LEGO</Text>
          <Text style={styles.titleAccent}>STRIKER</Text>
          {wins > 0 && (
            <View style={styles.bestBox}>
              <Text style={styles.bestLabel}>WINS {wins}</Text>
            </View>
          )}
        </View>

        <View style={styles.menuColumn}>
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.tips}>
              <Tip icon="👆" text="캐릭터 터치 → 당겨서 플릭" />
              <Tip icon="⚽" text="상대 골대(오른쪽)에 넣기" />
              <Tip icon="🏆" text="먼저 3골 승리" />
            </View>
            <SquadPicker value={squadSize} onChange={handleSquadChange} compact />
          </ScrollView>

          <View style={styles.actions}>
            <NeonButton title="KICK OFF" onPress={startGame} compact />
            <NeonButton
              title="LEADERBOARD"
              variant="secondary"
              compact
              onPress={() => router.push('/leaderboard')}
            />
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
}

function Tip({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.tipRow}>
      <Text style={styles.tipIcon}>{icon}</Text>
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.md,
  },
  heroPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
  },
  menuColumn: {
    flex: 1,
    minWidth: 0,
    maxWidth: 340,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  actions: {
    flexShrink: 0,
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 3,
    lineHeight: 30,
  },
  titleAccent: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.neonGold,
    letterSpacing: 3,
    lineHeight: 30,
    textShadowColor: colors.neonGold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  bestBox: {
    marginTop: spacing.sm,
  },
  bestLabel: {
    color: colors.neonCyan,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
  },
  tips: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.sm,
    gap: 4,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tipIcon: {
    fontSize: 14,
    width: 20,
  },
  tipText: {
    color: colors.textMuted,
    fontSize: 11,
    flex: 1,
  },
});
