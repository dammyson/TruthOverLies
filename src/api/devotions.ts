import request from './client';
import {ApiRecommendationsResponse, ApiSavedDevotionResponse} from './types';

export function getRecommendations(feelingIds: number[], token: string) {
  return request<ApiRecommendationsResponse>('/word-for-feeling/recommendations', {
    method: 'POST',
    body: JSON.stringify(feelingIds),
  }, token);
}

export function saveDevotionCheck(checkId: number, token: string) {
  return request<ApiSavedDevotionResponse>('/word-for-feeling/saved', {
    method: 'POST',
    body: JSON.stringify({check_id: checkId}),
  }, token);
}

export function getSavedDevotions(token: string) {
  return request<ApiSavedDevotionResponse[]>('/word-for-feeling/saved', {}, token);
}
