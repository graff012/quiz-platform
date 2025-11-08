import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import { useQuizStore } from '@/store/useQuizStore';
import { api } from '@/lib/api';

export const useSocket = (quizId?: string) => {
  const { setParticipants, setCurrentQuestionIndex, updateQuizStatus, setCurrentQuiz } = useQuizStore();

  useEffect(() => {
    if (!quizId) return;

    const socket = getSocket();
    socket.connect();

    // Join quiz room
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('student_name') || 'Student';
    console.log('useSocket - Joining quiz:', { quizId, userId, userName });
    socket.emit('joinQuiz', { quizId, userId, userName });

    // Listen for new participants
    socket.on('participantJoined', async (data: { userId: string; userName: string; timestamp?: string }) => {
      console.log('New participant joined:', data);
      // Fetch updated quiz data with participants
      try {
        const updatedQuiz = await api.getQuiz(quizId);
        setCurrentQuiz(updatedQuiz);
        if (updatedQuiz.participants) {
          setParticipants(updatedQuiz.participants);
        }
      } catch (error) {
        console.error('Error fetching updated quiz:', error);
      }
    });

    // Listen for quiz start
    socket.on('quizStarted', (data: { quizId: string; startedAt: string }) => {
      console.log('useSocket - Quiz started event received:', data);
      updateQuizStatus('ACTIVE');
      setCurrentQuestionIndex(0);
    });

    // Also listen for generic status updates
    socket.on('quizStatusChanged', (data: any) => {
      console.log('useSocket - Quiz status changed:', data);
      if (data.status) {
        updateQuizStatus(data.status);
      }
    });

    // Listen for new question
    socket.on('newQuestion', (data: { question: any }) => {
      console.log('New question:', data);
      // Question will be handled by the question page
    });

    // Listen for quiz completion
    socket.on('quizCompleted', (data: { quizId: string; completedAt: string }) => {
      console.log('Quiz completed:', data);
      updateQuizStatus('COMPLETED');
    });

    return () => {
      socket.off('participantJoined');
      socket.off('quizStarted');
      socket.off('newQuestion');
      socket.off('quizCompleted');
    };
  }, [quizId, setParticipants, setCurrentQuestionIndex, updateQuizStatus, setCurrentQuiz]);

  return getSocket();
};
