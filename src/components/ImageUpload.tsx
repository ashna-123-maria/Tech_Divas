'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

const PRESET_DEMO_IMAGES = [
  { label: 'MacBook / Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
  { label: 'AirPods / Earbuds', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80' },
  { label: 'Hydro Flask / Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80' },
  { label: 'Student ID / Card', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Car Keys & Remote', url: 'https://images.unsplash.com/photo-1589307904488-7d60ff29c975?auto=format&fit=crop&w=600&q=80' },
  { label: 'Backpack / Bag', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
];

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Item Photo (Optional)
        </label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showPresets ? 'Hide presets' : 'Use demo photo'}</span>
        </button>
      </div>

      {/* Preset Picker for Hackathon Judges */}
      {showPresets && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <p className="text-[11px] text-slate-500 font-medium">Quick sample campus item photos:</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_DEMO_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className="group flex flex-col items-center p-1.5 rounded-xl border border-slate-200 hover:border-sky-500 bg-white hover:bg-sky-50 transition-all text-center"
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-12 h-12 object-cover rounded-lg group-hover:scale-105 transition-transform"
                />
                <span className="text-[10px] text-slate-600 group-hover:text-sky-700 line-clamp-1 mt-1 font-medium">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview or Drop Area */}
      {value ? (
        <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
          <img src={value} alt="Item upload preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-md transition-all"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-sky-500 bg-sky-50/50'
              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
            <Camera className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">
            Click to upload photo or drag & drop
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG or WebP up to 5MB</p>
        </div>
      )}
    </div>
  );
}
