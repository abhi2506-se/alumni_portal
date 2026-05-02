// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.otpSecret || !user.otpExpiry) {
      return NextResponse.json({ error: 'No OTP found. Request a new one.' }, { status: 400 });
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ error: 'OTP has expired. Request a new one.' }, { status: 400 });
    }

    if (user.otpSecret !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Mark email verified, clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        otpSecret:     null,
        otpExpiry:     null,
      },
    });

    return NextResponse.json({ message: 'Email verified. Awaiting admin approval.' });
  } catch (err) {
    console.error('OTP verify error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
