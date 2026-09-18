'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Hero from '@/components/Hero';
import FilterBar from '@/components/FilterBar';
import ItemGrid from '@/components/ItemGrid';
import MatchAlertBanner from '@/components/MatchAlertBanner';
import AdminDesk from '@/components/AdminDesk';

export default function HomePage() {
  const { activeView } = useApp();

  return (
    <main className="min-h-screen pb-20">
      {activeView === 'feed' ? (
        <>
          <Hero />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MatchAlertBanner />
            <FilterBar />
            <ItemGrid />
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDesk />
        </div>
      )}
    </main>
  );
}
