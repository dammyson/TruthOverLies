import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {useTheme} from '../context/ThemeContext';
import {radius, spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

type WidgetGuideModalProps = {
  visible: boolean;
  onClose: () => void;
  verseText: string;
  verseReference: string;
};

// iOS doesn't let apps place widgets themselves, so we walk the user through it.
const STEPS = [
  'Go to your Home Screen and touch and hold an empty area until the apps jiggle.',
  'Tap Edit in the top-left corner, then tap Add Widget.',
  "Search for God's Place, pick a size, and tap Add Widget.",
];

function WidgetGuideModal({visible, onClose, verseText, verseReference}: WidgetGuideModalProps) {
  const {colors} = useTheme();
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(40);
      Animated.spring(translateY, {toValue: 0, friction: 8, tension: 70, useNativeDriver: true}).start();
    }
  }, [visible, translateY]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: 'rgba(20,14,10,0.55)',
          justifyContent: 'center',
          paddingHorizontal: spacing.lg,
        },
        card: {
          alignSelf: 'center',
          width: '100%',
          maxWidth: 380,
          backgroundColor: colors.surface,
          borderRadius: radius.xxl,
          padding: spacing.lg,
          shadowColor: colors.shadow,
          shadowOpacity: 0.25,
          shadowRadius: 24,
          shadowOffset: {width: 0, height: 12},
          elevation: 12,
        },
        preview: {
          borderRadius: radius.xl,
          padding: spacing.md,
          marginBottom: spacing.lg,
        },
        previewLabel: {
          fontSize: 11,
          fontWeight: '600',
          color: 'rgba(255,255,255,0.82)',
          marginBottom: spacing.xs,
        },
        previewVerse: {
          fontSize: 14,
          lineHeight: 20,
          fontWeight: '600',
          fontStyle: 'italic',
          color: '#FFFFFF',
        },
        previewRef: {
          marginTop: spacing.sm,
          fontSize: 12,
          fontWeight: '700',
          color: 'rgba(255,255,255,0.95)',
          textDecorationLine: 'underline',
        },
        title: {
          fontSize: 20,
          fontWeight: '700',
          color: colors.text,
          marginBottom: spacing.md,
        },
        stepRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: spacing.md - 4,
        },
        stepBadge: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.sm + 2,
          marginTop: 1,
        },
        stepBadgeText: {
          fontSize: 12,
          fontWeight: '700',
          color: colors.white,
        },
        stepText: {
          flex: 1,
          fontSize: 14,
          lineHeight: 21,
          color: colors.muted,
        },
        button: {
          marginTop: spacing.sm,
          minHeight: 50,
          borderRadius: radius.lg,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        buttonText: {
          ...typography.headline,
          color: colors.white,
        },
      }),
    [colors],
  );

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <Pressable onPress={onClose} style={styles.backdrop}>
        <Animated.View style={{transform: [{translateY}]}}>
          <Pressable onPress={() => {}} style={styles.card}>
            {/* Mini preview matching the real widget's look */}
            <LinearGradient
              colors={['#211714', '#4F3829', '#87663D']}
              end={{x: 1, y: 1}}
              start={{x: 0, y: 0}}
              style={styles.preview}>
              <Text style={styles.previewLabel}>Verse of the Day</Text>
              <Text numberOfLines={3} style={styles.previewVerse}>
                “{verseText}”
              </Text>
              <Text style={styles.previewRef}>{verseReference}</Text>
            </LinearGradient>

            <Text style={styles.title}>Add the widget</Text>
            {STEPS.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}

            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({pressed}) => [styles.button, pressed && {opacity: 0.85}]}>
              <Text style={styles.buttonText}>Got it</Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export default WidgetGuideModal;
