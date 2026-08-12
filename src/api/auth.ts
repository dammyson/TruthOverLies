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
