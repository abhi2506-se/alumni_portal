// app/api/users/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? 20);

  // Recalculate scores and ranks
  const entries = await prisma.leaderboard.findMany({
    include: {
      user: {
        select: {
          id:   true,
          role: true,
          profile: {
            select: {
              firstName:      true,
              lastName:       true,
              avatar:         true,
              currentCompany: true,
              currentRole:    true,
              batchYear:      true,
              department:     true,
            },
          },
        },
      },
    },
    orderBy: { totalScore: 'desc' },
    take:    limit,
  });

  // Add rank
  const ranked = entries.map((entry, i) => ({
    ...entry,
    rank: i + 1,
  }));

  // Update ranks in DB asynchronously
  Promise.all(
    ranked.map(e => prisma.leaderboard.update({
      where: { userId: e.userId },
      data:  { rank: e.rank },
    }))
  ).catch(() => {});

  return NextResponse.json(ranked);
}
