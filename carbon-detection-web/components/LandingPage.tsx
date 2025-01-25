import React from 'react';
import { Leaf, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

interface LandingPageProps {
  onStart: () => void;
}

function LandingPage({ onStart }: LandingPageProps) {
  const { theme, language }:any = useApp();
  const t = translations[language].landing;

  const bgColor = theme === 'dark' 
    ? 'bg-gradient-to-b from-slate-900 to-slate-800' 
    : 'bg-gradient-to-b from-white to-green-50';
  
  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <nav className="p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className={`h-6 w-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
            <span className="text-xl font-bold">Carbon Detection</span>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-5xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent' : 'text-green-800'}`}>
            {t.title}
          </h1>
          <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.subtitle}
          </p>
          <button
            onClick={onStart}
            className={`${
              theme === 'dark'
                ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            } px-8 py-4 rounded-lg font-semibold text-lg flex items-center space-x-2 mx-auto hover:opacity-90 transition-opacity`}
          >
            {t.startButton}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(t.features).map(([key, feature]:any) => (
            <div key={key} className={`${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
              <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-green-400/20' : 'bg-green-100'} rounded-lg flex items-center justify-center mb-4`}>
                <Leaf className={`h-6 w-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default LandingPage;