'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Hero from '@/components/Hero';
import FilterBar from '@/components/FilterBar';
import ItemGrid from '@/components/ItemGrid';

export default function HomePage() {
  const { activeView } = useApp();

  return (
    <main className="min-h-screen pb-16">
      {activeView === 'feed' ? (
        <>
          <Hero />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FilterBar />
            <ItemGrid />
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Placeholder until Task 8 AdminDesk is added */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
            <h2 className="text-xl font-bold text-slate-800">Campus Security Desk</h2>
            <p className="text-sm text-slate-500 mt-1">Reviewing pending claims and item verifications.</p>
          </div>
        </div>
      )}
    </main>
  );
}
