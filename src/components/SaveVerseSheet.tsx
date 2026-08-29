import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
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
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import {useTheme} from '../context/ThemeContext';
import {useScriptures} from '../context/ScriptureContext';
import {ScriptureCategory} from '../types/app';
import {typography} from '../theme/typography';
import {radius, spacing} from '../theme/spacing';

const CATEGORY_PRESET_COLORS = [
  '#4A2F24', // faith — earthy brown
  '#3D9A6A', // hope — forest green
  '#7B6BB8', // wisdom — royal purple
  '#C4943A', // praise — golden amber
  '#5B8DB8', // peace — sky blue
  '#B85B5B', // love — deep red
];

type Props = {
  visible: boolean;
  bookId: string;
  bookName: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  verseText: string;
  translation: string;
  onClose: () => void;
  onSaved?: () => void;
};

function CategoryChip({
  category,
  selected,
  onPress,
  isDark,
  glassScheme,
}: {
  category: ScriptureCategory;
  selected: boolean;
  onPress: () => void;
  isDark: boolean;
  glassScheme: 'light' | 'dark';
}) {
  const accentColor = category.color ?? '#4A2F24';
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
      <View
        style={[
          chipStyles.chip,
          selected && {borderColor: accentColor, borderWidth: 2},
          !isLiquidGlassSupported && {
            backgroundColor: selected ? accentColor + '22' : (isDark ? '#2A2218' : '#FFFDF5'),
            borderWidth: 1,
            borderColor: selected ? accentColor : (isDark ? '#3A3020' : '#E2D5C3'),
          },
        ]}>
        {isLiquidGlassSupported && (
          <LiquidGlassView
            style={StyleSheet.absoluteFill}
            effect={selected ? 'regular' : 'clear'}
            colorScheme={glassScheme}
          />
        )}
        <View style={[chipStyles.dot, {backgroundColor: accentColor}]} />
        <Text style={[chipStyles.label, {color: selected ? accentColor : (isDark ? '#9E9B8E' : '#72746A')}]}>
          {category.name}
        </Text>
      </View>
    </Pressable>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 8,
    gap: 6,
  },
  dot: {width: 7, height: 7, borderRadius: 3.5},
  label: {...typography.footnote, fontWeight: '600'},
});

