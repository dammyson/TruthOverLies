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
