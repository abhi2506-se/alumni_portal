// app/api/users/connections/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

// GET - list connections
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? 'ACCEPTED';

  const connections = await prisma.connection.findMany({
    where: {
      OR: [{ requesterId: userId }, { receiverId: userId }],
      status: status as any,
    },
    include: {
      requester: { include: { profile: true } },
      receiver:  { include: { profile: true } },
      chatRoom:  { select: { id: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(connections);
}

// POST - send connection request
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const requesterId = (session.user as any).id;
  const { receiverId, message } = await req.json();

  if (!receiverId) return NextResponse.json({ error: 'receiverId required' }, { status: 400 });
  if (requesterId === receiverId) return NextResponse.json({ error: 'Cannot connect with yourself' }, { status: 400 });

  // Check if connection already exists
  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { requesterId, receiverId },
        { requesterId: receiverId, receiverId: requesterId },
      ],
    },
  });

  if (existing) {
    return NextResponse.json({ error: 'Connection already exists', status: existing.status }, { status: 409 });
  }

  const connection = await prisma.connection.create({
    data: { requesterId, receiverId, message, status: 'PENDING' },
  });

  // Notify receiver
  const requester = await prisma.user.findUnique({
    where: { id: requesterId },
    include: { profile: true },
  });

  await prisma.notification.create({
    data: {
      userId:  receiverId,
      type:    'CONNECTION_REQUEST',
      title:   'New Connection Request',
      message: `${requester?.profile?.firstName ?? 'Someone'} wants to connect with you`,
      data:    { connectionId: connection.id, requesterId },
    },
  });

  return NextResponse.json(connection, { status: 201 });
}

// PATCH - accept / decline
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id;
  const { connectionId, action } = await req.json(); // action: 'ACCEPTED' | 'DECLINED'

  const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
  if (!connection) return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
  if (connection.receiverId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const updated = await prisma.$transaction(async (tx) => {
    const conn = await tx.connection.update({
      where: { id: connectionId },
      data:  { status: action },
    });

    // If accepted, create a chat room
    if (action === 'ACCEPTED') {
      await tx.chatRoom.create({ data: { connectionId } });

      // Notify requester
      await tx.notification.create({
        data: {
          userId:  connection.requesterId,
          type:    'CONNECTION_REQUEST',
          title:   'Connection Accepted!',
          message: 'Your connection request was accepted. You can now chat!',
          data:    { connectionId },
        },
      });
    }

    return conn;
  });

  return NextResponse.json(updated);
}
