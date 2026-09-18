'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getHighConfidencePairs, GlobalMatchPair } from '@/lib/matcher';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  X,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export default function MatchAlertBanner() {
  const { items, setSelectedItemForDetail } = useApp();
  const [dismissed, setDismissed] = useState(false);

  const matchPairs = getHighConfidencePairs(items, 60);

  if (dismissed || matchPairs.length === 0) {
    return null;
  }

  // Display top match
  const topPair: GlobalMatchPair = matchPairs[0];

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-0.5 shadow-md shadow-amber-500/10 animate-in fade-in duration-300">
      <div className="bg-white rounded-[14px] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black shadow-sm shrink-0">
            <Zap className="w-5 h-5 fill-white" />
          </div>

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Smart Match Engine
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {topPair.result.score}% Match Confidence
              </span>
              {matchPairs.length > 1 && (
                <span className="text-[11px] text-slate-500 font-medium">
                  +{matchPairs.length - 1} more match detected
                </span>
              )}
            </div>

            <div className="text-xs sm:text-sm text-slate-800 font-bold flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-rose-600 truncate max-w-[200px]">Lost: {topPair.lostItem.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-emerald-700 truncate max-w-[200px]">Found: {topPair.foundItem.title}</span>
            </div>

            {/* Reasons pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {topPair.result.reasons.slice(0, 3).map((reason, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
                >
                  ✓ {reason}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <button
            onClick={() => setSelectedItemForDetail(topPair.foundItem)}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span>Review Match</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
