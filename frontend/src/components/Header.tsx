import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Button } from './Button';

export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-full" />
            <h1 className="text-2xl font-bold">Voting System</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {isDark ? '☀️' : '🌙'}
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
