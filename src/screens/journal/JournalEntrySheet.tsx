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
import CloseButton from '../../components/CloseButton';
import {Journal} from '../../types/app';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';

function TrashIcon({color}: {color: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M12 11v6M14 11v6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

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

  // Colors
  const primaryDark = '#361f1a';
  const shadowColor = isDark ? 'rgba(54,31,26,0.35)' : 'rgba(54,31,26,0.12)';
  const deleteColor = '#FFFDF5';
  const deleteBtnBg = 'rgba(255,253,245,0.12)';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        sheet: {flex: 1, backgroundColor: colors.background},
        kav: {flex: 1},
        grabber: {
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.border,
          alignSelf: 'center',
          marginTop: spacing.sm,
          marginBottom: spacing.xs,
        },
        // ── Header ─────────────────────────────────────────────────
        closeRow: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xs,
          paddingBottom: spacing.sm,
        },
        headerWrapper: {
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
        },
        headerCard: {
          backgroundColor: primaryDark,
          borderRadius: 24,
          padding: spacing.lg,
        },
        headerLabel: {
          ...typography.caption1,
          fontWeight: '700',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          marginBottom: spacing.xs,
        },
        headerDate: {
          ...typography.title2,
          fontWeight: '800',
          color: '#FFFDF5',
          letterSpacing: -0.3,
        },
        deleteBtn: {
          position: 'absolute',
          top: spacing.md,
          right: spacing.md,
          padding: 8,
          borderRadius: radius.lg,
        },
        // ── Body ───────────────────────────────────────────────────
        body: {
          flex: 1,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
        },
        fieldBlock: {
          marginBottom: spacing.lg,
        },
        sectionLabel: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.muted,
          letterSpacing: 0.9,
          textTransform: 'uppercase',
          marginBottom: spacing.sm,
        },
        fieldShadow: {
          position: 'absolute',
          top: 5,
          left: 0,
          right: 0,
          bottom: -5,
          borderRadius: 20,
        },
        fieldCard: {
          borderRadius: 20,
          backgroundColor: isDark ? '#1E1A14' : '#FFFFFF',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
        },
        textInput: {
          ...typography.body,
          color: colors.text,
          lineHeight: 26,
          textAlignVertical: 'top',
          minHeight: 190,
          paddingTop: 0,
        },
        struggleInput: {
          ...typography.subhead,
          color: colors.text,
          lineHeight: 22,
          textAlignVertical: 'top',
          minHeight: 90,
          paddingTop: 0,
        },
        // ── Save bar ───────────────────────────────────────────────
        saveBarOuter: {
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xl,
        },
        saveBtn: {
          height: 52,
          borderRadius: radius.lg,
          overflow: 'hidden',
          backgroundColor: primaryDark,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        saveBtnText: {
          ...typography.headline,
          fontWeight: '700',
          color: '#FFFDF5',
          letterSpacing: 0.3,
        },
        saveBtnDisabled: {
          opacity: 0.45,
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colors, isDark],
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
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

          <View style={styles.grabber} />
          {/* Close button — above the card */}
          <View style={styles.closeRow}>
            <CloseButton onPress={onClose} />
          </View>

          {/* Header card */}
          <View style={styles.headerWrapper}>
            <View style={styles.headerCard}>
              <Text style={styles.headerLabel}>
                {isEditing ? 'Edit Entry' : 'New Entry'}
              </Text>
              <Text style={styles.headerDate}>{formattedDate}</Text>

              {isEditing && (
                <Pressable
                  style={({pressed}) => [
                    styles.deleteBtn,
                    {backgroundColor: deleteBtnBg},
                    pressed && {opacity: 0.65},
                  ]}
                  onPress={handleDelete}
                  hitSlop={8}>
                  <TrashIcon color={deleteColor} />
                </Pressable>
              )}
            </View>
          </View>

          <ScrollView
            style={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>

            {/* Main entry field */}
            <View style={styles.fieldBlock}>
              <Text style={styles.sectionLabel}>What's on your heart</Text>
              <View>
                <View style={[styles.fieldShadow, {backgroundColor: shadowColor}]} />
                <View style={styles.fieldCard}>
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
            </View>

            {/* Struggle field */}
            <View style={styles.fieldBlock}>
              <Text style={styles.sectionLabel}>What are you struggling with? (optional)</Text>
              <View>
                <View style={[styles.fieldShadow, {backgroundColor: shadowColor}]} />
                <View style={styles.fieldCard}>
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
            </View>

            {/* Bottom padding so content doesn't hide behind save bar */}
            <View style={{height: spacing.xl}} />
          </ScrollView>

          {/* Save bar with gradient fade */}
          <View>
            <LinearGradient
              colors={[
                isDark ? 'rgba(14,10,6,0)' : 'rgba(255,253,245,0)',
                isDark ? 'rgba(14,10,6,1)' : 'rgba(255,253,245,1)',
              ]}
              style={{height: 28, marginBottom: -1}}
              pointerEvents="none"
            />
            <View
              style={[
                styles.saveBarOuter,
                {backgroundColor: isDark ? '#0E0A06' : colors.background},
              ]}>
              <Pressable
                style={({pressed}) => [
                  styles.saveBtn,
                  (isSaving || !entryText.trim()) && styles.saveBtnDisabled,
                  pressed && {opacity: 0.8},
                ]}
                onPress={handleSave}
                disabled={isSaving || !entryText.trim()}>
                {isSaving ? (
                  <ActivityIndicator color="#FFFDF5" />
                ) : (
                  <Text style={styles.saveBtnText}>
                    {isEditing ? 'Save Changes' : 'Save Entry'}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>

        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default JournalEntrySheet;
