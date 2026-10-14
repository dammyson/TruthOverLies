import React, {useMemo} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {useTheme} from '../context/ThemeContext';
import {radius, spacing} from '../theme/spacing';
import PrimaryButton from './PrimaryButton';
import {TERMS_SECTIONS} from '../constants/legal';

type TermsModalProps = {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
};

function TermsModal({visible, onClose, onAccept}: TermsModalProps) {
  const {colors} = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'flex-end',
        },
        sheet: {
          maxHeight: '85%',
          backgroundColor: colors.surface,
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xl,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.md,
        },
        title: {
          fontSize: 20,
          fontWeight: '700',
          color: colors.text,
        },
        close: {
          fontSize: 15,
          fontWeight: '600',
          color: colors.primaryDark,
        },
        heading: {
          fontSize: 15,
          fontWeight: '700',
          color: colors.text,
          marginTop: spacing.md,
          marginBottom: spacing.xs,
        },
        body: {
          fontSize: 14,
          lineHeight: 21,
          color: colors.muted,
        },
      }),
    [colors],
  );

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Terms & Conditions</Text>
            <Pressable accessibilityRole="button" hitSlop={10} onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {TERMS_SECTIONS.map(section => (
              <View key={section.heading}>
                <Text style={styles.heading}>{section.heading}</Text>
                <Text style={styles.body}>{section.body}</Text>
              </View>
            ))}
          </ScrollView>
          <PrimaryButton label="I Agree" onPress={onAccept} />
        </View>
      </View>
    </Modal>
  );
}

export default TermsModal;
