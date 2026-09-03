import React, {useMemo, useState} from 'react';
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

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

function ForgotPasswordScreen({navigation}: Props) {
  const {colors} = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<'error' | 'success'>('error');
  const {isTransitioning, runWithTransition} = useTransitionAction();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        backLink: {
          fontSize: 13,
          lineHeight: 20,
          color: colors.muted,
          textAlign: 'center',
          marginTop: 4,
        },
        backLinkBold: {
          color: colors.primaryDark,
          fontWeight: '700',
        },
      }),
    [colors],
  );

  const handleSend = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setTone('error');
      setMessage('Please enter your email address.');
      return;
    }
    runWithTransition(async () => {
      try {
        await authApi.forgotPassword(trimmed);
        setTone('success');
        setMessage('A reset code has been sent to your email.');
        navigation.navigate('ResetPassword', {email: trimmed});
      } catch (err: any) {
        setTone('error');
        setMessage(err?.message ?? 'Something went wrong. Please try again.');
      }
    });
  };

  return (
    <ScreenShell keyboardAware>
      <AuthCard
        title="Forgot Password"
        subtitle="Enter your email and we'll send you a reset code.">
        <MessageBanner message={message} tone={tone} />
        <FormField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          onChangeText={value => {
            setMessage('');
            setEmail(value);
          }}
          placeholder="you@example.com"
          value={email}
        />
        <PrimaryButton
          label="Reset"
          loading={isTransitioning}
          onPress={handleSend}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backLink}>
            Remember your password?{' '}
            <Text style={styles.backLinkBold}>Log in</Text>
          </Text>
        </Pressable>
      </AuthCard>
    </ScreenShell>
  );
}

export default ForgotPasswordScreen;
