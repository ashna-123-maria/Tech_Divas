'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, Claim, UserPersona, ItemCategory, ItemStatus } from '@/types';
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
  resetAllData: () => void;
  // Modals & Active View
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportModalType: 'lost' | 'found';
  openReportModal: (type: 'lost' | 'found') => void;
  selectedItemForDetail: Item | null;
  setSelectedItemForDetail: (item: Item | null) => void;
  selectedItemForClaim: Item | null;
  setSelectedItemForClaim: (item: Item | null) => void;
  activeView: 'feed' | 'admin';
  setActiveView: (view: 'feed' | 'admin') => void;
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
  const [activeView, setActiveView] = useState<'feed' | 'admin'>('feed');

  // Load initial data
  useEffect(() => {
    const loadedItems = getStoredItems();
    const loadedClaims = getStoredClaims();
    setItems(loadedItems);
    setClaims(loadedClaims);
    setIsLoaded(true);
  }, []);

  // Sync items
  useEffect(() => {
    if (isLoaded) {
      saveStoredItems(items);
    }
  }, [items, isLoaded]);

  // Sync claims
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
    const newItem: Item = {
      ...itemData,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      reportedBy: itemData.reportedBy || currentPersona.id,
    };
    setItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateItemStatus = (id: string, status: ItemStatus) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    if (selectedItemForDetail && selectedItemForDetail.id === id) {
      setSelectedItemForDetail(prev => prev ? { ...prev, status } : null);
    }
  };

  const addClaim = (claimData: Omit<Claim, 'id' | 'createdAt' | 'status'>): Claim => {
    const newClaim: Claim = {
      ...claimData,
      id: `claim-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setClaims(prev => [newClaim, ...prev]);
    // Also update item status to claim_pending
    updateItemStatus(claimData.itemId, 'claim_pending');
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
  };

  const resetAllData = () => {
    const { items: newItems, claims: newClaims } = resetDemoData();
    setItems(newItems);
    setClaims(newClaims);
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedType('all');
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
        selectedItemForDetail,
        setSelectedItemForDetail,
        selectedItemForClaim,
        setSelectedItemForClaim,
        activeView,
        setActiveView,
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
