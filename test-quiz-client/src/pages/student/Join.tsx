import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { api } from '@/lib/api';
import { useQuizStore } from '@/store/useQuizStore';

const StudentJoin = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { setCurrentQuiz, setStudentName } = useQuizStore();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    const validateCode = async () => {
      if (!code) return;
      try {
        const quizData = await api.getQuizByCode(code);
        setQuiz(quizData);
        setCurrentQuiz(quizData);
      } catch (err) {
        setError('Kod noto\'g\'ri yoki test topilmadi');
      }
    };
    
    validateCode();
  }, [code, setCurrentQuiz]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quiz || !code) return;

    try {
      setLoading(true);
      setError('');
      
      const participant = await api.joinQuiz(code, name.trim());
      setStudentName(name.trim());
      
      // Store participant info
      localStorage.setItem('participant_id', participant.id);
      localStorage.setItem('user_id', participant.userId);
      
      navigate(`/student/quiz/${quiz.id}/lobby`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (error && !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Xatolik</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => navigate('/')} fullWidth>
            Bosh sahifaga qaytish
          </Button>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm mb-2">Kirish uchun kod</p>
          <p className="text-4xl font-bold text-white tracking-widest">{code}</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-6">
          <Input
            label="Ismingizni kiriting"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ism va familiya"
            fullWidth
            autoFocus
            className="text-center text-xl"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={name.trim().length < 2 || loading}
            variant={name.trim().length < 2 ? 'disabled' : 'primary'}
          >
            {loading ? 'Yuklanmoqda...' : 'KIRISH'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default StudentJoin;
