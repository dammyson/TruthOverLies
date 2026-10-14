import React, {useMemo} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {useTheme} from '../context/ThemeContext';
import {radius, spacing} from '../theme/spacing';
import PrimaryButton from './PrimaryButton';

type TermsModalProps = {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
};

const TERMS_SECTIONS: {heading: string; body: string}[] = [
  {
    heading: '1. Acceptance of Terms',
    body: "By creating an account or using God's Place, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the app.",
  },
  {
    heading: '2. Your Account',
    body: 'You are responsible for keeping your login details secure and for all activity that occurs under your account. Please provide accurate information when registering.',
  },
  {
    heading: '3. Use of the App',
    body: 'You agree to use the app for personal, non-commercial devotional purposes and not to misuse, disrupt, or attempt to gain unauthorised access to the service.',
  },
  {
    heading: '4. Your Content',
    body: 'Journal entries, sermon notes, highlights and other content you create remain yours. You grant us permission to store and process this content solely to provide the service to you.',
  },
  {
    heading: '5. Privacy',
    body: 'We collect only the information needed to run the app, such as your name and email address. We do not sell your personal information to third parties.',
  },
  {
    heading: '6. Scripture Content',
    body: 'Bible translations provided in the app are subject to the copyright and licensing terms of their respective publishers.',
  },
  {
    heading: '7. Termination',
    body: 'You may delete your account at any time. We may suspend or terminate accounts that violate these terms.',
  },
  {
    heading: '8. Changes to These Terms',
    body: 'We may update these terms from time to time. Continued use of the app after changes are made means you accept the updated terms.',
  },
];

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
