'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES, CAMPUS_LOCATIONS } from '@/data/mockData';
import { ItemCategory } from '@/types';
import {
  Search,
  X,
  MapPin,
  Filter,
  Layers,
  Sparkles,
  Laptop,
  CreditCard,
  Key,
  CupSoda,
  Briefcase,
  BookOpen,
  Watch,
  Shirt,
  HelpCircle,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Laptop,
  CreditCard,
  Key,
  CupSoda,
  Briefcase,
  BookOpen,
  Watch,
  Shirt,
  HelpCircle,
};

export default function FilterBar() {
  const {
    items,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    selectedType,
    setSelectedType,
  } = useApp();

  const totalAll = items.length;
  const totalLost = items.filter(i => i.type === 'lost' && i.status !== 'returned').length;
  const totalFound = items.filter(i => i.type === 'found' && i.status !== 'returned').length;
  const totalReturned = items.filter(i => i.status === 'returned').length;

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedLocation !== 'all' ||
    selectedType !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedType('all');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5 mb-8 space-y-4">
      
      {/* Top Row: Search Input + Location Dropdown */}
      <div className="flex flex-col sm:flex-row gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description (e.g., MacBook, Hydro Flask, keys)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="relative sm:w-64">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer"
          >
            <option value="all">All Campus Locations</option>
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name} ({loc.zone})
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all self-stretch sm:self-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Type Filter Tabs: All / Lost / Found / Reunited */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedType === 'all'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <span>All Items</span>
            <span className="px-1.5 py-0.2 bg-slate-200 rounded text-[10px]">{totalAll}</span>
          </button>

          <button
            onClick={() => setSelectedType('lost')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedType === 'lost'
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'hover:text-rose-600'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Lost</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedType === 'lost' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-700'}`}>
              {totalLost}
            </span>
          </button>

          <button
            onClick={() => setSelectedType('found')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedType === 'found'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'hover:text-emerald-600'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
            <span>Found</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedType === 'found' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
              {totalFound}
            </span>
          </button>

          <button
            onClick={() => setSelectedType('returned')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedType === 'returned'
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'hover:text-indigo-600'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Reunited</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedType === 'returned' ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
              {totalReturned}
            </span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </button>

          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || HelpCircle;
            const isSelected = selectedCategory === cat.id;
            const count = items.filter(i => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm font-bold'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
