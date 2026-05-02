'use client';
// app/(auth)/register/page.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, GraduationCap, ArrowRight, CheckCircle, Mail, Lock, User, Calendar, BookOpen } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@/lib/validators';
import { cn } from '@/lib/utils/helpers';

const STEPS = ['Account', 'Personal', 'Academic'];

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-navy-700 dark:text-navy-200">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800',
        'text-navy-900 dark:text-white placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-navy-400 focus:border-transparent',
        'transition-all duration-150 text-sm',
        className,
      )}
      {...props}
    />
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'STUDENT' },
  });

  const role = watch('role');

  async function nextStep() {
    const fields: (keyof RegisterInput)[][] = [
      ['email', 'password'],
      ['firstName', 'lastName'],
      ['batchYear', 'department', 'role'],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep(s => s + 1);
  }

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Registration failed');
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP() {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: watch('email'), otp }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'OTP verification failed');
      toast.success('Email verified! Awaiting admin approval.');
      router.push('/login?registered=1');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-400/10 blur-[120px] pointer-events-none" />

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
          {otpSent ? (
            /* OTP Screen */
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-green-500/20 flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">Check your email</h2>
                <p className="text-navy-300 text-sm">We sent a 6-digit code to <strong className="text-white">{watch('email')}</strong></p>
              </div>
              <div>
                <input
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full text-center text-3xl font-mono font-bold py-4 px-6 rounded-2xl bg-navy-800 text-white border border-navy-600 focus:outline-none focus:ring-2 focus:ring-gold-400 tracking-widest"
                />
              </div>
              <button
                onClick={verifyOTP}
                disabled={otp.length < 6 || loading}
                className="btn-gold w-full justify-center py-3.5 text-base rounded-xl disabled:opacity-50"
              >
                {loading ? 'Verifying…' : 'Verify Email'}
              </button>
            </div>
          ) : (
            /* Registration Form */
            <>
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-8">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                      i < step  ? 'bg-green-500 text-white' :
                      i === step ? 'bg-gold-400 text-navy-950' :
                                   'bg-navy-700 text-navy-400',
                    )}>
                      {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={cn('text-xs font-medium hidden sm:block', i === step ? 'text-gold-400' : 'text-navy-500')}>{s}</span>
                    {i < STEPS.length - 1 && (
                      <div className={cn('flex-1 h-0.5 mx-2 w-8 transition-colors', i < step ? 'bg-green-500' : 'bg-navy-700')} />
                    )}
                  </div>
                ))}
              </div>

              <h2 className="font-display text-2xl font-bold text-white mb-6">
                {step === 0 ? 'Create account' : step === 1 ? 'Your details' : 'Academic info'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <AnimatePresence mode="wait" custom={step}>
                  <motion.div
                    key={step}
                    custom={1}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-4"
                  >
                    {step === 0 && (
                      <>
                        <Field label="Email address" error={errors.email?.message}>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input {...register('email')} type="email" placeholder="you@college.edu" className="pl-10" />
                          </div>
                        </Field>
                        <Field label="Password" error={errors.password?.message}>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              {...register('password')}
                              type={showPw ? 'text' : 'password'}
                              placeholder="At least 8 characters"
                              className="pl-10 pr-10"
                            />
                            <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </Field>
                        {/* Role selector */}
                        <Field label="I am a…" error={errors.role?.message}>
                          <div className="grid grid-cols-2 gap-3">
                            {(['STUDENT', 'ALUMNI'] as const).map(r => (
                              <label
                                key={r}
                                className={cn(
                                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all',
                                  role === r
                                    ? 'border-gold-400 bg-gold-400/10 text-gold-300'
                                    : 'border-navy-600 bg-navy-800 text-navy-400 hover:border-navy-500',
                                )}
                              >
                                <input {...register('role')} type="radio" value={r} className="sr-only" />
                                {r === 'STUDENT' ? <BookOpen className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                                <span className="text-sm font-medium capitalize">{r.toLowerCase()}</span>
                              </label>
                            ))}
                          </div>
                        </Field>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <Field label="First name" error={errors.firstName?.message}>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input {...register('firstName')} placeholder="Arjun" className="pl-10" />
                          </div>
                        </Field>
                        <Field label="Last name" error={errors.lastName?.message}>
                          <Input {...register('lastName')} placeholder="Mehta" />
                        </Field>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <Field label="Batch Year" error={errors.batchYear?.message}>
                          <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input {...register('batchYear')} type="number" placeholder="2024" className="pl-10" />
                          </div>
                        </Field>
                        <Field label="Department" error={errors.department?.message}>
                          <select
                            {...register('department')}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-navy-800 text-white focus:outline-none focus:ring-2 focus:ring-navy-400 text-sm"
                          >
                            <option value="">Select department</option>
                            {['Computer Engineering', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical'].map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </Field>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep(s => s - 1)}
                      className="btn-outline flex-1 justify-center border-navy-600 text-white hover:bg-navy-700 py-3 rounded-xl"
                    >
                      Back
                    </button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-gold flex-1 justify-center py-3 rounded-xl"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold flex-1 justify-center py-3 rounded-xl disabled:opacity-60"
                    >
                      {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                  )}
                </div>
              </form>

              <p className="text-center text-sm text-navy-400 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-gold-400 hover:text-gold-300 font-medium">Sign in</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
