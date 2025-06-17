import axios from 'axios';

const API_URL = 'http://https://electrostore-ofl1.onrender.com/api';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  address: string;
  phone_number: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export interface UserProfile {
  token: any;
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  phone_number: string;
  is_active: boolean;
  role: string;
  date_joined: string;
}

// Tạo instance axios với interceptor để tự động thêm token
const api = axios.create({
  baseURL: API_URL
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login/`, data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register/`, data);
    return response.data;
  },

  async refreshToken(refresh: string): Promise<{ access: string }> {
    const response = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
    return response.data;
  },

  async getProfile(): Promise<UserProfile> {
    const response = await api.get(`${API_URL}/profile/me/`);
    return response.data;
  },

  // Hàm kiểm tra xem user có phải admin không
  async checkIsAdmin(): Promise<boolean> {
    try {
      const profile = await this.getProfile();
      return profile.role === 'ADMIN';
    } catch (error) {
      return false;
    }
  }
}; 