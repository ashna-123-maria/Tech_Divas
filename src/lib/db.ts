import fs from 'fs';
import path from 'path';
import { Item, Claim, UserRole } from '@/types';
import { INITIAL_ITEMS, INITIAL_CLAIMS } from '@/data/mockData';
import bcrypt from 'bcryptjs';

export interface DBUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department: string;
  avatar: string;
  createdAt: string;
}

export interface DBSchema {
  users: DBUser[];
  items: Item[];
  claims: Claim[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'campus.json');

// Pre-generated bcrypt hash for 'Password123!' with 10 salt rounds:
const DEFAULT_HASH = '$2b$10$ZXBvXYHCBB3.Nd96hbqBA.JvirqKAcJ47AdQz/ZmjFbr39POHdkN2';

const SEED_USERS: DBUser[] = [
  {
    id: 'user_sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.j@campus.edu',
    passwordHash: DEFAULT_HASH,
    role: 'student',
    department: 'Computer Science (3rd Year)',
    avatar: '👩‍🎓',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'user_priya',
    name: 'Priya Patel',
    email: 'priya.p@campus.edu',
    passwordHash: DEFAULT_HASH,
    role: 'student',
    department: 'Biotechnology (2nd Year)',
    avatar: '🎒',
    createdAt: '2026-09-01T08:30:00Z',
  },
  {
    id: 'user_dave',
    name: 'Officer Dave Miller',
    email: 'lostfound-desk@campus.edu',
    passwordHash: DEFAULT_HASH,
    role: 'security',
    department: 'Campus Security & Facilities',
    avatar: '👮‍♂️',
    createdAt: '2026-09-01T07:00:00Z',
  },
];

function ensureDatabase(): DBSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DBSchema = {
      users: SEED_USERS,
      items: INITIAL_ITEMS,
      claims: INITIAL_CLAIMS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.users || !parsed.items || !parsed.claims) {
      throw new Error('Corrupted DB format');
    }
    return parsed;
  } catch {
    const initialData: DBSchema = {
      users: SEED_USERS,
      items: INITIAL_ITEMS,
      claims: INITIAL_CLAIMS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function writeDatabase(data: DBSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ----------------- USER CRUD -----------------

export async function findUserByEmail(email: string): Promise<DBUser | null> {
  const db = ensureDatabase();
  const normalized = email.toLowerCase().trim();
  const user = db.users.find((u) => u.email.toLowerCase() === normalized);
  return user || null;
}

export async function findUserById(id: string): Promise<DBUser | null> {
  const db = ensureDatabase();
  const user = db.users.find((u) => u.id === id);
  return user || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  department?: string;
  avatar?: string;
}): Promise<DBUser> {
  const db = ensureDatabase();
  const newUser: DBUser = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email.toLowerCase().trim(),
    passwordHash: data.passwordHash,
    role: data.role || 'student',
    department: data.department || 'General Studies',
    avatar: data.avatar || (data.role === 'security' ? '👮‍♂️' : '🎓'),
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDatabase(db);
  return newUser;
}

// ----------------- ITEM CRUD WITH PAGINATION -----------------

export interface ItemQueryParams {
  search?: string;
  category?: string;
  location?: string;
  type?: 'lost' | 'found' | 'returned' | 'all';
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedItemsResult {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function findItems(params: ItemQueryParams = {}): Promise<PaginatedItemsResult> {
  const db = ensureDatabase();
  let results = [...db.items];

  // Type filter
  if (params.type === 'lost') {
    results = results.filter((i) => i.type === 'lost' && i.status !== 'returned');
  } else if (params.type === 'found') {
    results = results.filter((i) => i.type === 'found' && i.status !== 'returned');
  } else if (params.type === 'returned') {
    results = results.filter((i) => i.status === 'returned');
  }

  // Category filter
  if (params.category && params.category !== 'all') {
    results = results.filter((i) => i.category === params.category);
  }

  // Location filter
  if (params.location && params.location !== 'all') {
    results = results.filter((i) => i.location === params.location);
  }

  // Status filter
  if (params.status && params.status !== 'all') {
    results = results.filter((i) => i.status === params.status);
  }

  // Keyword search
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    results = results.filter((i) => {
      return (
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.contactName.toLowerCase().includes(q)
      );
    });
  }

  // Sort: Newest first
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = results.length;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 20);
  const totalPages = Math.ceil(total / limit) || 1;

  const startIndex = (page - 1) * limit;
  const paginatedItems = results.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function findItemById(id: string): Promise<Item | null> {
  const db = ensureDatabase();
  const item = db.items.find((i) => i.id === id);
  return item || null;
}

export async function createItem(
  itemData: Omit<Item, 'id' | 'createdAt' | 'status'>
): Promise<Item> {
  const db = ensureDatabase();
  const newItem: Item = {
    ...itemData,
    id: `item-${Date.now()}`,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  db.items.unshift(newItem);
  writeDatabase(db);
  return newItem;
}

export async function updateItem(id: string, updates: Partial<Item>): Promise<Item | null> {
  const db = ensureDatabase();
  const idx = db.items.findIndex((i) => i.id === id);
  if (idx === -1) return null;

  db.items[idx] = {
    ...db.items[idx],
    ...updates,
  };

  writeDatabase(db);
  return db.items[idx];
}

export async function deleteItem(id: string): Promise<boolean> {
  const db = ensureDatabase();
  const initialLen = db.items.length;
  db.items = db.items.filter((i) => i.id !== id);
  if (db.items.length !== initialLen) {
    writeDatabase(db);
    return true;
  }
  return false;
}

// ----------------- CLAIM CRUD -----------------

export async function findClaims(itemId?: string): Promise<Claim[]> {
  const db = ensureDatabase();
  if (itemId) {
    return db.claims.filter((c) => c.itemId === itemId);
  }
  return db.claims.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createClaim(
  claimData: Omit<Claim, 'id' | 'createdAt' | 'status'>
): Promise<Claim> {
  const db = ensureDatabase();
  const newClaim: Claim = {
    ...claimData,
    id: `claim-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.claims.unshift(newClaim);

  // Automatically update the item status to claim_pending
  const itemIdx = db.items.findIndex((i) => i.id === claimData.itemId);
  if (itemIdx !== -1) {
    db.items[itemIdx].status = 'claim_pending';
  }

  writeDatabase(db);
  return newClaim;
}

export async function updateClaim(
  id: string,
  updates: Partial<Claim>
): Promise<Claim | null> {
  const db = ensureDatabase();
  const idx = db.claims.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  db.claims[idx] = {
    ...db.claims[idx],
    ...updates,
  };

  // If claim is approved, set item to returned
  if (updates.status === 'approved') {
    const itemIdx = db.items.findIndex((i) => i.id === db.claims[idx].itemId);
    if (itemIdx !== -1) {
      db.items[itemIdx].status = 'returned';
    }
  } else if (updates.status === 'rejected') {
    const itemIdx = db.items.findIndex((i) => i.id === db.claims[idx].itemId);
    if (itemIdx !== -1) {
      db.items[itemIdx].status = 'active';
    }
  }

  writeDatabase(db);
  return db.claims[idx];
}

export async function resetDatabase(): Promise<void> {
  const fresh: DBSchema = {
    users: SEED_USERS,
    items: INITIAL_ITEMS,
    claims: INITIAL_CLAIMS,
  };
  writeDatabase(fresh);
}
