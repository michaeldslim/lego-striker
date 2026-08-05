import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useScreenPadding } from '../src/hooks/useScreenPadding';
import { ScreenBackground } from '../src/components/ScreenBackground';
import { NeonButton } from '../src/components/NeonButton';
import { BGM_VOLUME_MAX_LEVEL } from '../src/constants/audio';
import { colors, fonts, spacing } from '../src/constants/theme';
import { useSettings } from '../src/contexts/SettingsContext';
import { AppLanguage } from '../src/types/settings';

function LanguageToggle({
  value,
  onChange,
}: {
  value: AppLanguage;
  onChange: (language: AppLanguage) => void;
}) {
  return (
    <View style={styles.languageRow}>
      {(['ko', 'en'] as const).map((lang) => {
        const selected = value === lang;
        return (
          <Pressable
            key={lang}
            onPress={() => onChange(lang)}
            style={[styles.languageOption, selected && styles.languageOptionSelected]}
          >
            <Text style={[styles.languageText, selected && styles.languageTextSelected]}>
              {lang.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const screenPadding = useScreenPadding();
  const { t } = useTranslation();
  const { bgmEnabled, bgmVolumeLevel, language, soundEnabled, hapticsEnabled, setBgmEnabled, setBgmVolumeLevel, setLanguage, setSoundEnabled, setHapticsEnabled } =
    useSettings();

  return (
    <ScreenBackground>
      <View style={[styles.root, screenPadding]}>
        <View style={styles.headerPanel}>
          <Text style={styles.title}>{t('settings.title')}</Text>
          <NeonButton title={t('settings.back')} variant="secondary" onPress={() => router.back()} />
        </View>

        <ScrollView
          style={styles.contentPanel}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('settings.bgm')}</Text>
              <Switch
                value={bgmEnabled}
                onValueChange={setBgmEnabled}
                trackColor={{ false: colors.cardBorder, true: 'rgba(0,229,255,0.35)' }}
                thumbColor={bgmEnabled ? colors.neonCyan : colors.textMuted}
              />
            </View>

            {bgmEnabled && (
              <View style={styles.volumeSection}>
                <View style={styles.volumeHeader}>
                  <Text style={styles.label}>{t('settings.bgmVolume')}</Text>
                  <Text style={styles.volumeValue}>{bgmVolumeLevel}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={BGM_VOLUME_MAX_LEVEL}
                  step={1}
                  value={bgmVolumeLevel}
                  onValueChange={setBgmVolumeLevel}
                  minimumTrackTintColor={colors.neonCyan}
                  maximumTrackTintColor={colors.cardBorder}
                  thumbTintColor={colors.neonCyan}
                />
                <View style={styles.scaleRow}>
                  <Text style={styles.scaleText}>0</Text>
                  <Text style={styles.scaleText}>{BGM_VOLUME_MAX_LEVEL}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('settings.sound')}</Text>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: colors.cardBorder, true: 'rgba(0,229,255,0.35)' }}
                thumbColor={soundEnabled ? colors.neonCyan : colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('settings.haptics')}</Text>
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: colors.cardBorder, true: 'rgba(0,229,255,0.35)' }}
                thumbColor={hapticsEnabled ? colors.neonCyan : colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>{t('settings.language')}</Text>
            <LanguageToggle value={language} onChange={setLanguage} />
          </View>
        </ScrollView>
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
  contentPanel: {
    flex: 1,
    maxWidth: 420,
  },
  scrollContent: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: fonts.heading,
    fontWeight: '900',
    color: colors.neonGold,
    letterSpacing: 3,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.white,
    fontSize: fonts.body,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  volumeSection: {
    gap: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  volumeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  volumeValue: {
    color: colors.neonCyan,
    fontSize: fonts.body,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  slider: {
    width: '100%',
    height: 32,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    color: colors.textMuted,
    fontSize: fonts.caption,
    fontVariant: ['tabular-nums'],
  },
  languageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  languageOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  languageOptionSelected: {
    borderColor: colors.neonCyan,
    backgroundColor: 'rgba(0,229,255,0.12)',
  },
  languageText: {
    color: colors.textMuted,
    fontSize: fonts.body,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  languageTextSelected: {
    color: colors.neonCyan,
  },
});
