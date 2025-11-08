import axios from 'axios';
import { Quiz, Question, Participant } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  teacherLogin: async (phoneNumber: string, password: string) => {
    const response = await apiClient.post('/auth/login', { phoneNumber, password });
    return response.data;
  },

  teacherRegister: async (firstName: string, lastName: string, phoneNumber: string, password: string) => {
    const response = await apiClient.post('/auth/register', { 
      firstName, 
      lastName, 
      phoneNumber, 
      password,
      role: 'TEACHER'
    });
    return response.data;
  },

  // Quiz
  createQuiz: async (title: string, type: 'INDIVIDUAL' | 'TEAM', defaultQuestionTime: number = 15) => {
    const response = await apiClient.post<Quiz>('/quizzes', { title, type, defaultQuestionTime });
    return response.data;
  },

  addQuestion: async (quizId: string, question: { text: string; order: number; timeLimit: number; options: Array<{ text: string; label: string; isCorrect: boolean }> }) => {
    const response = await apiClient.post<Question>('/questions', { ...question, quizId });
    return response.data;
  },

  getQuizByCode: async (code: string) => {
    const response = await apiClient.get<Quiz>(`/quizzes/code/${code}`);
    return response.data;
  },

  getQuiz: async (quizId: string) => {
    const response = await apiClient.get<Quiz>(`/quizzes/${quizId}`);
    return response.data;
  },

  // Student
  joinQuiz: async (code: string, name: string, phoneNumber?: string) => {
    const response = await apiClient.post<Participant>('/quizzes/join', { 
      code, 
      name,
      phoneNumber 
    });
    return response.data;
  },

  submitAnswer: async (questionId: string, userId: string, optionId: string) => {
    const response = await apiClient.post('/answers', {
      questionId,
      userId,
      optionId,
    });
    return response.data;
  },

  // Teacher
  startQuiz: async (quizId: string) => {
    const response = await apiClient.post(`/quizzes/${quizId}/start`);
    return response.data;
  },

  getResults: async (quizId: string) => {
    const response = await apiClient.get(`/quizzes/${quizId}/leaderboard`);
    return response.data;
  },

  completeQuiz: async (quizId: string) => {
    const response = await apiClient.post(`/quizzes/${quizId}/complete`);
    return response.data;
  },

  // Get all quizzes for current teacher
  getTeacherQuizzes: async () => {
    const response = await apiClient.get<Quiz[]>('/quizzes');
    return response.data;
  },

  // Send quiz results to Telegram
  sendResultsToTelegram: async (quizId: string) => {
    const response = await apiClient.post(`/quizzes/${quizId}/send-telegram`);
    return response.data;
  },

  // Delete quiz
  deleteQuiz: async (quizId: string) => {
    const response = await apiClient.delete(`/quizzes/${quizId}`);
    return response.data;
  },

  // Get user by ID
  getUser: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId: string, data: { telegramId?: string }) => {
    const response = await apiClient.patch(`/users/${userId}`, data);
    return response.data;
  },

  // Delete user account
  deleteAccount: async (userId: string) => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },
};

export default api;
