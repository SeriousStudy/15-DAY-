
import React, { useState, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';

interface HeaderProps {
  points: number;
  rank: string;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  resetProgress: () => void;
  quote: string;
}

const Header: React.FC<HeaderProps> = ({ points, rank, isDarkMode, setIsDarkMode, resetProgress, quote }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = time.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className={`sticky top-0 z-50 w-full ${isDarkMode ? 'bg-black/80 border-white/10' : 'bg-[#f5f5f7]/80 border-black/5'} backdrop-blur-xl border-b`}>
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-black italic">A</span>
          </div>
          <div className="hidden sm:block">
            <h1 className={`text-lg font-bold tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-[#1d1d1f]'}`}>
              Accountancy Challenge
            </h1>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Elite 2026</p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center">
          <div className={`text-sm font-black tracking-widest tabular-nums ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {formattedTime} <span className="opacity-30 mx-2">|</span> {formattedDate}
          </div>
          <p className={`text-[9px] font-bold uppercase tracking-[0.3em] mt-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {quote}
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <MusicPlayer />
          
          <div className="hidden sm:flex flex-col items-end">
            <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>{points} XP</span>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{rank}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover-pop ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              {isDarkMode ? '☼' : '☾'}
            </button>

            <button 
              onClick={resetProgress}
              className={`text-[10px] font-bold uppercase tracking-widest px-4 h-10 rounded-full hover:bg-red-500 hover:text-white transition-all ${isDarkMode ? 'text-zinc-600 border border-white/10' : 'text-zinc-400 border border-black/5'}`}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
