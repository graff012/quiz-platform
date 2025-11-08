import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { api } from '@/lib/api';
import { Quiz } from '@/types';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await api.getTeacherQuizzes();
        // Filter only active and draft quizzes (not completed)
        const activeQuizzes = data.filter(q => q.status !== 'COMPLETED');
        setQuizzes(activeQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const getStatusBadge = (status: string) => {
    const colors = {
      DRAFT: 'bg-gray-600',
      ACTIVE: 'bg-green-600',
      COMPLETED: 'bg-blue-600',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-600';
  };

  const getStatusText = (status: string) => {
    const texts = {
      DRAFT: 'Tayyorlanmoqda',
      ACTIVE: 'Faol',
      COMPLETED: 'Tugallangan',
    };
    return texts[status as keyof typeof texts] || status;
  };

  const handleQuizClick = (quiz: Quiz) => {
    if (quiz.status === 'DRAFT') {
      navigate(`/teacher/quiz/${quiz.id}/lobby`);
    } else if (quiz.status === 'ACTIVE') {
      navigate(`/teacher/quiz/${quiz.id}/active`);
    }
  };

  const handleStartQuiz = async (e: React.MouseEvent, quizId: string) => {
    e.stopPropagation(); // Prevent card click
    if (!confirm('Testni boshlashni xohlaysizmi?')) return;
    
    try {
      await api.startQuiz(quizId);
      // Refresh quiz list
      const data = await api.getTeacherQuizzes();
      const activeQuizzes = data.filter(q => q.status !== 'COMPLETED');
      setQuizzes(activeQuizzes);
      // Navigate to active page
      navigate(`/teacher/quiz/${quizId}/active`);
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Testni boshlashda xatolik yuz berdi');
    }
  };

  const handleDeleteQuiz = async (e: React.MouseEvent, quizId: string) => {
    e.stopPropagation(); // Prevent card click
    if (!confirm('Testni o\'chirishni xohlaysizmi? Bu amalni qaytarib bo\'lmaydi!')) return;
    
    try {
      await api.deleteQuiz(quizId);
      // Remove from list
      setQuizzes(quizzes.filter(q => q.id !== quizId));
      alert('Test o\'chirildi');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Testni o\'chirishda xatolik yuz berdi');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Mening testlarim</h1>
        <Button onClick={() => navigate('/teacher/quiz/type')}>
          + Yangi test yaratish
        </Button>
      </div>

      {loading ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">Yuklanmoqda...</p>
          </div>
        </Card>
      ) : quizzes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl mb-6">
              Hozircha testlar yo'q
            </p>
            <p className="text-gray-500">
              Yangi test yaratish uchun yuqoridagi tugmani bosing
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="cursor-pointer hover:bg-card-hover transition-all"
              onClick={() => handleQuizClick(quiz)}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
                  <span className={`${getStatusBadge(quiz.status)} text-white text-xs px-2 py-1 rounded`}>
                    {getStatusText(quiz.status)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Kod:</span>
                    <span className="text-white font-mono">{quiz.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turi:</span>
                    <span className="text-white">{quiz.type === 'INDIVIDUAL' ? 'Yakka' : 'Jamoaviy'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Savollar:</span>
                    <span className="text-white">{quiz.questions?.length || 0}</span>
                  </div>
                  {quiz.participants && quiz.participants.length > 0 && (
                    <div className="flex justify-between">
                      <span>Ishtirokchilar:</span>
                      <span className="text-white">{quiz.participants.length}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  {new Date(quiz.createdAt).toLocaleDateString('uz-UZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {quiz.status === 'DRAFT' && (
                    <Button
                      onClick={(e) => handleStartQuiz(e, quiz.id)}
                      className="flex-1 text-sm py-2"
                    >
                      Boshlash
                    </Button>
                  )}
                  <Button
                    onClick={(e) => handleDeleteQuiz(e, quiz.id)}
                    variant="secondary"
                    className="flex-1 text-sm py-2 bg-red-600 hover:bg-red-700"
                  >
                    O'chirish
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
