'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  PackageCheck,
  Search,
  CheckCircle2,
  TrendingUp,
  Clock,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export default function AnalyticsCards() {
  const { items, claims } = useApp();

  const totalReported = items.length;
  const activeLost = items.filter(i => i.type === 'lost' && i.status === 'active').length;
  const activeFound = items.filter(i => i.type === 'found' && i.status === 'active').length;
  const returnedCount = items.filter(i => i.status === 'returned').length;
  const pendingClaims = claims.filter(c => c.status === 'pending').length;

  const recoveryRate = totalReported > 0 ? Math.round((returnedCount / totalReported) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Total Reported */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Campus Items</span>
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <PackageCheck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalReported}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across 8 campus facilities</p>
        </div>
      </div>

      {/* Active Lost Items */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Search</span>
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600">{activeLost}</p>
          <p className="text-[11px] text-rose-500 font-medium mt-0.5">Actively tracked by students</p>
        </div>
      </div>

      {/* Reunited / Returned */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Successfully Reunited</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{returnedCount}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{recoveryRate}% Campus Recovery Rate</p>
        </div>
      </div>

      {/* Claims Pending */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Desk Queue</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{pendingClaims}</p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">Verifications awaiting approval</p>
        </div>
      </div>

    </div>
  );
}
