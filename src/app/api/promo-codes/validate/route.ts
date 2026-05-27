import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/promo-codes/validate — Validate a promo code (public, no auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, orderAmount } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, reason: 'Promo code is required' }, { status: 400 });
    }

    if (orderAmount === undefined || orderAmount === null || isNaN(Number(orderAmount))) {
      return NextResponse.json(
        { valid: false, reason: 'Order amount is required' },
        { status: 400 }
      );
    }

    const amountInCents = Number(orderAmount);

    // Look up the promo code (case-insensitive)
    const promoCode = await db.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!promoCode) {
      return NextResponse.json({ valid: false, reason: 'Invalid promo code' });
    }

    // Check if active
    if (!promoCode.isActive) {
      return NextResponse.json({ valid: false, reason: 'This promo code is no longer active' });
    }

    // Check expiry
    if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, reason: 'This promo code has expired' });
    }

    // Check usage limit
    if (promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json({
        valid: false,
        reason: 'This promo code has reached its usage limit',
      });
    }

    // Check minimum order amount
    if (amountInCents < promoCode.minOrderAmount) {
      const minDollars = (promoCode.minOrderAmount / 100).toFixed(2);
      return NextResponse.json({
        valid: false,
        reason: `Minimum order amount of $${minDollars} required for this promo code`,
      });
    }

    // Calculate discount
    let discountCalculated = 0;

    if (promoCode.discountPercent) {
      discountCalculated = Math.round(amountInCents * (promoCode.discountPercent / 100));
    }

    if (promoCode.discountAmount) {
      discountCalculated += promoCode.discountAmount;
    }

    // Ensure discount doesn't exceed the order amount
    discountCalculated = Math.min(discountCalculated, amountInCents);

    return NextResponse.json({
      valid: true,
      discountPercent: promoCode.discountPercent,
      discountAmount: promoCode.discountAmount,
      discountCalculated,
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { valid: false, reason: 'Failed to validate promo code' },
      { status: 500 }
    );
  }
}
