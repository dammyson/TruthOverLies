import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ViewShot, {captureRef} from 'react-native-view-shot';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Line, Path} from 'react-native-svg';

import ShareColorPicker from './ShareColorPicker';
import ShareArrangementPicker from './ShareArrangementPicker';
import ShareBackgroundPicker from './ShareBackgroundPicker';
import {defaultShareSelection} from './shareBackgroundDefaults';
import {CUSTOM_BACKGROUND_ID, getShareBackground} from './shareBackgroundCatalog';
import {getShareArrangement, ShareArrangementId} from './shareArrangementCatalog';
import {
  defaultColorPaletteForPayload,
  resolveShareTheme,
} from './shareColorCatalog';
import ShareCardCanvas from './ShareCardCanvas';
import {
  SHARE_CAPTURE_QUALITY,
  SHARE_CARD_HEIGHT,
  SHARE_CARD_WIDTH,
} from './shareDesignTypes';
import {useTheme} from '../../context/ThemeContext';
import {ShareCardPayload} from '../../types/share';
import {typography} from '../../theme/typography';
import {radius, spacing} from '../../theme/spacing';
import {pickShareCustomPhoto} from './sharePickCustomPhoto';

const SCREEN = Dimensions.get('window');
const PREVIEW_WIDTH = SCREEN.width - spacing.lg * 2;
const PREVIEW_SCALE = PREVIEW_WIDTH / SHARE_CARD_WIDTH;
const PREVIEW_HEIGHT = SHARE_CARD_HEIGHT * PREVIEW_SCALE;

