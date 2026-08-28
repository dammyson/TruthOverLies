import {ImageSourcePropType} from 'react-native';

export const CUSTOM_BACKGROUND_ID = 'custom-photo';

export type ShareBackgroundKind =
  | 'gradient'
  | 'glow'
  | 'starlight'
  | 'png';

export type ShareTextVariant = 'light' | 'dark';

export type ShareBackgroundOption = {
  id: string;
  label: string;
  kind: ShareBackgroundKind;
  textVariant: ShareTextVariant;
  /** Swatch colors shown in the background picker. */
  previewColors: [string, string, string];
  /** Used when kind is `png`. Bundled assets only — user uploads use customImageUri. */
  png?: ImageSourcePropType;
};

export const CUSTOM_BACKGROUND_OPTION: ShareBackgroundOption = {
  id: CUSTOM_BACKGROUND_ID,
  label: 'Yours',
  kind: 'png',
  textVariant: 'light',
  previewColors: ['#2A1810', '#4A2F24', '#6B3A2A'],
};

/**
 * Visual backgrounds only — colors, gradients, textures, PNGs.
 * Layout is chosen separately via shareArrangementCatalog.
 */
export const SHARE_BACKGROUNDS: ShareBackgroundOption[] = [
  {
    id: 'gradient',
    label: 'Gradient',
    kind: 'gradient',
    textVariant: 'light',
    previewColors: ['#4A2F24', '#8B4A35', '#C4684A'],
  },
  {
    id: 'glow',
    label: 'Glow',
    kind: 'glow',
    textVariant: 'light',
    previewColors: ['#3A2218', '#7A4530', '#C4684A'],
  },
  {
    id: 'starlight',
    label: 'Starlight',
    kind: 'starlight',
    textVariant: 'light',
    previewColors: ['#0B1020', '#1B3A4B', '#4A9BA8'],
  },
];

export function getShareBackground(id: string): ShareBackgroundOption {
  if (id === CUSTOM_BACKGROUND_ID) {
    return CUSTOM_BACKGROUND_OPTION;
  }
  return SHARE_BACKGROUNDS.find(bg => bg.id === id) ?? SHARE_BACKGROUNDS[0];
}

export function isValidBackgroundId(id: string): boolean {
  return id === CUSTOM_BACKGROUND_ID || SHARE_BACKGROUNDS.some(bg => bg.id === id);
}
