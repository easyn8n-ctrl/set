import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get('domain');
  if (!domain) return NextResponse.json({ error: 'Domain required' }, { status: 400 });

  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`);
    const data = await res.json();
    // Status 3 = NXDOMAIN = available, Status 0 with Answer = taken
    const available = data.Status === 3 || (!data.Answer && data.Status === 0);
    return NextResponse.json({ domain, available, status: data.Status });
  } catch {
    return NextResponse.json({ domain, available: null, error: 'Check failed' }, { status: 500 });
  }
}
