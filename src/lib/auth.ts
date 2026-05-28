import { NextRequest } from 'next/server';
import { verifyAdminToken, extractBearerToken } from '@/lib/auth-utils';
import { db } from '@/lib/db';

/**
 * Verify an admin request by checking the Bearer token.
 * Returns the admin record if valid, or null otherwise.
 */
export async function verifyAdmin(request: NextRequest) {
  const token = extractBearerToken(request);
  if (!token) return null;

  const adminId = verifyAdminToken(token);
  if (!adminId) return null;

  try {
    const admin = await db.admin.findUnique({
      where: { id: adminId },
      select: { id: true, email: true, name: true },
    });
    return admin;
  } catch {
    return null;
  }
}
