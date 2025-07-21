// src/services/mockData.ts
import { User, Expert } from '../types/user.types';
import { Project, ProjectStatus, ProjectType } from '../types/project.types';
import { storage } from './storage';

// Mock Users
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'CUSTOMER',
    company: 'Tech Corp',
    profileComplete: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'EXPERT',
    profileComplete: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  } as Expert
];

// Expert Details
const expertDetails: Partial<Expert> = {
  expertise: ['Web Development', 'Cloud Architecture', 'DevOps'],
  location: 'Istanbul, Turkey',
  languages: ['English', 'Turkish'],
  biography: 'Experienced full-stack developer with 8 years of experience in web technologies and cloud solutions.',
  education: [
    {
      institution: 'Istanbul Technical University',
      degree: 'Bachelor of Science',
      field: 'Computer Engineering',
      startYear: 2015,
      endYear: 2019
    }
  ],
  experience: [
    {
      company: 'Tech Solutions Inc.',
      position: 'Senior Developer',
      description: 'Led development of enterprise web applications',
      startDate: '2019-06-01',
      endDate: '2023-12-31',
      current: false
    },
    {
      company: 'Freelance',
      position: 'Full Stack Developer',
      description: 'Independent consulting and development projects',
      startDate: '2024-01-01',
      current: true
    }
  ],
  hourlyRate: 75,
  availability: 'AVAILABLE',
  rating: 4.8
};

// Mock Projects
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform Development',
    description: 'Develop a modern e-commerce platform with React and Node.js',
    type: 'CONTRACT' as ProjectType,
    status: 'ACTIVE' as ProjectStatus,
    customerId: '1',
    expertId: '2',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    budget: 15000,
    documents: [],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Cloud Migration Consultation',
    description: 'Provide consultation for migrating legacy systems to AWS',
    type: 'CALL' as ProjectType,
    status: 'PENDING' as ProjectStatus,
    customerId: '1',
    budget: 500,
    documents: [],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  }
];

// Initialize mock data in localStorage
export const initializeMockData = () => {
  // Initialize users if not exists
  if (!storage.getItem('users')) {
    storage.setItem('users', mockUsers);
  }

  // Add expert details to the expert user
  const users = storage.getItem('users') as User[];
  const expertUser = users.find(u => u.id === '2') as Expert;
  if (expertUser && !expertUser.expertise) {
    Object.assign(expertUser, expertDetails);
    storage.setItem('users', users);
  }

  // Initialize projects if not exists
  if (!storage.getItem('projects')) {
    storage.setItem('projects', mockProjects);
  }

  // Initialize auth tokens for quick testing
  const mockTokens = {
    '1': 'customer-mock-token',
    '2': 'expert-mock-token'
  };
  if (!storage.getItem('tokens')) {
    storage.setItem('tokens', mockTokens);
  }
};

// Helper function to get mock user by email
export const getMockUserByEmail = (email: string): User | null => {
  const users = storage.getItem('users') as User[];
  return users.find(u => u.email === email) || null;
};

// Helper function to get mock token by user ID
export const getMockTokenByUserId = (userId: string): string | null => {
  const tokens = storage.getItem('tokens') as Record<string, string>;
  return tokens[userId] || null;
};

// Helper function to get mock user by token
export const getMockUserByToken = (token: string): User | null => {
  const tokens = storage.getItem('tokens') as Record<string, string>;
  const userId = Object.entries(tokens).find(([_, t]) => t === token)?.[0];
  if (!userId) return null;

  const users = storage.getItem('users') as User[];
  return users.find(u => u.id === userId) || null;
};