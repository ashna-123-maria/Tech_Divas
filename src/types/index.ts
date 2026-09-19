export type ItemType = 'lost' | 'found';

export type ItemStatus = 'active' | 'matched' | 'claim_pending' | 'returned';

export type ItemCategory =
  | 'electronics'
  | 'cards_id'
  | 'keys'
  | 'bags'
  | 'books'
  | 'accessories'
  | 'bottles'
  | 'clothing'
  | 'other';

export interface CategoryInfo {
  id: ItemCategory;
  name: string;
  icon: string;
  color: string;
}

export interface CampusLocationInfo {
  id: string;
  name: string;
  zone: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  type: ItemType;
  category: ItemCategory;
  location: string;
  locationDetails?: string;
  date: string;
  imageUrl?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  status: ItemStatus;
  proofQuestion?: string; // Optional security challenge from finder (e.g. "What sticker is on the laptop lid?")
  reportedBy: string; // UserPersona id
  createdAt: string;
  matchedItemId?: string;
  recoveryStatus?: 'unrecoverable' | 'recovered';
}

export interface RecordAuditDetail {
  id: string;
  name: string;
  beforeStatus: string;
  action: string;
  afterStatus: string;
  recoverable: boolean;
}

export interface RecoveryAudit {
  timestamp: string;
  totalRecords: number;
  affectedRecords: number;
  recoveredRecords: number;
  unrecoverableRecords: number;
  recoveryRate: number;
  records: RecordAuditDetail[];
}

export interface DatabaseHealth {
  status: 'healthy' | 'corrupted' | 'recovered';
  totalRecords: number;
  affectedRecords: number;
  recoveredRecords: number;
  unrecoverableRecords: number;
  recoveryRate: number;
  lastBackupTime: string | null;
  errors: string[];
  lastAudit?: RecoveryAudit | null;
}

export interface Claim {
  id: string;
  itemId: string;
  itemTitle: string;
  claimantId: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone?: string;
  proofAnswer: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewerNotes?: string;
}

export type UserRole = 'student' | 'staff' | 'security';

export interface UserPersona {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
  department: string;
  badge: string;
  description: string;
}

export interface MatchScoreResult {
  candidateItem: Item;
  score: number; // 0 to 100%
  breakdown: {
    categoryMatch: boolean;
    tokenSimilarity: number;
    locationMatch: boolean;
    dateProximityDays: number;
  };
  reasons: string[];
}
