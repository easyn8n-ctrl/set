import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminToken, extractBearerToken } from '@/lib/auth-utils';

/** Allowed fields for admin PATCH updates on an order */
const ALLOWED_PATCH_FIELDS = [
  'status',
  'adminNotes',
  'businessName',
  'email',
  'phone',
  'city',
  'address',
  'businessType',
  'websiteType',
  'notes',
  'service1',
  'service2',
  'service3',
  'selectedServices',
  'language',
  'selectedColor',
  'workingHours',
  'domain1',
  'domain2',
  'domain3',
  'amount',
  'stripeSessionId',
] as const;

// PATCH /api/orders/[id] - Update order (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const token = extractBearerToken(request);
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    // Build update data from allowed fields only
    for (const field of ALLOWED_PATCH_FIELDS) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Auto-set timestamps for status transitions
    if (body.status === 'paid' && !updateData.paidAt) {
      updateData.paidAt = new Date();
    }
    if (body.status === 'delivered' && !updateData.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const order = await db.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// GET /api/orders/[id] - Get single order (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const token = extractBearerToken(request);
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = await db.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// DELETE /api/orders/[id] - Delete an order (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const token = extractBearerToken(request);
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify the order exists before deleting
    const existing = await db.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    await db.order.delete({ where: { id } });

    return NextResponse.json({ message: 'Order deleted successfully', orderId: id });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
