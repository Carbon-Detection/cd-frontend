import React from 'react';
import { Languages } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function LanguageToggle() {
  const { language, setLanguage } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt-BR' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors flex items-center space-x-2"
      aria-label="Toggle language"
    >
      <Languages className="h-5 w-5" />
      <span className="text-sm font-medium">{language === 'en' ? 'EN' : 'PT'}</span>
    </button>
  );
}