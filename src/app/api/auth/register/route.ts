import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/db';
import { hashPassword, createSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, department } = body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // 2. Check duplicate email
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // 3. Hash password using bcrypt (10 rounds)
    const passwordHash = await hashPassword(password);

    // 4. Create user record
    const user = await createUser({
      name: name.trim(),
      email: email.trim(),
      passwordHash,
      role: role === 'security' ? 'security' : 'student',
      department: department?.trim() || 'General Campus',
    });

    // 5. Generate session token
    const token = createSessionToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully with secure password hashing.',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
          token,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
