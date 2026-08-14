import React, {useMemo, useState} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import LinearGradient from 'react-native-linear-gradient';

import SkeletonBlock from '../../components/SkeletonBlock';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {SavedStackParamList} from '../../navigation/SavedStackNavigator';

type Props = NativeStackScreenProps<SavedStackParamList, 'SavedDetail'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const HERO_HEIGHT = Math.round(SCREEN_WIDTH * 0.72);
const H_PAD = spacing.md + 2;

function SavedDetailScreen({route}: Props) {
  const {card} = route.params;
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';
  const [imageReady, setImageReady] = useState(false);

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
      }),
    [colors],
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingHorizontal: H_PAD,
        paddingTop: H_PAD,
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
            <Text style={styles.referenceText}>{card.reference}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default SavedDetailScreen;
