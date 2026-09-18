'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  X,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Lock,
  User,
  Mail,
  Phone,
} from 'lucide-react';

export default function ClaimModal() {
  const {
    selectedItemForClaim,
    setSelectedItemForClaim,
    currentPersona,
    addClaim,
  } = useApp();

  const [proofAnswer, setProofAnswer] = useState('');
  const [claimantName, setClaimantName] = useState(currentPersona.name);
  const [claimantEmail, setClaimantEmail] = useState(currentPersona.email);
  const [claimantPhone, setClaimantPhone] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setClaimantName(currentPersona.name);
    setClaimantEmail(currentPersona.email);
  }, [currentPersona]);

  if (!selectedItemForClaim) return null;

  const item = selectedItemForClaim;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofAnswer.trim()) {
      setError('Please provide your proof of ownership details or answer.');
      return;
    }

    addClaim({
      itemId: item.id,
      itemTitle: item.title,
      claimantId: currentPersona.id,
      claimantName: claimantName.trim(),
      claimantEmail: claimantEmail.trim(),
      claimantPhone: claimantPhone.trim() || undefined,
      proofAnswer: proofAnswer.trim(),
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedItemForClaim(null);
      setProofAnswer('');
      setError('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg my-8 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Claim This Item</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{item.title}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedItemForClaim(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Claim Submitted for Verification!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Campus Security and the finder have received your proof of ownership. You will be notified once verified!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Ownership Challenge Banner */}
            {item.proofQuestion ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Finder&apos;s Anti-Theft Verification Challenge:</span>
                </div>
                <p className="text-xs font-semibold text-amber-800 bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                  &ldquo;{item.proofQuestion}&rdquo;
                </p>
                <p className="text-[11px] text-amber-700">
                  To prevent fraudulent claims, describe the unique characteristics only the true owner knows.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Proof of Ownership</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Describe serial numbers, unique scratches, lockscreen image, or contents to prove ownership.
                </p>
              </div>
            )}

            {/* Answer Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Verification Proof / Answer *
              </label>
              <textarea
                rows={3}
                value={proofAnswer}
                onChange={(e) => setProofAnswer(e.target.value)}
                placeholder="e.g. My laptop has a sticker of a cat on the lower right lid and username starts with S..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
              {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
            </div>

            {/* Contact Details */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Claimant Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="Full Name"
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
                <input
                  type="email"
                  value={claimantEmail}
                  onChange={(e) => setClaimantEmail(e.target.value)}
                  placeholder="Campus Email"
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <input
                type="text"
                value={claimantPhone}
                onChange={(e) => setClaimantPhone(e.target.value)}
                placeholder="Phone / WhatsApp (Optional for pickup notification)"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>

            {/* Footer buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedItemForClaim(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Verification Claim</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
