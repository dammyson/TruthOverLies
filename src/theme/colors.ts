export type Colors = {
  background: string;
  backgroundAccent: string;
  backgroundAccentSoft: string;
  surface: string;
  surfaceSoft: string;
  surfaceStrong: string;
  text: string;
  muted: string;
  primary: string;
  primaryDark: string;
  border: string;
  placeholder: string;
  errorBg: string;
  errorText: string;
  successBg: string;
  successText: string;
  tabIdle: string;
  shadow: string;
  white: string;
  badgeBg: string;
};

export const lightColors: Colors = {
  background: '#FAF8EE',
  backgroundAccent: '#EBD0CF',
  backgroundAccentSoft: '#F2E8DC',
  surface: '#FFFFFF',
  surfaceSoft: '#FAF8F0',
  surfaceStrong: '#FFFDF5',
  text: '#282421',
  muted: '#72746A',
  primary: '#6B3A2A',
  primaryDark: '#4A2F24',
  border: '#E2D5C3',
  placeholder: '#9E9B8E',
  errorBg: '#F8E4DE',
  errorText: '#8C4D39',
  successBg: '#E5EFE4',
  successText: '#4A7845',
  tabIdle: '#B0AD9E',
  shadow: '#4A2F24',
  white: '#FFFDF5',
  badgeBg: '#EBD0CF',
};

export const darkColors: Colors = {
  background: '#1A1510',
  backgroundAccent: '#221C15',
  backgroundAccentSoft: '#261E16',
  surface: '#2A2218',
  surfaceSoft: '#2E261C',
  surfaceStrong: '#322A1E',
  text: '#F5F0E8',
  muted: '#9E9B8E',
  primary: '#A09852',
  primaryDark: '#D4C98A',
  border: '#3A3020',
  placeholder: '#6E6B5E',
  errorBg: '#2D1A16',
  errorText: '#E89080',
  successBg: '#1A2D18',
  successText: '#90C888',
  tabIdle: '#6E6B5E',
  shadow: '#000000',
  white: '#F5F0E8',
  badgeBg: '#3A2E20',
};

// kept for any legacy imports — resolves to light
export const colors = lightColors;
