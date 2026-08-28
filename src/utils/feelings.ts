import {FeelingOption} from '../types/app';

export const FEELING_OPTIONS: FeelingOption[] = [
  'Anxious',
  'Grateful',
  'Lonely',
  'Hopeful',
  'Tired',
  'Confused',
  'Joyful',
  'Heavy',
];

export function parseFeelingName(name?: string | null): FeelingOption | null {
  if (!name?.trim()) return null;
  const normalized = name.trim().toLowerCase();
  return FEELING_OPTIONS.find(f => f.toLowerCase() === normalized) ?? null;
}

export function parseFeelingNames(names: Array<string | null | undefined>): FeelingOption[] {
  const seen = new Set<FeelingOption>();
  const result: FeelingOption[] = [];
  for (const name of names) {
    const feeling = parseFeelingName(name);
    if (feeling && !seen.has(feeling)) {
      seen.add(feeling);
      result.push(feeling);
    }
  }
  return result;
}

export function feelingsFromIds(
  ids: number[],
  catalog: Array<{id: number; name: string}>,
): FeelingOption[] {
  return parseFeelingNames(ids.map(id => catalog.find(item => item.id === id)?.name));
}
