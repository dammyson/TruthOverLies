import React, {useLayoutEffect, useMemo, useState} from 'react';
import {Dimensions, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Line, Path} from 'react-native-svg';

import SkeletonBlock from '../../components/SkeletonBlock';
import VerseLink from '../../components/VerseLink';
import ShareCardSheet from '../../components/share/ShareCardSheet';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {SavedStackParamList} from '../../navigation/SavedStackNavigator';
import {sharePayloadFromDevotion} from '../../types/share';

type Props = NativeStackScreenProps<SavedStackParamList, 'SavedDetail'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const HERO_HEIGHT = Math.round(SCREEN_WIDTH * 0.72);
const H_PAD = spacing.md + 2;

function SavedDetailScreen({route, navigation}: Props) {
  const {card} = route.params;
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';
  const [imageReady, setImageReady] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share"
          onPress={() => setShareOpen(true)}
          style={({pressed}) => ({
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isDark ? 'rgba(120,120,128,0.32)' : 'rgba(120,120,128,0.18)',
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            overflow: 'hidden' as const,
            opacity: pressed ? 0.6 : 1,
          })}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"
              stroke={colors.primaryDark}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M16 6l-4-4-4 4"
              stroke={colors.primaryDark}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line
              x1="12" y1="2" x2="12" y2="15"
              stroke={colors.primaryDark}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
      ),
    });
  }, [navigation, isDark, colors]);

  // Deterministic image per card — always the same image for the same reference
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(card.reference)}/800/600`;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scroll: {
          flex: 1,
          backgroundColor: colors.background,
        },
        heroWrapper: {
          width: SCREEN_WIDTH,
          height: HERO_HEIGHT,
          marginLeft: -H_PAD,
          marginTop: 0,
        },
        heroImage: {
          ...StyleSheet.absoluteFill,
        },
        heroGradient: {
          ...StyleSheet.absoluteFill,
        },
        heroText: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: H_PAD,
          paddingBottom: spacing.lg,
        },
        heroEyebrow: {
          ...typography.eyebrow,
          color: 'rgba(255,245,230,0.65)',
          marginBottom: spacing.xs,
        },
        heroTitle: {
          ...typography.title1,
          fontWeight: '700',
          color: '#FFFDF5',
        },
        content: {
          paddingTop: spacing.lg,
        },
        body: {
          ...typography.body,
          color: colors.text,
          lineHeight: 28,
          marginBottom: spacing.lg,
        },
        verseWrapper: {
          borderRadius: radius.xl,
          marginBottom: spacing.md,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        verseGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xl,
        },
        verseContent: {padding: spacing.md + 4},
        verseEyebrow: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.sm,
        },
        verseText: {
          ...typography.title3,
          fontWeight: '400',
          color: colors.text,
          fontStyle: 'italic',
          lineHeight: 30,
          marginBottom: spacing.sm,
        },
        referenceText: {
          ...typography.subhead,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        shareButton: {
          marginTop: spacing.lg,
          borderRadius: radius.lg,
          backgroundColor: colors.primaryDark,
          paddingVertical: 16,
          alignItems: 'center',
          justifyContent: 'center',
        },
        shareButtonText: {
          ...typography.subhead,
          fontWeight: '700',
          color: '#FFFDF5',
        },
      }),
    [colors, isDark],
  );

  return (
    <>
    <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior="never"
      contentContainerStyle={{
        paddingHorizontal: H_PAD,
        paddingTop: 0,
        paddingBottom: 100,
      }}>

      {/* Hero image */}
      <View style={styles.heroWrapper}>
        {!imageReady && (
          <SkeletonBlock height={HERO_HEIGHT} width={SCREEN_WIDTH} borderRadius={0} />
        )}
        <Image
          source={{uri: imageUrl}}
          style={styles.heroImage}
          resizeMode="cover"
          onLoad={() => setImageReady(true)}
        />
        <LinearGradient
          colors={[
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0.25)',
            'rgba(0,0,0,0.65)',
            colors.background,
          ]}
          locations={[0, 0.45, 0.78, 1]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.heroGradient}
        />
        <View style={styles.heroText}>
          <Text style={styles.heroEyebrow}>SAVED VERSE</Text>
          <Text style={styles.heroTitle}>{card.title}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.content}>
        <Text style={styles.body}>{card.encouragement}</Text>

        {/* Verse panel */}
        <View style={styles.verseWrapper}>
          {isLiquidGlassSupported && (
            <LiquidGlassView
              style={styles.verseGlass}
              effect="regular"
              colorScheme={glassScheme}
            />
          )}
          <View style={styles.verseContent}>
            <Text style={styles.verseEyebrow}>Scripture</Text>
            <Text style={styles.verseText}>{card.verse}</Text>
            <VerseLink
              reference={card.reference}
              style={styles.referenceText}
              onBeforeNavigate={() => navigation.goBack()}
            />
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share this word"
          onPress={() => setShareOpen(true)}
          style={({pressed}) => [styles.shareButton, pressed && {opacity: 0.82}]}>
          <Text style={styles.shareButtonText}>Share this word</Text>
        </Pressable>
      </View>
    </ScrollView>

    <ShareCardSheet
      visible={shareOpen}
      payload={sharePayloadFromDevotion(card)}
      onClose={() => setShareOpen(false)}
    />
  </>
  );
}

export default SavedDetailScreen;
