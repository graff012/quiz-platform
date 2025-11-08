import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { api } from '@/lib/api';
import { useQuizStore } from '@/store/useQuizStore';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'),
  lastName: z.string().min(2, 'Familiya kamida 2 ta belgidan iborat bo\'lishi kerak'),
  phoneNumber: z.string().regex(/^\+998\d{9}$/, 'Telefon raqam noto\'g\'ri (masalan: +998901234567)'),
  password: z.string().min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Parollar mos kelmaydi',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const TeacherRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useQuizStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      setError('');
      
      // Call register API endpoint
      const response = await api.teacherRegister(data.firstName, data.lastName, data.phoneNumber, data.password);
      
      // Save token and user
      localStorage.setItem('auth_token', response.access_token);
      setUser(response.user);

      // Redirect based on state
      const quizType = (location.state as any)?.quizType;
      if (quizType) {
        navigate('/teacher/quiz/create', { state: { quizType } });
      } else {
        navigate('/teacher/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          O'qituvchi ro'yxatdan o'tish
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Test yaratish uchun ro'yxatdan o'ting
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Ism"
            type="text"
            placeholder="Ism"
            {...register('firstName')}
            error={errors.firstName?.message}
            fullWidth
          />

          <Input
            label="Familiya"
            type="text"
            placeholder="Familiya"
            {...register('lastName')}
            error={errors.lastName?.message}
            fullWidth
          />

          <Input
            label="Telefon raqam"
            type="tel"
            placeholder="+998901234567"
            {...register('phoneNumber')}
            error={errors.phoneNumber?.message}
            fullWidth
          />

          <Input
            label="Parol"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
            fullWidth
          />

          <Input
            label="Parolni tasdiqlang"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            fullWidth
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            fullWidth
            variant={loading ? 'disabled' : 'primary'}
            disabled={loading}
          >
            {loading ? 'Yuklanmoqda...' : 'RO\'YXATDAN O\'TISH'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Akkauntingiz bormi?{' '}
            <Link 
              to="/teacher/login" 
              state={location.state}
              className="text-white hover:text-gray-300 underline"
            >
              Kirish
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default TeacherRegister;
