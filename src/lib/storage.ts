import { Item, Claim } from '@/types';
import { INITIAL_ITEMS, INITIAL_CLAIMS } from '@/data/mockData';

const ITEMS_KEY = 'campus_lost_found_items_v1';
const CLAIMS_KEY = 'campus_lost_found_claims_v1';

export function getStoredItems(): Item[] {
  if (typeof window === 'undefined') {
    return INITIAL_ITEMS;
  }
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    if (!raw) {
      localStorage.setItem(ITEMS_KEY, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ITEMS;
  } catch {
    return INITIAL_ITEMS;
  }
}

export function saveStoredItems(items: Item[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save items to localStorage', err);
  }
}

export function getStoredClaims(): Claim[] {
  if (typeof window === 'undefined') {
    return INITIAL_CLAIMS;
  }
  try {
    const raw = localStorage.getItem(CLAIMS_KEY);
    if (!raw) {
      localStorage.setItem(CLAIMS_KEY, JSON.stringify(INITIAL_CLAIMS));
      return INITIAL_CLAIMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_CLAIMS;
  } catch {
    return INITIAL_CLAIMS;
  }
}

export function saveStoredClaims(claims: Claim[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
  } catch (err) {
    console.error('Failed to save claims to localStorage', err);
  }
}

export function resetDemoData(): { items: Item[]; claims: Claim[] } {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ITEMS_KEY);
    localStorage.removeItem(CLAIMS_KEY);
    localStorage.setItem(ITEMS_KEY, JSON.stringify(INITIAL_ITEMS));
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(INITIAL_CLAIMS));
  }
  return { items: INITIAL_ITEMS, claims: INITIAL_CLAIMS };
}
