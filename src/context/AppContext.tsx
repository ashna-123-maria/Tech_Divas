'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, Claim, UserPersona, ItemCategory, ItemStatus, DatabaseHealth, RecoveryAudit } from '@/types';
import { DEMO_PERSONAS, INITIAL_ITEMS, INITIAL_CLAIMS } from '@/data/mockData';
import {
  getStoredItems,
  saveStoredItems,
  getStoredClaims,
  saveStoredClaims,
  resetDemoData,
} from '@/lib/storage';

interface AppContextType {
  items: Item[];
  claims: Claim[];
  currentPersona: UserPersona;
  setCurrentPersona: (persona: UserPersona) => void;
  addItem: (itemData: Omit<Item, 'id' | 'createdAt' | 'status' | 'reportedBy'> & { reportedBy?: string }) => Item;
  updateItemStatus: (id: string, status: ItemStatus) => void;
  addClaim: (claimData: Omit<Claim, 'id' | 'createdAt' | 'status'>) => Claim;
  updateClaimStatus: (id: string, status: 'approved' | 'rejected', notes?: string) => void;
  // Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ItemCategory | 'all';
  setSelectedCategory: (cat: ItemCategory | 'all') => void;
  selectedLocation: string | 'all';
  setSelectedLocation: (loc: string | 'all') => void;
  selectedType: 'all' | 'lost' | 'found' | 'returned';
  setSelectedType: (t: 'all' | 'lost' | 'found' | 'returned') => void;
  editItem: (id: string, updatedData: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  resetAllData: () => void;
  // Modals & Active View
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportModalType: 'lost' | 'found';
  openReportModal: (type: 'lost' | 'found') => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  itemToEdit: Item | null;
  setItemToEdit: (item: Item | null) => void;
  openEditModal: (item: Item) => void;
  selectedItemForDetail: Item | null;
  setSelectedItemForDetail: (item: Item | null) => void;
  selectedItemForClaim: Item | null;
  setSelectedItemForClaim: (item: Item | null) => void;
  activeView: 'feed' | 'admin';
  setActiveView: (view: 'feed' | 'admin') => void;
  // Phase 2: Disaster Recovery & Integrity
  dbHealth: DatabaseHealth | null;
  fetchDbHealth: () => Promise<void>;
  simulateDbCorruption: () => Promise<void>;
  recoverDatabase: () => Promise<void>;
  isRecovering: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(DEMO_PERSONAS[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'lost' | 'found' | 'returned'>('all');

  // Modals & views
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState<'lost' | 'found'>('lost');
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<Item | null>(null);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<Item | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [activeView, setActiveView] = useState<'feed' | 'admin'>('feed');
  const [dbHealth, setDbHealth] = useState<DatabaseHealth | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // Fetch Database Integrity & Health
  const fetchDbHealth = async () => {
    try {
      const res = await fetch('/api/database');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setDbHealth(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch DB health:', err);
    }
  };

  // Function to sync with shared backend database
  const refreshFromServer = async () => {
    try {
      const [itemsRes, claimsRes, dbRes] = await Promise.all([
        fetch('/api/items?limit=100'),
        fetch('/api/claims'),
        fetch('/api/database'),
      ]);

      if (itemsRes.ok) {
        const itemsJson = await itemsRes.json();
        if (itemsJson.success && Array.isArray(itemsJson.data)) {
          setItems(itemsJson.data);
          saveStoredItems(itemsJson.data);
        }
      }

      if (claimsRes.ok) {
        const claimsJson = await claimsRes.json();
        if (claimsJson.success && Array.isArray(claimsJson.data)) {
          setClaims(claimsJson.data);
          saveStoredClaims(claimsJson.data);
        }
      }

      if (dbRes.ok) {
        const dbJson = await dbRes.json();
        if (dbJson.success) {
          setDbHealth(dbJson.data);
        }
      }
    } catch {
      // fallback silently to local storage
    }
  };

  // Simulate Database Corruption (Restricted to Security / Demo)
  const simulateDbCorruption = async () => {
    setIsRecovering(true);
    try {
      const res = await fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'simulate' }),
      });
      const json = await res.json();
      if (json.success) {
        setDbHealth(json.data);
        // Refresh items to show corrupted records in feed/admin
        const itemsRes = await fetch('/api/items?limit=100');
        if (itemsRes.ok) {
          const itemsJson = await itemsRes.json();
          if (itemsJson.success) {
            setItems(itemsJson.data);
            saveStoredItems(itemsJson.data);
          }
        }
      }
    } catch (err) {
      console.error('Failed to simulate DB corruption:', err);
    } finally {
      setIsRecovering(false);
    }
  };

