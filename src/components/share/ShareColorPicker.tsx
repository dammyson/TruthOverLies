import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {ShareCardPayload} from '../../types/share';
import {colorPalettesForPayload, ShareColorPaletteOption} from './shareColorCatalog';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

const SWATCH_W = 56;
const SWATCH_H = 56;

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
  payload: ShareCardPayload | null;
  colors: {
    text: string;
    muted: string;
    primaryDark: string;
    border: string;
  };
};

function ColorSwatch({
  option,
  selected,
  onPress,
  colors,
}: {
  option: ShareColorPaletteOption;
  selected: boolean;
  onPress: () => void;
  colors: Props['colors'];
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Color ${option.label}`}
      accessibilityState={{selected}}
      onPress={onPress}
      style={({pressed}) => [styles.item, pressed && {opacity: 0.75}]}>
      <View
        style={[
          styles.swatchWrap,
          {borderColor: selected ? colors.primaryDark : colors.border},
          selected && styles.swatchSelected,
        ]}>
        <LinearGradient
          colors={option.theme.gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.swatchImage}
        />
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

function ShareColorPicker({selectedId, onSelect, payload, colors}: Props) {
  const palettes = colorPalettesForPayload(payload);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.heading, {color: colors.text}]}>Choose color</Text>
      <Text style={[styles.hint, {color: colors.muted}]}>
        Sets the gradient for every background style.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {palettes.map(option => (
          <ColorSwatch
            key={option.id}
            option={option}
            selected={selectedId === option.id}
            onPress={() => onSelect(option.id)}
            colors={colors}
          />
        ))}
      </ScrollView>
    </View>
  );
}

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
    borderRadius: radius.full,
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
    fontSize: 11,
  },
  labelSelected: {
    fontWeight: '800',
  },
});

export default ShareColorPicker;
