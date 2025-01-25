import React, { useState } from 'react';
import { Camera, Leaf, PlayCircle, RefreshCcw, Settings2, Upload } from 'lucide-react';
import LandingPage from '../components/LandingPage';
import DetectionPage from '../components/DetectionPage';

function Home() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'detection'>('landing');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {currentPage === 'landing' ? (
        <LandingPage onStart={() => setCurrentPage('detection')} />
      ) : (
        <DetectionPage onBack={() => setCurrentPage('landing')} />
      )}
    </div>
  );
}

export default Home;