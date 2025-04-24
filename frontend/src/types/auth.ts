export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  csrfToken?: string; // Optional, in case it comes in response body instead of headers
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password1: string;
  password2: string; // Confirm password field
  first_name: string;
  last_name: string;
}
