// app/api/users/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { profileSchema } from '@/lib/validators';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id;
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  return NextResponse.json(profile);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as any).id;
  const body = await req.json();

  try {
    const data = profileSchema.parse(body);
    const { skills, achievements, openToMentor } = body;

    // Check if profile complete
    const isComplete = !!(
      data.firstName && data.lastName && data.bio &&
      data.batchYear && data.department && data.currentRole &&
      (skills?.length > 0)
    );

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        ...data,
        skills:          Array.isArray(skills) ? skills : undefined,
        achievements:    Array.isArray(achievements) ? achievements : undefined,
        openToMentor:    typeof openToMentor === 'boolean' ? openToMentor : undefined,
        profileComplete: isComplete,
        updatedAt:       new Date(),
      },
      create: {
        userId,
        firstName:  data.firstName ?? '',
        lastName:   data.lastName ?? '',
        bio:        data.bio,
        batchYear:  data.batchYear,
        department: data.department,
        skills:     Array.isArray(skills) ? skills : [],
        achievements: Array.isArray(achievements) ? achievements : [],
        openToMentor:  typeof openToMentor === 'boolean' ? openToMentor : false,
        profileComplete: isComplete,
      },
    });

    return NextResponse.json(profile);
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    console.error('Profile update error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
