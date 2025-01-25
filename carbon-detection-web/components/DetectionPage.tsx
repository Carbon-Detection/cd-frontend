import React, { useState } from 'react';
import { Camera, RefreshCcw, Upload, ArrowLeft, SwitchCamera, Settings2, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import Yolo from './models/Yolo';

interface DetectionPageProps {
  onBack: () => void;
}

function DetectionPage({ onBack }: DetectionPageProps) {


  const { isDetecting,processImage, setIsDetecting,setFacingMode, facingMode,changeCurrentModelResolution,reset, totalTime, setTotalTime, inferenceTime, setInferenceTime,totalEmissions, setTotalEmissions, liveDetection, runLiveDetection  } = useApp();


  const { theme, language } = useApp();
  const t = translations[language].detection;

  const bgColor = theme === 'dark' ? 'bg-slate-900' : 'bg-white';
  const cardBg = theme === 'dark' ? 'bg-slate-800/50' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-slate-700/50' : 'border-green-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgColor}`}>
      <nav className={`${cardBg} backdrop-blur-sm border-b ${borderColor}`}>
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className={`flex items-center ${mutedText} hover:${textColor} transition-colors`}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t.backHome}
          </button>
          <h1 className={`text-xl font-bold ${textColor}`}>{t.title}</h1>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>



      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className={`lg:col-span-3 ${cardBg} backdrop-blur-sm rounded-2xl overflow-hidden border ${borderColor}`}>
            
            <div className="aspect-video relative flex items-center justify-center bg-slate-900/50">
              {isDetecting ? (
                <Yolo setTotalTime={setTotalTime} setInferenceTime={setInferenceTime} setTotalEmissions={setTotalEmissions} totalEmissions={totalEmissions} />
              ) : (
                <div className="text-center p-8">
                  <p className={`mb-6 text-lg ${mutedText}`}>{t.noCamera}</p>
                  <button 
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                    onClick={() => setIsDetecting(true)}
                  >
                    <RefreshCcw className="h-5 w-5 mr-2" />
                    {t.startLive}
                  </button>
                  <div className="mt-4">
                    <button className={`text-sm ${mutedText} hover:${textColor} transition-colors inline-flex items-center`}>
                      <Upload className="h-4 w-4 mr-2" />
                      {t.uploadImage}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

      
          <div className="space-y-6">
            <div className={`${cardBg} backdrop-blur-sm rounded-2xl p-6 border ${borderColor}`}>
              <h2 className={`text-lg font-medium ${textColor} mb-4`}>{t.controls.title}</h2>
              <div className="space-y-3">
                <button onClick={async () => {
                const startTime = Date.now();
                await processImage();
                setTotalTime(Date.now() - startTime);
              }} className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg flex items-center justify-center">
                  <Camera className="h-5 w-5 mr-2" />
                  {t.controls.capture}
                </button>
                <button  onClick={async () => {
                  await setIsDetecting(true)
                  
                if (liveDetection.current) {
                  liveDetection.current = false;
                } else {
                  runLiveDetection();
                }
              }} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center">
                <RefreshCcw className="h-5 w-5 mr-2" />
                Live Detection
              </button>
                <button onClick={() => {
                reset();
                setFacingMode(facingMode === 'user' ? 'environment' : 'user');
              }} className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors">
                  <SwitchCamera className="h-5 w-5 mr-2" />
                  {t.controls.switchCamera}
                </button>
                {/* <button onClick={() => {
                reset();
                changeCurrentModelResolution();
              }} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors">
                  <Settings2 className="h-5 w-5 mr-2" />
                  {t.controls.changeModel}
                </button> */}
                <button               onClick={reset}
 className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  {t.controls.reset}
                </button>
              </div>
            </div>

            <div className={`${cardBg} backdrop-blur-sm rounded-2xl p-6 border ${borderColor}`}>
              <h2 className={`text-lg font-medium ${textColor} mb-4`}>{t.stats.title}</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={mutedText}>{t.stats.model}</span>
                  <span className={`${textColor} font-medium`}>YOLOv10n.onnx</span>
                </div>
              
                <div className="flex justify-between items-center">
                  <span className={mutedText}>{t.stats.totalTime}</span>
                  <span className={`${textColor} font-medium`}>{ + totalTime.toFixed() + 'ms'}</span>
                </div>

             
           
                <div className="flex justify-between items-center">
                  <span className={mutedText}>{t.stats.totalFps}</span>
                  <span className={`${textColor} font-medium`}>{+ (1000 / totalTime).toFixed(2) + 'fps'}</span>
                </div>

             

                <div className="flex justify-between items-center">
                  <span className={mutedText}>{t.stats.sumOfEmissions}</span>
                  <span className={`${textColor} font-medium`}>{totalEmissions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DetectionPage;