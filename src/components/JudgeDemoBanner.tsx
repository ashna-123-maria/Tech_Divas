'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DEMO_PERSONAS } from '@/data/mockData';
import {
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Play,
} from 'lucide-react';

export default function JudgeDemoBanner() {
  const {
    setCurrentPersona,
    setActiveView,
    setSearchQuery,
    setSelectedLocation,
    setSelectedType,
    openReportModal,
    resetAllData,
  } = useApp();

  const [isOpen, setIsOpen] = useState(true);
  const [activeScenario, setActiveScenario] = useState<number | null>(null);

  const runScenario1 = () => {
    setActiveScenario(1);
    setCurrentPersona(DEMO_PERSONAS[0]); // Sarah
    setActiveView('feed');
    setSelectedType('all');
    setSelectedLocation('Central Library');
    setSearchQuery('MacBook');
  };

  const runScenario2 = () => {
    setActiveScenario(2);
    setCurrentPersona(DEMO_PERSONAS[1]); // Priya
    setActiveView('feed');
    setSelectedType('all');
    setSelectedLocation('all');
    setSearchQuery('');
    openReportModal('found');
  };

  const runScenario3 = () => {
    setActiveScenario(3);
    setCurrentPersona(DEMO_PERSONAS[2]); // Officer Dave
    setActiveView('admin');
  };

  const runScenario4 = () => {
    setActiveScenario(4);
    setCurrentPersona(DEMO_PERSONAS[2]); // Officer Dave
    setActiveView('admin');
    setTimeout(() => {
      const el = document.getElementById('db-recovery-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>Judge Demo Guide</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:right-6 z-40 w-[94vw] sm:w-[540px] bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-4 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs">
            ★
          </div>
          <div>
            <h4 className="text-xs font-black tracking-wide text-amber-300 uppercase">
              Hackathon Judge Demo Guide
            </h4>
            <p className="text-[10px] text-slate-400">1-click test flows for evaluation</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              resetAllData();
              setActiveScenario(null);
            }}
            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800"
            title="Reset seed records"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Quick Scenarios */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
        
        {/* Scenario 1 */}
        <button
          onClick={runScenario1}
          className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeScenario === 1
              ? 'bg-sky-950 border-sky-400 text-white shadow-xs'
              : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-300'
          }`}
        >
          <div>
            <span className="text-xs font-bold text-sky-400 block">Flow 1</span>
            <p className="text-[11px] font-extrabold text-white leading-tight mt-0.5">Smart Match</p>
          </div>
          <p className="text-[9px] text-slate-400 mt-1 leading-tight">Sarah&apos;s MacBook (92% Match)</p>
        </button>

        {/* Scenario 2 */}
        <button
          onClick={runScenario2}
          className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeScenario === 2
              ? 'bg-emerald-950 border-emerald-400 text-white shadow-xs'
              : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-300'
          }`}
        >
          <div>
            <span className="text-xs font-bold text-emerald-400 block">Flow 2</span>
            <p className="text-[11px] font-extrabold text-white leading-tight mt-0.5">Report & Quiz</p>
          </div>
          <p className="text-[9px] text-slate-400 mt-1 leading-tight">Priya logs found item</p>
        </button>

        {/* Scenario 3 */}
        <button
          onClick={runScenario3}
          className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeScenario === 3
              ? 'bg-indigo-950 border-indigo-400 text-white shadow-xs'
              : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-300'
          }`}
        >
          <div>
            <span className="text-xs font-bold text-indigo-400 block">Flow 3</span>
            <p className="text-[11px] font-extrabold text-white leading-tight mt-0.5">Security Desk</p>
          </div>
          <p className="text-[9px] text-slate-400 mt-1 leading-tight">Officer verifies proof & confetti</p>
        </button>

        {/* Scenario 4 */}
        <button
          onClick={runScenario4}
          className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeScenario === 4
              ? 'bg-rose-950 border-rose-400 text-white shadow-xs'
              : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-300'
          }`}
        >
          <div>
            <span className="text-xs font-bold text-rose-400 block">Flow 4</span>
            <p className="text-[11px] font-extrabold text-white leading-tight mt-0.5">DB Recovery</p>
          </div>
          <p className="text-[9px] text-slate-400 mt-1 leading-tight">Phase 2: 80% Recovery Rate</p>
        </button>

      </div>

    </div>
  );
}
