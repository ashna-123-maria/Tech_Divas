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

  const qrData = typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${item.id}`
    : `https://campusfind.edu/items/${item.id}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&color=0-0-0&bgcolor=255-255-255&margin=1&data=${encodeURIComponent(qrData)}`;

  return (
    <>
      {/* Dedicated Print Media Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-property-tag,
          #printable-property-tag * {
            visibility: visible !important;
          }
          #printable-property-tag {
            position: fixed !important;
            left: 50% !important;
            top: 20px !important;
            transform: translateX(-50%) !important;
            width: 340px !important;
            border: 2px dashed #000000 !important;
            border-radius: 16px !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 24px !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 print:bg-transparent print:p-0">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden print:border-none print:shadow-none print:w-auto">
          
          {/* Header - Hidden in Print */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between print:hidden">
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
          <div className="p-6 print:p-0">
            <div
              id="printable-property-tag"
              className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50/70 text-center space-y-4 print:border-slate-900 print:bg-white"
            >
              
              <div className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-black print:bg-black print:text-white">
                  U
                </span>
                <span className="font-extrabold text-sm tracking-tight text-slate-900 uppercase">
                  University Campus Security
                </span>
              </div>

              {/* High-Contrast Printable & Scannable QR Code */}
              <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl border-2 border-slate-900 shadow-sm flex items-center justify-center print:border-black">
                <img
                  src={qrImageUrl}
                  alt={`Scannable QR Code for ${item.title}`}
                  className="w-36 h-36 object-contain"
                  onError={(e) => {
                    // Fallback to high-contrast black vector icon if offline
                    e.currentTarget.style.display = 'none';
                    const fb = document.getElementById(`fallback-qr-${item.id}`);
                    if (fb) fb.style.display = 'flex';
                  }}
                />
                <div
                  id={`fallback-qr-${item.id}`}
                  style={{ display: 'none' }}
                  className="w-full h-full items-center justify-center"
                >
                  <QrCode className="w-28 h-28 text-slate-950" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="inline-block text-[11px] font-mono uppercase bg-slate-200 print:bg-slate-100 print:text-black px-2.5 py-0.5 rounded text-slate-800 font-bold border border-slate-300">
                  REF #{item.id}
                </span>
                <h4 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-600 font-medium">Locker Desk: {item.location}</p>
                <p className="text-[11px] text-slate-500">Date Logged: {item.date}</p>
              </div>

              <p className="text-[9px] text-slate-500 border-t border-slate-200 pt-2 uppercase tracking-wide font-medium print:text-black">
                Official Property Verification Record • Claim at Central Security Desk
              </p>

            </div>
          </div>

          {/* Footer - Hidden in Print */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 print:hidden">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-white"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all hover:shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Physical Tag</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
