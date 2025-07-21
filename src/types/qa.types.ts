// src/types/qa.types.ts
export interface Vote {
  userId: number;
  type: 'UP' | 'DOWN';
}

export interface Answer {
  id: number;
  questionId: number;
  authorId: number;
  content: string;
  votes: Vote[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: number;
  authorId: number;
  title: string;
  content: string;
  tags: string[];
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
}