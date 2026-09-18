'use client';

import React from 'react';
import { Item } from '@/types';
import { X, Printer, QrCode, Shield, CheckCircle } from 'lucide-react';

interface QrTagModalProps {
  item: Item | null;
  onClose: () => void;
}

export default function QrTagModal({ item, onClose }: QrTagModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-indigo-600" />
            <span>Campus Security Property Tag</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="p-6">
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50/70 text-center space-y-4">
            
            <div className="flex items-center justify-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-black">
                U
              </span>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 uppercase">
                University Campus Security
              </span>
            </div>

            {/* Simulated QR Code */}
            <div className="w-36 h-36 mx-auto bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
              <div className="w-full h-full bg-slate-900 p-2 rounded-xl flex items-center justify-center">
                <QrCode className="w-24 h-24 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-bold">
                REF #{item.id}
              </span>
              <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-500">Locker Desk: {item.location}</p>
              <p className="text-[10px] text-slate-400">Date Logged: {item.date}</p>
            </div>

            <p className="text-[9px] text-slate-400 border-t border-slate-200 pt-2 uppercase tracking-wide">
              Official Property Verification Record • Claim at Central Security Desk
            </p>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-white"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Physical Tag</span>
          </button>
        </div>

      </div>
    </div>
  );
}
