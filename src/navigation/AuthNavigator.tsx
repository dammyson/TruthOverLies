import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OTPVerifyScreen from '../screens/auth/OTPVerifyScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import {colors} from '../theme/colors';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  OTPVerify: {email: string};
  ResetPassword: {email: string; otp: string};
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen component={LoginScreen} name="Login" />
      <Stack.Screen component={SignupScreen} name="Signup" />
      <Stack.Screen component={ForgotPasswordScreen} name="ForgotPassword" />
      <Stack.Screen component={OTPVerifyScreen} name="OTPVerify" />
      <Stack.Screen component={ResetPasswordScreen} name="ResetPassword" />
    </Stack.Navigator>
  );
}

export default AuthNavigator;