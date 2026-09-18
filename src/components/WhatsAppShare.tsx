'use client';

import React, { useState } from 'react';
import { Item } from '@/types';
import { MessageSquare, Copy, Check, ExternalLink, Share2 } from 'lucide-react';

interface WhatsAppShareProps {
  item: Item;
}

export default function WhatsAppShare({ item }: WhatsAppShareProps) {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const messageText = `🚨 *CAMPUS LOST & FOUND ALERT* 🚨\n\n` +
    `*Item:* ${item.title}\n` +
    `*Type:* ${item.type.toUpperCase()} ITEM\n` +
    `*Location:* ${item.location} ${item.locationDetails ? `(${item.locationDetails})` : ''}\n` +
    `*Date:* ${formattedDate}\n` +
    `*Description:* ${item.description}\n\n` +
    `--------------------------------\n` +
    `👉 *View details or submit claim securely on CampusFind:*\n` +
    `http://localhost:3000\n\n` +
    `_Centralized University Lost & Found Platform_`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppRedirect = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-900">Campus WhatsApp Share Bridge</h4>
            <p className="text-[10px] text-emerald-700">Export formatted card directly into student groups</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
          Anti-Spam Formatted
        </span>
      </div>

      {/* Message Preview Box */}
      <div className="p-3 bg-white rounded-xl border border-emerald-100 text-[11px] font-mono text-slate-700 whitespace-pre-line max-h-28 overflow-y-auto leading-relaxed scrollbar-thin">
        {messageText}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleWhatsAppRedirect}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Post to WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="py-2 px-3 rounded-xl border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Text'}</span>
        </button>
      </div>
    </div>
  );
}
