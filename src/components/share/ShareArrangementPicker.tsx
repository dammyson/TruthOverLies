import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {SHARE_ARRANGEMENTS, ShareArrangementId} from './shareArrangementCatalog';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

const SWATCH_W = 88;
const SWATCH_H = 72;

type Props = {
  selectedId: ShareArrangementId;
  onSelect: (id: ShareArrangementId) => void;
  colors: {
    text: string;
    muted: string;
    primaryDark: string;
    border: string;
    surface: string;
  };
};

function ArrangementWireframe({
  id,
  accent,
  muted,
}: {
  id: ShareArrangementId;
  accent: string;
  muted: string;
}) {
  const bar = {backgroundColor: accent, borderRadius: 2};
  const faint = {backgroundColor: muted, borderRadius: 2, opacity: 0.45};

  switch (id) {
    case 'side-accent':
      return (
        <View style={wire.row}>
          <View style={[wire.accentBar, {backgroundColor: accent}]} />
          <View style={wire.col}>
            <View style={[bar, {width: '55%', height: 6}]} />
            <View style={[faint, {width: '90%', height: 22, marginTop: 8}]} />
            <View style={[faint, {width: '75%', height: 8, marginTop: 6}]} />
          </View>
        </View>
      );
    case 'bold-center':
      return (
        <View style={wire.centerCol}>
          <View style={[bar, {width: '40%', height: 5}]} />
          <View style={[faint, {width: '85%', height: 28, marginTop: 10}]} />
          <View style={[faint, {width: '50%', height: 6, marginTop: 8}]} />
        </View>
      );
    case 'framed':
      return (
        <View style={[wire.frame, {borderColor: accent}]}>
          <View style={[wire.innerFrame, {borderColor: muted}]}>
            <View style={[bar, {width: '50%', height: 5}]} />
            <View style={[faint, {width: '80%', height: 18, marginTop: 8}]} />
          </View>
        </View>
      );
    default:
      return (
        <View style={wire.col}>
          <View style={[bar, {width: '50%', height: 5}]} />
          <View style={[faint, {width: '92%', height: 24, marginTop: 10}]} />
          <View style={[faint, {width: '70%', height: 6, marginTop: 6}]} />
          <View style={[bar, {width: '35%', height: 4, marginTop: 'auto', opacity: 0.5}]} />
        </View>
      );
  }
}

function ShareArrangementPicker({selectedId, onSelect, colors}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.heading, {color: colors.text}]}>Choose arrangement</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {SHARE_ARRANGEMENTS.map(option => {
          const selected = selectedId === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityLabel={`Arrangement ${option.label}`}
              accessibilityState={{selected}}
              onPress={() => onSelect(option.id)}
              style={({pressed}) => [styles.item, pressed && {opacity: 0.75}]}>
              <View
                style={[
                  styles.swatchWrap,
                  {borderColor: selected ? colors.primaryDark : colors.border, backgroundColor: colors.surface},
                  selected && styles.swatchSelected,
                ]}>
                <ArrangementWireframe
                  id={option.id}
                  accent={colors.primaryDark}
                  muted={colors.border}
                />
                {selected ? (
                  <View style={[styles.checkDot, {backgroundColor: colors.primaryDark}]} />
                ) : null}
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
        })}
      </ScrollView>
    </View>
  );
}

const wire = StyleSheet.create({
  fill: {flex: 1},
  row: {flex: 1, flexDirection: 'row', padding: 6},
  col: {flex: 1, padding: 6, justifyContent: 'flex-start'},
  centerCol: {flex: 1, padding: 6, alignItems: 'center', justifyContent: 'center'},
  accentBar: {width: 5, height: '100%', borderRadius: 2, marginRight: 4},
  frame: {
    flex: 1,
    margin: 6,
    borderWidth: 2,
    padding: 3,
  },
  innerFrame: {
    flex: 1,
    borderWidth: 1,
    padding: 4,
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.xl,
  },
  heading: {
    ...typography.headline,
    fontWeight: '700',
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

export default ShareArrangementPicker;
