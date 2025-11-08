import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { api } from '@/lib/api';

interface Participant {
  id: string;
  userId: string;
  score: number;
  user?: {
    firstName: string;
    lastName?: string;
  };
}

interface ResultsData {
  participants: Participant[];
}

const QuizResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      if (!id) return;
      try {
        const data = await api.getResults(id);
        console.log('Results data:', data);
        setResults(data);
      } catch (error) {
        console.error('Error loading results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [id]);

  const [sendingTelegram, setSendingTelegram] = useState(false);

  const handleSendToTelegram = async () => {
    if (!id) return;
    
    try {
      setSendingTelegram(true);
      await api.sendResultsToTelegram(id);
      alert('Natijalar Telegram\'ga yuborildi! ✅');
    } catch (error: any) {
      console.error('Error sending to Telegram:', error);
      if (error.response?.status === 404) {
        alert('Telegram ID topilmadi. Iltimos, profilingizda Telegram ID ni qo\'shing.');
      } else {
        alert('Xatolik yuz berdi. Telegram bot sozlanmagandir yoki Telegram ID noto\'g\'ri.');
      }
    } finally {
      setSendingTelegram(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-white text-xl">Natijalar yuklanmoqda...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="p-8">
        <Card className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Xatolik</h1>
          <p className="text-gray-400">Natijalarni yuklab bo'lmadi</p>
        </Card>
      </div>
    );
  }

  // Sort participants by score
  const sortedParticipants = [...(results?.participants || [])].sort((a, b) => b.score - a.score);
  const winner = sortedParticipants[0];
  const hasParticipants = sortedParticipants.length > 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-12 text-center">
        Natijalar
      </h1>

      {/* Winner Section */}
      {hasParticipants && winner ? (
        <Card className="mb-8 bg-gradient-to-br from-yellow-600 to-yellow-800">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              🏆 G'olib
            </h2>
            <div className="text-5xl font-bold text-white mb-3">
              {winner.user ? `${winner.user.firstName} ${winner.user.lastName || ''}`.trim() : 'O\'quvchi'}
            </div>
            <p className="text-yellow-100 text-2xl mb-2">
              {winner.score} ball
            </p>
          </div>
        </Card>
      ) : (
        <Card className="mb-8 text-center">
          <p className="text-gray-400 text-xl">Hali natijalar yo'q</p>
        </Card>
      )}

      {/* Leaderboard */}
      <Card className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-6">
          Natijalar jadvali
        </h3>
        {hasParticipants ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-gray-400 py-3 px-4">O'rin</th>
                  <th className="text-left text-gray-400 py-3 px-4">Ism</th>
                  <th className="text-left text-gray-400 py-3 px-4">Ball</th>
                </tr>
              </thead>
              <tbody>
                {sortedParticipants.map((participant, index) => {
                  const rank = index + 1;
                  const displayName = participant.user 
                    ? `${participant.user.firstName} ${participant.user.lastName || ''}`.trim()
                    : `O'quvchi ${rank}`;
                  
                  return (
                    <tr
                      key={participant.id}
                      className="border-b border-border hover:bg-card-hover transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className={`
                          font-bold text-lg
                          ${rank === 1 ? 'text-yellow-500' : ''}
                          ${rank === 2 ? 'text-gray-400' : ''}
                          ${rank === 3 ? 'text-orange-600' : ''}
                          ${rank > 3 ? 'text-white' : ''}
                        `}>
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white font-medium">{displayName}</td>
                      <td className="py-4 px-4 text-white">{participant.score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">Hali ishtirokchilar yo'q</p>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={handleSendToTelegram} 
          variant={sendingTelegram ? 'disabled' : 'secondary'} 
          disabled={sendingTelegram}
          fullWidth
        >
          {sendingTelegram ? 'YUBORILMOQDA...' : 'TELEGRAM\'GA YUBORISH'}
        </Button>
        <Button onClick={() => navigate('/teacher/dashboard')} fullWidth>
          BOSH SAHIFA
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;
