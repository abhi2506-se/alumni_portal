// app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { messageSchema } from '@/lib/validators';

// GET /api/messages?chatRoomId=xxx
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const chatRoomId = searchParams.get('chatRoomId');
  if (!chatRoomId) return NextResponse.json({ error: 'chatRoomId required' }, { status: 400 });

  const userId = (session.user as any).id;

  // Verify user is part of this chat room via connection
  const chatRoom = await prisma.chatRoom.findUnique({
    where: { id: chatRoomId },
    include: {
      connection: { select: { requesterId: true, receiverId: true, status: true } },
    },
  });

  if (!chatRoom) return NextResponse.json({ error: 'Chat room not found' }, { status: 404 });
  if (chatRoom.connection.status !== 'ACCEPTED') return NextResponse.json({ error: 'Connection not accepted' }, { status: 403 });
  if (chatRoom.connection.requesterId !== userId && chatRoom.connection.receiverId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { chatRoomId },
    orderBy: { createdAt: 'asc' },
    take: 100,
    select: { id: true, content: true, iv: true, senderId: true, status: true, createdAt: true },
  });

  // Mark unread messages as read
  await prisma.message.updateMany({
    where: { chatRoomId, senderId: { not: userId }, status: { not: 'READ' } },
    data: { status: 'READ' },
  });

  return NextResponse.json(messages);
}

// POST /api/messages
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id;
  const body = await req.json();

  try {
    const { chatRoomId, ciphertext, iv } = messageSchema.parse(body);

    // Verify access
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: { connection: { select: { requesterId: true, receiverId: true, status: true } } },
    });

    if (!chatRoom) return NextResponse.json({ error: 'Chat room not found' }, { status: 404 });
    if (chatRoom.connection.status !== 'ACCEPTED') return NextResponse.json({ error: 'Connection not accepted' }, { status: 403 });
    if (chatRoom.connection.requesterId !== userId && chatRoom.connection.receiverId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        chatRoomId,
        senderId: userId,
        content:  ciphertext, // store encrypted
        iv,
        status: 'SENT',
      },
    });

    // Send notification to other party
    const otherId = chatRoom.connection.requesterId === userId
      ? chatRoom.connection.receiverId
      : chatRoom.connection.requesterId;

    await prisma.notification.create({
      data: {
        userId:  otherId,
        type:    'MESSAGE',
        title:   'New Message',
        message: 'You have a new message',
        data:    { chatRoomId, messageId: message.id },
      },
    });

    // Update leaderboard score (small bonus for engagement)
    await prisma.leaderboard.upsert({
      where: { userId },
      update: { totalScore: { increment: 1 } },
      create: { userId, totalScore: 1 },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    console.error('Message error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
