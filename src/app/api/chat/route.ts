import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 15 requests per minute per IP
    const clientKey = `chat:${getClientIp(request)}`;
    if (!rateLimit(clientKey, 15, 60 * 1000)) {
      return NextResponse.json({ reply: 'You\'re sending messages too quickly. Please wait a moment.' }, { status: 429 });
    }

    const { message, history } = await request.json();

    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const systemPrompt = `You are a helpful AI assistant for WebCraft, a professional website building service for local businesses in North America. Key facts:
- 3 Plans available:
  * Starter: $599 — 1 page, 3 features, 5 business days delivery
  * Business: $899 — Up to 5 pages, 6 features, 3 business days delivery (MOST POPULAR)
  * Premium: $1,199 — Up to 10 pages, 10 features, 2 business days delivery
- Extra features: $30 each (Starter and Business plans)
- Delivery: 2-5 business days depending on plan
- All plans include: 3-year website operation, .com domain, SSL certificate, lifetime ownership
- 12 business types: Dental Clinic, Barbershop, Restaurant, Med Spa, Retail Store, Real Estate, Tutoring Center, Auto Repair, Law Firm, Hair & Nail Salon, Veterinary Clinic, Cleaning Service
- 24 color palettes available
- Multi-language support
- Contact: info@webcraft.ca
- One-time payment — NO monthly subscriptions
Be friendly, professional, and helpful. Answer questions about WebCraft services and help customers choose the right plan.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    const completion = await zai.chat.completions.create({ messages });

    return NextResponse.json({
      reply: completion.choices[0]?.message?.content || 'I apologize, I could not process your request.'
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({
      reply: 'Sorry, I\'m having trouble connecting right now. Please email us at info@webcraft.ca for immediate assistance.'
    }, { status: 500 });
  }
}
