import React, {useMemo} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';

import ScreenShell from '../../components/ScreenShell';
import {useTheme} from '../../context/ThemeContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
type Props = NativeStackScreenProps<RootStackParamList, 'ChapterGrid'>;

const NUM_COLUMNS = 5;

function ChapterGridScreen({route, navigation}: Props) {
  const {bookId, bookName, chapterCount, translation} = route.params;
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const chapters = useMemo(
    () => Array.from({length: chapterCount}, (_, i) => i + 1),
    [chapterCount],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {marginBottom: spacing.md},
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
        grid: {
          gap: spacing.sm,
        },
        chapterBtn: {
          flex: 1,
          aspectRatio: 1,
          borderRadius: radius.lg,
          alignItems: 'center',
          justifyContent: 'center',
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surfaceStrong,
            borderWidth: 1,
            borderColor: colors.border,
          }),
        },
        chapterGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.lg,
        },
        chapterNum: {
          ...typography.headline,
          fontWeight: '600',
          color: colors.text,
        },
      }),
    [colors],
  );

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{translation}</Text>
        <Text style={styles.title}>{bookName}</Text>
      </View>

      <FlatList
        data={chapters}
        keyExtractor={item => String(item)}
        numColumns={NUM_COLUMNS}
        scrollEnabled={false}
        columnWrapperStyle={styles.grid}
        contentContainerStyle={{gap: spacing.sm}}
        renderItem={({item}) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Chapter ${item}`}
            onPress={() =>
              navigation.navigate('Reader', {
                bookId,
                bookName,
                chapter: item,
                chapterCount,
                translation,
              })
            }
            style={({pressed}) => [styles.chapterBtn, pressed && {opacity: 0.65}]}>
            {isLiquidGlassSupported && (
              <LiquidGlassView style={styles.chapterGlass} effect="regular" colorScheme={glassScheme} />
            )}
            <Text style={styles.chapterNum}>{item}</Text>
          </Pressable>
        )}
      />
    </ScreenShell>
  );
}

export default ChapterGridScreen;
