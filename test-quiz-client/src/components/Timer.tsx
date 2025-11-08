import { useEffect, useState } from 'react';

interface TimerProps {
  seconds: number;
  onComplete?: () => void;
  className?: string;
}

const Timer = ({ seconds, onComplete, className = '' }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const isLow = timeLeft <= 10;

  return (
    <div className={`text-2xl font-bold ${isLow ? 'text-red-500' : 'text-white'} ${className}`}>
      {formatTime(timeLeft)}
    </div>
  );
};

export default Timer;
