// auth.ts
import { storage } from '../services/storage';

interface AuthUser {
  id: number;
  email: string;
  role: 'EXPERT' | 'CUSTOMER';
  firstName: string;
  lastName: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  role: 'EXPERT' | 'CUSTOMER';
}

export const auth = {
  login: async (credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> => {
    try {
      console.log('Auth Service - login request:', credentials);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      console.log('Auth Service - login response status:', response.status);
      
      // Hata mesajını daha iyi görebilmek için
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Auth Service - login error response:', errorData);
        throw new Error(errorData.message || 'Giriş başarısız');
      }

      const data = await response.json();
      console.log('Auth Service - login success data:', data);
      
      // Store auth data in localStorage
      storage.setItem('user', JSON.stringify(data.user));
      storage.setItem('token', data.token);

      return data;
    } catch (error: any) {
      console.error('Auth Service - login error:', error);
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<{ user: AuthUser; token: string }> => {
    try {
      console.log('Auth Service - register request:', data);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Auth Service - register response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Auth Service - register error response:', errorData);
        throw new Error(errorData.message || 'Kayıt başarısız');
      }

      const responseData = await response.json();
      console.log('Auth Service - register success data:', responseData);
      
      // Store auth data in localStorage
      storage.setItem('user', JSON.stringify(responseData.user));
      storage.setItem('token', responseData.token);

      return responseData;
    } catch (error: any) {
      console.error('Auth Service - register error:', error);
      throw error;
    }
  },

  logout: (): void => {
    storage.removeItem('user');
    storage.removeItem('token');
  },

  getCurrentUser: (): AuthUser | null => {
    const userJson = storage.getItem('user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Auth Service - parsing user error:', e);
      return null;
    }
  },

  getToken: (): string | null => {
    return storage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!storage.getItem('token') && !!storage.getItem('user');
  },

  updateProfile: async (userId: number, profileData: Partial<AuthUser>): Promise<AuthUser> => {
    try {
      console.log('Auth Service - update profile request:', { userId, profileData });
      
      const token = auth.getToken();
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      
      console.log('Auth Service - update profile response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Auth Service - update profile error response:', errorData);
        throw new Error(errorData.message || 'Profil güncelleme başarısız');
      }

      const updatedUser = await response.json();
      console.log('Auth Service - update profile success data:', updatedUser);
      
      storage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      console.error('Auth Service - update profile error:', error);
      throw error;
    }
  },
  
  // Test endpoint - doğrudan API isteğini test etmek için
  testLoginAPI: async (email: string, password: string): Promise<any> => {
    try {
      console.log('Auth Service - TEST LOGIN:', { email, password });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Auth Service - TEST LOGIN status:', response.status);
      
      try {
        const responseData = await response.json();
        console.log('Auth Service - TEST LOGIN response:', responseData);
        return responseData;
      } catch (e) {
        console.error('Auth Service - TEST LOGIN parse error:', e);
        const text = await response.text();
        console.log('Auth Service - TEST LOGIN raw response:', text);
        return { error: 'Yanıt işlenemedi', text };
      }
    } catch (error: any) {
      console.error('Auth Service - TEST LOGIN error:', error);
      return { error: error.message };
    }
  }
};