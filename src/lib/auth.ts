import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt with 10 salt rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a plain text password against a stored bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  role: 'student' | 'staff' | 'security';
  department: string;
}

/**
 * Generate a base64 session token (stateless auth token)
 */
export function createSessionToken(session: AuthSession): string {
  const payload = JSON.stringify({
    ...session,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  return Buffer.from(payload).toString('base64');
}

/**
 * Validate and decode a session token
 */
export function verifySessionToken(token: string): AuthSession | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.exp && parsed.exp < Date.now()) {
      return null; // Expired
    }
    return {
      userId: parsed.userId,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      department: parsed.department,
    };
  } catch {
    return null;
  }
}
