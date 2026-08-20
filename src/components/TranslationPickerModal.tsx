import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {LiquidGlassView, isLiquidGlassSupported} from '@callstack/liquid-glass';
import {useTheme} from '../context/ThemeContext';
import * as bibleApi from '../api/bible';
import * as bibleRepo from '../bible/bibleRepo';
import {typography} from '../theme/typography';
import {radius, spacing} from '../theme/spacing';

type DlStatus = 'idle' | 'downloading' | 'downloaded' | 'error';
type DlState = {[id: string]: {status: DlStatus; progress: number}};

type Props = {
  visible: boolean;
  selectedTranslation: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

function formatBytes(bytes: number): string {
  if (!bytes) return '';
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${Math.round(bytes / 1_000)} KB`;
}

function TranslationPickerModal({visible, selectedTranslation, onSelect, onClose}: Props) {
  const {colors, isDark} = useTheme();
  const glassScheme = isDark ? 'dark' : 'light';

  const [translations, setTranslations] = useState<bibleApi.BibleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dlState, setDlState] = useState<DlState>({});

  useEffect(() => {
    if (!visible) {
      return;
    }

    let cancelled = false;

    // Reset to a clean slate every time the modal opens
    setTranslations([]);
    setDlState({});
    setLoading(true);

    const load = async () => {
      try {
        let list: bibleApi.BibleListItem[] = [];

        try {
          const basic = await bibleRepo.getTranslations();
          list = basic.map(t => ({
            id: t.code,
            name: t.name,
            language: 'en',
            version: 1,
            sizeBytes: 0,
          }));
        } catch (err) {
          console.warn('[Bible] translation list fetch failed', err);
        }

        if (cancelled) {
          return;
        }
        // Deduplicate by id — API can return the same translation twice
        const unique = list.filter(
          (item, i, arr) => arr.findIndex(x => x.id === item.id) === i,
        );
        setTranslations(unique);

        const states: DlState = {};
        for (const t of unique) {
          if (cancelled) {
            return;
          }
          if (bibleRepo.isDownloadInProgress(t.id)) {
            states[t.id] = {status: 'downloading', progress: 0};
          } else {
            const downloaded = await bibleRepo.isTranslationDownloaded(t.id);
            states[t.id] = {status: downloaded ? 'downloaded' : 'idle', progress: 0};
          }
        }

        if (cancelled) {
          return;
        }
        setDlState(states);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [visible]);

  const handleDownload = useCallback(async (item: bibleApi.BibleListItem) => {
    setDlState(prev => ({...prev, [item.id]: {status: 'downloading', progress: 0}}));
    try {
      const books = await bibleRepo.getBooks(item.id);
      await bibleRepo.downloadTranslation(item.id, books, pct => {
        setDlState(prev => ({...prev, [item.id]: {status: 'downloading', progress: pct}}));
      });
      setDlState(prev => ({...prev, [item.id]: {status: 'downloaded', progress: 1}}));
    } catch {
      setDlState(prev => ({...prev, [item.id]: {status: 'error', progress: 0}}));
    }
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        sheet: {
          flex: 1,
          backgroundColor: colors.background,
        },
        grabber: {
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.border,
          alignSelf: 'center',
          marginTop: spacing.sm,
          marginBottom: spacing.md,
        },
        header: {
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        title: {
          ...typography.title2,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.xs / 2,
        },
        subtitle: {
          ...typography.footnote,
          color: colors.muted,
          lineHeight: 18,
        },
        listContent: {
          paddingTop: spacing.sm,
          paddingBottom: spacing.xl + spacing.lg,
          paddingHorizontal: spacing.md,
          gap: spacing.xs,
        },
        emptyText: {
          ...typography.subhead,
          color: colors.muted,
          textAlign: 'center',
          marginTop: spacing.xl,
        },
        // Row
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: radius.xl,
          paddingLeft: spacing.md,
          paddingRight: spacing.sm,
          paddingVertical: spacing.sm + 2,
          minHeight: 72,
          gap: spacing.sm,
          overflow: 'hidden',
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.surface,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
          }),
        },
        rowSelected: {
          ...(!isLiquidGlassSupported && {
            backgroundColor: colors.primaryDark + '14',
            borderColor: colors.primaryDark + '30',
          }),
        },
        rowGlass: {
          ...StyleSheet.absoluteFill,
          borderRadius: radius.xl,
        },
        // Info column
        infoCol: {flex: 1},
        codeRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
        },
        code: {
          ...typography.headline,
          fontWeight: '700',
          color: colors.text,
        },
        codeSelected: {color: colors.primaryDark},
        offlineBadge: {
          paddingHorizontal: spacing.xs,
          paddingVertical: 1,
          borderRadius: radius.sm,
          backgroundColor: colors.primaryDark + '18',
        },
        offlineBadgeText: {
          ...typography.caption1,
          fontSize: 10,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        name: {
          ...typography.subhead,
          color: colors.muted,
          marginTop: 1,
        },
        meta: {
          ...typography.caption1,
          color: colors.muted,
          marginTop: 2,
          opacity: 0.7,
        },
        // Action column
        actionCol: {
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
        },
        // Selected check
        checkCircle: {
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.primaryDark,
          alignItems: 'center',
          justifyContent: 'center',
        },
        checkText: {
          color: '#fff',
          fontSize: 14,
          fontWeight: '800',
        },
        // Downloaded (not selected)
        downloadedCircle: {
          width: 28,
          height: 28,
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: colors.primaryDark,
          alignItems: 'center',
          justifyContent: 'center',
        },
        downloadedText: {
          color: colors.primaryDark,
          fontSize: 13,
          fontWeight: '700',
        },
        // Download button
        downloadCircle: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.primaryDark + '15',
          alignItems: 'center',
          justifyContent: 'center',
        },
        downloadArrow: {
          color: colors.primaryDark,
          fontSize: 16,
          fontWeight: '600',
          marginTop: -1,
        },
        // Downloading
        progressStack: {
          alignItems: 'center',
          gap: 2,
        },
        progressPct: {
          ...typography.caption1,
          fontSize: 10,
          fontWeight: '700',
          color: colors.primaryDark,
        },
        // Error retry
        errorCircle: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: '#FF3B3018',
          alignItems: 'center',
          justifyContent: 'center',
        },
        errorText: {
          color: '#FF3B30',
          fontSize: 16,
        },
      }),
    [colors],
  );

  const renderItem = useCallback(
    ({item}: {item: bibleApi.BibleListItem}) => {
      const isSelected = item.id === selectedTranslation;
      const state = dlState[item.id] ?? {status: 'idle', progress: 0};
      const isDownloading = state.status === 'downloading';
      const isDownloaded = state.status === 'downloaded';
      const isError = state.status === 'error';

      return (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Select ${item.name}`}
          onPress={() => {
            onSelect(item.id);
            onClose();
          }}
          style={({pressed}) => [
            styles.row,
            isSelected && styles.rowSelected,
            pressed && {opacity: 0.72},
          ]}>
          {isLiquidGlassSupported && (
            <LiquidGlassView
              style={styles.rowGlass}
              effect={isSelected ? 'regular' : 'clear'}
              colorScheme={glassScheme}
            />
          )}

          {/* Translation info */}
          <View style={styles.infoCol}>
            <View style={styles.codeRow}>
              <Text style={[styles.code, isSelected && styles.codeSelected]}>
                {item.id}
              </Text>
              {isDownloaded && (
                <View style={styles.offlineBadge}>
                  <Text style={styles.offlineBadgeText}>OFFLINE</Text>
                </View>
              )}
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.meta}>
              {item.language}
              {item.sizeBytes ? `  ·  ${formatBytes(item.sizeBytes)}` : ''}
            </Text>
          </View>

          {/* Right action — separate Pressable so tap doesn't select */}
          <Pressable
            style={styles.actionCol}
            hitSlop={8}
            onPress={() => {
              if (isSelected) {
                onClose();
                return;
              }
              if (!isDownloading && !isDownloaded) {
                handleDownload(item);
              }
            }}>
            {isSelected ? (
              <View style={styles.checkCircle}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            ) : isDownloaded ? (
              <View style={styles.downloadedCircle}>
                <Text style={styles.downloadedText}>✓</Text>
              </View>
            ) : isDownloading ? (
              <View style={styles.progressStack}>
                <ActivityIndicator size="small" color={colors.primaryDark} />
                <Text style={styles.progressPct}>
                  {Math.round(state.progress * 100)}%
                </Text>
              </View>
            ) : isError ? (
              <View style={styles.errorCircle}>
                <Text style={styles.errorText}>↺</Text>
              </View>
            ) : (
              <View style={styles.downloadCircle}>
                <Text style={styles.downloadArrow}>↓</Text>
              </View>
            )}
          </Pressable>
        </Pressable>
      );
    },
    [selectedTranslation, dlState, styles, glassScheme, onSelect, onClose, handleDownload, colors],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.sheet}>
        <View style={styles.grabber} />

        <View style={styles.header}>
          <Text style={styles.title}>Bible Version</Text>
          <Text style={styles.subtitle}>
            Tap to select · Download for offline reading
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator
            color={colors.primaryDark}
            style={{marginTop: spacing.xl}}
          />
        ) : translations.length === 0 ? (
          <Text style={styles.emptyText}>No versions available right now.</Text>
        ) : (
          <FlatList
            data={translations}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Modal>
  );
}

export default TranslationPickerModal;
