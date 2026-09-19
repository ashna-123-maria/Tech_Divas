'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Item, Claim } from '@/types';
import AnalyticsCards from '@/components/AnalyticsCards';
import QrTagModal from '@/components/QrTagModal';
import { DEMO_PERSONAS } from '@/data/mockData';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Sparkles,
  QrCode,
  MapPin,
  Calendar,
  AlertCircle,
  HelpCircle,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminDesk() {
  const {
    items,
    claims,
    updateClaimStatus,
    updateItemStatus,
    setSelectedItemForDetail,
    currentPersona,
    setCurrentPersona,
    setActiveView,
  } = useApp();

  const [tagItem, setTagItem] = useState<Item | null>(null);

  const pendingClaims = claims.filter(c => c.status === 'pending');
  const foundItemsInStorage = items.filter(i => i.type === 'found' && i.status !== 'returned');

  const handleApprove = (claim: Claim) => {
    updateClaimStatus(claim.id, 'approved', 'Verified by Campus Security Desk.');
    // Trigger confetti celebration
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  // Role-Based Access Control (RBAC) Guard
  if (currentPersona.role !== 'security') {
    const securityPersona = DEMO_PERSONAS.find(p => p.role === 'security');

    return (
      <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Access Restricted • Security Staff Only
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Campus Security Authorization Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            You are currently browsing as <strong className="text-slate-900">{currentPersona.name}</strong> (<span className="capitalize">{currentPersona.role}</span>). Regular students cannot review proof challenges, release property, or manage locker inventory.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <p className="text-[11px] text-slate-500">
            To review ownership challenges and authorize property releases, please switch to an authorized Security Officer persona or sign in with staff credentials.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {securityPersona && (
            <button
              onClick={() => setCurrentPersona(securityPersona)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Switch to {securityPersona.name} (Demo Staff)</span>
            </button>
          )}
          <button
            onClick={() => setActiveView('feed')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            Back to Campus Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Campus Security & Administration Portal
          </span>
        </div>

        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Security Desk & Claim Verification
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/80 mt-1 leading-relaxed">
            Review ownership verification challenges, approve property handovers, and track university-wide recovery metrics.
          </p>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsCards />

      {/* Pending Claims Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Pending Claim Verifications
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {pendingClaims.length} awaiting review
            </span>
          </div>
        </div>

        <div className="p-5">
          {pendingClaims.length > 0 ? (
            <div className="space-y-4">
              {pendingClaims.map((claim) => {
                const relatedItem = items.find(i => i.id === claim.itemId);

                return (
                  <div
                    key={claim.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          Claim for: <span className="text-sky-700">{claim.itemTitle}</span>
                        </h4>
                        <p className="text-xs text-slate-500">
                          Submitted by <strong className="text-slate-800">{claim.claimantName}</strong> ({claim.claimantEmail}) {claim.claimantPhone ? `• ${claim.claimantPhone}` : ''}
                        </p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Logged on {new Date(claim.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Challenge Question & Claimant Answer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {relatedItem?.proofQuestion && (
                        <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1">
                          <p className="font-bold text-amber-900">Finder&apos;s Challenge Question:</p>
                          <p className="text-amber-800 font-medium">&ldquo;{relatedItem.proofQuestion}&rdquo;</p>
                        </div>
                      )}

                      <div className="p-3 bg-sky-50/70 border border-sky-200/60 rounded-xl space-y-1">
                        <p className="font-bold text-sky-900">Claimant&apos;s Verification Proof:</p>
                        <p className="text-sky-800 font-medium">&ldquo;{claim.proofAnswer}&rdquo;</p>
                      </div>
                    </div>

                    {/* Officer Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200/60">
                      {relatedItem && (
                        <button
                          onClick={() => setSelectedItemForDetail(relatedItem)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white text-xs font-semibold"
                        >
                          View Item
                        </button>
                      )}

                      <button
                        onClick={() => handleReject(claim)}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Claim</span>
                      </button>

                      <button
                        onClick={() => handleApprove(claim)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Handover & Reunited</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-800">All claims are currently resolved!</p>
              <p className="text-[11px] text-slate-400">No pending ownership verifications at the desk.</p>
            </div>
          )}
        </div>
      </div>

      {/* Campus Locker Inventory (Found Items Held by Security) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Found Property Inventory (Physical Storage)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {foundItemsInStorage.length} items logged
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foundItemsInStorage.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 text-xl">
                      📦
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-slate-400">ID: {item.id}</span>
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{item.title}</h5>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.location}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => setTagItem(item)}
                    className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-semibold"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Print QR Tag</span>
                  </button>

                  <button
                    onClick={() => {
                      updateItemStatus(item.id, 'returned');
                      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                    }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Mark Returned</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Tag Modal */}
      <QrTagModal item={tagItem} onClose={() => setTagItem(null)} />

    </div>
  );
}
