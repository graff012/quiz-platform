import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { api } from '@/lib/api';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  telegramId?: string;
  createdAt: string;
}

const TeacherProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [telegramId, setTelegramId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          console.error('User ID not found');
          return;
        }

        // Fetch user profile
        const response = await api.getUser(userId);
        setProfile(response);
        setTelegramId(response.telegramId || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveTelegramId = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      await api.updateUser(profile.id, { telegramId });
      setProfile({ ...profile, telegramId });
      setIsEditing(false);
      alert('Telegram ID saqlandi! ✅');
    } catch (error) {
      console.error('Error updating Telegram ID:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile) return;

    const confirmText = prompt(
      'Akkauntni o\'chirish uchun "DELETE" so\'zini kiriting.\n\n' +
      'DIQQAT: Bu amalni qaytarib bo\'lmaydi! Barcha testlaringiz va ma\'lumotlaringiz o\'chiriladi.'
    );

    if (confirmText !== 'DELETE') {
      if (confirmText !== null) {
        alert('Tasdiqlash noto\'g\'ri. Akkount o\'chirilmadi.');
      }
      return;
    }

    try {
      setDeleting(true);
      await api.deleteAccount(profile.id);
      
      // Clear all local storage
      localStorage.clear();
      
      alert('Akkauntingiz o\'chirildi.');
      
      // Redirect to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-white text-xl">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-white text-xl">Profil topilmadi</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Profil</h1>

      {/* Personal Information */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-6">Shaxsiy ma'lumotlar</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Ism</label>
              <p className="text-white text-lg">{profile.firstName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Familiya</label>
              <p className="text-white text-lg">{profile.lastName}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">Telefon raqam</label>
            <p className="text-white text-lg">{profile.phoneNumber}</p>
          </div>

          {/* <div> */}
          {/*   <label className="text-sm text-gray-400 block mb-2">Rol</label> */}
          {/*   <p className="text-white text-lg">{profile.role === 'TEACHER' ? 'O\'qituvchi' : profile.role}</p> */}
          {/* </div> */}

          <div>
            <label className="text-sm text-gray-400 block mb-2">Ro'yxatdan o'tgan sana</label>
            <p className="text-white text-lg">
              {new Date(profile.createdAt).toLocaleDateString('uz-UZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </Card>

      {/* Telegram Integration */}
      <Card>
        <h2 className="text-2xl font-bold text-white mb-4">Telegram integratsiyasi</h2>
        <p className="text-gray-400 mb-6">
          Test natijalari Telegram orqali yuborilishi uchun Telegram ID ni kiriting.
        </p>

        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-2">📱 Telegram ID ni qanday topish mumkin?</h3>
          <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
            <li>Telegram'da <code className="bg-gray-800 px-1 rounded">@userinfobot</code> botini oching</li>
            <li><code className="bg-gray-800 px-1 rounded">/start</code> buyrug'ini yuboring</li>
            <li>Bot sizga ID raqamingizni yuboradi</li>
            <li>O'sha raqamni bu yerga kiriting</li>
          </ol>
        </div>

        {/* Telegram ID Input */}
        <div className="space-y-4">
          {isEditing ? (
            <>
              <Input
                type="text"
                label="Telegram ID"
                placeholder="Masalan: 123456789"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                fullWidth
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveTelegramId}
                  disabled={saving || !telegramId}
                  className="flex-1"
                >
                  {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setTelegramId(profile.telegramId || '');
                  }}
                  variant="secondary"
                  className="flex-1"
                  disabled={saving}
                >
                  Bekor qilish
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Telegram ID</label>
                {profile.telegramId ? (
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                    <div>
                      <p className="text-white text-lg font-mono">{profile.telegramId}</p>
                      <p className="text-green-400 text-sm mt-1">✅ Ulangan</p>
                    </div>
                    <Button onClick={() => setIsEditing(true)} variant="secondary">
                      O'zgartirish
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                    <div>
                      <p className="text-gray-400">Telegram ID kiritilmagan</p>
                      <p className="text-yellow-400 text-sm mt-1">⚠️ Test natijalari Telegram'ga yuborilmaydi</p>
                    </div>
                    <Button onClick={() => setIsEditing(true)}>
                      + Qo'shish
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Danger Zone - Delete Account */}
      <Card className="mt-6 border-2 border-red-600">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Xavfli zona</h2>
        <p className="text-gray-400 mb-6">
          Akkauntni o'chirish barcha ma'lumotlaringizni butunlay yo'q qiladi. Bu amalni qaytarib bo'lmaydi.
        </p>

        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-2">⚠️ Quyidagilar o'chiriladi:</h3>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>Barcha yaratilgan testlar</li>
            <li>Barcha test natijalari</li>
            <li>Shaxsiy ma'lumotlar</li>
            <li>Telegram integratsiyasi</li>
            <li>Arxivdagi barcha ma'lumotlar</li>
          </ul>
        </div>

        <Button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 w-full"
        >
          {deleting ? 'O\'chirilmoqda...' : 'AKKAUNTNI O\'CHIRISH'}
        </Button>
      </Card>
    </div>
  );
};

export default TeacherProfile;
