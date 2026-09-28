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
import CloseButton from './CloseButton';
import {ScriptureCategory} from '../types/app';
import {typography} from '../theme/typography';
import {radius, spacing} from '../theme/spacing';

const CATEGORY_PRESET_COLORS = [
  '#4A2F24',
  '#3D9A6A',
  '#7B6BB8',
  '#C4943A',
  '#5B8DB8',
  '#B85B5B',
];

const PRIMARY_DARK = '#361f1a';

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

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(CATEGORY_PRESET_COLORS[0]);
  const [isCatSaving, setIsCatSaving] = useState(false);

  const [_resetKey, setResetKey] = useState(0);
  React.useEffect(() => {
    if (visible) {
      setMoment('');
      setSelectedCategoryId(null);
      setShowNewCategory(false);
      setNewCatName('');
      setNewCatColor(CATEGORY_PRESET_COLORS[0]);
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

  const shadowColor = isDark ? 'rgba(54,31,26,0.35)' : 'rgba(54,31,26,0.12)';

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
          backgroundColor: PRIMARY_DARK,
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
        headerReference: {
          ...typography.title2,
          fontWeight: '800',
          color: '#FFFDF5',
          letterSpacing: -0.3,
        },
        headerTranslation: {
          ...typography.footnote,
          color: 'rgba(255,255,255,0.5)',
          marginTop: 2,
        },
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
        quoteBlock: {
          paddingLeft: spacing.md,
          borderLeftWidth: 3,
          borderLeftColor: PRIMARY_DARK,
        },
        quoteText: {
          ...typography.body,
          color: colors.text,
          lineHeight: 26,
        },
        noteInput: {
          ...typography.body,
          color: colors.text,
          lineHeight: 26,
          textAlignVertical: 'top',
          minHeight: 110,
          paddingTop: 0,
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
          backgroundColor: isDark ? colors.surface : '#FFFFFF',
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
        colorSwatch: {width: 26, height: 26, borderRadius: 13},
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
        cancelBtn: {paddingHorizontal: spacing.md, paddingVertical: 8},
        cancelBtnText: {
          ...typography.footnote,
          color: colors.muted,
          fontWeight: '600',
        },
        createBtn: {
          paddingHorizontal: spacing.md,
          paddingVertical: 8,
          borderRadius: radius.md,
          backgroundColor: PRIMARY_DARK + '20',
        },
        createBtnText: {
          ...typography.footnote,
          color: PRIMARY_DARK,
          fontWeight: '700',
        },
        saveBarOuter: {
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xl,
        },
        saveBtn: {
          height: 52,
          borderRadius: radius.lg,
          overflow: 'hidden',
          backgroundColor: PRIMARY_DARK,
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
              <Text style={styles.headerLabel}>Save Scripture</Text>
              <Text style={styles.headerReference}>{reference}</Text>
              <Text style={styles.headerTranslation}>{translation}</Text>
            </View>
          </View>

          <ScrollView
            style={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>

            {/* Verse text */}
            <View style={styles.fieldBlock}>
              <View>
                <View style={[styles.fieldShadow, {backgroundColor: shadowColor}]} />
                <View style={styles.fieldCard}>
                  <View style={styles.quoteBlock}>
                    <Text style={styles.quoteText}>{verseText}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Personal note */}
            <View style={styles.fieldBlock}>
              <Text style={styles.sectionLabel}>Personal Note</Text>
              <View>
                <View style={[styles.fieldShadow, {backgroundColor: shadowColor}]} />
                <View style={styles.fieldCard}>
                  <TextInput
                    style={styles.noteInput}
                    placeholder="What does this verse mean to you right now?"
                    placeholderTextColor={colors.placeholder}
                    value={moment}
                    onChangeText={setMoment}
                    multiline
                    maxLength={1000}
                  />
                </View>
              </View>
            </View>

            {/* Collection picker */}
            <View style={styles.fieldBlock}>
              <Text style={styles.sectionLabel}>Add to Collection</Text>
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
                        <ActivityIndicator size="small" color={PRIMARY_DARK} />
                      ) : (
                        <Text style={styles.createBtnText}>Create</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

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
                  pressed && {opacity: 0.8},
                  isSaving && {opacity: 0.6},
                ]}
                onPress={handleSave}
                disabled={isSaving}>
                {isSaving ? (
                  <ActivityIndicator color="#FFFDF5" />
                ) : (
                  <Text style={styles.saveBtnText}>Save to Library</Text>
                )}
              </Pressable>
            </View>
          </View>

        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export default SaveVerseSheet;
