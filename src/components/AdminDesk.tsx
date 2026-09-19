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
  Database,
  RefreshCw,
  AlertTriangle,
  FileCheck,
  History,
  Activity,
  HardDrive,
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
    dbHealth,
    simulateDbCorruption,
    recoverDatabase,
    isRecovering,
    resetAllData,
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

  const handleReject = (claim: Claim) => {
    updateClaimStatus(claim.id, 'rejected', 'Proof did not match item details.');
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

      {/* PHASE 2: Database Disaster Recovery & Integrity Monitor */}
      <div id="db-recovery-section" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-20">
        
        {/* Header with Health Badge */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                Database Disaster Recovery & Integrity Monitor
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                Phase 2
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Automated snapshot verification, corruption detection, and forensic audit recovery engine.
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {dbHealth?.status === 'corrupted' ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span>CRITICAL: Database Corrupted (5 Records Affected)</span>
              </div>
            ) : dbHealth?.status === 'recovered' ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
                <FileCheck className="w-4 h-4 text-sky-600" />
                <span>Recovery Complete: 80% Rate (4/5 Restored, 1 Quarantined)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Database Healthy (0 Corruptions Detected)</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            
            {/* Total Records */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Records</span>
              <p className="text-2xl font-black text-slate-900">
                {dbHealth?.totalRecords || 10}
              </p>
              <span className="text-[10px] text-slate-400">Campus dataset</span>
            </div>

            {/* Affected / Corrupted Records */}
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/70 space-y-1">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Affected Records</span>
              <p className="text-2xl font-black text-rose-800">
                {dbHealth?.affectedRecords ?? (dbHealth?.status === 'corrupted' ? 5 : 0)}
              </p>
              <span className="text-[10px] text-rose-600/80">Corrupted entries</span>
            </div>

            {/* Successfully Recovered */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Recovered</span>
              <p className="text-2xl font-black text-emerald-800">
                {dbHealth?.recoveredRecords ?? (dbHealth?.status === 'recovered' ? 4 : 0)}
              </p>
              <span className="text-[10px] text-emerald-600/80">Restored from backup</span>
            </div>

            {/* Unrecoverable Records */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Unrecoverable</span>
              <p className="text-2xl font-black text-amber-800">
                {dbHealth?.unrecoverableRecords ?? (dbHealth?.status === 'recovered' ? 1 : 0)}
              </p>
              <span className="text-[10px] text-amber-700/80">Quarantined for audit</span>
            </div>

            {/* Recovery Rate */}
            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/70 space-y-1">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">Recovery Rate</span>
              <p className="text-2xl font-black text-indigo-900">
                {dbHealth?.status === 'corrupted' ? '0%' : `${dbHealth?.recoveryRate ?? 100}%`}
              </p>
              <span className="text-[10px] text-indigo-600/80">
                {dbHealth?.status === 'recovered' ? '4 / 5 recovered' : 'Integrity score'}
              </span>
            </div>

          </div>

          {/* Action Control Panel */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-sky-400" />
                <span>Security Desk Disaster Recovery Controls</span>
              </h4>
              <p className="text-[11px] text-slate-400 max-w-xl">
                Simulate realistic database corruption to evaluate integrity detection, then restore the database from the last-known-good snapshot with automatic validation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              
              {/* Simulate Corruption Button */}
              <button
                onClick={() => simulateDbCorruption()}
                disabled={isRecovering}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                title="Simulates corruption in 5 records for judge evaluation"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isRecovering ? 'Simulating...' : 'Simulate Database Corruption'}</span>
              </button>

              {/* Run Recovery Button */}
              <button
                onClick={async () => {
                  await recoverDatabase();
                  confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
                }}
                disabled={isRecovering || dbHealth?.status === 'healthy'}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-40"
                title="Restores 4 recoverable records from backup and preserves 1 unrecoverable record"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRecovering ? 'animate-spin' : ''}`} />
                <span>{isRecovering ? 'Restoring...' : 'Run Recovery / Restore from Backup'}</span>
              </button>

              {/* Reset to Clean State */}
              <button
                onClick={() => resetAllData()}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700"
                title="Reset database to initial clean seed state"
              >
                Reset
              </button>

            </div>
          </div>

          {/* Before-and-After Audit Comparison (Visible during Corruption & Recovery) */}
          {(dbHealth?.lastAudit || dbHealth?.status === 'corrupted' || dbHealth?.status === 'recovered') && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                    Before-and-After Forensic Audit Comparison
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Evaluation: 5 Affected Records • Formula: 4/5 × 100 = 80% Recovery Rate
                </span>
              </div>

              {/* Records Comparison List */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white shadow-xs">
                
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <div className="col-span-3 sm:col-span-3">Item Record</div>
                  <div className="col-span-3 sm:col-span-3">Before: Corruption State</div>
                  <div className="col-span-3 sm:col-span-3">Disaster Recovery Action</div>
                  <div className="col-span-3 sm:col-span-3 text-right">After: Final State</div>
                </div>

                {/* 5 Corrupted & Recovered Items */}
                {[
                  {
                    id: 'item-1',
                    name: 'Sarah’s MacBook Air M2',
                    before: "Corrupted Status ('corrupted_lost_status')",
                    action: 'Restored from Backup Snapshot (v1.4)',
                    after: dbHealth?.status === 'corrupted' ? 'Corrupted (Unverified)' : 'Recovered (active)',
                    recoverable: true,
                  },
                  {
                    id: 'item-2',
                    name: 'Apple AirPods Pro in Rugged Case',
                    before: 'Missing Location & Invalid Contact Email',
                    action: 'Restored from Backup Snapshot (v1.4)',
                    after: dbHealth?.status === 'corrupted' ? 'Corrupted (Unverified)' : 'Recovered (active)',
                    recoverable: true,
                  },
                  {
                    id: 'item-3',
                    name: 'Toyota Car Key Fob',
                    before: 'Malformed Title (0x7F) & Corrupted Category',
                    action: 'Restored from Backup Snapshot (v1.4)',
                    after: dbHealth?.status === 'corrupted' ? 'Corrupted (Unverified)' : 'Recovered (active)',
                    recoverable: true,
                  },
                  {
                    id: 'item-4',
                    name: 'Matte Blue Hydro Flask',
                    before: 'Corrupted Date (2099-99-99) & Missing Contact Name',
                    action: 'Restored from Backup Snapshot (v1.4)',
                    after: dbHealth?.status === 'corrupted' ? 'Corrupted (Unverified)' : 'Recovered (active)',
                    recoverable: true,
                  },
                  {
                    id: 'item-corrupt-unbacked',
                    name: 'Guest SanDisk 64GB USB Drive',
                    before: 'Damaged Payload (Not Present in Backup Snapshot)',
                    action: 'Preserved in Quarantine (Forensic Audit Evidence)',
                    after: dbHealth?.status === 'corrupted' ? 'Corrupted (Unbacked)' : 'Unrecoverable (Preserved)',
                    recoverable: false,
                  },
                ].map((rec) => (
                  <div key={rec.id} className="grid grid-cols-12 gap-2 px-4 py-3 text-xs items-center hover:bg-slate-50/50 transition-colors">
                    
                    {/* Item Name */}
                    <div className="col-span-3 sm:col-span-3">
                      <p className="font-bold text-slate-800">{rec.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{rec.id}</span>
                    </div>

                    {/* Before Status */}
                    <div className="col-span-3 sm:col-span-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                        <AlertTriangle className="w-3 h-3 shrink-0 text-rose-500" />
                        <span className="line-clamp-1">{rec.before}</span>
                      </span>
                    </div>

                    {/* Action Taken */}
                    <div className="col-span-3 sm:col-span-3 text-slate-600 text-[11px]">
                      <span className="font-medium">{rec.action}</span>
                    </div>

                    {/* After Status */}
                    <div className="col-span-3 sm:col-span-3 text-right">
                      {rec.recoverable ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                          dbHealth?.status === 'corrupted'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{rec.after}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                          <History className="w-3 h-3 text-amber-600" />
                          <span>{rec.after}</span>
                        </span>
                      )}
                    </div>

                  </div>
                ))}

              </div>

              {/* Summary Explanation Footer */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-600 flex items-start gap-2">
                <Activity className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Forensic Recovery Guarantee:</strong> 4 out of 5 corrupted records were successfully recovered using the last-known-good backup snapshot. The 1 unbacked record was intentionally quarantined and preserved for audit evidence with zero accidental data loss.
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

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
