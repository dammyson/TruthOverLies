import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import SkeletonBlock from '../../components/SkeletonBlock';
import VerseLink from '../../components/VerseLink';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {RootStackParamList} from '../../navigation/RootNavigator';

function SavedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {savedCards, isSavedLoading} = useAppContext();
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {marginBottom: spacing.md},
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          marginBottom: spacing.xs,
        },
        eyebrow: {
          ...typography.eyebrow,
          color: colors.primaryDark,
          marginBottom: spacing.xs,
        },
        title: {
          ...typography.title2,
          fontWeight: '700',
          color: colors.text,
        },
        countBadge: {
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
          borderRadius: radius.full,
          backgroundColor: colors.backgroundAccent,
          alignSelf: 'center',
        },
        countText: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        subtitle: {
          ...typography.subhead,
          color: colors.muted,
          marginTop: spacing.xs,
        },
        cardWrapper: {
          borderRadius: radius.xl,
          marginBottom: spacing.sm,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surfaceStrong,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        cardGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xl,
        },
        cardContent: {
          flexDirection: 'row',
          padding: spacing.md,
          gap: spacing.sm,
        },
        accentBar: {
          width: 3,
          borderRadius: 2,
          backgroundColor: colors.primary,
          alignSelf: 'stretch',
        },
        cardBody: {flex: 1},
        cardTitle: {
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.xs,
        },
        cardExcerpt: {
          ...typography.footnote,
          color: colors.muted,
          marginBottom: spacing.sm,
          lineHeight: 18,
        },
        referenceRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
        },
        referenceDot: {
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.primaryDark,
        },
        referenceText: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        emptyWrapper: {
          borderRadius: radius.xxl,
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        emptyGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xxl,
        },
        emptyContent: {padding: spacing.lg},
        emptyTitle: {
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.xs,
        },
        emptyText: {
          ...typography.subhead,
          color: colors.muted,
        },
      }),
    [colors],
  );

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Your Collection</Text>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Saved</Text>
          {!isSavedLoading && savedCards.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{savedCards.length}</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>
          Verses and reflections you want to return to.
        </Text>
      </View>

      {isSavedLoading ? (
        <>
          {[1, 2, 3].map(i => (
            <SkeletonBlock key={i} height={120} borderRadius={radius.xl} style={{marginBottom: spacing.sm}} />
          ))}
        </>
      ) : savedCards.length === 0 ? (
        <View style={styles.emptyWrapper}>
          {isLiquidGlassSupported && (
            <LiquidGlassView style={styles.emptyGlass} effect="regular" colorScheme={glassScheme} />
          )}
          <View style={styles.emptyContent}>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptyText}>
              Tap + on any card in the Home tab to save a verse here.
            </Text>
          </View>
        </View>
      ) : (
        savedCards.map(card => (
          <Pressable
            key={card.id}
            accessibilityRole="button"
            onPress={() => navigation.navigate('SavedDetail', {card})}
            style={({pressed}) => [styles.cardWrapper, pressed && {opacity: 0.75}]}>
            {isLiquidGlassSupported && (
              <LiquidGlassView style={styles.cardGlass} effect="regular" colorScheme={glassScheme} />
            )}
            <View style={styles.cardContent}>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardExcerpt} numberOfLines={2}>
                  {card.encouragement}
                </Text>
                <View style={styles.referenceRow}>
                  <View style={styles.referenceDot} />
                  <VerseLink reference={card.reference} style={styles.referenceText} />
                </View>
              </View>
            </View>
          </Pressable>
        ))
      )}
    </ScreenShell>
  );
}

export default SavedScreen;
