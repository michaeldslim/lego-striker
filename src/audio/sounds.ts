export type SfxId =
  | 'kick'
  | 'save'
  | 'goal'
  | 'goal_against'
  | 'ui_tap'
  | 'wall'
  | 'win'
  | 'lose'
  | 'super';

export const SFX_SOURCES: Record<SfxId, number> = {
  kick: require('../../assets/sounds/kick.wav'),
  save: require('../../assets/sounds/save.wav'),
  goal: require('../../assets/sounds/goal.wav'),
  goal_against: require('../../assets/sounds/goal_against.wav'),
  ui_tap: require('../../assets/sounds/ui_tap.wav'),
  wall: require('../../assets/sounds/wall.wav'),
  win: require('../../assets/sounds/win.wav'),
  lose: require('../../assets/sounds/lose.wav'),
  super: require('../../assets/sounds/super.wav'),
};

/** Per-event volume multiplier (0–1) relative to SFX master. */
export const SFX_VOLUME: Record<SfxId, number> = {
  kick: 0.85,
  save: 0.9,
  goal: 1,
  goal_against: 0.85,
  ui_tap: 0.55,
  wall: 0.35,
  win: 0.95,
  lose: 0.9,
  super: 1,
};

export const SFX_MASTER_VOLUME = 0.75;

export const HAPTIC_COOLDOWN_MS = 80;
