import React, { useEffect } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { BGM_SOURCE, BGM_VOLUME } from '../constants/audio';

export function BackgroundMusic() {
  const player = useAudioPlayer(BGM_SOURCE);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    });
  }, []);

  useEffect(() => {
    player.loop = true;
    player.volume = BGM_VOLUME;
  }, [player]);

  useEffect(() => {
    if (status.isLoaded && !status.playing) {
      player.play();
    }
  }, [status.isLoaded, status.playing, player]);

  return null;
}
