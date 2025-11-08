import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'disabled';
  children: ReactNode;
  fullWidth?: boolean;
}

const Button = ({ variant = 'primary', children, fullWidth, className = '', ...props }: ButtonProps) => {
  const baseStyles = 'px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200';
  
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-100 active:scale-95',
    secondary: 'bg-black text-white border-2 border-white hover:bg-white hover:text-black',
    disabled: 'bg-gray-600 text-gray-400 cursor-not-allowed',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      disabled={variant === 'disabled' || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
