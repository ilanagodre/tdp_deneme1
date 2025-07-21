// src/components/project/ProjectList.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project.types';
import { useNavigate } from 'react-router-dom';

interface ProjectListProps {
  projects: Project[];
  isExpert?: boolean;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, isExpert }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Budget: ${project.budget.min} - ${project.budget.max}
                </p>
              </div>
              <Badge>{project.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.requiredSkills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Duration: {project.duration.estimate} {project.duration.unit.toLowerCase()}
              </span>
              <Button
                onClick={() => navigate(`/projects/${project.id}`)}
                variant="outline"
              >
                {isExpert ? 'View Details' : 'Manage Project'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};