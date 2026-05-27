import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createHash } from 'crypto';
import { createSignedToken, verifyAdminToken, extractBearerToken } from '@/lib/auth-utils';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// ---------------------------------------------------------------------------
// Simple in-memory rate limiting: max 5 attempts per 15 minutes per IP
// ---------------------------------------------------------------------------
const loginAttempts = new Map<string, { count: number; firstAttemptAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) return false;
  if (now - record.firstAttemptAt > WINDOW_MS) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttemptAt: now });
  } else {
    record.count += 1;
  }

  // Periodic cleanup to prevent unbounded memory growth
  if (loginAttempts.size > 1000) {
    for (const [key, val] of loginAttempts.entries()) {
      if (now - val.firstAttemptAt > WINDOW_MS) {
        loginAttempts.delete(key);
      }
    }
  }
}

function resetAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// ---------------------------------------------------------------------------
// POST /api/admin/login — Authenticate admin
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const admin = await db.admin.findUnique({ where: { email } });

    if (!admin || admin.password !== hashPassword(password)) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Successful login — reset rate limit counter
    resetAttempts(ip);

    return NextResponse.json({
      admin: { id: admin.id, email: admin.email, name: admin.name },
      token: createSignedToken(admin.id),
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// GET /api/admin/login — Verify an existing admin token (with 24h expiry)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  const token = extractBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
  }

  const adminId = verifyAdminToken(token);
  if (!adminId) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  try {
    const admin = await db.admin.findUnique({
      where: { id: adminId },
      select: { id: true, email: true, name: true },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 401 });
    }

    return NextResponse.json({ admin });
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
