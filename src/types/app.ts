export type AuthMessageTone = 'error' | 'success';

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
