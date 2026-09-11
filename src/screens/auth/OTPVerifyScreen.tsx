import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

import AuthCard from '../../components/AuthCard';
import GlassBackButton from '../../components/GlassBackButton';
import MessageBanner from '../../components/MessageBanner';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenShell from '../../components/ScreenShell';
import {useTheme} from '../../context/ThemeContext';
import useTransitionAction from '../../hooks/useTransitionAction';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import * as authApi from '../../api/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerify'>;

const OTP_LENGTH = 6;

function OTPVerifyScreen({navigation, route}: Props) {
  const {email} = route.params;
  const {colors} = useTheme();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<'error' | 'success'>('error');
  const {isTransitioning, runWithTransition} = useTransitionAction();
  const {isTransitioning: isResending, runWithTransition: runResend} =
    useTransitionAction();
  const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));

  const otp = digits.join('');

  const handleChange = useCallback((index: number, value: string) => {
    // Handle paste — if more than 1 char, distribute across boxes
    if (value.length > 1) {
      const chars = value.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
      const next = Array(OTP_LENGTH).fill('');
      chars.forEach((c, i) => { next[i] = c; });
      setDigits(next);
      const focusIndex = Math.min(chars.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    setDigits(prev => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    setMessage('');

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyPress = useCallback((index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      setDigits(prev => {
        const next = [...prev];
        next[index - 1] = '';
        return next;
      });
      inputRefs.current[index - 1]?.focus();
    }
  }, [digits]);

  const handleVerify = () => {
    if (otp.length < OTP_LENGTH) {
      setTone('error');
      setMessage('Please enter the full 6-digit code.');
      return;
    }
    runWithTransition(async () => {
      try {
        await authApi.verifyOtp(email, otp);
        navigation.navigate('ResetPassword', {email, otp});
      } catch (err: any) {
        setTone('error');
        setMessage(err?.message ?? 'Invalid or expired code. Please try again.');
        setDigits(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    });
  };

  const handleResend = () => {
    runResend(async () => {
      try {
        await authApi.forgotPassword(email);
        setTone('success');
        setMessage('A new code has been sent to your email.');
        setDigits(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      } catch (err: any) {
        setTone('error');
        setMessage(err?.message ?? 'Could not resend code. Please try again.');
      }
    });
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        emailHint: {
          fontSize: 13,
          lineHeight: 18,
          color: colors.muted,
          marginBottom: 16,
        },
        emailBold: {
          color: colors.text,
          fontWeight: '600',
        },
        boxRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        },
        box: {
          width: 44,
          height: 52,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
        },
        boxFilled: {
          borderColor: colors.primaryDark,
          backgroundColor: colors.backgroundAccent,
        },
        boxInput: {
          width: '100%',
          height: '100%',
          textAlign: 'center',
          fontSize: 22,
          fontWeight: '700',
          color: colors.text,
          padding: 0,
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
        backRow: {
          marginBottom: 12,
        },
      }),
    [colors],
  );

  return (
    <ScreenShell keyboardAware>
      <View style={styles.backRow}>
        <GlassBackButton onPress={() => navigation.goBack()} />
      </View>
      <AuthCard
        title="Enter Code"
        subtitle="Check your email for the 6-digit reset code.">
        <Text style={styles.emailHint}>
          Sent to <Text style={styles.emailBold}>{email}</Text>
        </Text>
        <MessageBanner message={message} tone={tone} />

        <View style={styles.boxRow}>
          {Array.from({length: OTP_LENGTH}).map((_, i) => (
            <View key={i} style={[styles.box, digits[i] ? styles.boxFilled : null]}>
              <TextInput
                ref={ref => { inputRefs.current[i] = ref; }}
                style={styles.boxInput}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                value={digits[i]}
                onChangeText={value => handleChange(i, value)}
                onKeyPress={({nativeEvent}) => handleKeyPress(i, nativeEvent.key)}
                selectTextOnFocus
                caretHidden
              />
            </View>
          ))}
        </View>

        <PrimaryButton
          label="Verify Code"
          loading={isTransitioning}
          onPress={handleVerify}
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

export default OTPVerifyScreen;
