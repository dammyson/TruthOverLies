import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {useJournals} from '../../context/JournalContext';
import {Journal} from '../../types/app';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

type Props = {
  visible: boolean;
  entry?: Journal | null;
  onClose: () => void;
};

function JournalEntrySheet({visible, entry, onClose}: Props) {
  const {colors, isDark} = useTheme();
  const {createJournal, updateJournal, deleteJournal, isSaving} = useJournals();

  const [entryText, setEntryText] = useState('');
  const [struggle, setStruggle] = useState('');
  const isEditing = !!entry;

  useEffect(() => {
    if (visible) {
      setEntryText(entry?.entryText ?? '');
      setStruggle(entry?.struggle ?? '');
    }
  }, [visible, entry]);

  const handleSave = useCallback(async () => {
    const text = entryText.trim();
    if (!text) return;
    try {
      if (isEditing && entry) {
        await updateJournal(entry.id, {
          entryText: text,
          struggle: struggle.trim() || undefined,
        });
      } else {
        await createJournal({
          entryText: text,
          struggle: struggle.trim() || undefined,
        });
      }
      onClose();
    } catch {
      // error handled by context
    }
  }, [entryText, struggle, isEditing, entry, createJournal, updateJournal, onClose]);

  const handleDelete = useCallback(() => {
    if (!entry) return;
    Alert.alert(
      'Delete Entry',
      'This journal entry will be permanently deleted.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteJournal(entry.id);
            onClose();
          },
        },
      ],
    );
  }, [entry, deleteJournal, onClose]);

  const formattedDate = useMemo(() => {
    const d = entry ? dayjs(entry.createdAt) : dayjs();
    return d.format('ddd, D MMM YYYY');
  }, [entry]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        sheet: {flex: 1, backgroundColor: colors.background},
        header: {
          paddingTop: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: 10,
          height: 120
        },
        headerLabel: {
          ...typography.caption1,
          fontWeight: '700',
          color: 'rgba(255,255,255,0.65)',
          letterSpacing: 1.2,
          marginBottom: spacing.xs,
        },
        headerDate: {
          ...typography.title3,
          fontWeight: '800',
          color: '#FFFDF5',
        },
        deleteBtn: {
          position: 'absolute',
          top: 30 + spacing.md,
          right: spacing.xl,
          padding: 6,
          zIndex: 10,
        },
        body: {flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md},
        sectionLabel: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.muted,
          letterSpacing: 0.8,
          marginBottom: spacing.xs,
          marginTop: spacing.md,
        },
        fieldCard: {
          borderRadius: radius.xl,
          backgroundColor: isDark ? '#2A2218' : '#FDFAF5',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          overflow: 'hidden' as const,
          marginBottom: spacing.md,
        },
        fieldAccentBar: {
          height: 3,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
        },
        fieldInner: {
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
        },
        textInput: {
          ...typography.body,
          color: colors.text,
          lineHeight: 26,
          textAlignVertical: 'top',
          minHeight: 200,
          paddingTop: 0,
        },
        struggleInput: {
          ...typography.subhead,
          color: colors.text,
          lineHeight: 22,
          textAlignVertical: 'top',
          minHeight: 80,
          paddingTop: 0,
        },
        saveBar: {
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xl,
          backgroundColor: colors.background,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        },
        saveBtn: {
          borderRadius: radius.xl,
          overflow: 'hidden',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        },
        saveBtnGradient: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0},
        saveBtnText: {
          ...typography.headline,
          fontWeight: '700',
          color: '#FFFDF5',
          letterSpacing: 0.3,
        },
      }),
    [colors],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      onDismiss={onClose}>
      <View style={styles.sheet}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <LinearGradient
            colors={isDark ? ['#3E2010', '#2D160A', '#1A0E06'] : ['#5C3020', '#3E1E10', '#2D160E']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.header}>
            <Text style={styles.headerLabel}>
              {isEditing ? 'EDIT ENTRY' : 'NEW ENTRY'}
            </Text>
            <Text style={styles.headerDate}>{formattedDate}</Text>
          </LinearGradient>

          {/* Floats above gradient — outside its clipping bounds */}
          {isEditing && (
            <Pressable style={styles.deleteBtn} onPress={handleDelete} hitSlop={8}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                  stroke="rgba(255,80,80,0.9)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          )}

          <ScrollView
            style={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>WHAT'S ON YOUR HEART</Text>
            <View style={styles.fieldCard}>
              <LinearGradient
                colors={isDark ? ['#5C3020', '#3E1E10'] : ['#8B5E3C', '#6B4030']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.fieldAccentBar}
              />
              <View style={styles.fieldInner}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Write freely — this is your space with God..."
                  placeholderTextColor={colors.placeholder}
                  value={entryText}
                  onChangeText={setEntryText}
                  multiline
                  maxLength={5000}
                  autoFocus={!isEditing}
                />
              </View>
            </View>

            <Text style={styles.sectionLabel}>WHAT ARE YOU STRUGGLING WITH? (optional)</Text>
            <View style={styles.fieldCard}>
              <LinearGradient
                colors={['#8B4A4A', '#6B3030']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.fieldAccentBar}
              />
              <View style={styles.fieldInner}>
                <TextInput
                  style={styles.struggleInput}
                  placeholder="Name the struggle, give it to God..."
                  placeholderTextColor={colors.placeholder}
                  value={struggle}
                  onChangeText={setStruggle}
                  multiline
                  maxLength={250}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.saveBar}>
            <Pressable
              style={({pressed}) => [styles.saveBtn, pressed && {opacity: 0.85}]}
              onPress={handleSave}
              disabled={isSaving || !entryText.trim()}>
              <LinearGradient
                colors={
                  isDark
                    ? ['#6B4E1A', '#4A3410', '#2D1E08']
                    : ['#8B5E3C', '#5C3020', '#3E1E10']
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.saveBtnGradient}
              />
              {isSaving ? (
                <ActivityIndicator color="#FFFDF5" />
              ) : (
                <Text style={styles.saveBtnText}>
                  {isEditing ? 'Save Changes' : 'Save Entry'}
                </Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default JournalEntrySheet;
