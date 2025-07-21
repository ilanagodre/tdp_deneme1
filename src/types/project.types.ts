// src/types/project.types.ts
import { UserProfile } from './user.types';

export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface ProjectApplication {
  id: number;
  expertId: number;
  projectId: number;
  status: ApplicationStatus;
  proposedRate: number;
  coverLetter: string;
  createdAt: string;
}

export interface Project {
  id: number;
  customerId: number;
  title: string;
  description: string;
  status: ProjectStatus;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  requiredSkills: string[];
  preferredLanguages: string[];
  duration: {
    estimate: number;
    unit: 'DAYS' | 'WEEKS' | 'MONTHS';
  };
  applications: ProjectApplication[];
  createdAt: string;
  updatedAt: string;
}