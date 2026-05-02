// app/api/mentorship/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { mentorshipSchema } from '@/lib/validators';
import { sendMentorshipEmail } from '@/lib/utils/email';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const menteeId = (session.user as any).id;
  const body = await req.json();

  try {
    const data = mentorshipSchema.parse(body);

    // Validate mentor exists and is open to mentor
    const mentor = await prisma.user.findUnique({
      where: { id: data.mentorId },
      include: { profile: true },
    });
    if (!mentor || mentor.role !== 'ALUMNI') {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
    }
    if (!mentor.profile?.openToMentor) {
      return NextResponse.json({ error: 'This mentor is not accepting requests' }, { status: 400 });
    }
    if (mentor.id === menteeId) {
      return NextResponse.json({ error: 'Cannot mentor yourself' }, { status: 400 });
    }

    // Check for conflicting sessions
    const scheduledAt = new Date(data.scheduledAt);
    const conflict = await prisma.mentorship.findFirst({
      where: {
        mentorId: data.mentorId,
        scheduledAt: {
          gte: new Date(scheduledAt.getTime() - 60 * 60 * 1000),
          lte: new Date(scheduledAt.getTime() + 60 * 60 * 1000),
        },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });
    if (conflict) {
      return NextResponse.json({ error: 'Mentor has another session at this time' }, { status: 409 });
    }

    const mentee = await prisma.user.findUnique({
      where: { id: menteeId },
      include: { profile: true },
    });

    const mentorship = await prisma.mentorship.create({
      data: {
        mentorId:    data.mentorId,
        menteeId,
        topic:       data.topic,
        description: data.description,
        scheduledAt,
        duration:    data.duration,
        status:      'PENDING',
      },
    });

    // Notifications
    await prisma.notification.createMany({
      data: [
        {
          userId:  data.mentorId,
          type:    'MENTOR_REQUEST',
          title:   'New Mentorship Request',
          message: `${mentee?.profile?.firstName} wants to book a session: "${data.topic}"`,
          data:    { mentorshipId: mentorship.id },
        },
        {
          userId:  menteeId,
          type:    'MENTOR_REQUEST',
          title:   'Session Requested',
          message: `Your mentorship request with ${mentor.profile?.firstName} is pending confirmation`,
          data:    { mentorshipId: mentorship.id },
        },
      ],
    });

    // Update leaderboard
    await prisma.leaderboard.upsert({
      where: { userId: data.mentorId },
      update: { mentorScore: { increment: 15 }, totalScore: { increment: 15 } },
      create: { userId: data.mentorId, mentorScore: 15, totalScore: 15 },
    });

    // Send emails
    if (mentor.profile && mentee?.profile) {
      await sendMentorshipEmail(
        mentor.email, mentee.email,
        data.topic, scheduledAt,
        `${mentor.profile.firstName} ${mentor.profile.lastName}`,
        `${mentee.profile.firstName} ${mentee.profile.lastName}`,
      ).catch(() => {});
    }

    return NextResponse.json(mentorship, { status: 201 });
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    console.error('Mentorship error:', err);
    return NextResponse.json({ error: 'Failed to book mentorship' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id;
  const role   = (session.user as any).role;

  const where = role === 'ALUMNI'
    ? { mentorId: userId }
    : { menteeId: userId };

  const sessions = await prisma.mentorship.findMany({
    where,
    include: {
      mentor: { include: { profile: true } },
      mentee: { include: { profile: true } },
    },
    orderBy: { scheduledAt: 'desc' },
  });

  return NextResponse.json(sessions);
}
