'use client';
// app/(auth)/login/page.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, GraduationCap, ArrowRight, Mail, Lock, Info } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/validators';
import { cn } from '@/lib/utils/helpers';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needOTP, setNeedOTP] = useState(false);

  const registered = params.get('registered');
  const error = params.get('error');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email:    data.email,
        password: data.password,
        otp:      data.otp ?? '',
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'OTP expired' || result.error === 'Invalid OTP') {
          setNeedOTP(true);
          toast.error(result.error);
        } else {
          toast.error(result.error);
        }
        return;
      }

      toast.success('Welcome back!');
      router.push('/dashboard');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-navy-600/20 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5 text-gold-400" />
            </div>
            <span className="font-display font-bold text-2xl text-white">Alumni<span className="text-gold-400">Portal</span></span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 shadow-2xl"
        >
          {/* Alerts */}
          {registered && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-green-500/15 border border-green-500/20 text-green-400 text-sm">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Account created! Once admin approves, you can log in.
            </div>
          )}
          {error === 'Account pending admin approval' && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-yellow-500/15 border border-yellow-500/20 text-yellow-400 text-sm">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Your account is pending approval. You'll get an email when approved.
            </div>
          )}

          <h2 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-navy-400 text-sm mb-8">Sign in to your alumni portal account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-navy-200">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@college.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-navy-600 bg-navy-800 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm transition-all"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-navy-200">Password</label>
                <Link href="/forgot-password" className="text-xs text-gold-400 hover:text-gold-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-navy-600 bg-navy-800 text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm transition-all"
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-500">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {/* OTP (if needed) */}
            {needOTP && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1.5"
              >
                <label className="text-sm font-medium text-gold-400">Email OTP</label>
                <input
                  {...register('otp')}
                  placeholder="6-digit code from email"
                  maxLength={6}
                  className="w-full text-center text-2xl font-mono py-3 px-4 rounded-xl border border-gold-500/50 bg-gold-500/10 text-gold-400 placeholder:text-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-400 tracking-widest"
                />
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full justify-center py-3.5 text-base rounded-xl disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="text-center text-sm text-navy-400 mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-gold-400 hover:text-gold-300 font-medium">Join the network</Link>
          </p>
        </motion.div>

        {/* Demo credentials */}
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-navy-400">
          <p className="font-medium text-navy-300 mb-2">Demo credentials:</p>
          <p>Admin: <span className="text-white font-mono">admin@demo.com</span> / <span className="text-white font-mono">password123</span></p>
          <p>Alumni: <span className="text-white font-mono">alumni@demo.com</span> / <span className="text-white font-mono">password123</span></p>
        </div>
      </div>
    </div>
  );
}
