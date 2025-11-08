import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import ParticipantList from '@/components/ParticipantList';
import Countdown from '@/components/Countdown';
import { useQuizStore } from '@/store/useQuizStore';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/lib/api';

const QuizActive = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentQuiz, participants, questions, setCurrentQuiz, setParticipants, setQuestions } = useQuizStore();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showCountdown, setShowCountdown] = useState(true);

  // Connect to WebSocket
  useSocket(id);

  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) return;
      try {
        const quiz = await api.getQuiz(id);
        console.log('QuizActive - Loaded quiz:', quiz);
        console.log('QuizActive - Quiz status:', quiz.status);
        setCurrentQuiz(quiz);
        setParticipants(quiz.participants || []);
        setQuestions(quiz.questions || []);

        // Calculate total time from all questions
        const total = (quiz.questions || []).reduce((sum, q) => sum + (q.timeLimit || 15), 0);
        console.log('QuizActive - Total time calculated:', total);
        setTotalTime(total);
        setTimeRemaining(total);
      } catch (error) {
        console.error('Error loading quiz:', error);
      }
    };
    
    loadQuiz();
  }, [id, setCurrentQuiz, setParticipants, setQuestions]);

  const handleCountdownComplete = () => {
    console.log('QuizActive - Countdown complete, starting timer');
    setShowCountdown(false);
  };

  // Show countdown screen
  if (showCountdown) {
    return <Countdown onComplete={handleCountdownComplete} />;
  }

  // Countdown timer
  useEffect(() => {
    // Don't start countdown if totalTime hasn't been set yet
    if (totalTime === 0) return;
    
    if (timeRemaining <= 0) {
      // Quiz time is up, complete the quiz and navigate to results
      console.log('QuizActive - Timer reached 0, completing quiz');
      if (id) {
        api.completeQuiz(id).then(() => {
          navigate(`/teacher/quiz/${id}/results`);
        }).catch(err => {
          console.error('Error completing quiz:', err);
          navigate(`/teacher/quiz/${id}/results`);
        });
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, id, navigate, totalTime]);

  // Listen for quiz completion
  useEffect(() => {
    console.log('QuizActive - Current quiz status:', currentQuiz?.status);
    console.log('QuizActive - Time remaining:', timeRemaining);
    
    // Only redirect if quiz is completed AND we've actually started the timer
    if (currentQuiz?.status === 'COMPLETED' && totalTime > 0) {
      console.log('QuizActive - Quiz completed, redirecting to results');
      navigate(`/teacher/quiz/${id}/results`);
    }
  }, [currentQuiz?.status, id, navigate, timeRemaining, totalTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndQuiz = async () => {
    if (!id) return;
    
    const confirmed = window.confirm('Testni tugatmoqchimisiz?');
    if (!confirmed) return;

    try {
      await api.completeQuiz(id);
      navigate(`/teacher/quiz/${id}/results`);
    } catch (error) {
      console.error('Error completing quiz:', error);
      alert('Xatolik yuz berdi');
    }
  };

  if (!currentQuiz) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-white text-xl">Yuklanmoqda...</p>
      </div>
    );
  }

  const progressPercentage = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        {currentQuiz.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timer Display - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Timer */}
          <Card className="min-h-[300px] flex flex-col items-center justify-center">
            <p className="text-gray-400 text-xl mb-4">Test tugashiga qolgan vaqt:</p>
            <div className={`text-[120px] font-bold ${timeRemaining <= 30 ? 'text-red-500' : 'text-white'} tracking-wider`}>
              {formatTime(timeRemaining)}
            </div>
            <p className="text-gray-400 text-lg mt-4">
              Jami vaqt: {formatTime(totalTime)}
            </p>
          </Card>

          {/* Progress Bar */}
          <Card>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Jarayon</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Quiz Info */}
          <Card>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-sm">Savollar</p>
                <p className="text-white text-2xl font-bold">{questions.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Ishtirokchilar</p>
                <p className="text-white text-2xl font-bold">{participants.length}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Test kodi</p>
                <p className="text-white text-2xl font-bold">{currentQuiz.code}</p>
              </div>
            </div>
          </Card>

          {/* End Quiz Button */}
          <button
            onClick={handleEndQuiz}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors"
          >
            TESTNI TUGATISH
          </button>
        </div>

        {/* Participants List - Takes 1 column */}
        <div className="lg:col-span-1">
          <ParticipantList participants={participants} />
        </div>
      </div>
    </div>
  );
};

export default QuizActive;
