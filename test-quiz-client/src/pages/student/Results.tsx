import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { api } from '@/lib/api';
import { useQuizStore } from '@/store/useQuizStore';

interface Participant {
  id: string;
  userId: string;
  score: number;
  user?: {
    firstName: string;
    lastName?: string;
  };
}

interface ResultData {
  participants: Participant[];
}

const StudentResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { studentName } = useQuizStore();
  const [results, setResults] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      if (!id) return;
      try {
        const data = await api.getResults(id);
        console.log('Student results data:', data);
        setResults(data);
      } catch (error) {
        console.error('Error loading results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Natijalar yuklanmoqda...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Xatolik</h1>
          <p className="text-gray-400 mb-6">Natijalarni yuklab bo'lmadi</p>
          <Button onClick={() => navigate('/')} fullWidth>
            Bosh sahifaga qaytish
          </Button>
        </Card>
      </div>
    );
  }

  const userId = localStorage.getItem('user_id');
  const sortedParticipants = [...(results?.participants || [])].sort((a, b) => b.score - a.score);
  const currentParticipant = sortedParticipants.find(p => p.userId === userId);
  const currentRank = currentParticipant ? sortedParticipants.indexOf(currentParticipant) + 1 : 0;
  const winner = sortedParticipants[0];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Score Card */}
        <Card className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-8">
            Tabriklaymiz{studentName ? `, ${studentName}` : ''}!
          </h1>
          
          {currentParticipant ? (
            <>
              <div className="mb-8">
                <p className="text-gray-400 text-lg mb-2">Sizning natijangiz</p>
                <div className="text-6xl font-bold text-white mb-4">
                  {currentParticipant.score}
                </div>
                <p className="text-gray-400 text-xl">
                  ball
                </p>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-gray-400 mb-2">Sizning o'rningiz</p>
                <div className="text-4xl font-bold text-yellow-500">
                  {currentRank === 1 ? '🥇' : currentRank === 2 ? '🥈' : currentRank === 3 ? '🥉' : `#${currentRank}`}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-xl">Natijalar topilmadi</p>
          )}
        </Card>

        {/* Winner Card */}
        {winner && (
          <Card className="mb-6 bg-gradient-to-br from-yellow-600 to-yellow-800">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                🏆 G'olib
              </h2>
              <div className="text-4xl font-bold text-white mb-2">
                {winner.user ? `${winner.user.firstName} ${winner.user.lastName || ''}`.trim() : 'O\'quvchi'}
              </div>
              <p className="text-yellow-100 text-xl">
                {winner.score} ball
              </p>
            </div>
          </Card>
        )}

        {/* Actions */}
        <Button onClick={() => navigate('/')} fullWidth className="text-xl py-6">
          BOSH SAHIFAGA QAYTISH
        </Button>
      </div>
    </div>
  );
};

export default StudentResults;
