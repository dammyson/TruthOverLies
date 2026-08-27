import React, {useMemo} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import {useJournals} from '../../context/JournalContext';
import {Journal} from '../../types/app';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import SkeletonBlock from '../../components/SkeletonBlock';

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
}: {
  entry: Journal;
  onPress: () => void;
  isDark: boolean;
}) {
  const date = useMemo(
    () =>
      new Date(entry.createdAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    [entry.createdAt],
  );

  const preview = entry.entryText.length > 140
    ? entry.entryText.slice(0, 140).trimEnd() + '…'
    : entry.entryText;

  const accentColor = isDark ? '#7A4A2A' : '#8B5E3C';

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [{
        borderRadius: radius.xl,
        marginBottom: spacing.sm,
        backgroundColor: isDark ? '#1E1A14' : '#FDFAF4',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: isDark ? '#3A3020' : '#E8DFD0',
        overflow: 'hidden' as const,
        opacity: pressed ? 0.75 : 1,
        // left accent border via shadow trick — use borderLeftWidth instead
        borderLeftWidth: 3,
        borderLeftColor: accentColor,
      }]}>

      {/* Date + chevron row */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 6,
      }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <View style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: accentColor,
          }} />
          <Text style={{
            ...typography.caption1,
            fontWeight: '600',
            color: isDark ? '#9E8E7E' : '#8B7B6A',
            letterSpacing: 0.3,
          }}>
            {date}
          </Text>
        </View>
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 18l6-6-6-6"
            stroke={isDark ? '#6E5E4E' : '#B0A090'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      {/* Entry preview */}
      <Text style={{
        ...typography.body,
        color: isDark ? '#D8D4C8' : '#2E2C29',
        lineHeight: 23,
        paddingHorizontal: 14,
        paddingBottom: entry.struggle ? 10 : 14,
      }}>
        {preview}
      </Text>

      {/* Struggle pill */}
      {entry.struggle ? (
        <View style={{
          marginHorizontal: 14,
          marginBottom: 12,
          backgroundColor: isDark ? '#2A1A1A' : '#FFF2F0',
          borderRadius: radius.lg,
          paddingHorizontal: 10,
          paddingVertical: 7,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: isDark ? '#4A2020' : '#F0CABA',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 7,
        }}>
          <View style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#B85B5B',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 1,
          }}>
            <Text style={{fontSize: 8, fontWeight: '900', color: '#FFF'}}>!</Text>
          </View>
          <Text style={{
            flex: 1,
            ...typography.footnote,
            color: isDark ? '#C8A8A0' : '#7A4040',
            fontStyle: 'italic',
            lineHeight: 18,
          }}>
            {entry.struggle}
          </Text>
        </View>
      ) : null}
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
        header: {
          paddingTop: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: 10,
          height: 130,
        },
        titleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        title: {
          ...typography.largeTitle,
          fontWeight: '800',
          color: '#FFFDF5',
        },
        countBadge: {
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: radius.full,
          backgroundColor: 'rgba(255,255,255,0.18)',
          alignSelf: 'center',
        },
        countText: {
          ...typography.caption1,
          fontWeight: '700',
          color: 'rgba(255,253,245,0.85)',
        },
        subtitle: {
          ...typography.footnote,
          color: 'rgba(255,255,255,0.45)',
          marginTop: 4,
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
        emptyBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: spacing.xl,
          paddingVertical: 13,
          borderRadius: radius.xl,
          overflow: 'hidden' as const,
        },
        emptyBtnText: {
          ...typography.subhead,
          fontWeight: '700',
          color: '#FFFDF5',
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
          height: 50,
          borderRadius: radius.xl,
          overflow: 'hidden' as const,
        },
        addBtnGradient: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0},
        addBtnText: {
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
      onDismiss={onDismiss}>
      <View style={styles.sheet}>
        <LinearGradient
          colors={isDark ? ['#3E2010', '#2D160A', '#1A0E06'] : ['#5C3020', '#3E1E10', '#2D160E']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>My Journal</Text>
            {journals.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{journals.length}</Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>Your private space with God</Text>
        </LinearGradient>

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
                style={{marginBottom: spacing.sm}}
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
              />
            ))
          )}
        </ScrollView>

        <View style={styles.addBar}>
          <Pressable
            style={({pressed}) => [styles.addBtn, pressed && {opacity: 0.85}]}
            onPress={onNewEntry}>
            <LinearGradient
              colors={isDark ? ['#6B4E1A', '#4A3410', '#2D1E08'] : ['#8B5E3C', '#5C3020', '#3E1E10']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.addBtnGradient}
            />
            <PlusIcon />
            <Text style={styles.addBtnText}>New Entry</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default JournalListModal;
