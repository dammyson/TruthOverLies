import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle, Path} from 'react-native-svg';

import {ShareTheme} from '../../theme/feelingThemes';
import {
  CUSTOM_BACKGROUND_ID,
  CUSTOM_BACKGROUND_OPTION,
  SHARE_BACKGROUNDS,
  ShareBackgroundKind,
  ShareBackgroundOption,
} from './shareBackgroundCatalog';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

const SWATCH_W = 72;
const SWATCH_H = 56;

const SWATCH_STARS = [
  [10, 8],
  [28, 14],
  [58, 10],
  [66, 24],
  [14, 32],
  [48, 28],
  [22, 48],
  [62, 46],
];

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
  onPickCustomPhoto: () => void;
  customPhotoUri?: string | null;
  theme?: ShareTheme | null;
  colors: {
    text: string;
    muted: string;
    primaryDark: string;
    border: string;
    surface?: string;
  };
};

function UploadIcon({color, size = 22}: {color: string; size?: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15V5M12 5L8 9M12 5L16 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BackgroundStylePreview({
  kind,
  theme,
}: {
  kind: ShareBackgroundKind;
  theme?: ShareTheme | null;
}) {
  const gradient = theme?.gradient ?? (['#4A2F24', '#8B4A35', '#C4684A'] as const);
  const glowColor = theme?.glow ?? 'rgba(255, 200, 150, 0.55)';

  if (kind === 'glow') {
    return (
      <>
        <View style={[StyleSheet.absoluteFill, {backgroundColor: gradient[0]}]} />
        <LinearGradient
          colors={[...gradient]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <View style={[previewStyles.glowTop, {backgroundColor: glowColor}]} />
        <View style={[previewStyles.glowBottom, {backgroundColor: glowColor}]} />
        <Svg width={SWATCH_W} height={SWATCH_H} style={StyleSheet.absoluteFill} pointerEvents="none">
          <Circle cx={54} cy={16} r={2.5} fill="rgba(255,255,255,0.2)" />
          <Circle cx={16} cy={44} r={2} fill="rgba(255,255,255,0.14)" />
        </Svg>
      </>
    );
  }

  if (kind === 'starlight') {
    return (
      <>
        <View style={[StyleSheet.absoluteFill, {backgroundColor: gradient[0]}]} />
        <LinearGradient
          colors={[gradient[0], gradient[1], '#0A0812']}
          locations={[0, 0.45, 1]}
          start={{x: 0, y: 0}}
          end={{x: 0.2, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <Svg width={SWATCH_W} height={SWATCH_H} style={StyleSheet.absoluteFill} pointerEvents="none">
          {SWATCH_STARS.map(([x, y], i) => (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r={i % 3 === 0 ? 1.8 : 1.2}
              fill={`rgba(255,255,255,${i % 2 === 0 ? 0.75 : 0.45})`}
            />
          ))}
        </Svg>
      </>
    );
  }

  return (
    <>
      <View style={[StyleSheet.absoluteFill, {backgroundColor: gradient[0]}]} />
      <LinearGradient
        colors={[...gradient]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />
    </>
  );
}

function BackgroundSwatch({
  option,
  selected,
  onPress,
  colors,
  theme,
  previewUri,
}: {
  option: ShareBackgroundOption;
  selected: boolean;
  onPress: () => void;
  colors: Props['colors'];
  theme?: ShareTheme | null;
  previewUri?: string;
}) {
  const isCustom = option.id === CUSTOM_BACKGROUND_ID;
  const previewSource =
    previewUri != null ? ({uri: previewUri} as ImageSourcePropType) : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Background ${option.label}`}
      accessibilityState={{selected}}
      onPress={onPress}
      style={({pressed}) => [styles.item, pressed && {opacity: 0.75}]}>
      <View
        style={[
          styles.swatchWrap,
          {borderColor: selected ? colors.primaryDark : colors.border},
          selected && styles.swatchSelected,
        ]}>
        {previewSource ? (
          <Image source={previewSource} style={styles.swatchImage} />
        ) : isCustom ? (
          <View
            style={[
              styles.swatchImage,
              styles.customPlaceholder,
              {backgroundColor: colors.surface ?? colors.border},
            ]}>
            <UploadIcon color={colors.primaryDark} />
          </View>
        ) : (
          <View style={styles.swatchImage}>
            <BackgroundStylePreview kind={option.kind} theme={theme} />
          </View>
        )}
        {selected ? <View style={[styles.checkDot, {backgroundColor: colors.primaryDark}]} /> : null}
      </View>
      <Text
        style={[
          styles.label,
          {color: selected ? colors.primaryDark : colors.muted},
          selected && styles.labelSelected,
        ]}
        numberOfLines={1}>
        {option.label}
      </Text>
    </Pressable>
  );
}

function ShareBackgroundPicker({
  selectedId,
  onSelect,
  onPickCustomPhoto,
  customPhotoUri,
  theme,
  colors,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.heading, {color: colors.text}]}>Choose a background</Text>
      <Text style={[styles.hint, {color: colors.muted}]}>
        Style uses your selected color palette. Tap Yours to add your own photo.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {SHARE_BACKGROUNDS.map(option => (
          <BackgroundSwatch
            key={option.id}
            option={option}
            selected={selectedId === option.id}
            onPress={() => onSelect(option.id)}
            colors={colors}
            theme={theme}
          />
        ))}
        <BackgroundSwatch
          option={CUSTOM_BACKGROUND_OPTION}
          selected={selectedId === CUSTOM_BACKGROUND_ID}
          onPress={onPickCustomPhoto}
          colors={colors}
          theme={theme}
          previewUri={customPhotoUri ?? undefined}
        />
      </ScrollView>
    </View>
  );
}

const previewStyles = StyleSheet.create({
  glowTop: {
    position: 'absolute',
    top: -14,
    right: -10,
    width: 38,
    height: 38,
    borderRadius: 19,
    opacity: 0.95,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -16,
    left: -12,
    width: 44,
    height: 44,
    borderRadius: 22,
    opacity: 0.55,
  },
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  heading: {
    ...typography.subhead,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  hint: {
    ...typography.caption1,
    marginBottom: spacing.sm,
  },
  row: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  item: {
    width: SWATCH_W,
    alignItems: 'center',
  },
  swatchWrap: {
    width: SWATCH_W,
    height: SWATCH_H,
    borderRadius: radius.lg,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  swatchSelected: {
    borderWidth: 3,
  },
  swatchImage: {
    width: '100%',
    height: '100%',
  },
  customPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFDF5',
  },
  label: {
    ...typography.caption1,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelSelected: {
    fontWeight: '800',
  },
});

export default ShareBackgroundPicker;
