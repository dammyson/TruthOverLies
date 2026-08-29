import React, {useMemo} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {useJournals} from '../../context/JournalContext';
import CloseButton from '../../components/CloseButton';
import {Journal} from '../../types/app';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import SkeletonBlock from '../../components/SkeletonBlock';
import dayjs from 'dayjs';

function ChevronRight({color}: {color: string}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function AlertIcon({color}: {color: string}) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlusIcon({color = '#FFFDF5'}: {color?: string}) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function JournalCard({
  entry,
  onPress,
  isDark,
  colors,
}: {
  entry: Journal;
  onPress: () => void;
  isDark: boolean;
  colors: any;
}) {
  const date = useMemo(() => dayjs(entry.createdAt).format('D MMM YYYY'), [entry.createdAt]);
  const preview =
    entry.entryText.length > 140
      ? entry.entryText.slice(0, 140).trimEnd() + '…'
      : entry.entryText;

  const accentColor = isDark ? '#7A4A2A' : '#8B5E3C';
  const errorBg = isDark ? '#2D1A16' : '#FFF2F0';
  const errorBorder = isDark ? '#4A2A2A' : '#FFDAD6';
  const errorText = isDark ? '#E89080' : '#7A3B3B';
  const errorIcon = isDark ? '#E89080' : '#BA1A1A';

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => ({
        borderRadius: radius.xl,
        marginBottom: spacing.sm + 2,
        backgroundColor: isDark ? '#1E1A14' : '#FFFFFF',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: isDark ? '#3A3020' : '#D4C3BF',
        overflow: 'hidden' as const,
        opacity: pressed ? 0.75 : 1,
        shadowColor: '#000',
        shadowOpacity: isDark ? 0 : 0.04,
        shadowRadius: 8,
        shadowOffset: {width: 0, height: 2},
        elevation: 1,
      })}>
      {/* Left accent stripe */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: accentColor,
          borderTopLeftRadius: radius.xl,
          borderBottomLeftRadius: radius.xl,
        }}
      />

      <View style={{paddingLeft: 18, paddingRight: 14, paddingTop: 12, paddingBottom: 12}}>
        {/* Date row */}
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
            <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: accentColor}} />
            <Text style={{...typography.caption1, fontWeight: '500', color: colors.muted}}>
              {date}
            </Text>
          </View>
          <ChevronRight color={colors.muted} />
        </View>

        {/* Entry preview */}
        <Text
          numberOfLines={3}
          style={{
            ...typography.body,
            color: isDark ? '#D8D4C8' : '#1B1C16',
            lineHeight: 23,
            marginBottom: entry.struggle ? 10 : 0,
          }}>
          {preview}
        </Text>

        {/* Struggle section */}
        {entry.struggle ? (
          <View
            style={{
              backgroundColor: errorBg,
              borderRadius: radius.lg,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: errorBorder,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 8,
            }}>
            <View style={{marginTop: 1}}>
              <AlertIcon color={errorIcon} />
            </View>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                ...typography.footnote,
                color: errorText,
                fontStyle: 'italic',
              }}>
              {entry.struggle}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;
  onDismiss: () => void;
  onNewEntry: () => void;
  onEditEntry: (entry: Journal) => void;
};

function JournalListModal({visible, onClose, onDismiss, onNewEntry, onEditEntry}: Props) {
  const {colors, isDark} = useTheme();
  const {journals, isLoading} = useJournals();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        sheet: {flex: 1, backgroundColor: colors.background},
        grabber: {
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.border,
          alignSelf: 'center',
          marginTop: spacing.sm,
          marginBottom: spacing.sm,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
        headerLeft: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        title: {
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
        },
        countBadge: {
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: radius.full,
          backgroundColor: isDark ? '#3E2010' : '#361f1a1a',
        },
        countText: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        list: {
          flexGrow: 1,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.lg,
        },
        emptyWrapper: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.lg,
          gap: spacing.md,
          paddingTop: 60,
        },
        emptyTitle: {
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
          textAlign: 'center',
        },
        emptyText: {
          ...typography.subhead,
          color: colors.muted,
          textAlign: 'center',
          lineHeight: 22,
        },
        addBar: {
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xl,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        },
        addBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          height: 52,
          borderRadius: radius.xl,
          backgroundColor: colors.primaryDark,
        },
        addBtnText: {
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
      onDismiss={onDismiss}>
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>My Journal</Text>
            {journals.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{journals.length}</Text>
              </View>
            )}
          </View>
          <CloseButton onPress={onClose} />
        </View>

        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}>
          {isLoading ? (
            [1, 2, 3].map(i => (
              <SkeletonBlock
                key={i}
                height={110}
                borderRadius={radius.xl}
                style={{marginBottom: spacing.sm + 2}}
              />
            ))
          ) : journals.length === 0 ? (
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyTitle}>Start your first entry</Text>
              <Text style={styles.emptyText}>
                A journal is a place to be honest with God — your thoughts, your fears, your
                gratitude.
              </Text>
            </View>
          ) : (
            journals.map(j => (
              <JournalCard
                key={j.id}
                entry={j}
                onPress={() => onEditEntry(j)}
                isDark={isDark}
                colors={colors}
              />
            ))
          )}
        </ScrollView>

        <View style={styles.addBar}>
          <Pressable
            style={({pressed}) => [styles.addBtn, pressed && {opacity: 0.85}]}
            onPress={onNewEntry}>
            <PlusIcon />
            <Text style={styles.addBtnText}>New Entry</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default JournalListModal;
