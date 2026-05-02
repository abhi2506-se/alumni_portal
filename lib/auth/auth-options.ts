// lib/auth/auth-options.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days
  pages: {
    signIn:    '/login',
    error:     '/login',
    newUser:   '/onboarding',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
        otp:      { label: 'OTP',      type: 'text'     },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: { profile: true },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error('Invalid credentials');

        // Check OTP if provided / required
        if (user.otpSecret && credentials.otp) {
          const now = new Date();
          if (!user.otpExpiry || user.otpExpiry < now) {
            throw new Error('OTP expired');
          }
          if (user.otpSecret !== credentials.otp) {
            throw new Error('Invalid OTP');
          }
          // Clear OTP after successful use
          await prisma.user.update({
            where: { id: user.id },
            data: { otpSecret: null, otpExpiry: null, emailVerified: new Date() },
          });
        }

        // Check account status
        if (user.status === 'PENDING') {
          throw new Error('Account pending admin approval');
        }
        if (user.status === 'REJECTED') {
          throw new Error('Account rejected. Contact admin.');
        }
        if (user.status === 'SUSPENDED') {
          throw new Error('Account suspended. Contact admin.');
        }

        return {
          id:     user.id,
          email:  user.email,
          role:   user.role,
          status: user.status,
          name:   user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email,
          image:  user.profile?.avatar ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id     = user.id;
        token.role   = (user as any).role;
        token.status = (user as any).status;
      }
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id     = token.id as string;
        (session.user as any).role   = token.role;
        (session.user as any).status = token.status;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      // Track sign-in analytics
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await prisma.analytics.upsert({
        where: { date_metric: { date: today, metric: 'daily_logins' } },
        update: { value: { increment: 1 } },
        create: { date: today, metric: 'daily_logins', value: 1 },
      }).catch(() => {}); // Non-critical
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
