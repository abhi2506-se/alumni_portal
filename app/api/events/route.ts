// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { eventSchema } from '@/lib/validators';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page   = Number(searchParams.get('page') ?? 1);
  const limit  = Number(searchParams.get('limit') ?? 10);

  const where: any = {};
  if (status) where.status = status;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: { _count: { select: { rsvps: true } } },
      orderBy: { startDate: 'asc' },
      skip:    (page - 1) * limit,
      take:    limit,
    }),
    prisma.event.count({ where }),
  ]);

  return NextResponse.json({ data: events, total, page, pageSize: limit });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const body = await req.json();
  try {
    const data = eventSchema.parse(body);
    const event = await prisma.event.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate:   new Date(data.endDate),
        tags:      data.tags ?? [],
      },
    });

    // Notify all approved users
    const users = await prisma.user.findMany({
      where: { status: 'APPROVED' },
      select: { id: true },
    });

    await prisma.notification.createMany({
      data: users.map(u => ({
        userId:  u.id,
        type:    'EVENT_CREATED' as const,
        title:   'New Event',
        message: `${data.title} has been scheduled for ${new Date(data.startDate).toLocaleDateString()}`,
        data:    { eventId: event.id },
      })),
      skipDuplicates: true,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    console.error('Event error:', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