function SaveVerseSheet({
  visible,
  bookId,
  bookName,
  chapter,
  verseStart,
  verseEnd,
  verseText,
  translation,
  onClose,
  onSaved,
}: Props) {
  const {colors, isDark} = useTheme();
  const {categories, saveVerse, isSaving, createCategory} = useScriptures();
  const glassScheme = isDark ? 'dark' : 'light';

  const [moment, setMoment] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // New category inline form
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(CATEGORY_PRESET_COLORS[0]);
  const [isCatSaving, setIsCatSaving] = useState(false);

  // Dynamic note input height — expands to fill empty sheet space
  const [noteInputHeight, setNoteInputHeight] = useState(80);
  const svHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const hasAdjustedRef = useRef(false);

  const maybeExpandNote = useCallback(() => {
    if (hasAdjustedRef.current) return;
    if (svHeightRef.current === 0 || contentHeightRef.current === 0) return;
    const gap = svHeightRef.current - contentHeightRef.current;
    hasAdjustedRef.current = true;
    if (gap > 24) {
      setNoteInputHeight(prev => prev + gap - 48);
    }
  }, []);

  // Reset form state when sheet opens
  const [_resetKey, setResetKey] = useState(0);
  React.useEffect(() => {
    if (visible) {
      setMoment('');
      setSelectedCategoryId(null);
      setShowNewCategory(false);
      setNewCatName('');
      setNewCatColor(CATEGORY_PRESET_COLORS[0]);
      setNoteInputHeight(80);
      svHeightRef.current = 0;
      contentHeightRef.current = 0;
      hasAdjustedRef.current = false;
      setResetKey(k => k + 1);
    }
  }, [visible]);

  const reference = verseEnd
    ? `${bookName} ${chapter}:${verseStart}-${verseEnd}`
    : `${bookName} ${chapter}:${verseStart}`;

  const handleSave = useCallback(async () => {
    try {
      await saveVerse({
        bookId,
        chapter,
        verseStart,
        verseEnd,
        translation,
        reference,
        verseText,
        moment: moment.trim() || undefined,
        categoryId: selectedCategoryId ?? undefined,
      });
      onSaved?.();
      onClose();
    } catch {
      // error handled by context
    }
  }, [saveVerse, bookId, chapter, verseStart, verseEnd, translation, reference, verseText, moment, selectedCategoryId, onSaved, onClose]);

  const handleCreateCategory = useCallback(async () => {
    if (!newCatName.trim()) return;
    setIsCatSaving(true);
    try {
      const cat = await createCategory({
        name: newCatName.trim(),
        color: newCatColor,
      });
      setSelectedCategoryId(cat.id);
      setShowNewCategory(false);
      setNewCatName('');
    } finally {
      setIsCatSaving(false);
    }
  }, [createCategory, newCatName, newCatColor]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        sheet: {
          flex: 1,
          backgroundColor: colors.background,
          overflow: 'hidden',
        },
        headerGradient: {
          paddingTop: 12,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.sm,
          height: 110,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: 10,
        },
        grabber: {
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.35)',
          alignSelf: 'center',
          marginBottom: spacing.sm,
        },
        headerLabel: {
          ...typography.caption1,
          fontWeight: '700',
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: 1.2,
          marginBottom: 4,
        },
        headerReference: {
          ...typography.title2,
          fontWeight: '800',
          color: '#FFFDF5',
        },
        headerTranslation: {
          ...typography.footnote,
          color: 'rgba(255,255,255,0.5)',
          marginTop: 2,
        },
        body: {
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xs,
          paddingBottom: spacing.md,
        },
        quoteBlock: {
          marginTop: spacing.sm,
          marginBottom: spacing.sm,
          paddingLeft: spacing.md,
          borderLeftWidth: 3,
          borderLeftColor: colors.primaryDark,
        },
        quoteText: {
          ...typography.body,
          color: colors.text,
          lineHeight: 24,
          fontSize: 15,
        },
        sectionLabel: {
          ...typography.footnote,
          fontWeight: '700',
          color: colors.muted,
          letterSpacing: 0.8,
          marginBottom: spacing.xs,
          marginTop: spacing.sm,
        },
        momentInput: {
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderRadius: radius.lg,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          ...typography.subhead,
          color: colors.text,
          lineHeight: 22,
          minHeight: 110,
          textAlignVertical: 'top',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        categoryRow: {paddingVertical: 4},
        addCatBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 20,
          borderWidth: 1.5,
          borderStyle: 'dashed',
          borderColor: colors.border,
          gap: 4,
          marginRight: 8,
        },
        addCatText: {
          ...typography.footnote,
          fontWeight: '600',
          color: colors.muted,
        },
        newCatForm: {
          marginTop: spacing.sm,
          padding: spacing.md,
          borderRadius: radius.lg,
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          gap: spacing.sm,
        },
        newCatInput: {
          ...typography.subhead,
          color: colors.text,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          paddingVertical: 8,
        },
        colorRow: {flexDirection: 'row', gap: 10, paddingTop: 4},
        colorSwatch: {
          width: 26,
          height: 26,
          borderRadius: 13,
        },
        colorSwatchSelected: {
          borderWidth: 3,
          borderColor: colors.background,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: {width: 0, height: 2},
          elevation: 4,
        },
        newCatActions: {
          flexDirection: 'row',
          gap: spacing.sm,
          justifyContent: 'flex-end',
        },
        cancelBtn: {
          paddingHorizontal: spacing.md,
          paddingVertical: 8,
        },
        cancelBtnText: {
          ...typography.footnote,
          color: colors.muted,
          fontWeight: '600',
        },
        createBtn: {
          paddingHorizontal: spacing.md,
          paddingVertical: 8,
          borderRadius: radius.md,
          backgroundColor: colors.primaryDark + '20',
        },
        createBtnText: {
          ...typography.footnote,
          color: colors.primaryDark,
          fontWeight: '700',
        },
        saveBtnContainer: {
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
        saveBtnGradient: {
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        },
        saveBtnText: {
          ...typography.headline,
          fontWeight: '700',
          color: '#FFFDF5',
          letterSpacing: 0.3,
        },
      }),
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
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Decorative header gradient */}
          <LinearGradient
            colors={
              isDark
                ? ['#3E2010', '#2D160A', '#1A0E06']
                : ['#5C3020', '#3E1E10', '#2D160E']
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.headerGradient}>
            <View style={styles.grabber} />
            <Text style={styles.headerLabel}>SAVE SCRIPTURE</Text>
            <Text style={styles.headerReference}>{reference}</Text>
            <Text style={styles.headerTranslation}>{translation}</Text>
          </LinearGradient>

          {/* Scrollable body */}
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onLayout={e => {
              svHeightRef.current = e.nativeEvent.layout.height;
              maybeExpandNote();
            }}
            onContentSizeChange={(_w, h) => {
              contentHeightRef.current = h;
              maybeExpandNote();
            }}>
            {/* Verse text */}
            <View style={styles.quoteBlock}>
              <Text style={styles.quoteText}>{verseText}</Text>
            </View>

            {/* Moment / personal note */}
            <Text style={styles.sectionLabel}>PERSONAL NOTE</Text>
            <TextInput
              style={[styles.momentInput, {minHeight: noteInputHeight}]}
              placeholder="What does this verse mean to you right now?"
              placeholderTextColor={colors.placeholder}
              value={moment}
              onChangeText={setMoment}
              multiline
              maxLength={1000}
            />

            {/* Category picker */}
            <Text style={styles.sectionLabel}>ADD TO COLLECTION</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryRow}
              contentContainerStyle={{paddingBottom: 4}}>
              {categories.map(cat => (
                <CategoryChip
                  key={cat.id}
                  category={cat}
                  selected={selectedCategoryId === cat.id}
                  onPress={() =>
                    setSelectedCategoryId(prev => (prev === cat.id ? null : cat.id))
                  }
                  isDark={isDark}
                  glassScheme={glassScheme}
                />
              ))}
              <Pressable
                style={({pressed}) => [styles.addCatBtn, pressed && {opacity: 0.6}]}
                onPress={() => setShowNewCategory(v => !v)}>
                <Text style={{color: colors.muted, fontSize: 14}}>+</Text>
                <Text style={styles.addCatText}>New</Text>
              </Pressable>
            </ScrollView>

            {/* Inline new category form */}
            {showNewCategory && (
              <View style={styles.newCatForm}>
                <TextInput
                  style={styles.newCatInput}
                  placeholder="Collection name"
                  placeholderTextColor={colors.placeholder}
                  value={newCatName}
                  onChangeText={setNewCatName}
                  maxLength={64}
                  autoFocus
                />
                <View style={styles.colorRow}>
                  {CATEGORY_PRESET_COLORS.map(c => (
                    <Pressable
                      key={c}
                      onPress={() => setNewCatColor(c)}
                      style={[
                        styles.colorSwatch,
                        {backgroundColor: c},
                        newCatColor === c && styles.colorSwatchSelected,
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.newCatActions}>
                  <Pressable
                    style={styles.cancelBtn}
                    onPress={() => setShowNewCategory(false)}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.createBtn}
                    onPress={handleCreateCategory}
                    disabled={isCatSaving || !newCatName.trim()}>
                    {isCatSaving ? (
                      <ActivityIndicator size="small" color={colors.primaryDark} />
                    ) : (
                      <Text style={styles.createBtnText}>Create</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Save button — pinned at bottom */}
          <View style={styles.saveBtnContainer}>
            <Pressable
              style={({pressed}) => [styles.saveBtn, pressed && {opacity: 0.85}]}
              onPress={handleSave}
              disabled={isSaving}>
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
                <Text style={styles.saveBtnText}>Save to Library</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default SaveVerseSheet;
