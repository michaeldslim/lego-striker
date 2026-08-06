export type FieldTheme = 'day' | 'night' | 'indoor';

export interface FieldAmbientOverlay {
  center: string;
  edge: string;
  opacity: number;
}

export interface FieldThemePalette {
  grassStops: [string, string, string];
  stripeOpacity: number;
  lineColor: string;
  borderColor: string;
  goalPostFill: string;
  goalPostStroke: string;
  goalNetFill: string;
  goalNetLine: string;
  containerBorder: string;
  ambientOverlay?: FieldAmbientOverlay;
}

export const DEFAULT_FIELD_THEME: FieldTheme = 'day';

export const FIELD_THEME_OPTIONS: readonly FieldTheme[] = ['day', 'night', 'indoor'];

export const FIELD_THEMES: Record<FieldTheme, FieldThemePalette> = {
  day: {
    grassStops: ['#2d6a4f', '#40916c', '#2d6a4f'],
    stripeOpacity: 0.06,
    lineColor: 'rgba(255,255,255,0.35)',
    borderColor: 'rgba(255,255,255,0.5)',
    goalPostFill: '#1b4332',
    goalPostStroke: 'rgba(255,255,255,0.4)',
    goalNetFill: 'rgba(0,0,0,0.35)',
    goalNetLine: 'rgba(255,215,0,0.2)',
    containerBorder: 'rgba(255,255,255,0.12)',
  },
  night: {
    grassStops: ['#1a3d2e', '#245a42', '#1a3d2e'],
    stripeOpacity: 0.08,
    lineColor: 'rgba(255,255,255,0.22)',
    borderColor: 'rgba(255,255,255,0.28)',
    goalPostFill: '#0f2919',
    goalPostStroke: 'rgba(255,255,255,0.25)',
    goalNetFill: 'rgba(0,0,0,0.45)',
    goalNetLine: 'rgba(255,215,0,0.12)',
    containerBorder: 'rgba(255,255,255,0.08)',
    ambientOverlay: {
      center: 'rgba(255,255,220,0.14)',
      edge: 'rgba(0,0,0,0.35)',
      opacity: 1,
    },
  },
  indoor: {
    grassStops: ['#6b4f2a', '#8b6914', '#6b4f2a'],
    stripeOpacity: 0.05,
    lineColor: 'rgba(255,248,230,0.38)',
    borderColor: 'rgba(255,248,230,0.45)',
    goalPostFill: '#4a3820',
    goalPostStroke: 'rgba(255,248,230,0.35)',
    goalNetFill: 'rgba(0,0,0,0.3)',
    goalNetLine: 'rgba(255,200,80,0.18)',
    containerBorder: 'rgba(200,160,80,0.2)',
  },
};

export function parseFieldTheme(raw: unknown): FieldTheme {
  if (raw === 'night' || raw === 'indoor') return raw;
  return DEFAULT_FIELD_THEME;
}

export function getFieldThemePalette(theme: FieldTheme): FieldThemePalette {
  return FIELD_THEMES[theme];
}
