import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// POST /api/admin/seed - Create default admin account
// Protected by ADMIN_SEED_KEY to prevent unauthorized access
export async function POST(request: NextRequest) {
  try {
    // Verify seed key for protection
    const seedKey = request.headers.get('x-admin-seed-key') ||
                    new URL(request.url).searchParams.get('key');

    if (!seedKey || seedKey !== process.env.ADMIN_SEED_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing seed key' },
        { status: 403 }
      );
    }

    const existingAdmin = await db.admin.findUnique({
      where: { email: 'admin@webcraft.ca' },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin already exists', admin: { email: existingAdmin.email } });
    }

    const admin = await db.admin.create({
      data: {
        email: 'admin@webcraft.ca',
        password: hashPassword('admin123'),
        name: 'WebCraft Admin',
      },
    });

    return NextResponse.json({
      message: 'Admin created successfully',
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed admin' }, { status: 500 });
  }
}
