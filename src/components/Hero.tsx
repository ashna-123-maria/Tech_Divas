'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Search,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  MessageSquare,
  Compass,
} from 'lucide-react';

export default function Hero() {
  const { openReportModal, items } = useApp();

  const lostCount = items.filter(i => i.type === 'lost' && i.status === 'active').length;
  const returnedCount = items.filter(i => i.status === 'returned').length;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50 border-b border-slate-200/80 pt-8 pb-10 sm:py-12 mb-8">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* University Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Official Campus Lost & Found System • Replaces WhatsApp Chaos</span>
        </div>

        {/* Main Heading */}
        <div className="max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Lost something on campus? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              We help you find it in minutes.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Report lost or found items, get smart AI-powered similarity alerts, and claim your belongings through secure ownership verification across all campus facilities.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openReportModal('lost')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md hover:shadow-lg shadow-rose-600/20 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>I Lost an Item</span>
          </button>

          <button
            onClick={() => openReportModal('found')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>I Found an Item</span>
          </button>
        </div>

        {/* Feature Highlights Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-4 text-left">
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Smart Match Engine</p>
              <p className="text-[11px] text-slate-500">Auto-matches items by text, location & date</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Anti-Theft Proof Quiz</p>
              <p className="text-[11px] text-slate-500">Only verified owners can claim property</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">WhatsApp Card Bridge</p>
              <p className="text-[11px] text-slate-500">1-click sharing to campus groups</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
