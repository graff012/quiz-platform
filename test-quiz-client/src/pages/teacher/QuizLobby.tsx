import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ParticipantList from '@/components/ParticipantList';
import { useQuizStore } from '@/store/useQuizStore';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/lib/api';

const QuizLobby = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentQuiz, participants, setCurrentQuiz, setParticipants } = useQuizStore();
  const [loading, setLoading] = useState(false);
  
  // Connect to WebSocket
  useSocket(id);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) return;
      try {
        const quiz = await api.getQuiz(id);
        setCurrentQuiz(quiz);
        // Load existing participants if any
        setParticipants(quiz.participants || []);
      } catch (error) {
        console.error('Error loading quiz:', error);
      }
    };
    
    loadQuiz();
  }, [id, setCurrentQuiz, setParticipants]);

  const handleStartQuiz = async () => {
    if (!id || participants.length === 0) return;
    
    try {
      setLoading(true);
      console.log('QuizLobby - Starting quiz:', id);
      const response = await api.startQuiz(id);
      console.log('QuizLobby - Start quiz response:', response);
      
      // Navigate to active page
      console.log('QuizLobby - Navigating to active page');
      navigate(`/teacher/quiz/${id}/active`);
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (!currentQuiz) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-white text-xl">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Kirish uchun kod
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Code Display - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="h-full flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <p className="text-gray-400 text-xl mb-4">Test kodi:</p>
              <div className="text-[120px] font-bold text-white tracking-widest select-all">
                {currentQuiz.code}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(currentQuiz.code)}
                className="mt-4 text-gray-400 hover:text-white transition-colors text-sm"
              >
                📋 Nusxa olish
              </button>
            </div>
          </Card>
        </div>

        {/* Participants List - Takes 1 column */}
        <div className="lg:col-span-1">
          <ParticipantList participants={participants} />
        </div>
      </div>

      {/* Start Button */}
      <div className="mt-8">
        <Button
          onClick={handleStartQuiz}
          disabled={participants.length === 0 || loading}
          variant={participants.length === 0 ? 'disabled' : 'primary'}
          fullWidth
          className="text-2xl py-6"
        >
          {loading ? 'Boshlanmoqda...' : 'BOSHLASH'}
        </Button>
        {participants.length === 0 && (
          <p className="text-center text-gray-400 mt-4">
            Testni boshlash uchun kamida 1 ta o'quvchi qo'shilishi kerak
          </p>
        )}
      </div>
    </div>
  );
};

export default QuizLobby;
