// src/pages/projects/[id].tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectDetails } from '@/components/project/ProjectDetails';
import { storage } from '@/services/storage';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectApplication } from '@/types/project.types';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const project = storage.getProjectById(Number(id));

  const handleApply = async (application: Partial<ProjectApplication>) => {
    if (!project) return;
    
    const updatedProject = {
      ...project,
      applications: [...project.applications, application],
      updatedAt: new Date().toISOString(),
    };

    storage.updateProject(updatedProject);
  };

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <ProjectDetails
          project={project}
          isExpert={user?.role === 'EXPERT'}
          currentExpert={user?.role === 'EXPERT' ? user : undefined}
          onApply={handleApply}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetailPage;