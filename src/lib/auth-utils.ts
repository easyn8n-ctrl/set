import { createHmac, randomBytes } from 'crypto';

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Create an HMAC-signed admin token with expiry timestamp.
 * Format (base64): "{adminId}:{createdAt}:{nonce}.{signature}"
 */
export function createSignedToken(adminId: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET environment variable is not set. This is required for authentication.');
  }
  const createdAt = Date.now().toString();
  const nonce = randomBytes(16).toString('hex');
  const payload = `${adminId}:${createdAt}:${nonce}`;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}.${signature}`).toString('base64');
}

/**
 * Decode and verify an HMAC-signed admin token.
 * Returns the adminId if valid and not expired, or null otherwise.
 */
export function verifyAdminToken(token: string): string | null {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return null;
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const lastDot = decoded.lastIndexOf('.');
    if (lastDot === -1) return null;

    const payload = decoded.substring(0, lastDot);
    const signature = decoded.substring(lastDot + 1);

    if (!payload || !signature) return null;

    const expectedSignature = createHmac('sha256', secret).update(payload).digest('hex');
    if (signature !== expectedSignature) return null;

    // Extract adminId and createdAt from payload: "{adminId}:{createdAt}:{nonce}"
    const firstColon = payload.indexOf(':');
    const secondColon = payload.indexOf(':', firstColon + 1);
    if (firstColon === -1 || secondColon === -1) return null;

    const adminId = payload.substring(0, firstColon);
    const createdAt = parseInt(payload.substring(firstColon + 1, secondColon), 10);

    if (!adminId || isNaN(createdAt)) return null;

    // Check token expiry (24 hours)
    if (Date.now() - createdAt > TOKEN_EXPIRY_MS) return null;

    return adminId;
  } catch {
    return null;
  }
}

/**
 * Extract the Bearer token from the Authorization header.
 * Returns the token string or null if missing/invalid.
 */
export function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.replace('Bearer ', '');
}
