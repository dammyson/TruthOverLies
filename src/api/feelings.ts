import request from './client';
import {ApiFeelingItem, ApiUserFeelingResponse} from './types';

export function getFeelingsCatalog(token: string) {
  return request<ApiFeelingItem[]>('/feelings-catalog', {}, token);
}

export function logUserFeeling(feelingId: number, token: string) {
  return request<ApiUserFeelingResponse>('/user-feelings', {
    method: 'POST',
    body: JSON.stringify({feeling_id: feelingId}),
  }, token);
}

export function getUserFeelings(token: string) {
  return request<ApiUserFeelingResponse[]>('/user-feelings', {}, token);
}
