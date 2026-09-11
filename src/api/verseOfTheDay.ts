import request from './client';
import {ApiVerseOfTheDayEntry} from './types';

export function getVerseOfTheDay(date = new Date().toISOString().slice(0, 10)) {
  return request<ApiVerseOfTheDayEntry[]>(`/verse-of-the-day?date=${encodeURIComponent(date)}`);
}
