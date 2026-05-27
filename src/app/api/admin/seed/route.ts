import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// POST /api/admin/seed - Create default admin account
export async function POST() {
  try {
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
