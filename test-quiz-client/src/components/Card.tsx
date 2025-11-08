import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = ({ children, className = '', padding = 'lg', hover = false, ...props }: CardProps) => {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyle = hover ? 'hover:bg-card-hover cursor-pointer transition-colors' : '';

  return (
    <div className={`bg-card rounded-2xl ${paddingStyles[padding]} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
