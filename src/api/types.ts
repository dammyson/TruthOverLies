// ── Feelings ────────────────────────────────────────────────────────────────

export type ApiFeelingItem = {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  created_at: string | null;
};

export type ApiUserFeelingResponse = {
  id: number;
  feeling_id: number | null;
  created_at: string;
};

// ── Word for Feeling ─────────────────────────────────────────────────────────

export type ApiWordForFeelingCard = {
  id: number;
  feeling_id: number | null;
  feeling: string;
  title: string;
  encouragement: string;
  verse: string;
  reference: string;
  created_at: string;
};

export type ApiRecommendationsResponse = {
  check_id: number;
  feeling_ids: number[];
  cards: ApiWordForFeelingCard[];
};

export type ApiSavedCard = {
  id: number | null;
  feeling_id: number | null;
  feeling: string;
  title: string;
  encouragement: string;
  verse: string;
  reference: string;
};

export type ApiSavedDevotionResponse = {
  id: number;
  check_id: number | null;
  feeling_ids: number[];
  cards: ApiSavedCard[];
  saved: boolean;
  created_at: string;
};

// ── Auth ─────────────────────────────────────────────────────────────────────

export type ApiAuthResponse = {
  id: number;
  email: string;
  full_name: string;
  auth_token: string;
};

export type ApiUserProfile = {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
