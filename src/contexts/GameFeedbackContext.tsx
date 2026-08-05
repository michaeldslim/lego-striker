import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import {
  HAPTIC_COOLDOWN_MS,
  SFX_MASTER_VOLUME,
  SFX_SOURCES,
  SFX_VOLUME,
  SfxId,
} from '../audio/sounds';
import { useSettings } from './SettingsContext';

export type FeedbackEvent =
  | 'select'
  | 'flick'
  | 'super'
  | 'kick'
  | 'wall'
  | 'char_bump'
  | 'save'
  | 'goal'
  | 'goal_against'
  | 'turn'
  | 'cancel'
  | 'ui_tap'
  | 'win'
  | 'lose';

interface GameFeedbackContextValue {
  play: (event: FeedbackEvent, options?: { kickPower?: number }) => void;
}

const GameFeedbackContext = createContext<GameFeedbackContextValue | null>(null);

const EVENT_SFX: Partial<Record<FeedbackEvent, SfxId>> = {
  kick: 'kick',
  super: 'super',
  save: 'save',
  goal: 'goal',
  goal_against: 'goal_against',
  wall: 'wall',
  ui_tap: 'ui_tap',
  win: 'win',
  lose: 'lose',
};

const COOLDOWN_EVENTS: FeedbackEvent[] = ['wall', 'char_bump'];

export function GameFeedbackProvider({ children }: { children: React.ReactNode }) {
  const { soundEnabled, hapticsEnabled } = useSettings();
  const playersRef = useRef<Record<SfxId, AudioPlayer> | null>(null);
  const lastHapticRef = useRef<Record<string, number>>({});

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    });

    const players = Object.fromEntries(
      (Object.keys(SFX_SOURCES) as SfxId[]).map((id) => [id, createAudioPlayer(SFX_SOURCES[id])])
    ) as Record<SfxId, AudioPlayer>;

    playersRef.current = players;

    return () => {
      for (const player of Object.values(players)) {
        player.release();
      }
      playersRef.current = null;
    };
  }, []);

  const playSfx = useCallback(
    (id: SfxId, powerScale = 1) => {
      if (!soundEnabled || !playersRef.current) return;
      const player = playersRef.current[id];
      const volume = SFX_MASTER_VOLUME * SFX_VOLUME[id] * powerScale;
      player.volume = Math.min(1, volume);
      player.seekTo(0);
      player.play();
    },
    [soundEnabled]
  );

  const runHaptic = useCallback(
    (event: FeedbackEvent, kickPower = 0.5) => {
      if (!hapticsEnabled) return;

      const now = Date.now();
      if (COOLDOWN_EVENTS.includes(event)) {
        const last = lastHapticRef.current[event] ?? 0;
        if (now - last < HAPTIC_COOLDOWN_MS) return;
        lastHapticRef.current[event] = now;
      }

      switch (event) {
        case 'select':
        case 'turn':
        case 'cancel':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'flick':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'super':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'kick':
          if (kickPower >= 0.75) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
          } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          break;
        case 'wall':
        case 'char_bump':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          break;
        case 'save':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'goal':
        case 'win':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'goal_against':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'lose':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'ui_tap':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        default:
          break;
      }
    },
    [hapticsEnabled]
  );

  const play = useCallback(
    (event: FeedbackEvent, options?: { kickPower?: number }) => {
      const kickPower = options?.kickPower ?? 0.5;
      runHaptic(event, kickPower);

      const sfxId = EVENT_SFX[event];
      if (sfxId) {
        const powerScale = event === 'kick' ? 0.6 + kickPower * 0.4 : 1;
        playSfx(sfxId, powerScale);
      }
    },
    [playSfx, runHaptic]
  );

  const value = useMemo(() => ({ play }), [play]);

  return <GameFeedbackContext.Provider value={value}>{children}</GameFeedbackContext.Provider>;
}

export function useGameFeedback(): GameFeedbackContextValue {
  const ctx = useContext(GameFeedbackContext);
  if (!ctx) {
    throw new Error('useGameFeedback must be used within GameFeedbackProvider');
  }
  return ctx;
}
