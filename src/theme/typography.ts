import {TextStyle} from 'react-native';

type TypeStyle = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'> & {
  textTransform?: TextStyle['textTransform'];
};

export const typography = {
  largeTitle: {fontSize: 34, lineHeight: 41, fontWeight: '400'} as TypeStyle,
  title1:     {fontSize: 28, lineHeight: 34, fontWeight: '400'} as TypeStyle,
  title2:     {fontSize: 22, lineHeight: 28, fontWeight: '400'} as TypeStyle,
  title3:     {fontSize: 20, lineHeight: 25, fontWeight: '400'} as TypeStyle,
  headline:   {fontSize: 17, lineHeight: 22, fontWeight: '600'} as TypeStyle,
  body:       {fontSize: 17, lineHeight: 22, fontWeight: '400'} as TypeStyle,
  callout:    {fontSize: 16, lineHeight: 21, fontWeight: '400'} as TypeStyle,
  subhead:    {fontSize: 15, lineHeight: 20, fontWeight: '400'} as TypeStyle,
  footnote:   {fontSize: 13, lineHeight: 18, fontWeight: '400'} as TypeStyle,
  caption1:   {fontSize: 12, lineHeight: 16, fontWeight: '400'} as TypeStyle,
  caption2:   {fontSize: 11, lineHeight: 13, fontWeight: '400'} as TypeStyle,
  // Custom: small-caps label used as section eyebrow
  eyebrow:    {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TypeStyle,
} as const;
