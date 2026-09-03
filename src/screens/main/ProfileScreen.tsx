import React, {useMemo, useRef, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';

import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import {useTheme} from '../../context/ThemeContext';
import {useJournals} from '../../context/JournalContext';
import {useScriptures} from '../../context/ScriptureContext';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {Journal} from '../../types/app';
import JournalListModal from '../journal/JournalListModal';
import JournalEntrySheet from '../journal/JournalEntrySheet';

// ── Icons ─────────────────────────────────────────────────────────────────────

function FlameIcon({size = 20, color = '#FF6B35'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2c.5 2.5 2.5 4 4 5.5 1 1 2 2.5 2 4.5 0 3.5-3 6-6 6s-6-2.5-6-6c0-2 1-3.5 2-4.5.5-.5 1-1 1.5-2C10 4 11 2.5 12 2z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BookmarkIcon({size = 20, color = '#4A7845'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HeartIcon({size = 20, color = '#E57373'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
      />
    </Svg>
  );
}

function CrownIcon({size = 20, color = '#4A2F24'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 19h20M4 19l2-9 5 4 3-7 3 7 5-4 2 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRightIcon({size = 16, color = '#9E9B8E'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
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

function BellIcon({size = 20, color = '#4A2F24'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShieldIcon({size = 20, color = '#4A2F24'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ProfileScreen() {
  const {currentUser, savedCards, selectedFeelings} = useAppContext();
  const {colors, isDark} = useTheme();
  const {journals} = useJournals();
  const {scriptures} = useScriptures();
  const [journalOpen, setJournalOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Journal | null>(null);
  const pendingEntry = useRef<{entry: Journal | null} | null>(null);

  // Mock streak data - this would come from backend/context in production
  const streakDays = 12;
  const daysToMilestone = 3;

  // Get last feeling with time ago
  const lastFeeling = useMemo(() => {
    if (selectedFeelings.length === 0) return null;
    return {
      feeling: selectedFeelings[0],
      timeAgo: 'Today', // This would be calculated from actual data
    };
  }, [selectedFeelings]);

  // Total saved items (devotions + scriptures)
  const totalSaved = savedCards.length + scriptures.length;

  const handleNewEntry = () => {
    pendingEntry.current = {entry: null};
    setJournalOpen(false);
  };

  const handleEditEntry = (entry: Journal) => {
    pendingEntry.current = {entry};
    setJournalOpen(false);
  };

  const handleListDismiss = () => {
    setJournalOpen(false);
    if (pendingEntry.current !== null) {
      const p = pendingEntry.current;
      pendingEntry.current = null;
      setEditingEntry(p.entry);
      setEntryOpen(true);
    }
  };

  const handleEntryClose = () => {
    setEntryOpen(false);
    setJournalOpen(true);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        // ── Header ────────────────────────────────────────────────
        headerSection: {
          alignItems: 'center',
          marginBottom: spacing.lg,
        },
        avatarWrapper: {
          width: 80,
          height: 80,
          borderRadius: 40,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.md,
          backgroundColor: isDark ? colors.surface : colors.backgroundAccent,
        },
        avatarGradient: {
          ...StyleSheet.absoluteFill,
          borderRadius: 40,
        },
        avatarText: {
          ...typography.title2,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        userName: {
          ...typography.title2,
          fontWeight: '700',
          color: colors.text,
          textAlign: 'center',
          marginBottom: spacing.xs,
        },
        userEmail: {
          ...typography.subhead,
          color: colors.muted,
          marginBottom: spacing.sm,
        },
        editButton: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          borderRadius: radius.full,
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          gap: 6,
        },
        editButtonText: {
          ...typography.footnote,
          fontWeight: '600',
          color: colors.primaryDark,
        },

        // ── Stats Cards ───────────────────────────────────────────
        statsRow: {
          gap: spacing.sm,
          marginBottom: spacing.lg,
        },
        statsMiniRow: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        statCard: {
          flex: 1,
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          padding: spacing.md,
        },
        statCardFull: {
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          padding: spacing.md,
        },
        statIconWrapper: {
          width: 36,
          height: 36,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.sm,
        },
        statLabel: {
          ...typography.caption1,
          fontWeight: '600',
          color: colors.muted,
          marginBottom: 4,
        },
        statValue: {
          ...typography.title2,
          fontWeight: '700',
          color: colors.text,
        },
        statSubtitle: {
          ...typography.caption1,
          color: colors.muted,
          marginTop: 4,
        },
        streakTagline: {
          ...typography.caption1,
          color: colors.primaryDark,
          fontStyle: 'italic',
          marginTop: 2,
        },
        streakCardRow: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        streakLeft: {
          flex: 1,
        },
        streakIconWrapper: {
          width: 36,
          height: 36,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? '#FF6B3520' : '#FFF0EB',
          marginBottom: spacing.sm,
        },
        streakRight: {
          alignItems: 'flex-end',
        },
        streakNumber: {
          ...typography.largeTitle,
          fontWeight: '800',
          color: '#FF6B35',
          lineHeight: 52,
        },
        streakDaysLabel: {
          ...typography.footnote,
          fontWeight: '600',
          color: colors.muted,
          letterSpacing: 0.5,
        },
        savedIconBg: {
          backgroundColor: isDark ? '#4A784520' : '#E8F5E8',
        },
        feelingIconBg: {
          backgroundColor: isDark ? '#E5737320' : '#FFEBEE',
        },
        statValueSmall: {
          ...typography.title2,
          fontWeight: '700',
          color: colors.text,
          fontSize: 15,
        },

        // ── Settings Section ──────────────────────────────────────
        sectionWrapper: {
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          marginBottom: spacing.md,
        },
        sectionTitle: {
          ...typography.footnote,
          fontWeight: '700',
          color: colors.muted,
          letterSpacing: 0.5,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.xs,
        },
        settingRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          gap: spacing.md,
        },
        settingIconWrapper: {
          width: 36,
          height: 36,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? colors.primaryDark + '20' : colors.backgroundAccent,
        },
        settingText: {flex: 1},
        settingLabel: {
          ...typography.body,
          fontWeight: '500',
          color: colors.text,
        },
        settingValue: {
          ...typography.footnote,
          color: colors.muted,
          marginTop: 1,
        },
        settingDivider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginLeft: spacing.lg + 36 + spacing.md,
        },

        // ── Journal Section ───────────────────────────────────────
        journalCard: {
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: isDark ? colors.surface : colors.surfaceStrong,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          marginBottom: spacing.md,
        },
        journalContent: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing.lg,
          gap: spacing.md,
        },
        journalIconWrapper: {
          width: 44,
          height: 44,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? '#5C4033' : '#E8DDD4',
        },
        journalTextWrapper: {flex: 1},
        journalTitle: {
          ...typography.headline,
          fontWeight: '600',
          color: colors.text,
        },
        journalSubtitle: {
          ...typography.footnote,
          color: colors.muted,
          marginTop: 2,
        },
        journalBadge: {
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: radius.full,
          backgroundColor: isDark ? colors.primaryDark + '25' : colors.backgroundAccent,
          marginRight: spacing.xs,
        },
        journalBadgeText: {
          ...typography.caption1,
          fontWeight: '700',
          color: colors.primaryDark,
        },
      }),
    [colors, isDark],
  );

  if (!currentUser) {
    return null;
  }

  const initials = currentUser.fullName
    .split(' ')
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);

  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with user info */}
        <View style={styles.headerSection}>
          <View style={styles.avatarWrapper}>
            {!isDark && (
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(74,47,36,0.15)']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.avatarGradient}
              />
            )}
            <Text style={styles.avatarText}>{initials || 'GP'}</Text>
          </View>
          <Text style={styles.userName}>{currentUser.fullName}</Text>
          <Text style={styles.userEmail}>{currentUser.email}</Text>
          <Pressable style={({pressed}) => [styles.editButton, pressed && {opacity: 0.7}]}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                stroke={colors.primaryDark}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke={colors.primaryDark}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          {/* Current Streak — full width */}
          <View style={[styles.statCardFull, styles.streakCardRow]}>
            <View style={styles.streakLeft}>
              <View style={styles.streakIconWrapper}>
                <FlameIcon size={20} color="#FF6B35" />
              </View>
              <Text style={styles.statLabel}>Current Streak</Text>
              <Text style={styles.streakTagline}>Keep the peace flowing</Text>
              <Text style={styles.statSubtitle}>{daysToMilestone} days to next milestone</Text>
            </View>
            <View style={styles.streakRight}>
              <Text style={styles.streakNumber}>{streakDays}</Text>
              <Text style={styles.streakDaysLabel}>DAYS</Text>
            </View>
          </View>

          {/* Saved + Last Feeling side by side */}
          <View style={styles.statsMiniRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, styles.savedIconBg]}>
                <BookmarkIcon size={18} color="#4A7845" />
              </View>
              <Text style={styles.statLabel}>Saved</Text>
              <Text style={styles.statValue}>{totalSaved}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, styles.feelingIconBg]}>
                <HeartIcon size={18} color="#E57373" />
              </View>
              <Text style={styles.statLabel}>Last Feeling</Text>
              <Text style={styles.statValueSmall}>
                {lastFeeling?.feeling ?? 'None yet'}
              </Text>
              {lastFeeling && <Text style={styles.statSubtitle}>{lastFeeling.timeAgo}</Text>}
            </View>
          </View>
        </View>


        {/* Journal Section */}
        <Pressable
          style={({pressed}) => [styles.journalCard, pressed && {opacity: 0.8}]}
          onPress={() => setJournalOpen(true)}>
          <View style={styles.journalContent}>
            <View style={styles.journalIconWrapper}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                  stroke={isDark ? '#D4C98A' : '#5C4033'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                  stroke={isDark ? '#D4C98A' : '#5C4033'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={styles.journalTextWrapper}>
              <Text style={styles.journalTitle}>Journal</Text>
              <Text style={styles.journalSubtitle}>
                {journals.length === 0
                  ? 'Your private reflections'
                  : `${journals.length} ${journals.length === 1 ? 'entry' : 'entries'} and reflections`}
              </Text>
            </View>
            {journals.length > 0 && (
              <View style={styles.journalBadge}>
                <Text style={styles.journalBadgeText}>{journals.length}</Text>
              </View>
            )}
            <ChevronRightIcon color={colors.muted} />
          </View>
        </Pressable>

        {/* Settings Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>

          

          {/* Membership Status */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconWrapper}>
              <CrownIcon size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Membership Status</Text>
              <Text style={styles.settingValue}>Active</Text>
            </View>
          </View>

          <View style={styles.settingDivider} />

          {/* Notifications */}
          <Pressable style={({pressed}) => [styles.settingRow, pressed && {opacity: 0.7}]}>
            <View style={styles.settingIconWrapper}>
              <BellIcon size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingValue}>Daily reminders</Text>
            </View>
            <ChevronRightIcon color={colors.muted} />
          </Pressable>

          <View style={styles.settingDivider} />

          {/* Data & Privacy */}
          <Pressable style={({pressed}) => [styles.settingRow, pressed && {opacity: 0.7}]}>
            <View style={styles.settingIconWrapper}>
              <ShieldIcon size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Data & Privacy</Text>
              <Text style={styles.settingValue}>Manage your data</Text>
            </View>
            <ChevronRightIcon color={colors.muted} />
          </Pressable>
        </View>
      </ScrollView>

      <JournalListModal
        visible={journalOpen}
        onClose={() => setJournalOpen(false)}
        onDismiss={handleListDismiss}
        onNewEntry={handleNewEntry}
        onEditEntry={handleEditEntry}
      />
      <JournalEntrySheet
        visible={entryOpen}
        entry={editingEntry}
        onClose={handleEntryClose}
      />
    </ScreenShell>
  );
}

export default ProfileScreen;
