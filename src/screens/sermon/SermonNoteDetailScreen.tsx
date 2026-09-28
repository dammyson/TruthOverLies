import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Path, Rect } from 'react-native-svg';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import { launchImageLibrary } from 'react-native-image-picker';

import { RootStackParamList } from '../../navigation/RootNavigator';
import { useTheme } from '../../context/ThemeContext';
import { useSermonNotes } from '../../context/SermonNoteContext';
import { typography } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'SermonNoteDetail'>;

function SermonNoteDetailScreen({ route, navigation }: Props) {
  const { colors, isDark } = useTheme();
  const {
    sermonNotes,
    createSermonNote,
    updateSermonNote,
    deleteSermonNote,
    isSaving,
  } = useSermonNotes();

  const noteId = route.params?.noteId;
  const existing = sermonNotes.find(item => item.id === noteId);

  const richEditor = useRef<RichEditor>(null);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [sermonDate, setSermonDate] = useState(
    existing?.sermonDate ?? new Date().toISOString().slice(0, 10),
  );
  const [body, setBody] = useState(existing?.body ?? '');
  const [savedAt, setSavedAt] = useState<Date | null>(
    existing ? new Date() : null,
  );
  const [showPicker, setShowPicker] = useState(false);

  const dateObj = useMemo(() => {
    const parsed = new Date(sermonDate + 'T00:00:00');
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [sermonDate]);

  const handleDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selected) {
      setSermonDate(selected.toISOString().slice(0, 10));
    }
  };

  const displayDate = useMemo(() => {
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [dateObj]);

  const savedLabel = useMemo(() => {
    if (!savedAt) return null;
    const mins = Math.floor((Date.now() - savedAt.getTime()) / 60000);
    if (mins < 1) return 'Saved just now';
    if (mins === 1) return 'Saved 1 min ago';
    return `Saved ${mins} min ago`;
  }, [savedAt]);

  // "Draft" / "Editing" badge in navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            borderRadius: radius.full,
            overflow: 'hidden',
          }}
        >
          <Text
            style={{
              ...typography.caption1,
              color: colors.muted,
              fontWeight: '600',
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            {noteId == null ? 'Draft' : 'Editing'}
          </Text>
        </View>
      ),
    });
  }, [navigation, isDark, colors, noteId]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a sermon title.');
      return;
    }
    const stripped = body
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
    if (!stripped) {
      Alert.alert('Missing body', 'Please enter the sermon note body.');
      return;
    }

    try {
      if (noteId == null) {
        const created = await createSermonNote({
          title: title.trim(),
          sermonDate: sermonDate.trim(),
          body,
        });
        setSavedAt(new Date());
        navigation.replace('SermonNoteDetail', { noteId: created.id });
      } else {
        await updateSermonNote(noteId, {
          title: title.trim(),
          sermonDate: sermonDate.trim(),
          body,
        });
        setSavedAt(new Date());
      }
    } catch {
      Alert.alert('Error', 'Unable to save sermon note.');
    }
  };

  const handleDelete = () => {
    if (noteId == null) return;
    Alert.alert(
      'Delete sermon note?',
      'This will permanently remove this sermon note.',
      [
        { text: 'Cancel', style: 'cancel' },
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
      ],
    );
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: colors.background },
        safeArea: { flex: 1, backgroundColor: colors.background },
        scrollContent: {
          paddingHorizontal: spacing.md + 2,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xxl,
        },
        fieldLabel: {
          ...typography.eyebrow,
          color: colors.muted,
          marginBottom: 8,
          marginTop: spacing.md,
        },
        input: {
          ...typography.body,
          color: colors.text,
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderColor: colors.border,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: 12,
        },
        dateTrigger: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderColor: colors.border,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          paddingVertical: 12,
        },
        dateTriggerText: {
          ...typography.body,
          color: colors.text,
        },
        bodyLabel: {
          ...typography.eyebrow,
          color: colors.muted,
          marginBottom: 8,
          marginTop: spacing.md,
        },
        editorWrap: {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          borderRadius: radius.md,
          overflow: 'hidden',
          minHeight: 200,
        },
        editor: {
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
        },
        toolbar: {
          borderRadius: radius.md,
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          marginTop: spacing.sm,
        },
        savedText: {
          ...typography.caption1,
          color: colors.muted,
          textAlign: 'right',
          marginTop: 6,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginTop: spacing.md,
        },
        saveBtn: {
          backgroundColor: colors.primaryDark,
          borderRadius: radius.lg,
          paddingVertical: 16,
          alignItems: 'center',
          marginTop: spacing.lg,
        },
        saveBtnDisabled: {
          opacity: 0.6,
        },
        saveBtnText: {
          ...typography.subhead,
          color: '#FFFDF5',
          fontWeight: '700',
        },
        cancelRow: {
          alignItems: 'center',
          paddingVertical: spacing.md,
        },
        cancelText: {
          ...typography.subhead,
          color: colors.muted,
          fontWeight: '600',
        },
        deleteRow: {
          alignItems: 'center',
          paddingVertical: spacing.sm,
        },
        deleteText: {
          ...typography.footnote,
          color: '#BE3B3B',
          fontWeight: '600',
        },
      }),
    [colors, isDark],
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* SERMON TITLE */}
            <Text style={styles.fieldLabel}>Sermon Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholder="Enter sermon title"
              placeholderTextColor={colors.placeholder}
            />

            {/* DATE */}
            <Text style={styles.fieldLabel}>Date</Text>
            <Pressable
              style={({ pressed }) => [
                styles.dateTrigger,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => setShowPicker(prev => !prev)}
            >
              <Text style={styles.dateTriggerText}>{displayDate}</Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  stroke={colors.muted}
                  strokeWidth="1.6"
                />
                <Path
                  d="M16 2v4M8 2v4M3 10h18"
                  stroke={colors.muted}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </Svg>
            </Pressable>
            {showPicker && (
              <DateTimePicker
                value={dateObj}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                themeVariant={isDark ? 'dark' : 'light'}
              />
            )}

            {/* BODY / NOTES */}
            <Text style={styles.bodyLabel}>Body / Notes</Text>
            <View style={styles.editorWrap}>
              <RichEditor
                ref={richEditor}
                style={styles.editor}
                initialContentHTML={body}
                onChange={setBody}
                placeholder="Write your sermon notes here…"
                useContainer={false}
                editorStyle={{
                  backgroundColor: isDark
                    ? colors.surface
                    : colors.surfaceStrong,
                  color: colors.text,
                  placeholderColor: colors.placeholder,
                  contentCSSText: `
                    font-family: -apple-system, sans-serif;
                    font-size: 15px;
                    line-height: 1.6;
                    padding: 12px;
                  `,
                }}
              />
            </View>

            <RichToolbar
              editor={richEditor}
              style={styles.toolbar}
              iconTint={colors.muted}
              selectedIconTint={colors.primaryDark}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertImage,
                actions.insertLink,
                actions.undo,
                actions.redo,
              ]}
              onPressAddImage={() => {
                launchImageLibrary(
                  { mediaType: 'photo', includeBase64: true, quality: 0.8 },
                  async response => {
                    if (response.didCancel || response.errorCode) return;
                    const asset = response.assets?.[0];
                    if (!asset) return;

                    if (asset.base64 && asset.type) {
                      // Local photo — use base64 directly
                      richEditor.current?.insertImage(
                        `data:${asset.type};base64,${asset.base64}`,
                      );
                    } else if (asset.uri) {
                      // iCloud / unavailable locally — fetch and convert
                      try {
                        const res = await fetch(asset.uri);
                        const blob = await res.blob();
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            richEditor.current?.insertImage(reader.result);
                          }
                        };
                        reader.readAsDataURL(blob);
                      } catch {
                        Alert.alert(
                          'Image unavailable',
                          'Could not load this photo. Make sure it is downloaded from iCloud and try again.',
                        );
                      }
                    }
                  },
                );
              }}
            />

            {savedLabel != null && (
              <Text style={styles.savedText}>{savedLabel}</Text>
            )}

            <View style={styles.divider} />

            {/* SAVE NOTE */}
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                (pressed || isSaving) && styles.saveBtnDisabled,
              ]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFDF5" />
              ) : (
                <Text style={styles.saveBtnText}>Save Note</Text>
              )}
            </Pressable>

            {/* CANCEL */}
            <Pressable
              style={styles.cancelRow}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            {/* DELETE (existing notes only) */}
            {noteId != null && (
              <Pressable style={styles.deleteRow} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete note</Text>
              </Pressable>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

export default SermonNoteDetailScreen;
