// src/types/user.types.ts
export type UserRole = 'EXPERT' | 'CUSTOMER';

export interface BaseUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface Skill {
  id: number;
  name: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

export interface ExpertProfile extends BaseUser {
  role: 'EXPERT';
  skills: Skill[];
  bio: string;
  hourlyRate: number;
  availability: {
    status: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
    nextAvailableDate?: string;
  };
  experience: {
    years: number;
    summary: string;
  };
}

export interface CustomerProfile extends BaseUser {
  role: 'CUSTOMER';
  company: {
    name: string;
    position: string;
    industry: string;
    size: 'STARTUP' | 'SMB' | 'ENTERPRISE';
  };
}

export type UserProfile = ExpertProfile | CustomerProfile;

export interface AuthResponse {
  user: UserProfile;
  token: string;
}