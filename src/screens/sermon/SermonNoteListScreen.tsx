import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';

import { RootStackParamList } from '../../navigation/RootNavigator';
import { stripHtmlToPlainText } from '../../utils/text';
import { useTheme } from '../../context/ThemeContext';
import { useSermonNotes } from '../../context/SermonNoteContext';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'SermonNoteList'>;

function SermonNoteListScreen({ navigation }: Props) {
  const { colors, isDark } = useTheme();
  const { sermonNotes, isLoading } = useSermonNotes();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: colors.background },
        safeArea: { flex: 1, backgroundColor: colors.background },
        scroll: { flex: 1 },
        scrollContent: {
          paddingHorizontal: spacing.md + 2,
          paddingTop: spacing.md + 2,
          paddingBottom: 120,
        },
        bottomBar: {
          paddingHorizontal: spacing.md + 2,
          paddingBottom: spacing.lg,
          paddingTop: spacing.sm,
          backgroundColor: colors.background,
        },
        createButton: {
          backgroundColor: colors.primaryDark,
          borderRadius: radius.lg,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: spacing.sm,
        },
        createButtonText: {
          ...typography.subhead,
          color: '#FFFDF5',
          fontWeight: '700',
        },
        sectionRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.sm,
        },
        sectionLabel: {
          ...typography.eyebrow,
          color: colors.muted,
        },
        countBadge: {
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderRadius: radius.full,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          paddingHorizontal: 10,
          paddingVertical: 3,
        },
        countBadgeText: {
          ...typography.caption1,
          color: colors.muted,
          fontWeight: '600',
        },
        emptyCard: {
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          borderRadius: radius.xl,
          paddingVertical: spacing.xl,
          paddingHorizontal: spacing.lg,
          alignItems: 'center',
        },
        emptyIconWrap: {
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: isDark ? colors.surfaceStrong : '#EEE9DA',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.md,
        },
        emptyTitle: {
          ...typography.headline,
          color: colors.text,
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: 6,
        },
        emptySubtitle: {
          ...typography.footnote,
          color: colors.muted,
          textAlign: 'center',
          lineHeight: 19,
        },
        hintCard: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 10,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          borderRadius: radius.md,
          padding: spacing.md,
          marginTop: spacing.lg,
          alignSelf: 'stretch',
          backgroundColor: isDark ? colors.surfaceStrong : colors.background,
        },
        hintPlus: {
          ...typography.footnote,
          color: colors.primaryDark,
          fontWeight: '700',
          lineHeight: 19,
        },
        hintText: {
          ...typography.footnote,
          color: colors.muted,
          flex: 1,
          lineHeight: 19,
        },
        noteCard: {
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          borderRadius: radius.xl,
          padding: spacing.md,
          marginBottom: spacing.sm,
        },
        noteTitleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        },
        noteTitle: {
          ...typography.headline,
          color: colors.text,
          fontWeight: '700',
          flex: 1,
          marginRight: 8,
        },
        noteDate: {
          ...typography.caption1,
          color: colors.muted,
        },
        notePreview: {
          ...typography.subhead,
          color: colors.text,
        },
      }),
    [colors, isDark],
  );

  const countLabel =
    sermonNotes.length === 1 ? '1 note' : `${sermonNotes.length} notes`;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section header */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Your Collection</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{countLabel}</Text>
            </View>
          </View>

          {/* Content */}
          {isLoading && sermonNotes.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={{ ...typography.subhead, color: colors.muted }}>
                Loading sermon notes…
              </Text>
            </View>
          ) : sermonNotes.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconWrap}>
                <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
                    stroke={colors.muted}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
                    stroke={colors.muted}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={styles.emptyTitle}>No sermon notes yet</Text>
              <Text style={styles.emptySubtitle}>
                Capture key takeaways, scripture references, and personal
                reflections during Sunday service.
              </Text>
              <View style={styles.hintCard}>
                <Text style={styles.hintPlus}>+</Text>
                <Text style={styles.hintText}>
                  Heading to church today? Tap above to start drafting your
                  thoughts in real-time.
                </Text>
              </View>
            </View>
          ) : (
            sermonNotes.map(note => (
              <Pressable
                key={note.id}
                style={({ pressed }) => [
                  styles.noteCard,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() =>
                  navigation.navigate('SermonNoteDetail', { noteId: note.id })
                }
              >
                <View style={styles.noteTitleRow}>
                  <Text style={styles.noteTitle} numberOfLines={1}>
                    {note.title}
                  </Text>
                  <Text style={styles.noteDate}>
                    {new Date(note.sermonDate + 'T00:00:00').toLocaleDateString(
                      'en-US',
                      { month: 'short', day: 'numeric', year: 'numeric' },
                    )}
                  </Text>
                </View>
                <Text style={styles.notePreview} numberOfLines={3}>
                  {stripHtmlToPlainText(note.body)}
                </Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Create button — fixed at bottom */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            pressed && { opacity: 0.82 },
          ]}
          onPress={() => navigation.navigate('SermonNoteDetail', {})}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 5v14M5 12h14"
              stroke="#FFFDF5"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={styles.createButtonText}>Create Sermon Note</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default SermonNoteListScreen;
