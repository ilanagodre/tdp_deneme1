// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../services/auth';

interface AuthUser {
  id: number;
  email: string;
  role: 'EXPERT' | 'CUSTOMER';
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ user: AuthUser; token: string }>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'EXPERT' | 'CUSTOMER';
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (userId: number, profileData: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // İlk yükleme sırasında kullanıcı bilgisini al
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = auth.getCurrentUser();
        console.log("AuthContext: Mevcut kullanıcı:", currentUser);
        setUser(currentUser);
      } catch (err) {
        console.error("AuthContext: Kullanıcı yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Giriş yapılıyor:', { email });
      
      // Doğrudan fetch ile login işlemi
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('AuthContext: Login yanıt durumu:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('AuthContext: Login hatası yanıtı:', errorData);
        throw new Error(errorData.message || 'Giriş başarısız');
      }
      
      const result = await response.json();
      console.log('AuthContext: Giriş başarılı, kullanıcı:', result.user);
      
      // Kullanıcı verisini locale kaydet
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      
      // Giriş başarılıysa kullanıcıyı state'e ayarla
      setUser(result.user);
      return result;
    } catch (err: any) {
      console.error('AuthContext: Giriş hatası:', err);
      const errorMessage = err?.message || 'Giriş başarısız';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'EXPERT' | 'CUSTOMER';
  }) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await auth.register(data);
      setUser(user);
    } catch (err: any) {
      setError(err?.message || 'Kayıt başarısız');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (userId: number, profileData: Partial<AuthUser>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await auth.updateProfile(userId, profileData);
      setUser(updatedUser);
    } catch (err: any) {
      setError(err?.message || 'Profil güncelleme başarısız');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};