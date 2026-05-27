import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/stats - Dashboard statistics
export async function GET() {
  try {
    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      inProgressOrders,
      deliveredOrders,
      totalRevenue,
      recentOrders,
      ordersByType,
    ] = await Promise.all([
      db.order.count(),
      db.order.count({ where: { status: 'pending' } }),
      db.order.count({ where: { status: 'paid' } }),
      db.order.count({ where: { status: 'in-progress' } }),
      db.order.count({ where: { status: 'delivered' } }),
      db.order.aggregate({
        where: { status: { in: ['paid', 'in-progress', 'delivered'] } },
        _sum: { amount: true },
      }),
      db.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.order.groupBy({
        by: ['businessType'],
        _count: { businessType: true },
        orderBy: { _count: { businessType: 'desc' } },
      }),
    ]);

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      paidOrders,
      inProgressOrders,
      deliveredOrders,
      totalRevenue: totalRevenue._sum.amount || 0,
      recentOrders,
      ordersByType,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
