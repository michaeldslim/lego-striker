import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { ScreenBackground } from '../src/components/ScreenBackground';
import { SideViewField } from '../src/components/SideViewField';
import { HUD } from '../src/components/HUD';
import { useScreenPadding } from '../src/hooks/useScreenPadding';
import { useSoccerEngine } from '../src/hooks/useSoccerEngine';
import { GOALS_TO_WIN } from '../src/constants/game';
import { DEFAULT_GK_DIFFICULTY } from '../src/constants/gkDifficulty';
import { DEFAULT_FIELD_THEME } from '../src/constants/fieldThemes';
import { DEFAULT_BALL_SKIN, DEFAULT_COUNTRY, DEFAULT_PLAYER_COLORS, pickRandomCountry } from '../src/constants/skins';
import { spacing } from '../src/constants/theme';
import { useSettings } from '../src/contexts/SettingsContext';
import { BallSkin, CountryCode, TeamColors } from '../src/types/customize';
import { SquadSize } from '../src/types/game';
import { loadPreferences } from '../src/utils/storage';

function parseSquadSize(value: string | string[] | undefined): SquadSize {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === '3' ? 3 : 2;
}

export default function GameScreen() {
  const screenPadding = useScreenPadding();
  const router = useRouter();
  const params = useLocalSearchParams<{ squadSize?: string }>();
  const squadSize = parseSquadSize(params.squadSize);
  const { fieldTheme } = useSettings();
  const { state, startGame, onAimStart, onAimMove, onAimEnd, onAimCancel, getResult } = useSoccerEngine();
  const navigatedRef = useRef(false);
  const gameInitRef = useRef(false);
  const boardRef = useRef<View>(null);
  const boardOriginRef = useRef({ x: 0, y: 0 });
  const layoutSizeRef = useRef<{ width: number; height: number } | null>(null);
  const playerColorsRef = useRef<TeamColors>(DEFAULT_PLAYER_COLORS);
  const gkDifficultyRef = useRef(DEFAULT_GK_DIFFICULTY);
  const [ballSkin, setBallSkin] = useState<BallSkin>(DEFAULT_BALL_SKIN);
  const [countryCode, setCountryCode] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [aiCountryCode, setAiCountryCode] = useState<CountryCode>(DEFAULT_COUNTRY);
  const prefsReadyRef = useRef(false);

  const tryStartGame = useCallback(() => {
    if (gameInitRef.current || !prefsReadyRef.current || !layoutSizeRef.current) return;
    gameInitRef.current = true;
    navigatedRef.current = false;
    const { width, height } = layoutSizeRef.current;
    startGame(
      Math.round(width),
      Math.round(height),
      squadSize,
      playerColorsRef.current,
      gkDifficultyRef.current
    );
  }, [squadSize, startGame]);

  useEffect(() => {
    loadPreferences().then((prefs) => {
      playerColorsRef.current = prefs.teamColors;
      gkDifficultyRef.current = prefs.gkDifficulty;
      setBallSkin(prefs.ballSkin);
      setCountryCode(prefs.countryCode);
      setAiCountryCode(pickRandomCountry(prefs.countryCode));
      prefsReadyRef.current = true;
      tryStartGame();
    });
  }, [tryStartGame]);

  const syncBoardOrigin = useCallback(() => {
    boardRef.current?.measureInWindow((x, y) => {
      boardOriginRef.current = { x, y };
    });
  }, []);

  const toBoardCoords = useCallback((absoluteX: number, absoluteY: number) => {
    const { x, y } = boardOriginRef.current;
    return { x: absoluteX - x, y: absoluteY - y };
  }, []);

  const handleAimStart = useCallback(
    (absoluteX: number, absoluteY: number) => {
      boardRef.current?.measureInWindow((x, y) => {
        boardOriginRef.current = { x, y };
        const local = { x: absoluteX - x, y: absoluteY - y };
        onAimStart(local.x, local.y);
      });
    },
    [onAimStart]
  );

  const handleAimMove = useCallback(
    (absoluteX: number, absoluteY: number) => {
      const local = toBoardCoords(absoluteX, absoluteY);
      onAimMove(local.x, local.y);
    },
    [onAimMove, toBoardCoords]
  );

  const handleBoardLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    layoutSizeRef.current = { width, height };
    tryStartGame();
  };

  useEffect(() => () => {
    gameInitRef.current = false;
  }, []);

  useEffect(() => {
    if (!state?.isFinished || navigatedRef.current) return;
    navigatedRef.current = true;
    const result = getResult();
    setTimeout(() => {
      router.replace({
        pathname: '/result',
        params: {
          playerGoals: String(result.playerGoals),
          aiGoals: String(result.aiGoals),
          won: result.won ? '1' : '0',
          squadSize: String(squadSize),
        },
      });
    }, 800);
  }, [state?.isFinished, getResult, router, squadSize]);

  const pan = Gesture.Pan()
    .shouldCancelWhenOutside(false)
    .onStart((e) => {
      runOnJS(handleAimStart)(e.absoluteX, e.absoluteY);
    })
    .onUpdate((e) => {
      runOnJS(handleAimMove)(e.absoluteX, e.absoluteY);
    })
    .onEnd(() => {
      runOnJS(onAimEnd)();
    })
    .onFinalize((_e, success) => {
      if (!success) {
        runOnJS(onAimCancel)();
      }
    })
    .minDistance(0);

  const { width, height } = state?.boardSize ?? { width: 0, height: 0 };

  return (
    <ScreenBackground>
      <GestureDetector gesture={pan}>
        <View style={[styles.root, screenPadding]}>
          <HUD
            playerGoals={state?.playerGoals ?? 0}
            aiGoals={state?.aiGoals ?? 0}
            turn={state?.turn ?? 'player'}
            message={state?.message ?? null}
            goalsToWin={GOALS_TO_WIN}
          />

          <View style={styles.boardArea} onLayout={handleBoardLayout}>
            {state && width > 0 && height > 0 && (
              <View ref={boardRef} style={{ width, height }} onLayout={syncBoardOrigin}>
                <SideViewField
                  width={width}
                  height={height}
                  field={state.field}
                  ball={state.ball}
                  characters={state.characters}
                  gkBarYs={state.gkBarYs}
                  gkBarLength={state.gkBars[0]?.length ?? 0}
                  selectedId={state.selectedId}
                  aimStart={state.aimStart}
                  aimCurrent={state.aimCurrent}
                  aimStartTime={state.aimStartTime}
                  aimDraggedOut={state.aimDraggedOut}
                  activeCharacterId={state.activeCharacterId}
                  turn={state.turn}
                  phase={state.phase}
                  ballSkin={ballSkin}
                  theme={fieldTheme ?? DEFAULT_FIELD_THEME}
                  playerCountryCode={countryCode}
                  aiCountryCode={aiCountryCode}
                />
              </View>
            )}
          </View>
        </View>
      </GestureDetector>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: spacing.sm,
  },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
