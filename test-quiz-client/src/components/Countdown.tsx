import { useEffect, useState } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

const Countdown = ({ onComplete }: CountdownProps) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-[200px] font-bold text-white animate-pulse">
          {count}
        </div>
        <p className="text-2xl text-gray-400 mt-8">Test boshlanmoqda...</p>
      </div>
    </div>
  );
};

export default Countdown;
