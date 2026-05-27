import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/orders - List all orders (admin)
export async function GET(request: NextRequest) {
  try {
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

    const order = await db.order.create({
      data: {
        businessName: body.businessName,
        businessType: body.businessType,
        city: body.city,
        address: body.address || null,
        phone: body.phone,
        email: body.email,
        service1: body.service1,
        service2: body.service2,
        service3: body.service3,
        workingHours: body.workingHours || null,
        domain1: body.domain1,
        domain2: body.domain2 || null,
        domain3: body.domain3 || null,
        notes: body.notes || null,
        websiteType: body.websiteType,
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
