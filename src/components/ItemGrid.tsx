'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import ItemCard from '@/components/ItemCard';
import Pagination from '@/components/Pagination';
import { SearchX, PlusCircle, RefreshCw } from 'lucide-react';

const PAGE_SIZE = 6;

export default function ItemGrid() {
  const {
    items,
    searchQuery,
    selectedCategory,
    selectedLocation,
    selectedType,
    openReportModal,
    resetAllData,
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);

  // Filter items
  const filteredItems = items.filter((item) => {
    // Type filter
    if (selectedType === 'lost' && (item.type !== 'lost' || item.status === 'returned')) return false;
    if (selectedType === 'found' && (item.type !== 'found' || item.status === 'returned')) return false;
    if (selectedType === 'returned' && item.status !== 'returned') return false;

    // Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    // Location filter
    if (selectedLocation !== 'all' && item.location !== selectedLocation) return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchLoc = item.location.toLowerCase().includes(query);
      const matchContact = item.contactName.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchLoc && !matchContact) return false;
    }

    return true;
  });

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLocation, selectedType]);

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Campus Items Feed
          <span className="ml-2 font-semibold text-slate-500 text-xs lowercase">
            ({filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found)
          </span>
        </h2>
        {filteredItems.length > PAGE_SIZE && (
          <span className="text-[11px] text-slate-400 font-medium">
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Grid */}
      {paginatedItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination Component (Genesis 2.0 Bonus Requirement) */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm my-6">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <SearchX className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No matching campus items</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find anything matching your filters. Try adjusting your keywords, category, or location.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openReportModal('lost')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report as Lost</span>
            </button>
            <button
              onClick={resetAllData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
