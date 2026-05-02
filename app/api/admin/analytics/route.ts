// app/api/admin/analytics/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const [
    totalUsers,
    pendingApprovals,
    approvedUsers,
    totalJobs,
    pendingJobs,
    activeEvents,
    totalMentorships,
    usersByRole,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { status: 'APPROVED' } }),
    prisma.job.count({ where: { isActive: true } }),
    prisma.job.count({ where: { isApproved: false, isActive: true } }),
    prisma.event.count({ where: { status: 'UPCOMING' } }),
    prisma.mentorship.count({ where: { status: { in: ['PENDING', 'CONFIRMED'] } } }),

    // Users by role
    prisma.user.groupBy({
      by:      ['role'],
      _count:  { id: true },
    }),

    // Signups last 30 days
    prisma.user.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      select: { createdAt: true, role: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  // Group signups by day
  const signupsByDay: Record<string, { students: number; alumni: number }> = {};
  for (const user of recentSignups) {
    const day = user.createdAt.toISOString().split('T')[0];
    if (!signupsByDay[day]) signupsByDay[day] = { students: 0, alumni: 0 };
    if (user.role === 'STUDENT') signupsByDay[day].students++;
    if (user.role === 'ALUMNI')  signupsByDay[day].alumni++;
  }

  const monthlySignups = Object.entries(signupsByDay).map(([date, counts]) => ({
    date,
    ...counts,
    total: counts.students + counts.alumni,
  }));

  // Top mentors
  const topMentors = await prisma.leaderboard.findMany({
    where: { mentorScore: { gt: 0 } },
    include: {
      user: {
        select: {
          id: true,
          profile: {
            select: { firstName: true, lastName: true, avatar: true, currentCompany: true, batchYear: true },
          },
        },
      },
    },
    orderBy: { mentorScore: 'desc' },
    take:    5,
  });

  return NextResponse.json({
    totalUsers,
    pendingApprovals,
    approvedUsers,
    totalJobs,
    pendingJobs,
    activeEvents,
    totalMentorships,
    usersByRole: usersByRole.map(r => ({ role: r.role, count: r._count.id })),
    monthlySignups,
    topMentors,
  });
}
