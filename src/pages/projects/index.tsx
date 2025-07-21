// src/pages/projects/index.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectList } from '@/components/project/ProjectList';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/services/storage';
import { Project } from '@/types/project.types';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = () => {
    // In a real app, this would be an API call
    // For now, we'll simulate with localStorage
    const allProjects = storage.getAllProjects();
    const filteredProjects = user?.role === 'CUSTOMER'
      ? allProjects.filter(p => p.customerId === user.id)
      : allProjects;
    
    setProjects(filteredProjects);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {user?.role === 'CUSTOMER' ? 'My Projects' : 'Available Projects'}
          </h1>
          {user?.role === 'CUSTOMER' && (
            <Button onClick={() => navigate('/projects/new')}>
              Create New Project
            </Button>
          )}
        </div>
        <ProjectList
          projects={projects}
          isExpert={user?.role === 'EXPERT'}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;