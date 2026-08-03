import React, {useState} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import AuthCard from '../../components/AuthCard';
import FormField from '../../components/FormField';
import MessageBanner from '../../components/MessageBanner';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenShell from '../../components/ScreenShell';
import {useAppContext} from '../../context/AppContext';
import useTransitionAction from '../../hooks/useTransitionAction';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {colors} from '../../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

function SignupScreen({navigation}: Props) {
  const {authMessage, authMessageTone, clearAuthMessage, signup} = useAppContext();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {isTransitioning, runWithTransition} = useTransitionAction();

  return (
    <ScreenShell keyboardAware>
      <AuthCard
        subtitle="Join God's Place to begin your devotional journey."
        title="Create Account">
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
        <PrimaryButton
          label="Create Account"
          loading={isTransitioning}
          onPress={() => {
            runWithTransition(() => {
              signup(fullName, email, password);
            });
          }}
        />
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Log in</Text>
          </Text>
        </Pressable>
      </AuthCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  footerText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
  },
  footerLink: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
});

export default SignupScreen;