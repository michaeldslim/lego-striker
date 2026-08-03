import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useScreenPadding } from '../src/hooks/useScreenPadding';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { ScreenBackground } from '../src/components/ScreenBackground';
import { NeonButton } from '../src/components/NeonButton';
import { colors, fonts, spacing } from '../src/constants/theme';
import { saveMatch } from '../src/utils/storage';

export default function ResultScreen() {
  const screenPadding = useScreenPadding();
  const router = useRouter();
  const params = useLocalSearchParams<{
    playerGoals: string;
    aiGoals: string;
    won: string;
    squadSize?: string;
  }>();

  const playerGoals = Number(params.playerGoals ?? 0);
  const aiGoals = Number(params.aiGoals ?? 0);
  const won = params.won === '1';
  const squadSize = params.squadSize === '3' ? 3 : 2;

  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  const scale = useSharedValue(0);

  useEffect(() => {
    if (won) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    scale.value = withDelay(200, withSpring(1, { damping: 12 }));
  }, [won, scale]);

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSave = async () => {
    const playerName = name.trim().slice(0, 3).toUpperCase() || 'AAA';
    await saveMatch({
      name: playerName,
      playerGoals,
      aiGoals,
      won,
      date: new Date().toISOString(),
    });
    setSaved(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <ScreenBackground>
      <View style={[styles.root, screenPadding]}>
        <View style={styles.scorePanel}>
          <Text style={styles.title}>{won ? 'VICTORY!' : 'DEFEAT'}</Text>
          <Text style={styles.emoji}>{won ? '🏆' : '😤'}</Text>

          <Animated.View style={[styles.scoreBox, scoreStyle]}>
            <View style={styles.scoreRow}>
              <View style={styles.teamCol}>
                <Text style={styles.teamLabel}>YOU</Text>
                <Text style={[styles.goalNum, styles.playerGoals]}>{playerGoals}</Text>
              </View>
              <Text style={styles.dash}>—</Text>
              <View style={styles.teamCol}>
                <Text style={styles.teamLabel}>AI</Text>
                <Text style={[styles.goalNum, styles.aiGoals]}>{aiGoals}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.actionPanel}>
          {!saved ? (
            <View style={styles.saveSection}>
              <Text style={styles.saveLabel}>이니셜 (3글자)</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(t) => setName(t.toUpperCase().slice(0, 3))}
                placeholder="AAA"
                placeholderTextColor={colors.textMuted}
                maxLength={3}
                autoCapitalize="characters"
              />
              <NeonButton title="SAVE MATCH" onPress={handleSave} />
            </View>
          ) : (
            <View style={styles.savedMsg}>
              <Text style={styles.savedText}>✓ 기록 저장됨</Text>
            </View>
          )}

          <View style={styles.actions}>
            <NeonButton
              title="REMATCH"
              onPress={() => router.replace({ pathname: '/game', params: { squadSize: String(squadSize) } })}
            />
            <NeonButton
              title="HOME"
              variant="secondary"
              onPress={() => router.replace('/')}
              style={styles.homeBtn}
            />
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  scorePanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPanel: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    maxWidth: 320,
  },
  title: {
    fontSize: fonts.heading,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 4,
  },
  emoji: {
    fontSize: 36,
    marginVertical: spacing.sm,
  },
  scoreBox: {
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  teamCol: {
    alignItems: 'center',
  },
  teamLabel: {
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: 2,
  },
  goalNum: {
    fontSize: 48,
    fontWeight: '900',
  },
  playerGoals: {
    color: colors.neonCyan,
  },
  aiGoals: {
    color: colors.neonPink,
  },
  dash: {
    color: colors.textMuted,
    fontSize: 24,
    fontWeight: '300',
  },
  saveSection: {
    gap: spacing.sm,
  },
  saveLabel: {
    color: colors.textMuted,
    fontSize: fonts.caption,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 8,
  },
  savedMsg: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  savedText: {
    color: colors.neonGreen,
    fontWeight: '700',
    fontSize: fonts.body,
  },
  actions: {
    gap: spacing.sm,
  },
  homeBtn: {
    shadowColor: colors.neonCyan,
  },
});
