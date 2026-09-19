'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES, CAMPUS_LOCATIONS } from '@/data/mockData';
import { ItemCategory } from '@/types';
import ImageUpload from '@/components/ImageUpload';
import {
  X,
  Edit3,
  MapPin,
  Calendar,
  Layers,
  User,
  Mail,
  Phone,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Save,
} from 'lucide-react';

export default function EditItemModal() {
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    itemToEdit,
    editItem,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0].name);
  const [locationDetails, setLocationDetails] = useState('');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [proofQuestion, setProofQuestion] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setTitle(itemToEdit.title);
      setDescription(itemToEdit.description);
      setCategory(itemToEdit.category);
      setLocation(itemToEdit.location);
      setLocationDetails(itemToEdit.locationDetails || '');
      setDate(itemToEdit.date);
      setImageUrl(itemToEdit.imageUrl || '');
      setProofQuestion(itemToEdit.proofQuestion || '');
      setContactName(itemToEdit.contactName);
      setContactEmail(itemToEdit.contactEmail);
      setContactPhone(itemToEdit.contactPhone || '');
      setErrors({});
      setIsSuccess(false);
    }
  }, [itemToEdit]);

  if (!isEditModalOpen || !itemToEdit) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
    if (!description.trim() || description.trim().length < 5) errs.description = 'Description must be at least 5 characters';
    if (!contactName.trim()) errs.contactName = 'Contact name is required';
    if (!contactEmail.trim() || !contactEmail.includes('@')) errs.contactEmail = 'Valid contact email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    editItem(itemToEdit.id, {
      title: title.trim(),
      description: description.trim(),
      category,
      location,
      locationDetails: locationDetails.trim() || undefined,
      date,
      imageUrl: imageUrl.trim() || undefined,
      proofQuestion: itemToEdit.type === 'found' && proofQuestion.trim() ? proofQuestion.trim() : undefined,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim() || undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsEditModalOpen(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Edit {itemToEdit.type === 'lost' ? 'Lost Item' : 'Found Item'} Report
              </h3>
              <p className="text-xs text-slate-500">
                Update details, location, or contact info for #{itemToEdit.id}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Report Updated Successfully!</h4>
            <p className="text-xs text-slate-500">Your changes have been saved to the campus database.</p>
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Item Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Anker USB-C Fast Charger"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  errors.title ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-500 font-medium">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Description & Distinguishing Features *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Color, brand, markings, scratches, stickers..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  errors.description ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
                }`}
              />
              {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description}</p>}
            </div>

            {/* Category & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campus Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Campus Facility</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Location Details & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Specific Spot / Desk (Optional)
                </label>
                <input
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="e.g., Desk 14, 2nd floor window"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date Logged</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

            </div>

            {/* Photo Upload */}
            <ImageUpload value={imageUrl} onChange={setImageUrl} />

            {/* Anti-Theft Proof Challenge (If Found Item) */}
            {itemToEdit.type === 'found' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Anti-Theft Proof Challenge Question</span>
                </label>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Conceal a unique detail (e.g. wallpaper, keychain, stickers) that only the real owner would know.
                </p>
                <input
                  type="text"
                  value={proofQuestion}
                  onChange={(e) => setProofQuestion(e.target.value)}
                  placeholder="e.g., What sticker is on the charger head?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-sm font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            )}

            {/* Contact Details */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Contact Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-600">Contact Name *</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                  {errors.contactName && <p className="text-[10px] text-rose-500">{errors.contactName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-600">Contact Email *</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                  {errors.contactEmail && <p className="text-[10px] text-rose-500">{errors.contactEmail}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-600">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
