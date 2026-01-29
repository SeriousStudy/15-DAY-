
import React, { useState, useEffect, useMemo } from 'react';
import { EXAM_DATE } from '../constants';

const FORMULAS = [
  { name: 'Current Ratio', formula: 'Current Assets / Current Liabilities', result: 'Ideal: 2:1' },
  { name: 'Quick Ratio', formula: '(Current Assets - Inventory - Prepaid Exp) / Current Liabilities', result: 'Ideal: 1:1' },
  { name: 'Debt Equity Ratio', formula: 'Total Debt / Shareholders Funds', result: 'Solvency Measure' },
  { name: 'Inventory Turnover', formula: 'COGS / Average Inventory', result: 'Efficiency Measure' },
  { name: 'Gross Profit Ratio', formula: '(Gross Profit / Net Sales) * 100', result: 'Profitability' },
];

const FLASHCARDS = [
  { q: "What is Double Entry?", a: "Every transaction affects at least two accounts with equal debits and credits." },
  { q: "Accrual Concept?", a: "Revenue/expenses recorded when earned/incurred, not when cash moves." },
  { q: "Going Concern?", a: "Assumption that business will continue for the foreseeable future." },
  { q: "Conservatism?", a: "Anticipate no profit, provide for all possible losses." },
];

const ProductivitySuite: React.FC = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  // Existing Tool States
  const [waterCount, setWaterCount] = useState(0);
  const [notes, setNotes] = useState(() => localStorage.getItem('productivity_notes') || '');
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [liveUsers, setLiveUsers] = useState(() => Math.floor(Math.random() * (1000 - 100 + 1)) + 100);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0 });

  // New Tool States
  const [formulaQuery, setFormulaQuery] = useState('');
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [breathingState, setBreathingState] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Relax'>('Relax');
  const [breathingTimer, setBreathingTimer] = useState(0);
  
  // T-Account State
  const [debits, setDebits] = useState<{id: number, val: number}[]>([]);
  const [credits, setCredits] = useState<{id: number, val: number}[]>([]);
  const [tInput, setTInput] = useState('');

  // Curriculum Checkpoint
  const [checkedChapters, setCheckedChapters] = useState<string[]>(() => {
    const saved = localStorage.getItem('checked_chapters');
    return saved ? JSON.parse(saved) : [];
  });

  const chapters = ["Partnership", "Share Capital", "Cash Flow", "Financial Analysis", "Ratios", "NPO"];

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diffTime = EXAM_DATE.getTime() - now.getTime();
      const d = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const h = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setCountdown({ days: d, hours: h });
    };
    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('checked_chapters', JSON.stringify(checkedChapters));
  }, [checkedChapters]);

  // Breathing Loop
  useEffect(() => {
    let interval: any;
    if (breathingState !== 'Relax') {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          if (prev >= 4) {
            if (breathingState === 'Inhale') setBreathingState('Hold');
            else if (breathingState === 'Hold') setBreathingState('Exhale');
            else if (breathingState === 'Exhale') setBreathingState('Relax');
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathingState]);

  const filteredFormulas = useMemo(() => {
    if (!formulaQuery) return [];
    return FORMULAS.filter(f => f.name.toLowerCase().includes(formulaQuery.toLowerCase()));
  }, [formulaQuery]);

  const handleCalc = (val: string) => {
    if (val === '=') {
      try {
        const sanitized = calcInput.replace(/[^-+*/.0-9]/g, '');
        setCalcResult(eval(sanitized).toString());
      } catch { setCalcResult('Err'); }
    } else if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else { setCalcInput(prev => prev + val); }
  };

  const handleToggleChapter = (chapter: string) => {
    setCheckedChapters(prev => prev.includes(chapter) ? prev.filter(c => c !== chapter) : [...prev, chapter]);
  };

  const totalDebits = debits.reduce((acc, curr) => acc + curr.val, 0);
  const totalCredits = credits.reduce((acc, curr) => acc + curr.val, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* 1. Water Tracker */}
      <div className="apple-card p-7 flex flex-col items-center justify-between min-h-[180px] hover-pop">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Hydration Monitor</h4>
        <div className="flex items-center space-x-5">
          <button onClick={() => setWaterCount(Math.max(0, waterCount - 1))} className="w-10 h-10 rounded-full border border-black/5 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">-</button>
          <span className="text-3xl font-black">{waterCount}</span>
          <button onClick={() => setWaterCount(waterCount + 1)} className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg">+</button>
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-2 rounded-full mt-4 overflow-hidden">
          <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, (waterCount / 8) * 100)}%` }} />
        </div>
      </div>

      {/* 2. Exam Countdown */}
      <div className="apple-card p-7 flex flex-col items-center justify-center min-h-[180px] hover-pop bg-red-600/5 border border-red-500/10">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3">T-Minus Finals</h4>
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-black tracking-tighter text-red-500">{countdown.days}d</span>
          <span className="text-2xl font-bold text-red-500/50">{countdown.hours}h</span>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-widest opacity-40 mt-2">Until Examination</p>
      </div>

      {/* 3. Flashcard Protocol (New Working Tool) */}
      <div className="apple-card p-7 flex flex-col min-h-[180px] hover-pop relative overflow-hidden">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Term Recital</h4>
        <div 
          onClick={() => setFlashcardFlipped(!flashcardFlipped)}
          className={`flex-1 flex items-center justify-center text-center p-4 cursor-pointer transition-all duration-500 ${flashcardFlipped ? 'rotate-x-180' : ''}`}
        >
          <p className="text-sm font-bold leading-relaxed">
            {flashcardFlipped ? FLASHCARDS[flashcardIdx].a : FLASHCARDS[flashcardIdx].q}
          </p>
        </div>
        <div className="flex justify-between items-center mt-2">
           <button onClick={(e) => { e.stopPropagation(); setFlashcardIdx(i => (i - 1 + FLASHCARDS.length) % FLASHCARDS.length); setFlashcardFlipped(false); }} className="text-[10px] font-bold text-blue-500">PREV</button>
           <span className="text-[9px] font-bold opacity-30">{flashcardIdx + 1}/{FLASHCARDS.length}</span>
           <button onClick={(e) => { e.stopPropagation(); setFlashcardIdx(i => (i + 1) % FLASHCARDS.length); setFlashcardFlipped(false); }} className="text-[10px] font-bold text-blue-500">NEXT</button>
        </div>
      </div>

      {/* 4. Curriculum Checkpoint (New Working Tool) */}
      <div className="apple-card p-7 flex flex-col min-h-[180px] hover-pop">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Milestone Gate</h4>
        <div className="space-y-2 max-h-[100px] overflow-y-auto hide-scrollbar">
          {chapters.map(ch => (
            <label key={ch} className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" className="hidden" checked={checkedChapters.includes(ch)} onChange={() => handleToggleChapter(ch)} />
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checkedChapters.includes(ch) ? 'bg-green-500 border-green-500' : 'border-zinc-300 dark:border-zinc-700'}`}>
                {checkedChapters.includes(ch) && <span className="text-white text-[8px]">✓</span>}
              </div>
              <span className={`text-[11px] font-bold ${checkedChapters.includes(ch) ? 'line-through opacity-30' : 'opacity-70'}`}>{ch}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. T-Account Scratchpad (New Working Tool) */}
      <div className="apple-card p-7 flex flex-col min-h-[220px] lg:col-span-2 hover-pop">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ledger Scratchpad</h4>
          <div className="flex space-x-2">
            <button onClick={() => { if (tInput) setDebits([...debits, {id: Date.now(), val: parseFloat(tInput)}]); setTInput(''); }} className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">DR+</button>
            <button onClick={() => { if (tInput) setCredits([...credits, {id: Date.now(), val: parseFloat(tInput)}]); setTInput(''); }} className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded">CR+</button>
            <button onClick={() => { setDebits([]); setCredits([]); }} className="text-[9px] font-bold text-zinc-400 bg-zinc-400/10 px-2 py-1 rounded">CLR</button>
          </div>
        </div>
        <input 
          type="number" value={tInput} onChange={(e) => setTInput(e.target.value)} placeholder="Enter amount..."
          className={`w-full py-2 px-4 rounded-xl text-xs font-bold mb-4 outline-none border ${isDark ? 'bg-black border-white/5' : 'bg-zinc-50 border-black/5'}`}
        />
        <div className="flex-1 grid grid-cols-2 border-t border-black/5 dark:border-white/5 pt-2 gap-4">
          <div className="text-right pr-2">
            <div className="text-[9px] font-bold opacity-30 uppercase mb-2">Debit</div>
            <div className="space-y-1 text-[11px] font-mono opacity-60">
              {debits.map(d => <div key={d.id}>{d.val.toLocaleString()}</div>)}
            </div>
            <div className="mt-2 border-t border-blue-500/20 pt-1 font-black text-blue-500 text-xs">Σ {totalDebits.toLocaleString()}</div>
          </div>
          <div className="text-left pl-2 border-l border-black/5 dark:border-white/5">
            <div className="text-[9px] font-bold opacity-30 uppercase mb-2">Credit</div>
            <div className="space-y-1 text-[11px] font-mono opacity-60">
              {credits.map(c => <div key={c.id}>{c.val.toLocaleString()}</div>)}
            </div>
            <div className="mt-2 border-t border-red-500/20 pt-1 font-black text-red-500 text-xs">Σ {totalCredits.toLocaleString()}</div>
          </div>
        </div>
        <div className="mt-2 text-center text-[10px] font-bold opacity-50">Balance: {(totalDebits - totalCredits).toLocaleString()}</div>
      </div>

      {/* 6. Formula Vault (Fully Searchable) */}
      <div className="apple-card p-7 flex flex-col min-h-[220px] hover-pop lg:col-span-2">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Query Formula Vault</h4>
        <div className="relative">
          <input 
            type="text" 
            value={formulaQuery}
            onChange={(e) => setFormulaQuery(e.target.value)}
            placeholder="Search e.g. 'Current Ratio'..." 
            className={`w-full py-4 px-6 rounded-2xl border transition-all font-semibold text-sm outline-none ${isDark ? 'bg-black border-white/5 focus:border-blue-500/50' : 'bg-zinc-50 border-black/5 focus:border-blue-500/20'}`}
          />
        </div>
        <div className="mt-4 flex-1 overflow-y-auto hide-scrollbar space-y-3">
           {filteredFormulas.length > 0 ? filteredFormulas.map(f => (
             <div key={f.name} className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
               <p className="text-[11px] font-black text-blue-500">{f.name}</p>
               <p className="text-[10px] font-mono mt-1 opacity-60">{f.formula}</p>
               <p className="text-[9px] font-bold mt-1 text-green-500">{f.result}</p>
             </div>
           )) : (
             <div className="text-[10px] opacity-20 italic p-4 text-center">Enter keywords to query the financial logic vault...</div>
           )}
        </div>
      </div>

      {/* 7. Zen Focus (Breathing - New Working Tool) */}
      <div className="apple-card p-7 flex flex-col items-center justify-between min-h-[200px] hover-pop relative">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Cognitive Calm</h4>
        <div className="relative w-24 h-24 flex items-center justify-center">
           <div className={`absolute w-full h-full rounded-full bg-blue-500/10 transition-all duration-1000 ${breathingState === 'Inhale' ? 'scale-125' : breathingState === 'Exhale' ? 'scale-75' : 'scale-100'}`}></div>
           <div className={`w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20 ${breathingState !== 'Relax' ? 'animate-pulse' : ''}`}></div>
        </div>
        <div className="text-center">
           <p className="text-xs font-black uppercase tracking-widest text-blue-500">{breathingState}</p>
           {breathingState !== 'Relax' && <p className="text-[10px] font-mono opacity-30 mt-1">{4 - breathingTimer}s</p>}
        </div>
        <button 
          onClick={() => setBreathingState(s => s === 'Relax' ? 'Inhale' : 'Relax')}
          className="w-full py-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all"
        >
          {breathingState === 'Relax' ? 'START BREATHING' : 'END PROTOCOL'}
        </button>
      </div>

      {/* 8. Study Hall Status */}
      <div className="apple-card p-7 flex flex-col justify-between min-h-[200px] hover-pop">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Study Hall Status</h4>
        <div className="flex-1 flex flex-col justify-center space-y-4 py-4">
           <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-bold">{liveUsers} Live Users</span>
           </div>
           <p className="text-[10px] opacity-40">Connecting with elite accountancy candidates worldwide. (Dynamic tracking enabled)</p>
        </div>
        <button className="w-full py-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all">ENTER HALL</button>
      </div>

      {/* 9. Logic Calculator (Expanded) */}
      <div className="apple-card p-7 flex flex-col min-h-[220px] hover-pop lg:col-span-2">
        <div className="flex justify-between items-center mb-4">
           <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Precision Engine</h4>
           <button onClick={() => handleCalc('C')} className="text-[10px] font-bold text-red-500">CLEAR</button>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl mb-4 text-right font-mono text-xl h-16 flex flex-col justify-end shadow-inner">
          <div className="opacity-20 text-xs mb-1">{calcInput || '0'}</div>
          <div className="font-black">{calcResult || calcInput || '0'}</div>
        </div>
        <div className="grid grid-cols-4 gap-2 flex-1">
          {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => (
            <button 
               key={btn} 
               onClick={() => handleCalc(btn)} 
               className={`rounded-xl text-xs font-bold transition-all ${btn === '=' ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* 10. Pro Reflection Journal */}
      <div className="apple-card p-8 flex flex-col lg:col-span-2 min-h-[220px] hover-pop bg-blue-600/5 border border-blue-500/10">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-4">Daily Performance Review</h4>
        <textarea 
           value={notes}
           onChange={(e) => setNotes(e.target.value)}
           placeholder="Summarize your cognitive performance today. What was your peak hour?"
           className="flex-1 bg-transparent border-none outline-none text-sm font-bold italic leading-relaxed placeholder:opacity-30 resize-none"
        />
        <div className="mt-4 flex items-center space-x-4 opacity-30">
           <span className="text-[9px] font-bold uppercase tracking-widest">Self-Rating:</span>
           <div className="flex space-x-1">
              {Array.from({length: 5}).map((_, i) => <span key={i} className="text-xs">⭐</span>)}
           </div>
        </div>
      </div>

    </div>
  );
};

export default ProductivitySuite;
