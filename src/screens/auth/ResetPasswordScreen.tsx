import React, {useMemo, useRef, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
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
  const {email, otp} = route.params;
  const {colors} = useTheme();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<'error' | 'success'>('error');
  const {isTransitioning, runWithTransition} = useTransitionAction();
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        hint: {
          fontSize: 13,
          lineHeight: 18,
          color: colors.muted,
          marginBottom: 12,
        },
      }),
    [colors],
  );

  const handleReset = () => {
    if (newPassword.length < 8) {
      setTone('error');
      setMessage('Password must be at least 8 characters.');
      return;
    }
    runWithTransition(async () => {
      try {
        await authApi.resetPassword(email, otp, newPassword);
        setTone('success');
        setMessage('Password reset! Redirecting to login…');
        redirectTimer.current = setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } catch (err: any) {
        setTone('error');
        setMessage(err?.message ?? 'Something went wrong. Please try again.');
      }
    });
  };

  return (
    <ScreenShell keyboardAware>
      <AuthCard
        title="New Password"
        subtitle="Choose a strong password for your account.">
        <Text style={styles.hint}>Resetting password for {email}</Text>
        <MessageBanner message={message} tone={tone} />
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
      </AuthCard>
    </ScreenShell>
  );
}

export default ResetPasswordScreen;
