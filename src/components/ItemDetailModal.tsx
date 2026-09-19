'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mockData';
import SuggestedMatches from '@/components/SuggestedMatches';
import WhatsAppShare from '@/components/WhatsAppShare';
import {
  X,
  MapPin,
  Calendar,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle2,
  Edit3,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ItemDetailModal() {
  const {
    selectedItemForDetail,
    setSelectedItemForDetail,
    setSelectedItemForClaim,
    openReportModal,
    updateItemStatus,
    currentPersona,
    openEditModal,
    deleteItem,
  } = useApp();

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!selectedItemForDetail) return null;

  const item = selectedItemForDetail;
  const category = CATEGORIES.find(c => c.id === item.category);
  const isOwner = Boolean(currentPersona?.id && item.reportedBy && currentPersona.id === item.reportedBy);
  const isSecurity = currentPersona?.role === 'security';
  const canManage = isOwner || isSecurity;

  const formatDetailDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) {
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const mIdx = parseInt(month, 10) - 1;
        return `${monthNames[mIdx] || month} ${parseInt(day, 10)}, ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleMarkReunited = () => {
    updateItemStatus(item.id, 'returned');
    // Trigger celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                item.status === 'returned'
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : item.type === 'lost'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {item.status === 'returned'
                ? '✨ Reunited with Owner'
                : `${item.type.toUpperCase()} ITEM`}
            </span>

            {category && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${category.color}`}>
                {category.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {canManage && (
              <>
                <button
                  onClick={() => openEditModal(item)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Edit this report"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-200/60 shadow-xs"
                  title="Delete this report"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                setIsConfirmingDelete(false);
                setSelectedItemForDetail(null);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inline Delete Confirmation Banner */}
        {isConfirmingDelete && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-200/70 text-rose-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Permanently delete this report?</h4>
                <p className="text-[11px] text-rose-700">This will remove the item and any related claims from the campus feed.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="px-3 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100/50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteItem(item.id);
                  setIsConfirmingDelete(false);
                  setSelectedItemForDetail(null);
                }}
                className="px-3.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Main Photo and Info Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image */}
            <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <span className="text-5xl mb-2">📦</span>
                  <span className="text-xs font-medium">No photo provided</span>
                </div>
              )}

              {item.proofQuestion && (
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-900/85 text-white backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    Anti-Theft Protected
                  </span>
                </div>
              )}
            </div>

            {/* Info Summary */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">{item.location}</span>
                    {item.locationDetails && (
                      <p className="text-slate-500 text-[11px]">{item.locationDetails}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span suppressHydrationWarning>{formatDetailDate(item.date)}</span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700">Contact: {item.contactName} ({item.contactEmail})</span>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="flex flex-wrap gap-2 pt-1">
                {item.status === 'active' && item.type === 'found' && (
                  <button
                    onClick={() => {
                      setSelectedItemForClaim(item);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Claim This Item (Prove Ownership)</span>
                  </button>
                )}

                {item.status === 'active' && item.type === 'lost' && (
                  <button
                    onClick={() => {
                      openReportModal('found');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>I Found This Exact Item</span>
                  </button>
                )}

                {/* Security Admin Direct Action */}
                {currentPersona.role === 'security' && item.status !== 'returned' && (
                  <button
                    onClick={handleMarkReunited}
                    className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Authorize Handover & Close</span>
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* WhatsApp Broadcast Card Bridge */}
          <WhatsAppShare item={item} />

          {/* Smart Match Recommendations Section */}
          <div className="pt-2 border-t border-slate-100">
            <SuggestedMatches
              item={item}
              onSelectCandidate={(candidate) => setSelectedItemForDetail(candidate)}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
