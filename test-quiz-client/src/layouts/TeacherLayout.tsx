import { Outlet, Link, useLocation } from 'react-router-dom';

const TeacherLayout = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/teacher/dashboard', label: 'Boshqaruv', icon: '📊' },
    { path: '/teacher/students', label: "O'quvchilar", icon: '👥' },
    { path: '/teacher/archive', label: 'Arxiv', icon: '📁' },
    { path: '/teacher/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">Quiz App</h1>
          <p className="text-sm text-gray-400 mt-1">Teacher Panel</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-card-hover transition-colors ${
                location.pathname === item.path ? 'bg-card-hover border-l-4 border-primary' : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
