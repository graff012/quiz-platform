import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth, className = '', ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label className="block text-white text-lg mb-3 font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            bg-transparent border-2 border-white rounded-xl px-6 py-4 
            text-white text-lg placeholder-gray-500 
            focus:outline-none focus:border-gray-300 transition-colors
            ${widthClass} ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
