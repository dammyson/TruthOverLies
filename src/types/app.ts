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
