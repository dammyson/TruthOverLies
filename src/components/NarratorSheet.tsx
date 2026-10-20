import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';
import {useAudioPlayer} from '../context/AudioPlayerContext';
import {useTheme} from '../context/ThemeContext';
import {typography} from '../theme/typography';
import {radius, spacing} from '../theme/spacing';
import CloseButton from './CloseButton';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function NarratorSheet({visible, onClose}: Props) {
  const {colors, isDark} = useTheme();
  const insets = useSafeAreaInsets();
  const {voices, activeVoiceId, setVoice} = useAudioPlayer();
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

  if (!visible) return null;

  const sheetBg = isDark ? '#1E1510' : colors.surface;

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
      <Pressable
        style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(0,0,0,0.35)'}]}
        onPress={onClose}
      />
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

        {/* Title row */}
        <View style={s.closeRow}>
          <View style={s.closeSpacer} />
          <Text style={[s.title, {color: colors.text}]}>Narrator Voice</Text>
          <CloseButton onPress={onClose} />
        </View>
        <Text style={[s.hint, {color: colors.muted}]}>
          Premium &amp; Enhanced voices sound most natural
        </Text>

        {voices.length === 0 ? (
          <View style={{paddingHorizontal: spacing.md, paddingBottom: spacing.lg}}>
            <Text
              style={{
                ...typography.subhead,
                color: colors.muted,
                textAlign: 'center',
              }}>
              No English voices found on this device.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{maxHeight: 360}}
            contentContainerStyle={{paddingHorizontal: spacing.md}}
            showsVerticalScrollIndicator={false}>
            {voices.map(voice => {
              const active = voice.id === activeVoiceId;
              const qualityLabel =
                voice.quality >= 750
                  ? 'Premium'
                  : voice.quality >= 500
                  ? 'Enhanced'
                  : 'Standard';
              const qualityColor =
                voice.quality >= 750
                  ? '#7B5EA7'
                  : voice.quality >= 500
                  ? '#2E7D32'
                  : colors.muted;
              return (
                <Pressable
                  key={voice.id}
                  onPress={() => {
                    setVoice(voice.id);
                    onClose();
                  }}
                  style={({pressed}) => [
                    s.voiceRow,
                    {
                      borderBottomColor: colors.border,
                      backgroundColor: active
                        ? colors.primaryDark + '12'
                        : 'transparent',
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}>
                  <View style={{flex: 1}}>
                    <View style={s.nameRow}>
                      <Text
                        style={[
                          s.voiceName,
                          {color: active ? colors.primaryDark : colors.text},
                        ]}>
                        {voice.name}
                      </Text>
                      <View style={[s.badge, {borderColor: qualityColor}]}>
                        <Text style={[s.badgeText, {color: qualityColor}]}>
                          {qualityLabel}
                        </Text>
                      </View>
                    </View>
                    <Text style={[s.voiceLang, {color: colors.muted}]}>
                      {voice.language}
                    </Text>
                  </View>
                  {active && (
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M20 6L9 17l-5-5"
                        stroke={colors.primaryDark}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        )}
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
  handleWrap: {alignItems: 'center', paddingTop: 12, paddingBottom: 2},
  handle: {width: 36, height: 4, borderRadius: 2},
  closeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: 8,
    paddingBottom: 16,
  },
  closeSpacer: {width: 36},
  title: {
    ...typography.headline,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  hint: {
    ...typography.caption1,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 8,
    paddingHorizontal: spacing.md,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.sm,
  },
  nameRow: {flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap'},
  voiceName: {...typography.subhead, fontWeight: '600'},
  voiceLang: {...typography.caption1, marginTop: 2},
  badge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {...typography.caption2, fontWeight: '600'},
});
