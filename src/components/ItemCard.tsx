'use client';

import React from 'react';
import { Item } from '@/types';
import { CATEGORIES } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Calendar,
  ShieldAlert,
  Share2,
  Sparkles,
  ArrowUpRight,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { setSelectedItemForDetail, setSelectedItemForClaim, openReportModal } = useApp();

  const category = CATEGORIES.find(c => c.id === item.category);

  const getStatusBadge = () => {
    switch (item.status) {
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            Reunited with Owner
          </span>
        );
      case 'claim_pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Claim Under Review
          </span>
        );
      case 'active':
      default:
        if (item.type === 'lost') {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              LOST ITEM
            </span>
          );
        } else {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              FOUND ITEM
            </span>
          );
        }
    }
  };

  const formatItemDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mIdx = parseInt(month, 10) - 1;
        return `${monthNames[mIdx] || month} ${parseInt(day, 10)}, ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      
      {/* Thumbnail or Category Icon Backdrop */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <span className="text-4xl mb-1">📦</span>
            <span className="text-xs font-medium">No photo uploaded</span>
          </div>
        )}

        {/* Status Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {getStatusBadge()}
        </div>

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md bg-white/90 shadow-sm border ${category.color}`}>
              {category.name}
            </span>
          </div>
        )}

        {/* Anti-Theft Protection Indicator */}
        {item.proofQuestion && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-sm shadow-sm">
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              Proof Challenge Protected
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3
            onClick={() => setSelectedItemForDetail(item)}
            className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-sky-600 transition-colors cursor-pointer"
          >
            {item.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location & Date Details */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="truncate font-medium text-slate-700">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span suppressHydrationWarning>{item.type === 'lost' ? 'Lost on' : 'Found on'} {formatItemDate(item.date)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => setSelectedItemForDetail(item)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {item.status === 'active' && item.type === 'found' && (
            <button
              onClick={() => setSelectedItemForClaim(item)}
              className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Claim</span>
            </button>
          )}

          {item.status === 'active' && item.type === 'lost' && (
            <button
              onClick={() => openReportModal('found')}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <span>I Found This</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
