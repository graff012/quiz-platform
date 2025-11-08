import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import { api } from '@/lib/api';
import { Quiz } from '@/types';

const TeacherArchive = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await api.getTeacherQuizzes();
        // Filter only completed quizzes
        const completedQuizzes = data.filter(q => q.status === 'COMPLETED');
        setQuizzes(completedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleQuizClick = (quizId: string) => {
    navigate(`/teacher/quiz/${quizId}/results`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Arxiv</h1>

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
              Arxivda testlar yo'q
            </p>
            <p className="text-gray-500">
              Tugallangan testlar bu yerda ko'rinadi
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="cursor-pointer hover:bg-card-hover transition-all"
              onClick={() => handleQuizClick(quiz.id)}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Tugallangan
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

                <div className="space-y-1">
                  <div className="text-xs text-gray-500">
                    Boshlangan: {quiz.startedAt ? new Date(quiz.startedAt).toLocaleString('uz-UZ') : '-'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Tugallangan: {quiz.completedAt ? new Date(quiz.completedAt).toLocaleString('uz-UZ') : '-'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherArchive;
