export const BGM_VOLUME_MAX_LEVEL = 10;

export const DEFAULT_BGM_VOLUME_LEVEL = 2;

export const BGM_SOURCE = require('../../assets/sounds/playing.mp3');

export const DEFAULT_SOUND_ENABLED = true;
export const DEFAULT_HAPTICS_ENABLED = true;

export function volumeFromLevel(level: number): number {
  const clamped = Math.min(BGM_VOLUME_MAX_LEVEL, Math.max(0, Math.round(level)));
  return clamped / BGM_VOLUME_MAX_LEVEL;
}
