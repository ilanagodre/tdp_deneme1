// src/pages/login.tsx
import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Github, Linkedin, Facebook } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Lütfen geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const from = location.state?.from?.pathname || '/';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      setIsLoggingIn(true);
      
      console.log('Form gönderiliyor:', data);
      
      // Manuel olarak fetch isteği
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      });
      
      console.log('Yanıt durumu:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Giriş hatası yanıtı:', errorData);
        throw new Error(errorData.message || 'Giriş başarısız');
      }
      
      const result = await response.json();
      console.log('Giriş başarılı:', result);
      
      // LocalStorage'e kaydet
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      
      // Auth context'i güncelle
      setIsLoggingIn(false);
      
      // Yönlendirme yap
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login hatası:", err);
      setError(err?.message || 'Giriş başarısız oldu');
      setIsLoggingIn(false);
    }
  };
  
  const fillDemoUser = (type: 'customer' | 'expert' | 'customer2' | 'expert2') => {
    const user = type === 'customer'
      ? { email: 'customer@example.com', password: 'password123' }
      : type === 'expert'
      ? { email: 'expert@example.com', password: 'password123' }
      : type === 'customer2'
      ? { email: 'customer2@example.com', password: 'password123' }
      : { email: 'expert2@example.com', password: 'password123' };
    
    form.setValue('email', user.email);
    form.setValue('password', user.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-8 py-6 bg-white rounded-3xl shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">
            Login
          </h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="rounded-xl py-6"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-sm font-medium text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="rounded-xl py-6"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center mt-1">
                    <FormMessage className="text-sm font-medium text-red-500" />
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Şifremi Unuttum
                    </Link>
                  </div>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full rounded-xl py-6 text-lg font-medium" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 flex justify-center items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-md h-14 w-14">
            <Github className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-md h-14 w-14">
            <Linkedin className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-md h-14 w-14">
            <Facebook className="h-6 w-6" />
          </Button>
        </div>

        <div className="mt-10 flex justify-between items-center">
          <Button variant="link" className="text-muted-foreground">
            Help/Support
          </Button>
          <Link to="/register">
            <Button variant="link" className="text-primary font-medium">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;