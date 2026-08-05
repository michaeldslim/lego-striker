import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useScreenPadding } from '../src/hooks/useScreenPadding';
import { ScreenBackground } from '../src/components/ScreenBackground';
import { NeonButton } from '../src/components/NeonButton';
import { colors, fonts, spacing } from '../src/constants/theme';
import { LeaderboardEntry } from '../src/types/game';
import { clearLeaderboard, getLeaderboard } from '../src/utils/storage';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const screenPadding = useScreenPadding();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  const load = useCallback(async () => {
    const data = await getLeaderboard();
    setEntries(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleClear = async () => {
    await clearLeaderboard();
    setEntries([]);
  };

  return (
    <ScreenBackground>
      <View style={[styles.root, screenPadding]}>
        <View style={styles.headerPanel}>
          <Text style={styles.title}>{t('leaderboard.title')}</Text>
          <Text style={styles.subtitle}>{t('leaderboard.subtitle')}</Text>
          <View style={styles.actions}>
            {entries.length > 0 && (
              <Pressable onPress={handleClear} style={styles.clearBtn}>
                <Text style={styles.clearText}>{t('leaderboard.clear')}</Text>
              </Pressable>
            )}
            <NeonButton title={t('leaderboard.back')} variant="secondary" onPress={() => router.back()} />
          </View>
        </View>

        <View style={styles.listPanel}>
          {entries.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🏟️</Text>
              <Text style={styles.emptyText}>{t('leaderboard.empty')}</Text>
              <Text style={styles.emptyHint}>{t('leaderboard.emptyHint')}</Text>
            </View>
          ) : (
            <FlatList
              data={entries}
              keyExtractor={(item) => item.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <View style={[styles.row, item.won && styles.rowWin]}>
                  <Text style={styles.result}>{item.won ? 'W' : 'L'}</Text>
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.date}>
                      {new Date(item.date).toLocaleDateString(
                        i18n.language === 'ko' ? 'ko-KR' : 'en-US'
                      )}
                    </Text>
                  </View>
                  <Text style={styles.score}>
                    {item.playerGoals} - {item.aiGoals}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xl,
  },
  headerPanel: {
    width: 200,
    justifyContent: 'center',
    gap: spacing.md,
  },
  listPanel: {
    flex: 1,
  },
  title: {
    fontSize: fonts.heading,
    fontWeight: '900',
    color: colors.neonGold,
    letterSpacing: 3,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fonts.caption,
    letterSpacing: 2,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  rowWin: {
    borderColor: 'rgba(0,229,255,0.3)',
    backgroundColor: 'rgba(0,229,255,0.06)',
  },
  result: {
    width: 28,
    fontSize: 18,
    fontWeight: '900',
    color: colors.textMuted,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  name: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 2,
  },
  date: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  score: {
    color: colors.neonCyan,
    fontWeight: '800',
    fontSize: 20,
    fontVariant: ['tabular-nums'],
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.white,
    fontSize: fonts.body,
    fontWeight: '600',
  },
  emptyHint: {
    color: colors.textMuted,
    fontSize: fonts.caption,
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.sm,
  },
  clearBtn: {
    alignItems: 'center',
    padding: spacing.xs,
  },
  clearText: {
    color: colors.bomb,
    fontSize: fonts.caption,
  },
});
