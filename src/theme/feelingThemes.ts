import {FeelingOption} from '../types/app';

export type ShareTheme = {
  label: string;
  gradient: [string, string, string];
  glow: string;
  badge: string;
};

const feelingThemes: Record<FeelingOption, ShareTheme> = {
  Anxious: {
    label: 'Peace',
    gradient: ['#1B3A4B', '#2E6B7A', '#4A9BA8'],
    glow: 'rgba(120, 200, 220, 0.35)',
    badge: 'Calm',
  },
  Grateful: {
    label: 'Gratitude',
    gradient: ['#5C3D1E', '#8B5E28', '#C4943A'],
    glow: 'rgba(255, 210, 120, 0.35)',
    badge: 'Thankful',
  },
  Lonely: {
    label: 'Presence',
    gradient: ['#2D1F4E', '#4A3578', '#6B5FA6'],
    glow: 'rgba(180, 160, 255, 0.35)',
    badge: 'Never alone',
  },
  Hopeful: {
    label: 'Hope',
    gradient: ['#4A2F24', '#8B4A35', '#C4684A'],
    glow: 'rgba(255, 180, 140, 0.35)',
    badge: 'Hopeful',
  },
  Tired: {
    label: 'Rest',
    gradient: ['#1E3328', '#2E5240', '#4A7A5E'],
    glow: 'rgba(140, 210, 170, 0.35)',
    badge: 'Rest',
  },
  Confused: {
    label: 'Guidance',
    gradient: ['#2A2545', '#4A3F78', '#7B6BB8'],
    glow: 'rgba(190, 170, 255, 0.35)',
    badge: 'Clarity',
  },
  Joyful: {
    label: 'Joy',
    gradient: ['#5C4010', '#9A7020', '#D4A832'],
    glow: 'rgba(255, 230, 130, 0.4)',
    badge: 'Joyful',
  },
  Heavy: {
    label: 'Strength',
    gradient: ['#3A1520', '#6B2838', '#9A4050'],
    glow: 'rgba(255, 140, 140, 0.3)',
    badge: 'Carried',
  },
};

const defaultTheme: ShareTheme = {
  label: 'Scripture',
  gradient: ['#2A1810', '#4A2F24', '#6B3A2A'],
  glow: 'rgba(235, 208, 207, 0.3)',
  badge: 'Word',
};

export function themeForFeeling(feeling?: FeelingOption | null): ShareTheme {
  if (feeling && feelingThemes[feeling]) {
    return feelingThemes[feeling];
  }
  return defaultTheme;
}

export function themeForAccentColor(color?: string | null): ShareTheme {
  if (!color) return defaultTheme;
  return {
    label: 'Scripture',
    gradient: [darken(color, 0.45), color, lighten(color, 0.15)],
    glow: color + '55',
    badge: 'Saved',
  };
}

function darken(hex: string, amount: number): string {
  const rgb = parseHex(hex);
  if (!rgb) return defaultTheme.gradient[0];
  return rgbToHex(
    Math.round(rgb.r * (1 - amount)),
    Math.round(rgb.g * (1 - amount)),
    Math.round(rgb.b * (1 - amount)),
  );
}

function lighten(hex: string, amount: number): string {
  const rgb = parseHex(hex);
  if (!rgb) return defaultTheme.gradient[2];
  return rgbToHex(
    Math.round(rgb.r + (255 - rgb.r) * amount),
    Math.round(rgb.g + (255 - rgb.g) * amount),
    Math.round(rgb.b + (255 - rgb.b) * amount),
  );
}

function parseHex(hex: string): {r: number; g: number; b: number} | null {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return null;
  const num = parseInt(cleaned, 16);
  if (Number.isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0'))
      .join('')
  );
}
