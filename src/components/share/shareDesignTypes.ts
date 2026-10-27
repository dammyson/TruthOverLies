import {ShareTheme} from '../../theme/feelingThemes';
import {ShareCardPayload} from '../../types/share';
import {ShareTextVariant} from './shareBackgroundCatalog';
import {ShareArrangementId} from './shareArrangementCatalog';

export const SHARE_CARD_WIDTH = 1080;
export const SHARE_CARD_HEIGHT = 1350;

/** JPEG quality for social sharing — keeps cards under ~1 MB. */
export const SHARE_CAPTURE_QUALITY = 0.88;

export type ShareArrangementProps = {
  payload: ShareCardPayload;
  theme: ShareTheme;
  scale: number;
  textVariant: ShareTextVariant;
};

export type ShareCardSelection = {
  backgroundId: string;
  arrangementId: ShareArrangementId;
};

export type ShareContent = {
  badgeLabel: string;
  devotionFeelings: string[];
  referenceLine: string;
  hasDevotion: boolean;
  hasMoment: boolean;
};

export function buildShareContent(payload: ShareCardPayload, theme: ShareTheme): ShareContent {
  // Feelings are private — never print them (or a feeling-derived badge) on a shared card
  const badgeLabel =
    payload.kind === 'devotion'
      ? 'DEVOTION'
      : payload.categoryName?.toUpperCase() ?? theme.badge;

  const devotionFeelings: string[] = [];

  const referenceLine =
    payload.kind === 'scripture' && payload.translation
      ? `${payload.reference} · ${payload.translation}`
      : payload.reference;

  return {
    badgeLabel,
    devotionFeelings,
    referenceLine,
    hasDevotion: payload.kind === 'devotion',
    hasMoment: payload.kind === 'scripture' && Boolean(payload.moment),
  };
}
