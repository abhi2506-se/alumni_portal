// app/api/admin/users/[action]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { sendApprovalEmail } from '@/lib/utils/email';

export async function POST(
  req: Request,
  { params }: { params: { action: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 });
  }

  const { userId, reason } = await req.json();
  const adminId = (session.user as any).id;
  const action = params.action; // 'approve' | 'reject' | 'suspend'

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
  if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const newStatus = action === 'approve' ? 'APPROVED'
                  : action === 'reject'  ? 'REJECTED'
                  : 'SUSPENDED';

  // Update user status
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { status: newStatus } }),
    prisma.adminAction.create({
      data: { adminId, targetId: userId, action: action.toUpperCase(), reason },
    }),
    prisma.notification.create({
      data: {
        userId,
        type:    'APPROVAL',
        title:   action === 'approve' ? 'Account Approved!' : 'Account Status Update',
        message: action === 'approve'
          ? 'Your account has been approved. You can now log in.'
          : `Your account has been ${newStatus.toLowerCase()}. ${reason ?? ''}`,
      },
    }),
  ]);

  // Send email
  const name = targetUser.profile
    ? `${targetUser.profile.firstName} ${targetUser.profile.lastName}`
    : targetUser.email;

  await sendApprovalEmail(targetUser.email, name, action === 'approve', reason).catch(() => {});

  return NextResponse.json({ message: `User ${action}d successfully` });
}
