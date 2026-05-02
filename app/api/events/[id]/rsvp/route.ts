// app/api/events/[id]/rsvp/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId  = (session.user as any).id;
  const eventId = params.id;

  const event = await prisma.event.findUnique({ where: { id: eventId }, include: { _count: { select: { rsvps: true } } } });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  // Check capacity
  if (event.capacity && event._count.rsvps >= event.capacity) {
    return NextResponse.json({ error: 'Event is at full capacity' }, { status: 400 });
  }

  // Toggle RSVP
  const existing = await prisma.eventRSVP.findUnique({ where: { eventId_userId: { eventId, userId } } });

  if (existing) {
    await prisma.eventRSVP.delete({ where: { eventId_userId: { eventId, userId } } });
    return NextResponse.json({ rsvped: false, message: 'RSVP cancelled' });
  }

  await prisma.eventRSVP.create({ data: { eventId, userId } });

  // Update leaderboard score
  await prisma.leaderboard.upsert({
    where:  { userId },
    update: { eventScore: { increment: 5 }, totalScore: { increment: 5 } },
    create: { userId, eventScore: 5, totalScore: 5 },
  });

  return NextResponse.json({ rsvped: true, message: 'RSVP confirmed' }, { status: 201 });
}
