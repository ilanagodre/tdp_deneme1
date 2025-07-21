// src/pages/projects/new.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectForm } from '@/components/project/ProjectForm';
import { storage } from '@/services/storage';
import { Project } from '@/types/project.types';
import { useAuth } from '@/contexts/AuthContext';

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (data: Partial<Project>) => {
    if (!user) return;

    const newProject: Project = {
      ...data as Project,
      id: Date.now(),
      customerId: user.id,
      status: 'OPEN',
      applications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.createProject(newProject);
    navigate('/projects');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
        <ProjectForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  );
};

export default NewProjectPage;