import React, {useMemo, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import ScreenShell from '../../components/ScreenShell';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {useTheme} from '../../context/ThemeContext';
import {useSermonNotes} from '../../context/SermonNoteContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'SermonNoteDetail'>;

function SermonNoteDetailScreen({route, navigation}: Props) {
  const {colors, isDark} = useTheme();
  const {sermonNotes, createSermonNote, updateSermonNote, deleteSermonNote, isSaving} = useSermonNotes();

  const noteId = route.params?.noteId;
  const existing = sermonNotes.find(item => item.id === noteId);
  const [isEditing, setIsEditing] = useState(noteId == null);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [sermonDate, setSermonDate] = useState(existing?.sermonDate ?? new Date().toISOString().slice(0, 10));
  const [body, setBody] = useState(existing?.body ?? '');

  const styles = useMemo(
    () =>
      StyleSheet.create({
        label: {
          ...typography.footnote,
          color: colors.muted,
          fontWeight: '700',
          marginBottom: 6,
          marginTop: spacing.sm,
        },
        input: {
          ...typography.body,
          color: colors.text,
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderColor: colors.border,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        },
        bodyInput: {
          minHeight: 220,
          textAlignVertical: 'top',
        },
        viewTitle: {
          ...typography.title2,
          color: colors.text,
          fontWeight: '700',
        },
        viewDate: {
          ...typography.subhead,
          color: colors.muted,
          marginTop: 6,
          marginBottom: spacing.md,
        },
        viewBody: {
          ...typography.body,
          color: colors.text,
          lineHeight: 26,
        },
        row: {
          flexDirection: 'row',
          gap: spacing.sm,
          marginTop: spacing.md,
        },
        actionBtn: {
          flex: 1,
          alignItems: 'center',
          borderRadius: radius.lg,
          paddingVertical: spacing.sm,
        },
        primaryBtn: {
          backgroundColor: colors.primaryDark,
        },
        secondaryBtn: {
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        dangerBtn: {
          backgroundColor: '#BE3B3B',
        },
        btnText: {
          ...typography.subhead,
          fontWeight: '700',
          color: '#FFFDF5',
        },
        secondaryBtnText: {
          ...typography.subhead,
          fontWeight: '700',
          color: colors.text,
        },
      }),
    [colors, isDark],
  );

  const validateDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a sermon title.');
      return;
    }
    if (!body.trim()) {
      Alert.alert('Missing body', 'Please enter the sermon note body.');
      return;
    }
    if (!validateDate(sermonDate.trim())) {
      Alert.alert('Invalid date', 'Use date format YYYY-MM-DD.');
      return;
    }

    try {
      if (noteId == null) {
        const created = await createSermonNote({
          title: title.trim(),
          sermonDate: sermonDate.trim(),
          body: body.trim(),
        });
        navigation.replace('SermonNoteDetail', {noteId: created.id});
      } else {
        await updateSermonNote(noteId, {
          title: title.trim(),
          sermonDate: sermonDate.trim(),
          body: body.trim(),
        });
      }
      setIsEditing(false);
    } catch {
      Alert.alert('Error', 'Unable to save sermon note.');
    }
  };

  const handleDelete = () => {
    if (noteId == null) return;
    Alert.alert('Delete sermon note?', 'This will permanently remove this sermon note.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSermonNote(noteId);
            navigation.goBack();
          } catch {
            Alert.alert('Error', 'Unable to delete sermon note.');
          }
        },
      },
    ]);
  };

  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isEditing ? (
          <>
            <Text style={styles.label}>Title</Text>
            <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Sermon title" placeholderTextColor={colors.muted} />

            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput
              value={sermonDate}
              onChangeText={setSermonDate}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="numbers-and-punctuation"
              placeholder="2026-09-24"
              placeholderTextColor={colors.muted}
            />

            <Text style={styles.label}>Body</Text>
            <TextInput
              value={body}
              onChangeText={setBody}
              style={[styles.input, styles.bodyInput]}
              multiline
              placeholder="Write full sermon notes"
              placeholderTextColor={colors.muted}
            />

            <View style={styles.row}>
              <Pressable style={[styles.actionBtn, styles.primaryBtn]} disabled={isSaving} onPress={handleSave}>
                <Text style={styles.btnText}>{isSaving ? 'Saving...' : 'Save'}</Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => setIsEditing(false)}>
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.viewTitle}>{existing?.title ?? title}</Text>
            <Text style={styles.viewDate}>{existing?.sermonDate ?? sermonDate}</Text>
            <Text style={styles.viewBody}>{existing?.body ?? body}</Text>

            <View style={styles.row}>
              <Pressable style={[styles.actionBtn, styles.primaryBtn]} onPress={() => setIsEditing(true)}>
                <Text style={styles.btnText}>Edit</Text>
              </Pressable>
              {noteId != null && (
                <Pressable style={[styles.actionBtn, styles.dangerBtn]} onPress={handleDelete}>
                  <Text style={styles.btnText}>Delete</Text>
                </Pressable>
              )}
            </View>
          </>
        )}
        <View style={{height: spacing.xl}} />
      </ScrollView>
    </ScreenShell>
  );
}

export default SermonNoteDetailScreen;
