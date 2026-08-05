import React, { useEffect } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { BGM_SOURCE, volumeFromLevel } from '../constants/audio';
import { useSettings } from '../contexts/SettingsContext';

export function BackgroundMusic() {
  const { ready, bgmEnabled, bgmVolumeLevel } = useSettings();
  const player = useAudioPlayer(BGM_SOURCE);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    player.loop = true;
    player.volume = volumeFromLevel(bgmVolumeLevel);
    if (bgmEnabled) {
      if (status.isLoaded && !status.playing) {
        player.play();
      }
    } else if (status.playing) {
      player.pause();
    }
  }, [ready, bgmEnabled, bgmVolumeLevel, player, status.isLoaded, status.playing]);

  return null;
}
