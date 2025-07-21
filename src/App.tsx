// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import QAPage from './pages/qa';
import QuestionDetailPage from './pages/qa/[id]';
import { AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Button } from './components/ui/button';
import { useAuth } from './contexts/AuthContext';
import { ProfilePage } from './pages/profile';
import ExpertsPage from './pages/experts';
import ProjectsPage from './pages/projects';
import NewProjectPage from './pages/projects/new';
import ProjectDetailPage from './pages/projects/[id]';
import "./App.css";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Landing page component
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 p-8">
      <h1 className="text-4xl font-bold text-center">
        Welcome to Talent Discovery Platform
      </h1>
      <p className="text-xl text-center text-muted-foreground max-w-2xl">
        Connect with expert professionals or find exciting projects to work on.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate('/login')}>Login</Button>
        <Button variant="outline" onClick={() => navigate('/register')}>
          Register
        </Button>
      </div>
    </div>
  );
};

// Dashboard placeholder
const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6 ">
      <h2 className="text-3xl font-bold">
        Welcome, {user?.firstName}!
      </h2>
      <p className="text-muted-foreground">
        {user?.role === 'EXPERT' 
          ? 'Find projects that match your expertise.'
          : 'Find experts for your projects.'}
      </p>
      {/* Dashboard content will be expanded in subsequent updates */}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/experts"
            element={
              <ProtectedRoute>
                <ExpertsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <ProtectedRoute>
                <NewProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Q&A routes */}
          <Route
            path="/qa"
            element={
              <ProtectedRoute>
                <QAPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qa/:id"
            element={
              <ProtectedRoute>
                <QuestionDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;