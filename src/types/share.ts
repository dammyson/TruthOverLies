import {DevotionCard, FeelingOption, SavedScripture} from './app';

export type ShareCardPayload =
  | {
      kind: 'devotion';
      title: string;
      encouragement: string;
      verse: string;
      reference: string;
      feelings: FeelingOption[];
    }
  | {
      kind: 'scripture';
      verse: string;
      reference: string;
      translation?: string;
      moment?: string | null;
      categoryName?: string | null;
      accentColor?: string | null;
    };

export function sharePayloadFromDevotion(card: DevotionCard): ShareCardPayload {
  return {
    kind: 'devotion',
    title: card.title,
    encouragement: card.encouragement,
    verse: card.verse,
    reference: card.reference,
    feelings: card.feelings,
  };
}

export function sharePayloadFromScripture(scripture: SavedScripture): ShareCardPayload {
  return {
    kind: 'scripture',
    verse: scripture.verseText ?? '',
    reference: scripture.reference,
    translation: scripture.translation,
    moment: scripture.moment,
    categoryName: scripture.categoryName,
    accentColor: scripture.categoryColor,
  };
}
