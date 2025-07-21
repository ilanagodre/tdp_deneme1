// src/services/mockHandlers.ts
import { LoginRequest, RegisterRequest, User } from '../types/user.types';
import { Project, ProjectCreate, ProjectUpdate } from '../types/project.types';
import { storage } from './storage';
import { getMockUserByEmail, getMockTokenByUserId, getMockUserByToken } from './mockData';

// Authentication Handlers
export const handleLogin = async (data: LoginRequest): Promise<{ token: string; user: User }> => {
  // In mock system, we accept any password
  const user = getMockUserByEmail(data.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const token = getMockTokenByUserId(user.id);
  if (!token) {
    throw new Error('Token not found');
  }

  return { token, user };
};

export const handleRegister = async (data: RegisterRequest): Promise<{ token: string; user: User }> => {
  const existingUser = getMockUserByEmail(data.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const users = storage.getItem<User[]>('users') || [];
  const newUser: User = {
    id: (users.length + 1).toString(),
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    company: data.company,
    profileComplete: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  storage.setItem('users', users);

  // Create token for new user
  const tokens = storage.getItem<Record<string, string>>('tokens') || {};
  const token = `${data.role.toLowerCase()}-${Date.now()}`;
  tokens[newUser.id] = token;
  storage.setItem('tokens', tokens);

  return { token, user: newUser };
};

// Project Handlers
export const handleGetProjects = async (token: string): Promise<Project[]> => {
  const user = getMockUserByToken(token);
  if (!user) {
    throw new Error('Unauthorized');
  }

  const projects = storage.getItem<Project[]>('projects') || [];
  return user.role === 'CUSTOMER'
    ? projects.filter(p => p.customerId === user.id)
    : projects.filter(p => p.expertId === user.id || p.expertId === undefined);
};

export const handleCreateProject = async (token: string, data: ProjectCreate): Promise<Project> => {
  const user = getMockUserByToken(token);
  if (!user || user.role !== 'CUSTOMER') {
    throw new Error('Unauthorized');
  }

  const projects = storage.getItem<Project[]>('projects') || [];
  const newProject: Project = {
    id: (projects.length + 1).toString(),
    ...data,
    customerId: user.id,
    status: 'PENDING',
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.push(newProject);
  storage.setItem('projects', projects);

  return newProject;
};

export const handleUpdateProject = async (
  token: string,
  projectId: string,
  data: ProjectUpdate
): Promise<Project> => {
  const user = getMockUserByToken(token);
  if (!user) {
    throw new Error('Unauthorized');
  }

  const projects = storage.getItem<Project[]>('projects') || [];
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    throw new Error('Project not found');
  }

  const project = projects[projectIndex];
  
  // Check authorization
  if (
    (user.role === 'CUSTOMER' && project.customerId !== user.id) ||
    (user.role === 'EXPERT' && project.expertId !== user.id)
  ) {
    throw new Error('Unauthorized');
  }

  // Update project
  const updatedProject = {
    ...project,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  projects[projectIndex] = updatedProject;
  storage.setItem('projects', projects);

  return updatedProject;
};

// User Profile Handlers
export const handleUpdateProfile = async (token: string, data: Partial<User>): Promise<User> => {
  const user = getMockUserByToken(token);
  if (!user) {
    throw new Error('Unauthorized');
  }

  const users = storage.getItem<User[]>('users') || [];
  const userIndex = users.findIndex(u => u.id === user.id);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Update user
  const updatedUser = {
    ...users[userIndex],
    ...data,
    profileComplete: true,
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;
  storage.setItem('users', users);

  return updatedUser;
};

// Expert Search Handlers
export const handleSearchExperts = async (
  token: string,
  query?: string,
  filters?: Record<string, any>
): Promise<User[]> => {
  const user = getMockUserByToken(token);
  if (!user) {
    throw new Error('Unauthorized');
  }

  const users = storage.getItem<User[]>('users') || [];
  let experts = users.filter(u => u.role === 'EXPERT');

  if (query) {
    const searchQuery = query.toLowerCase();
    experts = experts.filter(expert => 
      expert.firstName.toLowerCase().includes(searchQuery) ||
      expert.lastName.toLowerCase().includes(searchQuery) ||
      (expert as any).expertise?.some((skill: string) => 
        skill.toLowerCase().includes(searchQuery)
      )
    );
  }

  if (filters) {
    // Apply filters (location, hourly rate, availability, etc.)
    experts = experts.filter(expert => {
      const expertDetails = expert as any;
      let matches = true;

      if (filters.location && expertDetails.location) {
        matches = matches && expertDetails.location.includes(filters.location);
      }
      if (filters.maxRate && expertDetails.hourlyRate) {
        matches = matches && expertDetails.hourlyRate <= filters.maxRate;
      }
      if (filters.availability && expertDetails.availability) {
        matches = matches && expertDetails.availability === filters.availability;
      }
      if (filters.languages && expertDetails.languages) {
        matches = matches && filters.languages.every((lang: string) =>
          expertDetails.languages.includes(lang)
        );
      }

      return matches;
    });
  }

  return experts;
};