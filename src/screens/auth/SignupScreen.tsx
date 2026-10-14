import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AuthCard from '../../components/AuthCard';
import FormField from '../../components/FormField';
import MessageBanner from '../../components/MessageBanner';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenShell from '../../components/ScreenShell';
import TermsModal from '../../components/TermsModal';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import useTransitionAction from '../../hooks/useTransitionAction';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

function SignupScreen({ navigation }: Props) {
  const { authMessage, authMessageTone, clearAuthMessage, signup } =
    useAppContext();
  const { colors } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const { isTransitioning, runWithTransition } = useTransitionAction();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        termsRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 4,
        },
        radioOuter: {
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        },
        radioInner: {
          width: 11,
          height: 11,
          borderRadius: 6,
          backgroundColor: colors.primary,
        },
        termsText: {
          flex: 1,
          fontSize: 13,
          lineHeight: 20,
          color: colors.muted,
        },
        footerText: {
          fontSize: 13,
          lineHeight: 20,
          color: colors.muted,
          textAlign: 'center',
        },
        footerLink: {
          color: colors.primaryDark,
          fontWeight: '700',
        },
      }),
    [colors],
  );

  return (
    <ScreenShell keyboardAware>
      <AuthCard
        subtitle="Join God's Place to begin your devotional journey."
        title="Create Account"
      >
        <MessageBanner message={authMessage} tone={authMessageTone} />
        <FormField
          label="Full Name"
          onChangeText={value => {
            clearAuthMessage();
            setFullName(value);
          }}
          placeholder="Your name"
          value={fullName}
        />
        <FormField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          onChangeText={value => {
            clearAuthMessage();
            setEmail(value);
          }}
          placeholder="you@example.com"
          value={email}
        />
        <FormField
          label="Password"
          onChangeText={value => {
            clearAuthMessage();
            setPassword(value);
          }}
          placeholder="Create a password"
          secureTextEntry
          value={password}
        />
        <FormField
          label="Confirm Password"
          onChangeText={value => {
            clearAuthMessage();
            setConfirmPassword(value);
          }}
          placeholder="Re-enter your password"
          secureTextEntry
          value={confirmPassword}
        />
        <View style={styles.termsRow}>
          <Pressable
            accessibilityLabel="Accept Terms and Conditions"
            accessibilityRole="radio"
            accessibilityState={{ checked: acceptedTerms }}
            hitSlop={8}
            onPress={() => setAcceptedTerms(prev => !prev)}
            style={styles.radioOuter}
          >
            {acceptedTerms ? <View style={styles.radioInner} /> : null}
          </Pressable>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text
              onPress={() => setTermsVisible(true)}
              style={styles.footerLink}
            >
              Terms & Conditions
            </Text>
          </Text>
        </View>
        <PrimaryButton
          disabled={!acceptedTerms}
          label="Create Account"
          loading={isTransitioning}
          onPress={() => {
            runWithTransition(() => signup(fullName, email, password, confirmPassword));
          }}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.footerLink}>Log in</Text>
          </Text>
        </Pressable>
      </AuthCard>
      <TermsModal
        onAccept={() => {
          setAcceptedTerms(true);
          setTermsVisible(false);
        }}
        onClose={() => setTermsVisible(false)}
        visible={termsVisible}
      />
    </ScreenShell>
  );
}

export default SignupScreen;
