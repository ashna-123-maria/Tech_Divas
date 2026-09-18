'use client';

import React from 'react';
import { Item } from '@/types';
import { useApp } from '@/context/AppContext';
import { getSmartMatchesForItem } from '@/lib/matcher';
import {
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface SuggestedMatchesProps {
  item: Item;
  onSelectCandidate?: (candidate: Item) => void;
}

export default function SuggestedMatches({ item, onSelectCandidate }: SuggestedMatchesProps) {
  const { items, setSelectedItemForDetail, setSelectedItemForClaim } = useApp();

  const matches = getSmartMatchesForItem(item, items, 40);

  if (matches.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
        <p className="text-xs font-bold text-slate-700">No Potential Matches Yet</p>
        <p className="text-[11px] text-slate-400">
          Our smart matcher runs continuously as new lost and found reports are submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Suggested Matches ({matches.length})</span>
        </h4>
        <span className="text-[11px] text-slate-400 font-medium">Scored by NLP & Location Proximity</span>
      </div>

      <div className="space-y-2.5">
        {matches.map(({ candidateItem, score, reasons }) => {
          const isHighConfidence = score >= 70;

          return (
            <div
              key={candidateItem.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-xs transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {candidateItem.imageUrl ? (
                    <img
                      src={candidateItem.imageUrl}
                      alt={candidateItem.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 text-lg">
                      📦
                    </div>
                  )}

                  <div>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {candidateItem.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-sky-600" />
                        {candidateItem.location}
                      </span>
                      <span>•</span>
                      <span>{candidateItem.date}</span>
                    </div>
                  </div>
                </div>

                {/* Score Pill */}
                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black ${
                      isHighConfidence
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {score}% Match
                  </span>
                </div>
              </div>

              {/* Reasons Breakdown */}
              <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                {reasons.map((r, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/60"
                  >
                    ✓ {r}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => {
                    if (onSelectCandidate) onSelectCandidate(candidateItem);
                    else setSelectedItemForDetail(candidateItem);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                >
                  <span>Compare Details</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>

                {candidateItem.type === 'found' && candidateItem.status === 'active' && (
                  <button
                    onClick={() => setSelectedItemForClaim(candidateItem)}
                    className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-all flex items-center gap-1 shadow-xs"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Claim Item</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
