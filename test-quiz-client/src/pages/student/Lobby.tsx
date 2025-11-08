import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ParticipantList from '@/components/ParticipantList';
import Countdown from '@/components/Countdown';
import { useQuizStore } from '@/store/useQuizStore';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/lib/api';

const StudentLobby = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentQuiz, participants, currentQuestionIndex, setCurrentQuiz, setParticipants } = useQuizStore();
  const [showCountdown, setShowCountdown] = useState(false);
  
  // Fetch quiz data on mount and poll for status changes
  useEffect(() => {
    if (!id) return;
    
    const fetchQuiz = async () => {
      try {
        const quiz = await api.getQuiz(id);
        console.log('StudentLobby - Fetched quiz:', quiz);
        setCurrentQuiz(quiz);
        if (quiz.participants) {
          setParticipants(quiz.participants);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };
    
    // Initial fetch
    fetchQuiz();
    
    // Poll every 2 seconds to check for status changes
    const pollInterval = setInterval(fetchQuiz, 2000);
    
    return () => clearInterval(pollInterval);
  }, [id, setCurrentQuiz, setParticipants]);
  
  // Connect to WebSocket
  const socket = useSocket(id);

  // Listen for quiz start
  useEffect(() => {
    console.log('StudentLobby - Current quiz status:', currentQuiz?.status);
    if (currentQuiz?.status === 'ACTIVE' && !showCountdown) {
      console.log('StudentLobby - Quiz is ACTIVE, showing countdown');
      // Show countdown before starting
      setShowCountdown(true);
    }
  }, [currentQuiz?.status, showCountdown]);

  const handleCountdownComplete = () => {
    console.log('StudentLobby - Countdown complete, navigating to first question');
    navigate(`/student/quiz/${id}/question/0`);
  };

  // Show countdown screen
  if (showCountdown) {
    return <Countdown onComplete={handleCountdownComplete} />;
  }

  if (!currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Left Side - Waiting Message */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center md:text-left">
            Boshlanishiga oz qoldi
          </h1>
          <Card>
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-4">
                O'qituvchi testni boshlashini kuting...
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side - Participants */}
        <div>
          <ParticipantList participants={participants} />
          <Button
            variant="disabled"
            fullWidth
            className="mt-6"
            disabled
          >
            Biroz kuting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentLobby;
