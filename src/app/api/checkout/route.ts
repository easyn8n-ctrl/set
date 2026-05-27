import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/checkout - Create order and optionally Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create order in database first
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
        notes: body.notes || null,
        websiteType: body.websiteType,
        amount: body.amount || 70000,
        currency: 'cad',
      },
    });

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const isStripeConfigured = stripeSecretKey &&
      (stripeSecretKey.startsWith('sk_live_') ||
        (stripeSecretKey.startsWith('sk_test_') && stripeSecretKey !== 'sk_test_placeholder'));

    if (isStripeConfigured) {
      // Create Stripe checkout session
      try {
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(stripeSecretKey!, {
          apiVersion: '2025-04-30.basil',
        });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'cad',
                product_data: {
                  name: `${body.websiteType} - Professional Website Package`,
                  description: `Complete website for ${body.businessName} including 3 services, 3 years hosting, domain, SSL, and lifetime ownership. Delivery in 3 business days.`,
                },
                unit_amount: body.amount || 70000,
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
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
