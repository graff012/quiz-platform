export type UserRole = 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  telegramId?: string;
  createdAt: string;
  updatedAt: string;
}

export type QuizType = 'INDIVIDUAL' | 'TEAM';
export type QuizStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED';

export interface Quiz {
  id: string;
  title: string;
  code: string;
  type: QuizType;
  status: QuizStatus;
  teacherId: string;
  defaultQuestionTime: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  questions?: Question[];
  participants?: Participant[];
  teacher?: User;
}

export interface Question {
  id: string;
  text: string;
  quizId: string;
  order: number;
  options: Option[];
  timeLimit?: number; // in seconds
}

export interface Option {
  id: string;
  label: string; // A, B, C, D
  text: string;
  isCorrect: boolean;
  questionId: string;
}

export interface Participant {
  id: string;
  userId: string;
  quizId: string;
  teamId?: string;
  score: number;
  joinedAt: string;
  user?: User;
}

export interface Answer {
  id: string;
  participantId: string;
  questionId: string;
  optionId: string;
  answeredAt: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}
