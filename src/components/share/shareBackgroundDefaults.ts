import {FeelingOption} from '../../types/app';
import {ShareCardPayload} from '../../types/share';
import {ShareCardSelection} from './shareDesignTypes';

const FEELING_DEFAULTS: Record<FeelingOption, ShareCardSelection> = {
  Anxious: {backgroundId: 'starlight', arrangementId: 'classic'},
  Grateful: {backgroundId: 'gradient', arrangementId: 'side-accent'},
  Lonely: {backgroundId: 'starlight', arrangementId: 'framed'},
  Hopeful: {backgroundId: 'glow', arrangementId: 'classic'},
  Tired: {backgroundId: 'gradient', arrangementId: 'side-accent'},
  Confused: {backgroundId: 'starlight', arrangementId: 'framed'},
  Joyful: {backgroundId: 'glow', arrangementId: 'bold-center'},
  Heavy: {backgroundId: 'gradient', arrangementId: 'bold-center'},
};

const SCRIPTURE_DEFAULTS: ShareCardSelection[] = [
  {backgroundId: 'gradient', arrangementId: 'framed'},
  {backgroundId: 'gradient', arrangementId: 'side-accent'},
  {backgroundId: 'glow', arrangementId: 'classic'},
  {backgroundId: 'gradient', arrangementId: 'bold-center'},
  {backgroundId: 'starlight', arrangementId: 'classic'},
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function payloadSeed(payload: ShareCardPayload): number {
  const parts =
    payload.kind === 'devotion'
      ? [payload.title, payload.reference, ...payload.feelings]
      : [payload.reference, payload.categoryName ?? '', payload.translation ?? ''];
  return hashString(parts.join('|'));
}

/** Picks sensible defaults when the share sheet opens. */
export function defaultShareSelection(payload: ShareCardPayload): ShareCardSelection {
  if (payload.kind === 'devotion') {
    const primary = payload.feelings[0];
    if (primary && FEELING_DEFAULTS[primary]) {
      return FEELING_DEFAULTS[primary];
    }
  }

  return SCRIPTURE_DEFAULTS[payloadSeed(payload) % SCRIPTURE_DEFAULTS.length];
}
