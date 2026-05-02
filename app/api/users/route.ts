// app/api/users/route.ts – Alumni/Student directory search
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);

  const page       = Number(searchParams.get('page') ?? 1);
  const limit      = Number(searchParams.get('limit') ?? 12);
  const q          = searchParams.get('q');
  const role       = searchParams.get('role');
  const dept       = searchParams.get('department');
  const batch      = searchParams.get('batchYear');
  const company    = searchParams.get('company');
  const mentor     = searchParams.get('openToMentor');
  const city       = searchParams.get('city');
  const skills     = searchParams.get('skills')?.split(',').filter(Boolean);

  // Build where clause
  const where: any = {
    status: 'APPROVED',
    role:   role ?? { in: ['STUDENT', 'ALUMNI'] },
    profile: {
      isPublic: true,
      ...(dept    ? { department:     { contains: dept,    mode: 'insensitive' } } : {}),
      ...(batch   ? { batchYear:      Number(batch)                              } : {}),
      ...(company ? { currentCompany: { contains: company, mode: 'insensitive' } } : {}),
      ...(mentor === 'true' ? { openToMentor: true } : {}),
      ...(city    ? { city:           { contains: city,    mode: 'insensitive' } } : {}),
      ...(skills?.length ? { skills:  { hasSome: skills } } : {}),
    },
  };

  if (q) {
    where.OR = [
      { profile: { firstName: { contains: q, mode: 'insensitive' } } },
      { profile: { lastName:  { contains: q, mode: 'insensitive' } } },
      { profile: { currentCompany: { contains: q, mode: 'insensitive' } } },
      { profile: { currentRole:    { contains: q, mode: 'insensitive' } } },
      { profile: { skills: { has: q } } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id:     true,
        role:   true,
        profile: {
          select: {
            firstName:      true,
            lastName:       true,
            avatar:         true,
            bio:            true,
            batchYear:      true,
            department:     true,
            currentCompany: true,
            currentRole:    true,
            city:           true,
            country:        true,
            skills:         true,
            openToMentor:   true,
            linkedinUrl:    true,
            githubUrl:      true,
            // Only expose contact details to authenticated users
            ...(session ? {
              phone:        true,
              portfolioUrl: true,
              resumeUrl:    true,
            } : {}),
          },
        },
        // Only expose leaderboard data to authenticated users
        ...(session ? {
          leaderboardEntry: { select: { totalScore: true, rank: true } },
        } : {}),
      },
      orderBy: { profile: { batchYear: 'desc' } },
      skip:  (page - 1) * limit,
      take:  limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    data:     users,
    total,
    page,
    pageSize: limit,
    hasMore:  page * limit < total,
  });
}
