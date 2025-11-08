import { Outlet } from 'react-router-dom';

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};

export default StudentLayout;
