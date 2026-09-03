import React, {useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import AuthCard from '../../components/AuthCard';
import FormField from '../../components/FormField';
import MessageBanner from '../../components/MessageBanner';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenShell from '../../components/ScreenShell';
import {useTheme} from '../../context/ThemeContext';
import useTransitionAction from '../../hooks/useTransitionAction';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import * as authApi from '../../api/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

function ResetPasswordScreen({navigation, route}: Props) {
  const {email} = route.params;
  const {colors} = useTheme();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<'error' | 'success'>('error');
  const {isTransitioning, runWithTransition} = useTransitionAction();
  const {isTransitioning: isResending, runWithTransition: runResend} =
    useTransitionAction();
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        emailHint: {
          fontSize: 13,
          lineHeight: 18,
          color: colors.muted,
          marginBottom: 12,
        },
        emailBold: {
          color: colors.text,
          fontWeight: '600',
        },
        resendRow: {
          fontSize: 13,
          lineHeight: 20,
          color: colors.muted,
          textAlign: 'center',
          marginTop: 4,
        },
        resendLink: {
          color: colors.primaryDark,
          fontWeight: '700',
        },
      }),
    [colors],
  );

  const handleReset = () => {
    if (!otp.trim()) {
      setTone('error');
      setMessage('Please enter the code sent to your email.');
      return;
    }
    if (newPassword.length < 8) {
      setTone('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }
    runWithTransition(async () => {
      try {
        await authApi.resetPassword(email, otp.trim(), newPassword);
        setTone('success');
        setMessage('Password reset! Redirecting to login…');
        redirectTimer.current = setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } catch (err: any) {
        setTone('error');
        setMessage(err?.message ?? 'Invalid code or the code has expired.');
      }
    });
  };

  const handleResend = () => {
    runResend(async () => {
      try {
        await authApi.forgotPassword(email);
        setTone('success');
        setMessage('A new code has been sent to your email.');
      } catch (err: any) {
        setTone('error');
        setMessage(err?.message ?? 'Could not resend code. Please try again.');
      }
    });
  };

  return (
    <ScreenShell keyboardAware>
      <AuthCard
        title="Reset Password"
        subtitle="Enter the code from your email and choose a new password.">
        <Text style={styles.emailHint}>
          Code sent to{' '}
          <Text style={styles.emailBold}>{email}</Text>
        </Text>
        <MessageBanner message={message} tone={tone} />
        <FormField
          keyboardType="number-pad"
          label="Reset Code"
          maxLength={6}
          onChangeText={value => {
            setMessage('');
            setOtp(value);
          }}
          placeholder="123456"
          value={otp}
        />
        <FormField
          label="New Password"
          onChangeText={value => {
            setMessage('');
            setNewPassword(value);
          }}
          placeholder="At least 8 characters"
          secureTextEntry
          value={newPassword}
        />
        <PrimaryButton
          label="Reset Password"
          loading={isTransitioning}
          onPress={handleReset}
        />
        <Pressable
          accessibilityRole="button"
          disabled={isResending}
          onPress={handleResend}>
          <Text style={styles.resendRow}>
            Didn't receive a code?{' '}
            <Text style={styles.resendLink}>
              {isResending ? 'Sending…' : 'Resend'}
            </Text>
          </Text>
        </Pressable>
      </AuthCard>
    </ScreenShell>
  );
}

export default ResetPasswordScreen;
