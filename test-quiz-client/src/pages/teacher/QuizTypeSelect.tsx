import { useNavigate } from 'react-router-dom';
import Card from '@/components/Card';

const QuizTypeSelect = () => {
  const navigate = useNavigate();

  const handleCreateQuiz = (type: 'INDIVIDUAL' | 'TEAM') => {
    navigate('/teacher/quiz/create', { state: { quizType: type } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          Qanday test yaratmoqchisiz?
        </h1>
        <div className="flex gap-6">
          <Card
            className="w-72 h-48 flex items-center justify-center cursor-pointer hover:bg-card-hover transition-all"
            onClick={() => handleCreateQuiz('INDIVIDUAL')}
          >
            <h2 className="text-3xl font-bold text-white">Yakka</h2>
          </Card>
          <Card
            className="w-72 h-48 flex items-center justify-center cursor-pointer hover:bg-card-hover transition-all"
            onClick={() => handleCreateQuiz('TEAM')}
          >
            <h2 className="text-3xl font-bold text-white">Jamoaviy</h2>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizTypeSelect;
