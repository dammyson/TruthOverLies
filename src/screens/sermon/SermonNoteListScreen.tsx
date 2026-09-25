import React, {useMemo} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import ScreenShell from '../../components/ScreenShell';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {useTheme} from '../../context/ThemeContext';
import {useSermonNotes} from '../../context/SermonNoteContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'SermonNoteList'>;

function SermonNoteListScreen({navigation}: Props) {
  const {colors, isDark} = useTheme();
  const {sermonNotes, isLoading} = useSermonNotes();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        createButton: {
          backgroundColor: colors.primaryDark,
          borderRadius: radius.lg,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          marginBottom: spacing.md,
          alignItems: 'center',
        },
        createButtonText: {
          ...typography.subhead,
          color: isDark ? colors.background : '#FFFDF5',
          fontWeight: '700',
        },
        card: {
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          borderRadius: radius.xl,
          padding: spacing.md,
          marginBottom: spacing.sm,
        },
        title: {
          ...typography.headline,
          color: colors.text,
          fontWeight: '700',
        },
        date: {
          ...typography.footnote,
          color: colors.muted,
          marginTop: 4,
          marginBottom: 6,
        },
        bodyPreview: {
          ...typography.subhead,
          color: colors.text,
        },
        emptyText: {
          ...typography.subhead,
          color: colors.muted,
          textAlign: 'center',
          marginTop: spacing.xl,
        },
      }),
    [colors, isDark],
  );

  return (
    <ScreenShell>
      <Pressable
        style={({pressed}) => [styles.createButton, pressed && {opacity: 0.8}]}
        onPress={() => navigation.navigate('SermonNoteDetail', {})}>
        <Text style={styles.createButtonText}>Create Sermon Note</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading && sermonNotes.length === 0 ? (
          <Text style={styles.emptyText}>Loading sermon notes...</Text>
        ) : sermonNotes.length === 0 ? (
          <Text style={styles.emptyText}>No sermon notes yet. Create your first note.</Text>
        ) : (
          sermonNotes.map(note => (
            <Pressable
              key={note.id}
              style={({pressed}) => [styles.card, pressed && {opacity: 0.8}]}
              onPress={() => navigation.navigate('SermonNoteDetail', {noteId: note.id})}>
              <Text style={styles.title}>{note.title}</Text>
              <Text style={styles.date}>{note.sermonDate}</Text>
              <Text style={styles.bodyPreview} numberOfLines={3}>
                {note.body}
              </Text>
            </Pressable>
          ))
        )}
        <View style={{height: spacing.xl}} />
      </ScrollView>
    </ScreenShell>
  );
}

export default SermonNoteListScreen;
