import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../context/ThemeContext';
import {typography} from '../theme/typography';
import {radius, spacing} from '../theme/spacing';
import CloseButton from './CloseButton';
import type {BibleStyle} from '../bible/bibleRepo';

interface Props {
  visible: boolean;
  bibleStyle: BibleStyle;
  onChange: (style: BibleStyle) => void;
  onClose: () => void;
}

const FONT_OPTIONS: Array<{key: BibleStyle['fontSize']; label: string; size: number}> = [
  {key: 'sm', label: 'Sm', size: 13},
  {key: 'md', label: 'Med', size: 17},
  {key: 'lg', label: 'Lg', size: 21},
  {key: 'xl', label: 'XL', size: 25},
];

const SPACING_OPTIONS: Array<{key: BibleStyle['lineSpacing']; label: string; gaps: number}> = [
  {key: 'compact', label: 'Compact', gaps: 2},
  {key: 'normal', label: 'Normal', gaps: 6},
  {key: 'relaxed', label: 'Relaxed', gaps: 11},
];

const LAYOUT_OPTIONS: Array<{
  key: BibleStyle['verseLayout'];
  label: string;
  desc: string;
}> = [
  {key: 'separated', label: 'Separated', desc: 'Each verse spaced apart'},
  {key: 'continuous', label: 'Continuous', desc: 'Verses flow together'},
];

export default function BibleStyleSheet({visible, bibleStyle, onChange, onClose}: Props) {
  const {colors, isDark} = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 13,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  if (!visible) {
    return null;
  }

  const update = (partial: Partial<BibleStyle>) => onChange({...bibleStyle, ...partial});
  const sheetBg = isDark ? '#1E1510' : colors.surface;

  const optionBase = (active: boolean) => ({
    backgroundColor: active
      ? colors.primaryDark + '1E'
      : isDark
      ? colors.surfaceStrong
      : '#F4EFE6',
    borderColor: active ? colors.primaryDark : colors.border,
    borderWidth: active ? 1.5 : StyleSheet.hairlineWidth,
  });

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
      {/* Backdrop */}
      <Pressable
        style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(0,0,0,0.35)'}]}
        onPress={onClose}
      />

      {/* Sheet */}
      <Animated.View
        style={[
          s.sheet,
          {
            backgroundColor: sheetBg,
            paddingBottom: Math.max(insets.bottom, 12) + spacing.sm,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        {/* Handle */}
        <View style={s.handleWrap}>
          <View style={[s.handle, {backgroundColor: colors.border}]} />
        </View>

        {/* Title row — spacer + centered title + close button */}
        <View style={s.closeRow}>
          <View style={s.closeSpacer} />
          <Text style={[s.title, {color: colors.text}]}>Reading Style</Text>
          <CloseButton onPress={onClose} />
        </View>

        <View style={s.body}>
          {/* ── FONT SIZE ── */}
          <View>
            <Text style={[s.sectionLabel, {color: colors.muted}]}>Font Size</Text>
            <View style={s.row}>
              {FONT_OPTIONS.map(opt => {
                const active = bibleStyle.fontSize === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => update({fontSize: opt.key})}
                    style={({pressed}) => [
                      s.fontOption,
                      optionBase(active),
                      pressed && {opacity: 0.7},
                    ]}>
                    <Text
                      style={{
                        fontSize: opt.size,
                        fontWeight: '700',
                        color: active ? colors.primaryDark : colors.text,
                        lineHeight: opt.size + 4,
                      }}>
                      A
                    </Text>
                    <Text
                      style={[
                        s.optionLabel,
                        {color: active ? colors.primaryDark : colors.muted},
                      ]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ── LINE SPACING ── */}
          <View>
            <Text style={[s.sectionLabel, {color: colors.muted}]}>Line Spacing</Text>
            <View style={s.row}>
              {SPACING_OPTIONS.map(opt => {
                const active = bibleStyle.lineSpacing === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => update({lineSpacing: opt.key})}
                    style={({pressed}) => [
                      s.spacingOption,
                      optionBase(active),
                      pressed && {opacity: 0.7},
                    ]}>
                    {/* Line density preview */}
                    <View style={{width: 44, gap: opt.gaps}}>
                      {[1, 0.75, 0.88].map((w, i) => (
                        <View
                          key={i}
                          style={{
                            height: 2,
                            width: `${w * 100}%` as unknown as number,
                            borderRadius: 1,
                            backgroundColor: active ? colors.primaryDark : colors.muted,
                            opacity: 0.7,
                          }}
                        />
                      ))}
                    </View>
                    <Text
                      style={[
                        s.optionLabel,
                        {color: active ? colors.primaryDark : colors.muted},
                      ]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ── VERSE STYLE ── */}
          <View>
            <Text style={[s.sectionLabel, {color: colors.muted}]}>Verse Style</Text>
            <View style={s.row}>
              {LAYOUT_OPTIONS.map(opt => {
                const active = bibleStyle.verseLayout === opt.key;
                const isSep = opt.key === 'separated';
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => update({verseLayout: opt.key})}
                    style={({pressed}) => [
                      s.layoutOption,
                      optionBase(active),
                      pressed && {opacity: 0.7},
                    ]}>
                    {/* Mini verse layout preview */}
                    <View style={{width: 60, gap: isSep ? 7 : 2}}>
                      {[0, 1].map(block => (
                        <View key={block} style={{gap: 2}}>
                          <View style={{flexDirection: 'row', gap: 3, alignItems: 'center'}}>
                            <View
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: 1.5,
                                backgroundColor: active ? colors.primaryDark : colors.muted,
                                opacity: 0.65,
                              }}
                            />
                            <View
                              style={{
                                height: 2,
                                flex: 1,
                                borderRadius: 1,
                                backgroundColor: active ? colors.primaryDark : colors.muted,
                                opacity: 0.55,
                              }}
                            />
                          </View>
                          <View
                            style={{
                              height: 2,
                              width: '80%',
                              borderRadius: 1,
                              backgroundColor: active ? colors.primaryDark : colors.muted,
                              opacity: 0.35,
                              marginLeft: 10,
                            }}
                          />
                        </View>
                      ))}
                    </View>
                    <Text
                      style={[
                        s.layoutLabel,
                        {color: active ? colors.primaryDark : colors.text},
                      ]}>
                      {opt.label}
                    </Text>
                    <Text style={[s.layoutDesc, {color: colors.muted}]}>{opt.desc}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 2,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  closeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: 8,
    paddingBottom: 16,
  },
  closeSpacer: {
    width: 36,
  },
  title: {
    ...typography.headline,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  body: {
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  sectionLabel: {
    ...typography.eyebrow,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  fontOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    gap: 4,
  },
  spacingOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    gap: 8,
  },
  layoutOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    gap: 6,
  },
  optionLabel: {
    ...typography.caption1,
  },
  layoutLabel: {
    ...typography.footnote,
    fontWeight: '700',
  },
  layoutDesc: {
    ...typography.caption1,
    textAlign: 'center',
  },
});
