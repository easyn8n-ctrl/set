import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const systemPrompt = `You are a helpful AI assistant for WebCraft, a professional website building service for local businesses in North America. Key facts:
- Price: $700 CAD base (3 website features included)
- Extra features: $30 CAD each
- Delivery: 3 business days
- Includes: 3-year website operation, .com domain, SSL certificate, lifetime ownership
- 12 business types available: Dental Clinic, Barbershop, Restaurant, Med Spa, Retail Store, Real Estate, Tutoring Center, Auto Repair, Law Firm, Hair & Nail Salon, Veterinary Clinic, Cleaning Service
- 24 color palettes available
- Multi-language support
- Contact: info@webcraft.ca
Be friendly, professional, and helpful. Answer questions about WebCraft services and help customers choose the right package.`;

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
