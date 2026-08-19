export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role_id: number;
  role: Role;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  telephone?: string;
  password: string;
  password_confirmation: string;
}
