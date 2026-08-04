export interface TeamColors {
  shirt: string;
  pants: string;
}

export type BallSkin = 'legacy' | 'pl' | 'worldcup';

export type CountryCode = 'KR' | 'BR' | 'JP' | 'US' | 'GB' | 'ES' | 'DE' | 'FR' | 'AR' | 'IT' | 'PT' | 'MX';

export interface CountryOption {
  code: CountryCode;
  name: string;
}

export interface BallSkinOption {
  id: BallSkin;
  label: string;
}

export type UniformKitId =
  | 'cyan'
  | 'gold'
  | 'neon'
  | 'blue'
  | 'red'
  | 'orange'
  | 'navy'
  | 'teal';

export interface UniformKit {
  id: UniformKitId;
  label: string;
  shirt: string;
  pants: string;
}
