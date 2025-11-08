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

const loginSchema = z.object({
  phoneNumber: z.string().regex(/^\+998\d{9}$/, 'Telefon raqam noto\'g\'ri (masalan: +998901234567)'),
  password: z.string().min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
});

type LoginForm = z.infer<typeof loginSchema>;

const TeacherLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useQuizStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.teacherLogin(data.phoneNumber, data.password);
      
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
      setError(err.response?.data?.message || 'Login xatosi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          O'qituvchi kirish
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            fullWidth
            variant={loading ? 'disabled' : 'primary'}
            disabled={loading}
          >
            {loading ? 'Yuklanmoqda...' : 'Kirish'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Akkauntingiz yo'qmi?{' '}
            <Link 
              to="/teacher/register" 
              state={location.state}
              className="text-white hover:text-gray-300 underline"
            >
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default TeacherLogin;
