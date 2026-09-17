'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES, CAMPUS_LOCATIONS } from '@/data/mockData';
import { ItemCategory, ItemType } from '@/types';
import ImageUpload from '@/components/ImageUpload';
import {
  X,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  User,
  Mail,
  Phone,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';

export default function ReportItemModal() {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    reportModalType,
    addItem,
    currentPersona,
  } = useApp();

  const [type, setType] = useState<ItemType>(reportModalType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0].name);
  const [locationDetails, setLocationDetails] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [proofQuestion, setProofQuestion] = useState('');
  const [contactName, setContactName] = useState(currentPersona.name);
  const [contactEmail, setContactEmail] = useState(currentPersona.email);
  const [contactPhone, setContactPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setType(reportModalType);
    setContactName(currentPersona.name);
    setContactEmail(currentPersona.email);
  }, [reportModalType, currentPersona]);

  if (!isReportModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (!contactName.trim()) errs.contactName = 'Contact name is required';
    if (!contactEmail.trim()) errs.contactEmail = 'Contact email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addItem({
      title: title.trim(),
      description: description.trim(),
      type,
      category,
      location,
      locationDetails: locationDetails.trim() || undefined,
      date,
      imageUrl: imageUrl.trim() || undefined,
      proofQuestion: type === 'found' && proofQuestion.trim() ? proofQuestion.trim() : undefined,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim() || undefined,
      reportedBy: currentPersona.id,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsReportModalOpen(false);
      // Reset form
      setTitle('');
      setDescription('');
      setLocationDetails('');
      setImageUrl('');
      setProofQuestion('');
      setErrors({});
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden">
        
        {/* Header with Type Toggle */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {type === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {type === 'lost'
                ? 'Provide details so students and staff can identify your item.'
                : 'Help reconnect this found item with its rightful campus owner.'}
            </p>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Splash */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Report Submitted!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your report is now live in the campus feed. Our smart matcher is actively looking for corresponding items.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Type Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  type === 'lost'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-300" />
                <span>I Lost Something</span>
              </button>
              <button
                type="button"
                onClick={() => setType('found')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  type === 'found'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                <span>I Found Something</span>
              </button>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Item Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Space Gray MacBook Pro 14, Blue Hydro Flask 32oz..."
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                }`}
              />
              {errors.title && <p className="text-[11px] text-rose-500 font-medium">{errors.title}</p>}
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Campus Location *
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} ({loc.zone})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Details & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Specific Location (Room/Floor/Desk)
                </label>
                <input
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="e.g. 2nd Floor Study Room Desk 14, Cafeteria booth..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Date {type === 'lost' ? 'Lost' : 'Found'} *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Detailed Description *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include color, model, distinguishing marks, stickers, scratches, or unique contents..."
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.description
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-sky-500/20 focus:border-sky-500'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-rose-500 font-medium">{errors.description}</p>
              )}
            </div>

            {/* Photo Upload Component */}
            <ImageUpload value={imageUrl} onChange={setImageUrl} />

            {/* Anti-Theft Verification Question (Found items only) */}
            {type === 'found' && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Anti-Theft Ownership Proof Challenge (Recommended)</span>
                </div>
                <p className="text-[11px] text-indigo-700 leading-relaxed">
                  Ask a question only the true owner would know (e.g. &ldquo;What sticker is on the back?&rdquo;, &ldquo;What is the phone wallpaper?&rdquo;). Anyone attempting to claim this item must answer this question before receiving contact details.
                </p>
                <input
                  type="text"
                  value={proofQuestion}
                  onChange={(e) => setProofQuestion(e.target.value)}
                  placeholder="e.g. Describe the stickers on the lid or the keychain attached..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            )}

            {/* Contact Details */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Contact Info
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  {errors.contactName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.contactName}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Campus Email"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  {errors.contactEmail && <p className="text-[10px] text-rose-500 mt-0.5">{errors.contactEmail}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Phone / WhatsApp (optional)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all ${
                  type === 'lost'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                {type === 'lost' ? 'Publish Lost Item Report' : 'Publish Found Item Report'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
