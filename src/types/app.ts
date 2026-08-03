export type AuthMessageTone = 'error' | 'success';

export type AuthUser = {
  fullName: string;
  email: string;
  password: string;
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