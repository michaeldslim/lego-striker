export interface TeamColors {
  shirt: string;
  pants: string;
}

export type BallSkin = 'legacy' | 'pl' | 'worldcup';

export interface BallSkinOption {
  id: BallSkin;
  label: string;
}

export type UniformKitId =
  | 'cyan'
  | 'gold'
  | 'neon'
  | 'pink'
  | 'purple'
  | 'orange'
  | 'navy'
  | 'teal';

export interface UniformKit {
  id: UniformKitId;
  label: string;
  shirt: string;
  pants: string;
}
