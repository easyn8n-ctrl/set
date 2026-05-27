import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/orders - List all orders (protected)
export async function GET(request: NextRequest) {
  try {
    // Verify admin authorization
    const authHeader = request.headers.get('authorization');
    const adminToken = authHeader?.replace('Bearer ', '');

    if (!adminToken) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    // Verify admin token (basic check)
    const { createHmac } = await import('crypto');
    try {
      const decoded = Buffer.from(adminToken, 'base64').toString('utf-8');
      const [payload, signature] = decoded.split('.');
      if (!payload || !signature) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
      const expectedSig = createHmac('sha256', secret).update(payload).digest('hex');
      if (signature !== expectedSig) {
        return NextResponse.json({ error: 'Invalid token signature' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { businessName: { contains: search } },
        { email: { contains: search } },
        { city: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.businessName || !body.city || !body.phone || !body.email) {
      return NextResponse.json(
        { error: 'Business name, city, phone, and email are required' },
        { status: 400 }
      );
    }

    const order = await db.order.create({
      data: {
        businessName: body.businessName,
        businessType: body.businessType,
        city: body.city,
        address: body.address || null,
        phone: body.phone,
        email: body.email,
        service1: body.service1 || '',
        service2: body.service2 || '',
        service3: body.service3 || '',
        selectedServices: body.selectedServices ? JSON.stringify(body.selectedServices) : null,
        language: body.language || 'English',
        selectedColor: body.selectedColor || 'Emerald',
        workingHours: body.workingHours || null,
        domain1: body.domain1 || '',
        domain2: body.domain2 || null,
        domain3: body.domain3 || null,
        notes: body.notes || null,
        websiteType: body.websiteType || '',
        amount: body.amount || 70000,
        currency: body.currency || 'cad',
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
