// src/components/layout/DashboardLayout.tsx
import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Talent Discovery Platform</h1>
            <span className="text-muted-foreground">
              {user.role === 'EXPERT' ? 'Expert Dashboard' : 'Customer Dashboard'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <nav>
              <ul className="flex items-center space-x-6">
                <li>
                  <Button variant="link" asChild>
                    <Link to="/profile">Profile</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild>
                    <Link to="/experts">Find Experts</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild>
                    <Link to="/projects">{user.role === 'CUSTOMER' ? 'My Projects' : 'Browse Projects'}</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="link" asChild>
                    <Link to="/qa">Q&A</Link>
                  </Button>
                </li>
              </ul>
            </nav>
            <LanguageSwitcher />
            <span className="text-sm">
              {user.firstName} {user.lastName}
            </span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};