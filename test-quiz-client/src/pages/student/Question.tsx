import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Timer from '@/components/Timer';
import { useQuizStore } from '@/store/useQuizStore';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';

const StudentQuestion = () => {
  const { id, questionId } = useParams<{ id: string; questionId: string }>();
  const navigate = useNavigate();
  const { questions, participants, currentQuestionIndex, addStudentAnswer, setQuestions, setCurrentQuiz } = useQuizStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [loading, setLoading] = useState(true);
  
  useSocket(id);

  // Fetch quiz with questions on mount
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      try {
        console.log('StudentQuestion - Fetching quiz:', id);
        const quiz = await api.getQuiz(id);
        console.log('StudentQuestion - Fetched quiz:', quiz);
        console.log('StudentQuestion - Questions:', quiz.questions);
        setCurrentQuiz(quiz);
        if (quiz.questions) {
          setQuestions(quiz.questions);
        }
      } catch (error) {
        console.error('StudentQuestion - Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, setCurrentQuiz, setQuestions]);

  const questionNum = parseInt(questionId || '0');
  const currentQuestion = questions[questionNum];
  
  console.log('StudentQuestion - Current question index:', questionNum);
  console.log('StudentQuestion - Total questions:', questions.length);
  console.log('StudentQuestion - Current question:', currentQuestion);

  useEffect(() => {
    // Reset state when question changes
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedback(null);
  }, [currentQuestionIndex]);

  // Listen for next question event
  useEffect(() => {
    if (currentQuestionIndex > questionNum) {
      navigate(`/student/quiz/${id}/question/${currentQuestionIndex}`);
    }
  }, [currentQuestionIndex, questionNum, id, navigate]);

  const handleSelectOption = async (optionId: string) => {
    if (isAnswered || !currentQuestion || !id) return;

    setSelectedOption(optionId);
    setIsAnswered(true);

    try {
      // Get userId from localStorage
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      // Submit answer
      const result = await api.submitAnswer(currentQuestion.id, userId, optionId);
      addStudentAnswer(currentQuestion.id, optionId);
      
      // Show feedback
      const option = currentQuestion.options.find(opt => opt.id === optionId);
      setFeedback(option?.isCorrect ? 'correct' : 'incorrect');

      // Auto-advance after 2 seconds
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          navigate(`/student/quiz/${id}/question/${currentQuestionIndex + 1}`);
        } else {
          // Quiz finished
          navigate(`/student/quiz/${id}/results`);
        }
      }, 2000);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleTimeUp = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      // Auto-advance to next question or results
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          navigate(`/student/quiz/${id}/question/${currentQuestionIndex + 1}`);
        } else {
          navigate(`/student/quiz/${id}/results`);
        }
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Savol topilmadi</p>
          <p className="text-gray-400">Savol #{questionNum + 1}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-card border-b border-border px-8 py-4 flex justify-between items-center">
        <div className="text-white">
          <span className="text-gray-400">O'quvchilar:</span> {participants.length}/20
        </div>
        <Timer seconds={currentQuestion.timeLimit || 15} onComplete={handleTimeUp} />
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Question Text */}
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 max-w-4xl">
          {currentQuestion.text}
        </h1>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const showFeedback = isAnswered && isSelected;
            
            let bgColor = 'bg-card hover:bg-card-hover';
            if (showFeedback) {
              bgColor = feedback === 'correct' ? 'bg-green-600' : 'bg-red-600';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={isAnswered}
                className={`
                  ${bgColor}
                  text-white text-xl font-medium
                  rounded-2xl p-8 min-h-[120px]
                  transition-all duration-200
                  ${!isAnswered ? 'hover:scale-105 active:scale-95' : ''}
                  ${isAnswered ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                  ${isSelected && !isAnswered ? 'ring-4 ring-white' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{option.text}</span>
                  <span className="text-3xl font-bold ml-4">{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 text-gray-400 text-sm">
          Savol {currentQuestionIndex + 1} / {questions.length}
        </div>
      </div>
    </div>
  );
};

export default StudentQuestion;