  // Execute Disaster Recovery
  const recoverDatabase = async () => {
    setIsRecovering(true);
    try {
      const res = await fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'recover' }),
      });
      const json = await res.json();
      if (json.success) {
        await refreshFromServer();
        await fetchDbHealth();
      }
    } catch (err) {
      console.error('Failed to execute disaster recovery:', err);
    } finally {
      setIsRecovering(false);
    }
  };

  // Load initial data and start multi-device real-time sync polling
  useEffect(() => {
    const loadedItems = getStoredItems();
    const loadedClaims = getStoredClaims();
    setItems(loadedItems);
    setClaims(loadedClaims);
    setIsLoaded(true);

    // Initial server fetch & push any unsynced items
    refreshFromServer();

    // Auto-poll every 3.5s so all connected devices/phones stay in sync in real time
    const interval = setInterval(refreshFromServer, 3500);
    return () => clearInterval(interval);
  }, []);

  // Sync items to localStorage
  useEffect(() => {
    if (isLoaded) {
      saveStoredItems(items);
    }
  }, [items, isLoaded]);

  // Sync claims to localStorage
  useEffect(() => {
    if (isLoaded) {
      saveStoredClaims(claims);
    }
  }, [claims, isLoaded]);

  // Auto switch view if persona is security
  const handlePersonaChange = (persona: UserPersona) => {
    setCurrentPersona(persona);
    if (persona.role === 'security') {
      setActiveView('admin');
    } else {
      setActiveView('feed');
    }
  };

  const addItem = (itemData: Omit<Item, 'id' | 'createdAt' | 'status' | 'reportedBy'> & { reportedBy?: string }): Item => {
    const tempId = `item-${Date.now()}`;
    const newItem: Item = {
      ...itemData,
      id: tempId,
      createdAt: new Date().toISOString(),
      status: 'active',
      reportedBy: itemData.reportedBy || currentPersona.id,
    };

    // Optimistic local state update
    setItems(prev => [newItem, ...prev]);

    // Persist to shared backend server database
    fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setItems(prev => prev.map(item => item.id === tempId ? data.data : item));
        }
      })
      .catch(err => console.error('Failed to sync item to server', err));

    return newItem;
  };

  const updateItemStatus = (id: string, status: ItemStatus) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    if (selectedItemForDetail && selectedItemForDetail.id === id) {
      setSelectedItemForDetail(prev => prev ? { ...prev, status } : null);
    }

    // Persist to server
    fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(err => console.error('Failed to sync item status to server', err));
  };

  const editItem = (id: string, updatedData: Partial<Item>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedData } : item));
    if (selectedItemForDetail && selectedItemForDetail.id === id) {
      setSelectedItemForDetail(prev => prev ? { ...prev, ...updatedData } : null);
    }

    // Persist edits to server
    fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    }).catch(err => console.error('Failed to update item on server', err));
  };

  const deleteItem = (id: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveStoredItems(updated);
      return updated;
    });
    if (selectedItemForDetail && selectedItemForDetail.id === id) {
      setSelectedItemForDetail(null);
    }

    // Persist deletion to server
    fetch(`/api/items/${id}`, {
      method: 'DELETE',
    }).catch(err => console.error('Failed to delete item on server', err));
  };

  const openEditModal = (item: Item) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const addClaim = (claimData: Omit<Claim, 'id' | 'createdAt' | 'status'>): Claim => {
    const tempId = `claim-${Date.now()}`;
    const newClaim: Claim = {
      ...claimData,
      id: tempId,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setClaims(prev => [newClaim, ...prev]);
    // Also update item status to claim_pending
    updateItemStatus(claimData.itemId, 'claim_pending');

    // Persist claim to server
    fetch('/api/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: claimData.itemId,
        claimantId: currentPersona.id,
        claimantName: claimData.claimantName,
        claimantEmail: claimData.claimantEmail,
        claimantPhone: claimData.claimantPhone,
        proofAnswer: claimData.proofAnswer,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setClaims(prev => prev.map(c => c.id === tempId ? data.data : c));
        }
      })
      .catch(err => console.error('Failed to sync claim to server', err));

    return newClaim;
  };

  const updateClaimStatus = (id: string, status: 'approved' | 'rejected', notes?: string) => {
    setClaims(prev => prev.map(claim => {
      if (claim.id === id) {
        return {
          ...claim,
          status,
          reviewerNotes: notes || claim.reviewerNotes,
        };
      }
      return claim;
    }));

    const targetedClaim = claims.find(c => c.id === id);
    if (targetedClaim) {
      if (status === 'approved') {
        updateItemStatus(targetedClaim.itemId, 'returned');
      } else {
        // Return back to active if rejected
        updateItemStatus(targetedClaim.itemId, 'active');
      }
    }

    // Persist claim update to server
    fetch(`/api/claims/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewerNotes: notes }),
    }).catch(err => console.error('Failed to sync claim status to server', err));
  };

  const resetAllData = () => {
    const { items: newItems, claims: newClaims } = resetDemoData();
    setItems(newItems);
    setClaims(newClaims);
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedType('all');

    // Reset shared server database
    fetch('/api/reset', { method: 'POST' }).catch(err => console.error('Failed to reset server database', err));
  };

  const openReportModal = (type: 'lost' | 'found') => {
    setReportModalType(type);
    setIsReportModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        items,
        claims,
        currentPersona,
        setCurrentPersona: handlePersonaChange,
        addItem,
        editItem,
        deleteItem,
        updateItemStatus,
        addClaim,
        updateClaimStatus,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedLocation,
        setSelectedLocation,
        selectedType,
        setSelectedType,
        resetAllData,
        isReportModalOpen,
        setIsReportModalOpen,
        reportModalType,
        openReportModal,
        isEditModalOpen,
        setIsEditModalOpen,
        itemToEdit,
        setItemToEdit,
        openEditModal,
        selectedItemForDetail,
        setSelectedItemForDetail,
        selectedItemForClaim,
        setSelectedItemForClaim,
        activeView,
        setActiveView,
        dbHealth,
        fetchDbHealth,
        simulateDbCorruption,
        recoverDatabase,
        isRecovering,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
