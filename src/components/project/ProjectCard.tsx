// src/components/project/ProjectCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Project } from '../../types/project.types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'COMPLETED':
        return 'bg-blue-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge className={getStatusColor(project.status)}>
          {t(`project.status.${project.status.toLowerCase()}`)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm line-clamp-2">{project.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{project.type}</Badge>
              {project.budget && (
                <span className="text-sm font-medium">
                  ${project.budget.toLocaleString()}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              {t('project.viewDetails')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;