export type AuthMessageTone = 'error' | 'success';

export type FeelingItem = {
  id: number;
  name: string;
  category: string;
  subcategory: string;
};

export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
};

export type FeelingOption =
  | 'Anxious'
  | 'Grateful'
  | 'Lonely'
  | 'Hopeful'
  | 'Tired'
  | 'Confused'
  | 'Joyful'
  | 'Heavy';

export type DevotionCard = {
  id: string;
  title: string;
  encouragement: string;
  verse: string;
  reference: string;
  feelings: FeelingOption[];
};

export type ScriptureCategory = {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: string;
};

export type Journal = {
  id: number;
  entryText: string;
  feelingId: number | null;
  struggle: string | null;
  savedScriptureId: number | null;
  createdAt: string;
};

export type SavedScripture = {
  id: number;
  categoryId: number | null;
  categoryName: string | null;
  categoryColor: string | null;
  translation: string;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd: number | null;
  reference: string;
  verseText: string | null;
  moment: string | null;
  createdAt: string;
};
