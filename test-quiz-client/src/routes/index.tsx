import { createBrowserRouter } from 'react-router-dom';
import Landing from '@/pages/Landing';
import TeacherLogin from '@/pages/teacher/Login';
import TeacherRegister from '@/pages/teacher/Register';
import TeacherDashboard from '@/pages/teacher/Dashboard';
import QuizCreate from '@/pages/teacher/QuizCreate';
import QuizBuild from '@/pages/teacher/QuizBuild';
import QuizLobby from '@/pages/teacher/QuizLobby';
import QuizActive from '@/pages/teacher/QuizActive';
import QuizResults from '@/pages/teacher/QuizResults';
import QuizTypeSelect from '@/pages/teacher/QuizTypeSelect';
import TeacherProfile from '@/pages/teacher/Profile';
import TeacherStudents from '@/pages/teacher/Students';
import TeacherArchive from '@/pages/teacher/Archive';
import StudentJoin from '@/pages/student/Join';
import StudentLobby from '@/pages/student/Lobby';
import StudentQuestion from '@/pages/student/Question';
import StudentResults from '@/pages/student/Results';
import TeacherLayout from '@/layouts/TeacherLayout';
import StudentLayout from '@/layouts/StudentLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/teacher/login',
    element: <TeacherLogin />,
  },
  {
    path: '/teacher/register',
    element: <TeacherRegister />,
  },
  {
    path: '/teacher',
    element: <TeacherLayout />,
    children: [
      {
        path: 'dashboard',
        element: <TeacherDashboard />,
      },
      {
        path: 'profile',
        element: <TeacherProfile />,
      },
      {
        path: 'students',
        element: <TeacherStudents />,
      },
      {
        path: 'archive',
        element: <TeacherArchive />,
      },
      {
        path: 'quiz/type',
        element: <QuizTypeSelect />,
      },
      {
        path: 'quiz/create',
        element: <QuizCreate />,
      },
      {
        path: 'quiz/:id/build',
        element: <QuizBuild />,
      },
      {
        path: 'quiz/:id/lobby',
        element: <QuizLobby />,
      },
      {
        path: 'quiz/:id/active',
        element: <QuizActive />,
      },
      {
        path: 'quiz/:id/results',
        element: <QuizResults />,
      },
    ],
  },
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      {
        path: 'quiz/:code/join',
        element: <StudentJoin />,
      },
      {
        path: 'quiz/:id/lobby',
        element: <StudentLobby />,
      },
      {
        path: 'quiz/:id/question/:questionId',
        element: <StudentQuestion />,
      },
      {
        path: 'quiz/:id/results',
        element: <StudentResults />,
      },
    ],
  },
]);
