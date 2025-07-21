// src/services/storage.ts
import { UserProfile, ExpertProfile, CustomerProfile } from '../types/user.types';

// Eksik tip tanımları
interface Project {
  id: number;
  title: string;
  description: string;
  [key: string]: any; // Diğer alanlar için
}

interface Question {
  id: number;
  title: string;
  content: string;
  [key: string]: any; // Diğer alanlar için
}

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  LANGUAGE: 'language'
};

class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic localStorage methods
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  removeAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  setUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  getUserProfile(): UserProfile | null {
    const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!profile) return null;
    try {
      return JSON.parse(profile) as UserProfile;
    } catch (error) {
      console.error('Error parsing user profile:', error);
      return null;
    }
  }

  updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
    const currentProfile = this.getUserProfile();
    if (!currentProfile) return null;

    const updatedProfile = {
      ...currentProfile,
      ...updates,
    } as UserProfile;

    this.setUserProfile(updatedProfile);
    return updatedProfile;
  }

  getAllExperts(): ExpertProfile[] {
    // Get all users and filter experts
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]') as UserProfile[];
    return allUsers.filter((user) => user.role === 'EXPERT') as ExpertProfile[];
  }

  getAllProjects(): Project[] {
    return JSON.parse(localStorage.getItem('projects') || '[]') as Project[];
  }

  getAllQuestions(): Question[] {
    return JSON.parse(localStorage.getItem('questions') || '[]') as Question[];
  }

  getQuestionById(id: number): Question | null {
    const questions = this.getAllQuestions();
    return questions.find(q => q.id === id) || null;
  }

  createQuestion(question: Question): void {
    const questions = this.getAllQuestions();
    questions.push(question);
    localStorage.setItem('questions', JSON.stringify(questions));
  }

  updateQuestion(question: Question): void {
    const questions = this.getAllQuestions();
    const index = questions.findIndex(q => q.id === question.id);
    if (index !== -1) {
      questions[index] = question;
      localStorage.setItem('questions', JSON.stringify(questions));
    }
  }

  getProjectById(id: number): Project | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }

  createProject(project: Project): void {
    const projects = this.getAllProjects();
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  updateProject(project: Project): void {
    const projects = this.getAllProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      projects[index] = project;
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem('projects');
  }
}

export const storage = StorageService.getInstance();