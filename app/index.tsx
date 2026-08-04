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
import { BallSkinPicker } from '../src/components/BallSkinPicker';
import { CountryPicker } from '../src/components/CountryPicker';
import { UniformColorPicker } from '../src/components/UniformColorPicker';
import { HomeHeroLogo } from '../src/components/HomeHeroLogo';
import { DEFAULT_SQUAD_SIZE } from '../src/constants/game';
import { DEFAULT_BALL_SKIN, DEFAULT_COUNTRY, DEFAULT_PLAYER_COLORS } from '../src/constants/skins';
import { colors, spacing } from '../src/constants/theme';
import { BallSkin, CountryCode, TeamColors } from '../src/types/customize';
import { SquadSize } from '../src/types/game';
import { getWinCount, loadPreferences, savePreferences } from '../src/utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const screenPadding = useScreenPadding();
  const [wins, setWins] = useState(0);
  const [squadSize, setSquadSizeState] = useState<SquadSize>(DEFAULT_SQUAD_SIZE);
  const [teamColors, setTeamColors] = useState<TeamColors>(DEFAULT_PLAYER_COLORS);
  const [ballSkin, setBallSkin] = useState<BallSkin>(DEFAULT_BALL_SKIN);
  const [countryCode, setCountryCode] = useState<CountryCode>(DEFAULT_COUNTRY);
  const bounce = useSharedValue(0);

  useEffect(() => {
    getWinCount().then(setWins);
    loadPreferences().then((prefs) => {
      setSquadSizeState(prefs.squadSize);
      setTeamColors(prefs.teamColors);
      setBallSkin(prefs.ballSkin);
      setCountryCode(prefs.countryCode);
    });
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
    savePreferences({ squadSize: size });
  };

  const handleTeamColorsChange = (colors: TeamColors) => {
    setTeamColors(colors);
    savePreferences({ teamColors: colors });
  };

  const handleBallSkinChange = (skin: BallSkin) => {
    setBallSkin(skin);
    savePreferences({ ballSkin: skin });
  };

  const handleCountryChange = (code: CountryCode) => {
    setCountryCode(code);
    savePreferences({ countryCode: code });
  };

  const startGame = () => {
    router.push({ pathname: '/game', params: { squadSize: String(squadSize) } });
  };

  return (
    <ScreenBackground>
      <View style={[styles.root, screenPadding]}>
        <View style={styles.heroPanel}>
          <View style={styles.heroContent}>
            <View style={styles.logoBlock}>
              <Animated.View style={[styles.heroLogo, heroStyle]}>
                <HomeHeroLogo teamColors={teamColors} ballSkin={ballSkin} />
              </Animated.View>
              <Text style={styles.title}>LEGO</Text>
              <Text style={styles.titleAccent}>STRIKER</Text>
              {wins > 0 && (
                <View style={styles.bestBox}>
                  <Text style={styles.bestLabel}>WINS {wins}</Text>
                </View>
              )}
            </View>
            <View style={styles.actions}>
              <NeonButton title="KICK OFF" onPress={startGame} compact style={styles.actionButton} />
              <NeonButton
                title="LEADERBOARD"
                variant="secondary"
                compact
                style={styles.actionButton}
                onPress={() => router.push('/leaderboard')}
              />
            </View>
          </View>
        </View>

        <View style={styles.menuColumn}>
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <SquadPicker value={squadSize} onChange={handleSquadChange} compact />
            <UniformColorPicker value={teamColors} onChange={handleTeamColorsChange} compact />
            <BallSkinPicker value={ballSkin} onChange={handleBallSkinChange} compact />
          </ScrollView>

          <View style={styles.countrySection}>
            <CountryPicker value={countryCode} onChange={handleCountryChange} />
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
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  heroPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
  },
  heroContent: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: spacing.md,
    width: '100%',
    maxWidth: 280,
  },
  logoBlock: {
    alignItems: 'center',
    width: '100%',
  },
  menuColumn: {
    width: 320,
    flexShrink: 0,
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
    alignSelf: 'stretch',
    gap: spacing.xs,
  },
  actionButton: {
    alignSelf: 'stretch',
  },
  countrySection: {
    flexShrink: 0,
    paddingTop: spacing.xs,
    alignItems: 'center',
  },
  heroLogo: {
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 3,
    lineHeight: 30,
    textAlign: 'center',
    width: '100%',
  },
  titleAccent: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.neonGold,
    letterSpacing: 3,
    lineHeight: 30,
    textAlign: 'center',
    width: '100%',
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
});
