import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// POST /api/checkout - Create order and optionally Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 checkouts per 5 minutes per IP
    const clientKey = `checkout:${getClientIp(request)}`;
    if (!rateLimit(clientKey, 3, 5 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many checkout attempts. Please wait a moment.' }, { status: 429 });
    }

    const body = await request.json();

    // ---- Promo code validation (optional) ----
    let promoCodeData: {
      code: string;
      discountCalculated: number;
      discountPercent: number | null;
      discountAmount: number | null;
    } | null = null;

    let finalAmount = body.amount || 70000;

    if (body.promoCode) {
      const promo = await db.promoCode.findUnique({
        where: { code: String(body.promoCode).trim().toUpperCase() },
      });

      if (!promo) {
        return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
      }
      if (!promo.isActive) {
        return NextResponse.json(
          { error: 'This promo code is no longer active' },
          { status: 400 }
        );
      }
      if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
        return NextResponse.json({ error: 'This promo code has expired' }, { status: 400 });
      }
      if (promo.usedCount >= promo.maxUses) {
        return NextResponse.json(
          { error: 'This promo code has reached its usage limit' },
          { status: 400 }
        );
      }
      if (finalAmount < promo.minOrderAmount) {
        const minDollars = (promo.minOrderAmount / 100).toFixed(2);
        return NextResponse.json(
          { error: `Minimum order amount of $${minDollars} required for this promo code` },
          { status: 400 }
        );
      }

      // Calculate discount
      let discountCalculated = 0;
      if (promo.discountPercent) {
        discountCalculated = Math.round(finalAmount * (promo.discountPercent / 100));
      }
      if (promo.discountAmount) {
        discountCalculated += promo.discountAmount;
      }
      // Cap discount at order amount
      discountCalculated = Math.min(discountCalculated, finalAmount);

      promoCodeData = {
        code: promo.code,
        discountCalculated,
        discountPercent: promo.discountPercent,
        discountAmount: promo.discountAmount,
      };

      finalAmount = finalAmount - discountCalculated;
    }

    // Build the notes string — prepend promo code info to any existing notes
    let orderNotes = body.notes || '';
    if (promoCodeData) {
      const discountInfo = `[Promo: ${promoCodeData.code} — $${(promoCodeData.discountCalculated / 100).toFixed(2)} off]`;
      orderNotes = orderNotes ? `${discountInfo}\n${orderNotes}` : discountInfo;
    }

    // Create order in database
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
        domain1: body.domain1,
        domain2: body.domain2 || null,
        domain3: body.domain3 || null,
        notes: orderNotes || null,
        websiteType: body.websiteType,
        amount: finalAmount,
        currency: 'cad',
        promoCode: promoCodeData?.code || null,
        discountAmount: promoCodeData?.discountCalculated || 0,
      },
    });

    // Increment promo code usage count
    if (promoCodeData) {
      try {
        await db.promoCode.update({
          where: { code: promoCodeData.code },
          data: { usedCount: { increment: 1 } },
        });
      } catch (promoErr) {
        console.error('Failed to increment promo code usage:', promoErr);
        // Non-blocking — the order is already created
      }
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const isStripeConfigured =
      stripeSecretKey &&
      (stripeSecretKey.startsWith('sk_live_') ||
        (stripeSecretKey.startsWith('sk_test_') && stripeSecretKey !== 'sk_test_placeholder'));

    if (isStripeConfigured) {
      // Create Stripe checkout session
      try {
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(stripeSecretKey!);

        const lineItemName = `${body.websiteType} - Professional Website Package`;
        const lineItemDescription = `Complete website for ${body.businessName} including 3 services, 3 years hosting, domain, SSL, and lifetime ownership. Delivery in 3 business days.`;
        if (promoCodeData) {
          // Stripe needs to know the discounted amount
        }

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'cad',
                product_data: {
                  name: lineItemName,
                  description: lineItemDescription,
                },
                unit_amount: finalAmount,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL || '/'}?payment=success&order=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || '/'}?payment=cancelled`,
          customer_email: body.email,
          metadata: {
            orderId: order.id,
            businessName: body.businessName,
            businessType: body.businessType,
            city: body.city,
            ...(promoCodeData ? { promoCode: promoCodeData.code } : {}),
          },
        });

        // Update order with Stripe session ID
        await db.order.update({
          where: { id: order.id },
          data: { stripeSessionId: session.id },
        });

        return NextResponse.json({
          sessionId: session.id,
          url: session.url,
          orderId: order.id,
          mode: 'stripe',
          ...(promoCodeData ? { discountApplied: promoCodeData.discountCalculated } : {}),
        });
      } catch (stripeError) {
        console.error('Stripe error, falling back to demo mode:', stripeError);
        // Fall through to demo mode
      }
    }

    // Demo mode - no Stripe configured or Stripe failed
    return NextResponse.json({
      orderId: order.id,
      mode: 'demo',
      ...(promoCodeData ? { discountApplied: promoCodeData.discountCalculated } : {}),
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
