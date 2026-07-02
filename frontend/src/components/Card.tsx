import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 ${className || ''}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`mb-4 ${className || ''}`}>{children}</div>;
};

export const CardTitle: React.FC<CardProps> = ({ children, className }) => {
  return <h2 className={`text-2xl font-bold ${className || ''}`}>{children}</h2>;
};

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`${className || ''}`}>{children}</div>;
};

export const CardFooter: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`mt-6 flex gap-2 ${className || ''}`}>{children}</div>;
};
