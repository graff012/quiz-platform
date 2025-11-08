import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

const Landing = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleJoinQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      navigate(`/student/quiz/${code}/join`);
    }
  };

  const handleCreateQuiz = (type: 'INDIVIDUAL' | 'TEAM') => {
    // Check if teacher is logged in
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/teacher/register', { state: { quizType: type } });
    } else {
      navigate('/teacher/quiz/create', { state: { quizType: type } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Quiz Type Selection */}
      <div className="mb-16">
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

      {/* Student Join Section */}
      <div className="w-full max-w-md">
        <form onSubmit={handleJoinQuiz} className="space-y-4">
          <Input
            type="text"
            placeholder="Kirish uchun kodni kiriting"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            fullWidth
            className="text-center text-2xl"
          />
          <Button type="submit" fullWidth disabled={code.length !== 6}>
            Kirish
          </Button>
        </form>
        <div className="text-center mt-4 space-y-2">
          <p className="text-gray-400">
            <button
              onClick={() => navigate('/teacher/register')}
              className="text-white hover:text-gray-300 transition-colors underline font-medium"
            >
              Test yaratish
            </button>
          </p>
          <p className="text-sm text-gray-500">
            Akkauntingiz bormi?{' '}
            <button
              onClick={() => navigate('/teacher/login')}
              className="text-gray-400 hover:text-white transition-colors underline"
            >
              Kirish
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