function ShareSheetIcon({color = '#FFFDF5', size = 20}: {color?: string; size?: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 6l-4-4-4 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="12" y1="2" x2="12" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

type Props = {
  visible: boolean;
  payload: ShareCardPayload | null;
  onClose: () => void;
};

function ShareCardSheet({visible, payload, onClose}: Props) {
  const {colors} = useTheme();
  const shotRef = useRef<React.ElementRef<typeof ViewShot>>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [backgroundId, setBackgroundId] = useState('gradient');
  const [colorPaletteId, setColorPaletteId] = useState('classic');
  const [arrangementId, setArrangementId] = useState<ShareArrangementId>('classic');
  const [customPhotoUri, setCustomPhotoUri] = useState<string | null>(null);
  const [captureKey, setCaptureKey] = useState(0);

  const pickerColors = {
    text: colors.text,
    muted: colors.muted,
    primaryDark: colors.primaryDark,
    border: colors.border,
    surface: colors.surface,
  };

  const shareTheme = useMemo(() => {
    if (!payload) return null;
    return resolveShareTheme(payload, colorPaletteId);
  }, [payload, colorPaletteId]);

  const feelingLabel =
    payload?.kind === 'devotion' && payload.feelings.length > 0
      ? payload.feelings.join(' · ')
      : null;

  const reset = useCallback(() => {
    setPreviewUri(null);
    setIsCapturing(false);
    setIsSharing(false);
    setBackgroundId('gradient');
    setColorPaletteId('classic');
    setArrangementId('classic');
    setCustomPhotoUri(null);
    setCaptureKey(0);
  }, []);

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  useEffect(() => {
    if (!visible || !payload) return;
    const defaults = defaultShareSelection(payload);
    setBackgroundId(defaults.backgroundId);
    setArrangementId(defaults.arrangementId);
    setColorPaletteId(defaultColorPaletteForPayload(payload));
    setCaptureKey(k => k + 1);
  }, [visible, payload]);

  useEffect(() => {
    if (!visible || !payload) return;

    let cancelled = false;
    setIsCapturing(true);
    setPreviewUri(null);

    const timer = setTimeout(async () => {
      try {
        const uri = await captureRef(shotRef, {
          format: 'jpg',
          quality: SHARE_CAPTURE_QUALITY,
          result: 'tmpfile',
        });
        if (!cancelled) {
          setPreviewUri(uri);
        }
      } catch {
        if (!cancelled) {
          Alert.alert('Could not create image', 'Please try again.');
          onClose();
        }
      } finally {
        if (!cancelled) {
          setIsCapturing(false);
        }
      }
    }, backgroundId === CUSTOM_BACKGROUND_ID && customPhotoUri ? 650 : 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [visible, payload, backgroundId, colorPaletteId, arrangementId, customPhotoUri, captureKey, onClose]);

  const bumpCapture = () => setCaptureKey(k => k + 1);

  const handleSelectBackground = (id: string) => {
    if (id === backgroundId) return;
    setBackgroundId(id);
    bumpCapture();
  };

  const handlePickCustomPhoto = async () => {
    const uri = await pickShareCustomPhoto();
    if (!uri) return;

    try {
      await Image.prefetch(uri);
    } catch {
      // Local file URIs may still render without prefetch.
    }

    setCustomPhotoUri(uri);
    setBackgroundId(CUSTOM_BACKGROUND_ID);
    bumpCapture();
  };

  const handleSelectColor = (id: string) => {
    if (id === colorPaletteId) return;
    setColorPaletteId(id);
    bumpCapture();
  };

  const handleSelectArrangement = (id: ShareArrangementId) => {
    if (id === arrangementId) return;
    setArrangementId(id);
    bumpCapture();
  };

  const handleShare = async () => {
    if (!previewUri || !payload) return;
    setIsSharing(true);
    try {
      const title =
        payload.kind === 'devotion' ? payload.title : payload.reference;
      const shareUri = Platform.OS === 'ios' ? previewUri : `file://${previewUri}`;
      const result = await Share.share(
        Platform.select({
          ios: {url: shareUri, message: `${title} — TruthOverLies`},
          default: {message: `${title} — TruthOverLies`, url: shareUri},
        })!,
      );
      if (result.action === Share.sharedAction) {
        onClose();
      }
    } catch {
      Alert.alert('Share failed', 'Could not open the share sheet.');
    } finally {
      setIsSharing(false);
    }
  };

  const bgLabel = getShareBackground(backgroundId).label;
  const arrLabel = getShareArrangement(arrangementId).label;
  const shareReady = Boolean(previewUri) && !isCapturing;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />

        <View style={[styles.sheet, {backgroundColor: colors.background}]}>
          <View style={styles.header}>
            <View style={[styles.handle, {backgroundColor: colors.border}]} />
            <View style={styles.titleRow}>
              <Text style={[styles.title, {color: colors.text}]}>Share this word</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                hitSlop={12}
                style={({pressed}) => [
                  styles.closeBtn,
                  {backgroundColor: colors.surface, borderColor: colors.border},
                  pressed && {opacity: 0.7},
                ]}>
                <Text style={[styles.closeIcon, {color: colors.muted}]}>✕</Text>
              </Pressable>
            </View>
            <Text style={[styles.subtitle, {color: colors.muted}]}>
              Customize your card, then share it anywhere.
            </Text>
          </View>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.sheetContent}>
            <ShareColorPicker
              selectedId={colorPaletteId}
              onSelect={handleSelectColor}
              payload={payload}
              colors={pickerColors}
            />

            <ShareBackgroundPicker
              selectedId={backgroundId}
              onSelect={handleSelectBackground}
              onPickCustomPhoto={handlePickCustomPhoto}
              customPhotoUri={customPhotoUri}
              theme={shareTheme}
              colors={pickerColors}
            />

            <ShareArrangementPicker
              selectedId={arrangementId}
              onSelect={handleSelectArrangement}
              colors={pickerColors}
            />

            <Text style={[styles.previewLabel, {color: colors.muted}]}>
              Preview · {bgLabel} · {arrLabel}
              {feelingLabel ? ` · ${feelingLabel}` : ''}
            </Text>

            <View style={[styles.previewFrame, {height: PREVIEW_HEIGHT}]}>
              {isCapturing ? (
                <View style={[styles.loadingBox, {backgroundColor: colors.surface}]}>
                  <ActivityIndicator color={colors.primaryDark} size="large" />
                  <Text style={[styles.loadingText, {color: colors.muted}]}>
                    Creating your card…
                  </Text>
                </View>
              ) : previewUri ? (
                <Image
                  source={{uri: previewUri}}
                  style={{width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT, borderRadius: radius.lg}}
                  resizeMode="contain"
                />
              ) : null}
            </View>
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={shareReady ? 'Share to apps' : 'Preparing card'}
            accessibilityState={{disabled: !shareReady || isSharing}}
            disabled={!shareReady || isSharing}
            onPress={handleShare}
            style={({pressed}) => [
              styles.fab,
              {shadowColor: colors.shadow},
              (!shareReady || isSharing) && styles.fabDisabled,
              pressed && shareReady && !isSharing && styles.fabPressed,
            ]}>
            <LinearGradient
              colors={
                shareReady && !isSharing
                  ? [colors.primaryDark, colors.primary]
                  : [colors.border, colors.muted]
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.fabGradient}>
              {isSharing || isCapturing ? (
                <ActivityIndicator color="#FFFDF5" size="small" />
              ) : (
                <ShareSheetIcon color="#FFFDF5" size={22} />
              )}
            </LinearGradient>
          </Pressable>
        </View>

        {payload ? (
          <View style={styles.offscreen} pointerEvents="none">
            <ViewShot
              ref={shotRef}
              options={{format: 'jpg', quality: SHARE_CAPTURE_QUALITY}}>
              <ShareCardCanvas
                payload={payload}
                backgroundId={backgroundId}
                colorPaletteId={colorPaletteId}
                arrangementId={arrangementId}
                customPhotoUri={customPhotoUri}
                scale={1}
              />
            </ViewShot>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    maxHeight: SCREEN.height * 0.92,
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  scroll: {
    flexShrink: 1,
  },
  sheetContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + 56,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  title: {
    ...typography.title2,
    fontWeight: '700',
    flex: 1,
  },
  subtitle: {
    ...typography.subhead,
    marginTop: spacing.xs,
  },
  previewLabel: {
    ...typography.caption1,
    fontWeight: '700',
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  previewFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBox: {
    width: PREVIEW_WIDTH,
    flex: 1,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.subhead,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 52,
    height: 52,
    borderRadius: 26,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 6,
  },
  fabGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabDisabled: {
    opacity: 0.72,
  },
  fabPressed: {
    opacity: 0.88,
    transform: [{scale: 0.96}],
  },
  offscreen: {
    position: 'absolute',
    left: -SHARE_CARD_WIDTH - 100,
    top: 0,
    opacity: 1,
  },
});

export default ShareCardSheet;
