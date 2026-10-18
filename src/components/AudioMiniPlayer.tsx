import React, {useState} from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Path, Rect} from 'react-native-svg';
import {useAudioPlayer, SPEED_STEPS} from '../context/AudioPlayerContext';
import {useTheme} from '../context/ThemeContext';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import NarratorSheet from './NarratorSheet';

const TAB_BAR_HEIGHT = Platform.OS === 'android' ? 56 : 49;

const TINT = '#FFFDF5';
const MUTED = 'rgba(255,253,245,0.5)';

function PlayIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M5 3l14 9-14 9V3z" fill={TINT} />
    </Svg>
  );
}

function PauseIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="4" width="4" height="16" rx="1" fill={TINT} />
      <Rect x="15" y="4" width="4" height="16" rx="1" fill={TINT} />
    </Svg>
  );
}

function SkipPrevIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M19 20L9 12l10-8v16z" fill={TINT} />
      <Rect x="5" y="4" width="2" height="16" rx="1" fill={TINT} />
    </Svg>
  );
}

function SkipNextIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M5 4l10 8L5 20V4z" fill={TINT} />
      <Rect x="17" y="4" width="2" height="16" rx="1" fill={TINT} />
    </Svg>
  );
}

export default function AudioMiniPlayer() {
  const {isDark} = useTheme();
  const insets = useSafeAreaInsets();
  const {status, track, currentVerse, speedIndex, pause, resume, stop, skipPrev, skipNext, cycleSpeed} =
    useAudioPlayer();
  const [narratorOpen, setNarratorOpen] = useState(false);

  if (status === 'idle' || !track) return null;

  const isPlaying = status === 'playing';
  const speedLabel = SPEED_STEPS[speedIndex].label;
  const verseTag = currentVerse != null ? `v${currentVerse}` : '';

  const bg = isDark ? '#2A1E14' : '#3D2714';

  return (
    <>
      <View
        style={[
          s.bar,
          {backgroundColor: bg, bottom: TAB_BAR_HEIGHT + insets.bottom},
        ]}>
        {/* Info — tap to open narrator picker */}
        <Pressable style={s.info} onPress={() => setNarratorOpen(true)} hitSlop={4}>
          <Text style={s.bookLabel} numberOfLines={1}>
            {track.bookName} {track.chapter}
            {verseTag ? (
              <Text style={s.verseTag}>  {verseTag}</Text>
            ) : null}
          </Text>
          <Text style={s.narratorHint}>Tap to switch narrator</Text>
        </Pressable>

        {/* Controls */}
        <View style={s.controls}>
          {/* Speed cycle */}
          <Pressable onPress={cycleSpeed} style={s.speedBtn} hitSlop={8}>
            <Text style={s.speedLabel}>{speedLabel}</Text>
          </Pressable>

          {/* Prev verse */}
          <Pressable onPress={skipPrev} style={s.iconBtn} hitSlop={8}>
            <SkipPrevIcon />
          </Pressable>

          {/* Play / Pause */}
          <Pressable
            onPress={isPlaying ? pause : resume}
            style={s.playBtn}
            hitSlop={4}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Pressable>

          {/* Next verse */}
          <Pressable onPress={skipNext} style={s.iconBtn} hitSlop={8}>
            <SkipNextIcon />
          </Pressable>

          {/* Dismiss */}
          <Pressable onPress={stop} style={s.iconBtn} hitSlop={8}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6l12 12"
                stroke={MUTED}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
        </View>
      </View>

      <NarratorSheet visible={narratorOpen} onClose={() => setNarratorOpen(false)} />
    </>
  );
}

const s = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: -3},
    elevation: 10,
  },
  info: {flex: 1},
  bookLabel: {
    ...typography.footnote,
    fontWeight: '700',
    color: TINT,
  },
  verseTag: {
    ...typography.caption1,
    color: MUTED,
    fontWeight: '400',
  },
  narratorHint: {
    ...typography.caption1,
    color: MUTED,
    marginTop: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  speedBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  speedLabel: {
    ...typography.caption1,
    fontWeight: '700',
    color: MUTED,
  },
  iconBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,253,245,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
