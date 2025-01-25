import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </button>
  );
}