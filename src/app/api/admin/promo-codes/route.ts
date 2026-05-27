import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdminToken, extractBearerToken } from '@/lib/auth-utils';

/** Require admin auth — returns null on success, or a 401 NextResponse on failure */
function requireAdmin(request: NextRequest): NextResponse | null {
  const token = extractBearerToken(request);
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// GET /api/admin/promo-codes — List all promo codes (admin only)
export async function GET(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;

  try {
    const codes = await db.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ promoCodes: codes });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return NextResponse.json({ error: 'Failed to fetch promo codes' }, { status: 500 });
  }
}

// POST /api/admin/promo-codes — Create a new promo code (admin only)
export async function POST(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;

  try {
    const body = await request.json();

    if (!body.code || typeof body.code !== 'string') {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
    }

    // Validate numeric fields
    if (body.discountPercent !== undefined && body.discountPercent !== null) {
      const pct = Number(body.discountPercent);
      if (isNaN(pct) || pct < 1 || pct > 100) {
        return NextResponse.json(
          { error: 'discountPercent must be a number between 1 and 100' },
          { status: 400 }
        );
      }
    }

    if (body.discountAmount !== undefined && body.discountAmount !== null) {
      const amt = Number(body.discountAmount);
      if (isNaN(amt) || amt < 0) {
        return NextResponse.json(
          { error: 'discountAmount must be a non-negative number' },
          { status: 400 }
        );
      }
    }

    if (body.maxUses !== undefined) {
      const max = Number(body.maxUses);
      if (isNaN(max) || max < 1) {
        return NextResponse.json({ error: 'maxUses must be a positive number' }, { status: 400 });
      }
    }

    if (body.minOrderAmount !== undefined) {
      const min = Number(body.minOrderAmount);
      if (isNaN(min) || min < 0) {
        return NextResponse.json(
          { error: 'minOrderAmount must be a non-negative number (cents)' },
          { status: 400 }
        );
      }
    }

    const promoCode = await db.promoCode.create({
      data: {
        code: body.code.trim().toUpperCase(),
        discountPercent: body.discountPercent != null ? Number(body.discountPercent) : null,
        discountAmount: body.discountAmount != null ? Number(body.discountAmount) : null,
        maxUses: body.maxUses ? Number(body.maxUses) : 100,
        usedCount: 0,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        minOrderAmount: body.minOrderAmount != null ? Number(body.minOrderAmount) : 0,
      },
    });

    return NextResponse.json({ promoCode }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating promo code:', error);
    // Handle unique constraint violation
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 });
  }
}

// PATCH /api/admin/promo-codes — Update a promo code (admin only)
export async function PATCH(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Promo code id is required' }, { status: 400 });
    }

    const existing = await db.promoCode.findUnique({ where: { id: body.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Promo code not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.code !== undefined) {
      updateData.code = String(body.code).trim().toUpperCase();
    }
    if (body.discountPercent !== undefined) {
      updateData.discountPercent =
        body.discountPercent != null ? Number(body.discountPercent) : null;
    }
    if (body.discountAmount !== undefined) {
      updateData.discountAmount =
        body.discountAmount != null ? Number(body.discountAmount) : null;
    }
    if (body.maxUses !== undefined) {
      updateData.maxUses = Number(body.maxUses);
    }
    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }
    if (body.expiresAt !== undefined) {
      updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    }
    if (body.minOrderAmount !== undefined) {
      updateData.minOrderAmount = Number(body.minOrderAmount);
    }

    const promoCode = await db.promoCode.update({
      where: { id: body.id },
      data: updateData,
    });

    return NextResponse.json({ promoCode });
  } catch (error: unknown) {
    console.error('Error updating promo code:', error);
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update promo code' }, { status: 500 });
  }
}

// DELETE /api/admin/promo-codes — Deactivate a promo code (soft delete, admin only)
export async function DELETE(request: NextRequest) {
  const err = requireAdmin(request);
  if (err) return err;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Promo code id is required (query param)' },
        { status: 400 }
      );
    }

    const existing = await db.promoCode.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Promo code not found' }, { status: 404 });
    }

    // Soft delete: set isActive to false
    const promoCode = await db.promoCode.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Promo code deactivated', promoCode });
  } catch (error) {
    console.error('Error deactivating promo code:', error);
    return NextResponse.json({ error: 'Failed to deactivate promo code' }, { status: 500 });
  }
}
