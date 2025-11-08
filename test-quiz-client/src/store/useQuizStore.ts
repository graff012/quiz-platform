import { create } from 'zustand';
import { Quiz, Question, Participant, User } from '@/types';

interface QuizState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Current quiz
  currentQuiz: Quiz | null;
  setCurrentQuiz: (quiz: Quiz | null | ((prev: Quiz | null) => Quiz | null)) => void;
  updateQuizStatus: (status: Quiz['status']) => void;
  
  // Participants
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  setParticipants: (participants: Participant[]) => void;
  
  // Questions
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  
  // Current question index
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  nextQuestion: () => void;
  
  // Student state
  studentName: string;
  setStudentName: (name: string) => void;
  studentAnswers: Record<string, string>; // questionId -> optionId
  addStudentAnswer: (questionId: string, optionId: string) => void;
  
  // Reset
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),
  
  // Current quiz
  currentQuiz: null,
  setCurrentQuiz: (quiz) => set((state) => ({
    currentQuiz: typeof quiz === 'function' ? quiz(state.currentQuiz) : quiz
  })),
  updateQuizStatus: (status) => set((state) => ({
    currentQuiz: state.currentQuiz ? { ...state.currentQuiz, status } : null
  })),
  
  // Participants
  participants: [],
  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant],
    })),
  setParticipants: (participants) => set({ participants }),
  
  // Questions
  questions: [],
  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, question],
    })),
  
  // Current question
  currentQuestionIndex: 0,
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),
  
  // Student state
  studentName: '',
  setStudentName: (name) => set({ studentName: name }),
  studentAnswers: {},
  addStudentAnswer: (questionId, optionId) =>
    set((state) => ({
      studentAnswers: {
        ...state.studentAnswers,
        [questionId]: optionId,
      },
    })),
  
  // Reset
  reset: () =>
    set({
      currentQuiz: null,
      participants: [],
      questions: [],
      currentQuestionIndex: 0,
      studentName: '',
      studentAnswers: {},
    }),
}));
