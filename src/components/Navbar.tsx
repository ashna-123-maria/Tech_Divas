'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DEMO_PERSONAS } from '@/data/mockData';
import {
  Compass,
  ShieldCheck,
  PlusCircle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Building2,
  CheckCircle2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

export default function Navbar() {
  const {
    items,
    claims,
    currentPersona,
    setCurrentPersona,
    openReportModal,
    activeView,
    setActiveView,
    resetAllData,
  } = useApp();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const activeLostCount = items.filter(i => i.type === 'lost' && i.status === 'active').length;
  const returnedCount = items.filter(i => i.status === 'returned').length;
  const pendingClaimsCount = claims.filter(c => c.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('feed')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                    Campus<span className="text-sky-600">Find</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  Centralized Campus Lost & Found System
                </p>
              </div>
            </button>
          </div>

          {/* Quick Metrics (Desktop) */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>{activeLostCount} Lost Items</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{returnedCount} Reunited</span>
            </div>
            {currentPersona.role === 'security' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>{pendingClaimsCount} Claims Pending</span>
              </div>
            )}
          </div>

          {/* Action Center & Persona Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Switcher: Feed vs Security Desk */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold text-slate-600">
              <button
                onClick={() => setActiveView('feed')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeView === 'feed'
                    ? 'bg-white text-sky-700 shadow-sm font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Campus Feed</span>
              </button>
              <button
                onClick={() => setActiveView('admin')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 relative ${
                  activeView === 'admin'
                    ? 'bg-white text-indigo-700 shadow-sm font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Security Desk</span>
                {pendingClaimsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {pendingClaimsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Report Buttons */}
            <button
              onClick={() => openReportModal('lost')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report Lost</span>
            </button>
            <button
              onClick={() => openReportModal('found')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report Found</span>
            </button>

            {/* Demo Persona Switcher (For Hackathon Judges) */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-left transition-all"
                title="Switch test persona for hackathon grading"
              >
                <span className="text-xl leading-none">{currentPersona.avatar}</span>
                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {currentPersona.name}
                  </p>
                  <p className="text-[10px] text-sky-600 font-semibold leading-none">
                    {currentPersona.badge}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Persona Dropdown */}
              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Judge Persona Switcher
                    </span>
                    <button
                      onClick={() => {
                        resetAllData();
                        setIsPersonaMenuOpen(false);
                      }}
                      className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-100"
                      title="Reset seed records"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Seed
                    </button>
                  </div>
                  <div className="p-1 space-y-1">
                    {DEMO_PERSONAS.map(persona => {
                      const isSelected = persona.id === currentPersona.id;
                      return (
                        <button
                          key={persona.id}
                          onClick={() => {
                            setCurrentPersona(persona);
                            setIsPersonaMenuOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-start gap-2.5 transition-colors ${
                            isSelected
                              ? 'bg-sky-50 text-sky-900 border border-sky-100'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="text-2xl mt-0.5">{persona.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold truncate">{persona.name}</p>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                persona.role === 'security'
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-slate-200 text-slate-700'
                              }`}>
                                {persona.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{persona.department}</p>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{persona.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
