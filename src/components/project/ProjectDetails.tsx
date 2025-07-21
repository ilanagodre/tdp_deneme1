// src/components/project/ProjectDetails.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Project, ProjectApplication } from '@/types/project.types';
import { ExpertProfile } from '@/types/user.types';

interface ProjectDetailsProps {
  project: Project;
  isExpert: boolean;
  currentExpert?: ExpertProfile;
  onApply?: (application: Partial<ProjectApplication>) => Promise<void>;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  isExpert,
  currentExpert,
  onApply,
}) => {
  const [coverLetter, setCoverLetter] = React.useState('');
  const [proposedRate, setProposedRate] = React.useState('');

  const handleApply = async () => {
    if (!onApply || !currentExpert) return;
    
    await onApply({
      expertId: currentExpert.id,
      projectId: project.id,
      status: 'PENDING',
      proposedRate: Number(proposedRate),
      coverLetter,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
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
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p>{project.description}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map((skill) => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Duration</h3>
            <p>{project.duration.estimate} {project.duration.unit.toLowerCase()}</p>
          </div>
        </CardContent>
      </Card>

      {isExpert && project.status === 'OPEN' && (
        <Card>
          <CardHeader>
            <CardTitle>Apply for Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label>Proposed Hourly Rate ($)</label>
              <Input
                type="number"
                value={proposedRate}
                onChange={(e) => setProposedRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label>Cover Letter</label>
              <Textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
              />
            </div>
            <Button onClick={handleApply} className="w-full">
              Submit Application
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};