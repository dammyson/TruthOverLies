import React from 'react';
import {ImageBackground, ImageSourcePropType, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle} from 'react-native-svg';

import {ShareTheme} from '../../theme/feelingThemes';
import {CUSTOM_BACKGROUND_ID, ShareBackgroundOption} from './shareBackgroundCatalog';
import {SHARE_CARD_HEIGHT, SHARE_CARD_WIDTH} from './shareDesignTypes';

const STAR_POINTS = [
  [120, 180],
  [280, 120],
  [860, 160],
  [980, 280],
  [180, 420],
  [920, 520],
  [240, 760],
  [780, 880],
  [960, 1040],
  [140, 980],
  [540, 240],
  [700, 680],
];

type Props = {
  background: ShareBackgroundOption;
  theme: ShareTheme;
  scale: number;
  customImageUri?: string | null;
};

function PhotoBackground({source}: {source: ImageSourcePropType}) {
  return (
    <>
      <ImageBackground
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.82)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
    </>
  );
}

function ShareBackgroundLayer({background, theme, scale, customImageUri}: Props) {
  const s = scale;
  const width = SHARE_CARD_WIDTH * s;
  const height = SHARE_CARD_HEIGHT * s;

  if (background.id === CUSTOM_BACKGROUND_ID && customImageUri) {
    return <PhotoBackground source={{uri: customImageUri}} />;
  }

  if (background.kind === 'png' && background.png) {
    return <PhotoBackground source={background.png} />;
  }

  if (background.kind === 'glow') {
    return (
      <>
        <View style={[StyleSheet.absoluteFill, {backgroundColor: theme.gradient[0]}]} />
        <LinearGradient
          colors={theme.gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.glowTop, {backgroundColor: theme.glow, transform: [{scale: s}]}]} />
        <View style={[styles.glowBottom, {backgroundColor: theme.glow, transform: [{scale: s}]}]} />
        <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Circle cx={920 * s} cy={280 * s} r={6 * s} fill="rgba(255,255,255,0.12)" />
          <Circle cx={860 * s} cy={360 * s} r={4 * s} fill="rgba(255,255,255,0.08)" />
          <Circle cx={180 * s} cy={980 * s} r={5 * s} fill="rgba(255,255,255,0.1)" />
        </Svg>
      </>
    );
  }

  if (background.kind === 'starlight') {
    return (
      <>
        <View style={[StyleSheet.absoluteFill, {backgroundColor: theme.gradient[0]}]} />
        <LinearGradient
          colors={[theme.gradient[0], theme.gradient[1], '#0A0812']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
          {STAR_POINTS.map(([x, y], i) => (
            <Circle
              key={i}
              cx={x * s}
              cy={y * s}
              r={(i % 3 === 0 ? 4 : 2.5) * s}
              fill={`rgba(255,255,255,${i % 2 === 0 ? 0.35 : 0.18})`}
            />
          ))}
        </Svg>
      </>
    );
  }

  return (
    <>
      <View style={[StyleSheet.absoluteFill, {backgroundColor: theme.gradient[0]}]} />
      <LinearGradient
        colors={theme.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />
    </>
  );
}

const styles = StyleSheet.create({
  glowTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 420,
    height: 420,
    borderRadius: 210,
    opacity: 1,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -160,
    left: -100,
    width: 500,
    height: 500,
    borderRadius: 250,
    opacity: 0.6,
  },
});

export default ShareBackgroundLayer;
