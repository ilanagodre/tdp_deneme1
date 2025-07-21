// storage.ts
type StorageKey = 'user' | 'token' | 'experts' | 'projects' | 'profiles';

interface StorageValue {
  user: {
    id: number;
    email: string;
    role: 'EXPERT' | 'CUSTOMER';
    firstName: string;
    lastName: string;
  };
  token: string;
  experts: Array<{
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    skills: string[];
    experience: number;
    rate: number;
  }>;
  projects: Array<{
    id: number;
    title: string;
    description: string;
    skills: string[];
    budget: number;
    customerId: number;
    expertId?: number;
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  }>;
  profiles: Array<{
    userId: number;
    bio: string;
    skills: string[];
    experience: number;
    rate?: number;
    completedProjects: number;
  }>;
}

export const storage = {
  get: <K extends StorageKey>(key: K): StorageValue[K] | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },

  set: <K extends StorageKey>(key: K, value: StorageValue[K]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  },

  remove: (key: StorageKey): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  exists: (key: StorageKey): boolean => {
    return localStorage.getItem(key) !== null;
  },
};