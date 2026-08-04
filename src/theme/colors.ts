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
  background: '#efe5d9',
  backgroundAccent: '#e4c8a6',
  backgroundAccentSoft: '#edd7bc',
  surface: '#f7f2e8',
  surfaceSoft: '#fbf8f2',
  surfaceStrong: '#fffaf3',
  text: '#3f3027',
  muted: '#887a6d',
  primary: '#c7884f',
  primaryDark: '#3a1b01',
  border: '#ddd2c4',
  placeholder: '#9f988f',
  errorBg: '#f8e4de',
  errorText: '#8c4d39',
  successBg: '#e5efe4',
  successText: '#5a7855',
  tabIdle: '#b6a594',
  shadow: '#9c7e5f',
  white: '#fff8f0',
  badgeBg: '#eed7be',
};

export const darkColors: Colors = {
  background: '#100d0a',
  backgroundAccent: '#1a1410',
  backgroundAccentSoft: '#1e1812',
  surface: '#1c1814',
  surfaceSoft: '#201c18',
  surfaceStrong: '#251f1a',
  text: '#f0e6d8',
  muted: '#9a8d80',
  primary: '#c7884f',
  primaryDark: '#e8c49a',
  border: '#2e2720',
  placeholder: '#6b6058',
  errorBg: '#2d1a16',
  errorText: '#e89080',
  successBg: '#1a2d18',
  successText: '#90c888',
  tabIdle: '#6b5e54',
  shadow: '#000000',
  white: '#f5ede4',
  badgeBg: '#2e2318',
};

// kept for any legacy imports — resolves to light
export const colors = lightColors;
