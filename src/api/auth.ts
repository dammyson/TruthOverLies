import request from './client';
import {ApiAuthResponse, ApiUserProfile} from './types';

export function register(fullName: string, email: string, password: string) {
  return request<ApiAuthResponse>('/users/register', {
    method: 'POST',
    body: JSON.stringify({full_name: fullName, email, password}),
  });
}

export function login(email: string, password: string) {
  return request<ApiAuthResponse>('/users/login', {
    method: 'POST',
    body: JSON.stringify({email, password}),
  });
}

export function guestLogin() {
  return request<ApiAuthResponse>('/users/guest-login', {method: 'POST'});
}

export function getMe(token: string) {
  return request<ApiUserProfile>('/users/me', {}, token);
}

export function forgotPassword(email: string) {
  return request<void>('/users/forgot-password', {
    method: 'POST',
    body: JSON.stringify({email}),
  });
}

export function verifyOtp(email: string, otp: string) {
  return request<void>('/users/verify-otp', {
    method: 'POST',
    body: JSON.stringify({email, otp}),
  });
}

export function resetPassword(email: string, otp: string, newPassword: string) {
  return request<void>('/users/reset-password', {
    method: 'POST',
    body: JSON.stringify({email, otp, new_password: newPassword}),
  });
}
