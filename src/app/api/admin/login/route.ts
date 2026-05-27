import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createHash, randomBytes, createHmac } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Create a signed token that can't be forged
function createSignedToken(adminId: string): string {
  const payload = `${adminId}:${Date.now()}:${randomBytes(16).toString('hex')}`;
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}.${signature}`).toString('base64');
}

// Verify a signed token
function verifySignedToken(token: string): { valid: boolean; adminId?: string } {
  try {
    const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [payload, signature] = decoded.split('.');
    if (!payload || !signature) return { valid: false };

    const expectedSignature = createHmac('sha256', secret).update(payload).digest('hex');
    if (signature !== expectedSignature) return { valid: false };

    const adminId = payload.split(':')[0];
    return { valid: true, adminId };
  } catch {
    return { valid: false };
  }
}

// POST /api/admin/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const admin = await db.admin.findUnique({ where: { email } });

    if (!admin || admin.password !== hashPassword(password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      admin: { id: admin.id, email: admin.email, name: admin.name },
      token: createSignedToken(admin.id),
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
