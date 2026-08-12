import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import AuthCard from '../../components/AuthCard';
import FormField from '../../components/FormField';
import MessageBanner from '../../components/MessageBanner';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenShell from '../../components/ScreenShell';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import useTransitionAction from '../../hooks/useTransitionAction';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

function LoginScreen({ navigation }: Props) {
  const {
    authMessage,
    authMessageTone,
    clearAuthMessage,
    login,
    loginAsGuest,
  } = useAppContext();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isTransitioning: isLoggingIn, runWithTransition: runLogin } =
    useTransitionAction();
  const { isTransitioning: isGuestLoading, runWithTransition: runGuest } =
    useTransitionAction();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        guestButton: {
          minHeight: 46,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surfaceStrong,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        },
        guestButtonDisabled: {
          opacity: 0.82,
        },
        guestButtonText: {
          fontSize: 14,
          lineHeight: 20,
          fontWeight: '700',
          color: colors.primaryDark,
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
      <AuthCard subtitle="Log in to continue." title="Welcome Back">
        <MessageBanner message={authMessage} tone={authMessageTone} />
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
          placeholder="••••••••"
          secureTextEntry
          value={password}
        />
        <PrimaryButton
          label="Log In"
          loading={isLoggingIn}
          onPress={() => {
            runLogin(() => login(email, password));
          }}
        />
        <Pressable
          accessibilityRole="button"
          disabled={isGuestLoading}
          onPress={() => {
            runGuest(() => loginAsGuest());
          }}
          style={[
            styles.guestButton,
            isGuestLoading ? styles.guestButtonDisabled : null,
          ]}
        >
          {isGuestLoading ? (
            <ActivityIndicator color={colors.primaryDark} />
          ) : (
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text style={styles.footerLink}>Sign up</Text>
          </Text>
        </Pressable>
      </AuthCard>
    </ScreenShell>
  );
}

export default LoginScreen;
