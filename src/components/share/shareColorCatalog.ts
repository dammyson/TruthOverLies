import {FeelingOption} from '../../types/app';
import {ShareTheme, themeForAccentColor, themeForFeeling} from '../../theme/feelingThemes';
import {ShareCardPayload} from '../../types/share';

export type ShareColorPaletteOption = {
  id: string;
  label: string;
  theme: ShareTheme;
};

const FEELING_ORDER: FeelingOption[] = [
  'Hopeful',
  'Grateful',
  'Joyful',
  'Anxious',
  'Tired',
  'Lonely',
  'Confused',
  'Heavy',
];

export const SHARE_COLOR_PALETTES: ShareColorPaletteOption[] = [
  ...FEELING_ORDER.map(feeling => ({
    id: feeling.toLowerCase(),
    label: feeling,
    theme: themeForFeeling(feeling),
  })),
  {
    id: 'classic',
    label: 'Classic',
    theme: themeForFeeling(null),
  },
];

export function getShareColorPalette(id: string): ShareColorPaletteOption | undefined {
  return SHARE_COLOR_PALETTES.find(p => p.id === id);
}

export function colorPalettesForPayload(
  payload: ShareCardPayload | null,
): ShareColorPaletteOption[] {
  if (payload?.kind === 'scripture' && payload.accentColor) {
    return [
      {
        id: 'scripture-category',
        label: payload.categoryName ?? 'Saved',
        theme: themeForAccentColor(payload.accentColor),
      },
      ...SHARE_COLOR_PALETTES,
    ];
  }
  return SHARE_COLOR_PALETTES;
}

export function defaultColorPaletteForPayload(payload: ShareCardPayload): string {
  if (payload.kind === 'devotion' && payload.feelings[0]) {
    return payload.feelings[0].toLowerCase();
  }
  if (payload.kind === 'scripture' && payload.accentColor) {
    return 'scripture-category';
  }
  return 'classic';
}

export function resolveShareTheme(
  payload: ShareCardPayload,
  colorPaletteId: string,
): ShareTheme {
  if (colorPaletteId === 'scripture-category' && payload.kind === 'scripture') {
    return themeForAccentColor(payload.accentColor);
  }
  const palette = getShareColorPalette(colorPaletteId);
  if (palette) return palette.theme;
  if (payload.kind === 'devotion') {
    return themeForFeeling(payload.feelings[0]);
  }
  return themeForAccentColor(payload.kind === 'scripture' ? payload.accentColor : null);
}

export function getShareColorPaletteLabel(id: string): string {
  if (id === 'scripture-category') return 'Category';
  return getShareColorPalette(id)?.label ?? 'Classic';
}
