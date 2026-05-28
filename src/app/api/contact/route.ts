import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// POST - Customer sends a message
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 messages per minute per IP
    const clientKey = `contact:${getClientIp(request)}`;
    if (!rateLimit(clientKey, 5, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many messages. Please wait a moment.' }, { status: 429 });
    }

    const body = await request.json();
    const { name, email, message, fileData, fileName, fileType, fileSize } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (fileData) {
      const decodedSize = Math.ceil((fileData.length * 3) / 4);
      if (decodedSize > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
      }
    }

    let fileUrl: string | null = null;
    if (fileData) {
      fileUrl = fileData;
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        fileUrl,
        fileName: fileName || null,
        fileType: fileType || null,
        fileSize: fileSize || null,
      },
    });

    return NextResponse.json({ success: true, id: contactMessage.id });
  } catch (error) {
    console.error('Contact message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// GET - Admin fetches messages
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const where = unreadOnly ? { isRead: false, isAdmin: false } : {};

    const messages = await db.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const unreadCount = await db.contactMessage.count({
      where: { isRead: false, isAdmin: false },
    });

    return NextResponse.json({ messages, unreadCount });
  } catch (error) {
    console.error('Fetch contact messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// PATCH - Mark as read / Admin reply
export async function PATCH(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { messageId, action, replyMessage } = body;

    if (action === 'markRead') {
      await db.contactMessage.update({
        where: { id: messageId },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'markAllRead') {
      await db.contactMessage.updateMany({
        where: { isRead: false, isAdmin: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'reply') {
      if (!replyMessage || !messageId) {
        return NextResponse.json({ error: 'Message ID and reply are required' }, { status: 400 });
      }
      const originalMessage = await db.contactMessage.findUnique({
        where: { id: messageId },
      });
      if (!originalMessage) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }

      await db.contactMessage.create({
        data: {
          name: 'WebCraft Admin',
          email: 'admin@webcraft.ca',
          message: replyMessage,
          isAdmin: true,
          replyTo: messageId,
        },
      });

      await db.contactMessage.update({
        where: { id: messageId },
        data: { isRead: true },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Update contact message error:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}
