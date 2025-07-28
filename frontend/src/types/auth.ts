export interface FormData {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  id: number;
  username: string;
  token: string;
  isAdmin: boolean;
}

export interface RegisterResponse {
  message: string;
  id: number;
  username: string;
} 