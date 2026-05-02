// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';
import { registerSchema } from '@/lib/validators';
import { sendOTPEmail, generateOTP } from '@/lib/utils/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    // Check existing
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Hash password
    const hashed = await bcrypt.hash(data.password, 12);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user + profile in transaction
    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email:     data.email.toLowerCase(),
          password:  hashed,
          role:      data.role,
          status:    'PENDING',
          otpSecret: otp,
          otpExpiry,
        },
      });

      await tx.profile.create({
        data: {
          userId:     u.id,
          firstName:  data.firstName,
          lastName:   data.lastName,
          batchYear:  data.batchYear,
          department: data.department,
        },
      });

      // Create leaderboard entry
      await tx.leaderboard.create({ data: { userId: u.id } });

      return u;
    });

    // Send OTP email
    await sendOTPEmail(data.email, otp, `${data.firstName} ${data.lastName}`);

    // Notify admins of new registration
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN', status: 'APPROVED' } });
    await prisma.notification.createMany({
      data: admins.map(admin => ({
        userId:  admin.id,
        type:    'APPROVAL' as const,
        title:   'New Registration',
        message: `${data.firstName} ${data.lastName} (${data.role}) registered and needs approval`,
        data:    { userId: user.id },
      })),
    });

    return NextResponse.json({ message: 'Registration successful. OTP sent to email.' }, { status: 201 });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
