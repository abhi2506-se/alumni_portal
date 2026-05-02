// app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { jobSchema } from '@/lib/validators';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page     = Number(searchParams.get('page') ?? 1);
  const limit    = Number(searchParams.get('limit') ?? 10);
  const type     = searchParams.get('type');
  const search   = searchParams.get('q');
  const location = searchParams.get('location');

  const where: any = { isActive: true, isApproved: true };
  if (type)     where.type = type;
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (search) {
    where.OR = [
      { title:   { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
      { skills:  { has: search } },
    ];
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        poster: { include: { profile: { select: { firstName: true, lastName: true, avatar: true, currentRole: true } } } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip:  (page - 1) * limit,
      take:  limit,
    }),
    prisma.job.count({ where }),
  ]);

  return NextResponse.json({ data: jobs, total, page, pageSize: limit, hasMore: page * limit < total });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = session.user as any;
  if (user.role !== 'ALUMNI' && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only alumni can post jobs' }, { status: 403 });
  }

  const body = await req.json();
  try {
    const data = jobSchema.parse(body);
    const job = await prisma.job.create({
      data: {
        ...data,
        posterId:  user.id,
        deadline:  data.deadline ? new Date(data.deadline) : undefined,
        isApproved: user.role === 'ADMIN', // Auto-approve for admins
      },
    });

    // Update leaderboard
    await prisma.leaderboard.upsert({
      where: { userId: user.id },
      update: { jobPostScore: { increment: 10 }, totalScore: { increment: 10 } },
      create: { userId: user.id, jobPostScore: 10, totalScore: 10 },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
