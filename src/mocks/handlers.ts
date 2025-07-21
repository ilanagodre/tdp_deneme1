// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

// Doğrudan sabit kullanıcılar tanımla - JSON okuma sorunlarını aşmak için
const MOCK_USERS = [
  {
    id: 1,
    email: "customer@example.com",
    password: "password123",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    role: "CUSTOMER",
    company: "ABC Şirketi"
  },
  {
    id: 2,
    email: "expert@example.com",
    password: "password123",
    firstName: "Ayşe",
    lastName: "Demir",
    role: "EXPERT",
    expertise: ["Yazılım", "Veri Bilimi"]
  },
  {
    id: 3,
    email: "customer2@example.com",
    password: "password123",
    firstName: "Mehmet",
    lastName: "Kaya",
    role: "CUSTOMER",
    company: "XYZ Holding"
  },
  {
    id: 4,
    email: "expert2@example.com",
    password: "password123",
    firstName: "Zeynep",
    lastName: "Şahin",
    role: "EXPERT",
    expertise: ["UI/UX Tasarım", "Mobil Uygulama Geliştirme"]
  }
];

// Define the base URL for API endpoints
const BASE_URL = '/api';

// Active users with tokens - token sahibi kullanıcılar
const activeUsers = [];

// Generate token for user
const generateToken = (user) => {
  return `mock-jwt-token-${user.role.toLowerCase()}-${user.id}`;
};

export const handlers = [
  // Login handler
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    try {
      const body = await request.json();
      console.log('[MSW] Login isteği alındı:', body);
      const { email, password } = body;
      
      if (!email || !password) {
        console.error('[MSW] Eksik veri:', { email, password });
        return HttpResponse.json(
          { message: 'E-posta ve şifre gereklidir' },
          { status: 400 }
        );
      }
      
      // Kullanıcıyı bul
      console.log('[MSW] Kullanıcı aranıyor:', email);
      const user = MOCK_USERS.find(u => u.email === email);
      console.log('[MSW] Bulunan kullanıcı:', user);
      
      if (!user) {
        console.error('[MSW] Kullanıcı bulunamadı:', email);
        return HttpResponse.json(
          { message: 'Geçersiz e-posta veya şifre' },
          { status: 401 }
        );
      }

      if (user.password !== password) {
        console.error('[MSW] Şifre eşleşmiyor');
        return HttpResponse.json(
          { message: 'Geçersiz e-posta veya şifre' },
          { status: 401 }
        );
      }

      // Token oluştur
      const { password: _, ...userWithoutPassword } = user;
      const token = generateToken(user);
      
      const responseData = {
        user: userWithoutPassword,
        token
      };
      
      console.log('[MSW] Login başarılı, yanıt:', responseData);
      
      return HttpResponse.json(responseData, { status: 200 });
    } catch (error) {
      console.error('[MSW] Login işlemi hatası:', error);
      return HttpResponse.json(
        { message: 'İşlem sırasında bir hata oluştu' },
        { status: 500 }
      );
    }
  }),

  // Register handler
  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    try {
      const body = await request.json();
      console.log('[MSW] Kayıt isteği alındı:', body);
      
      // Gerekli alanları kontrol et
      if (!body.email || !body.password || !body.firstName || !body.lastName || !body.role) {
        return HttpResponse.json(
          { message: 'Tüm gerekli alanlar doldurulmalıdır' },
          { status: 400 }
        );
      }
      
      // E-posta kontrolü
      if (MOCK_USERS.some(u => u.email === body.email)) {
        return HttpResponse.json(
          { message: 'Bu e-posta adresi zaten kayıtlı' },
          { status: 400 }
        );
      }
      
      // Yeni kullanıcı oluştur
      const newId = Math.max(...MOCK_USERS.map(u => u.id)) + 1;
      const newUser = {
        id: newId,
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
        ...(body.role === 'CUSTOMER' ? { company: body.company || 'Belirtilmedi' } : {}),
        ...(body.role === 'EXPERT' ? { expertise: body.expertise || [] } : {})
      };
      
      MOCK_USERS.push(newUser);
      
      // Yanıt için kullanıcı verisi
      const { password: _, ...userWithoutPassword } = newUser;
      const token = generateToken(newUser);
      
      return HttpResponse.json(
        { user: userWithoutPassword, token },
        { status: 201 }
      );
    } catch (error) {
      console.error('[MSW] Kayıt işlemi hatası:', error);
      return HttpResponse.json(
        { message: 'İşlem sırasında bir hata oluştu' },
        { status: 500 }
      );
    }
  }),

  // Get user profile
  http.get(`${BASE_URL}/users/profile`, ({ request }) => {
    try {
      const authHeader = request.headers.get('Authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { message: 'Yetkilendirme başarısız' },
          { status: 401 }
        );
      }

      const token = authHeader.split(' ')[1];
      // Token'dan kullanıcı ID'sini çıkar
      const tokenParts = token.split('-');
      const userId = parseInt(tokenParts[tokenParts.length - 1]);
      
      const user = MOCK_USERS.find(u => u.id === userId);
      
      if (!user) {
        return HttpResponse.json(
          { message: 'Kullanıcı bulunamadı' },
          { status: 401 }
        );
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      return HttpResponse.json(
        { user: userWithoutPassword },
        { status: 200 }
      );
    } catch (error) {
      console.error('[MSW] Profil getirme hatası:', error);
      return HttpResponse.json(
        { message: 'İşlem sırasında bir hata oluştu' },
        { status: 500 }
      );
    }
  })
];