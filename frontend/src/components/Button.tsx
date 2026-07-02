import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black',
  secondary: 'bg-gray-200 text-black hover:bg-gray-300',
  outline: 'border border-gray-300 text-black hover:bg-gray-50',
  ghost: 'text-black hover:bg-gray-100'
};

const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-medium rounded transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className || ''}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
