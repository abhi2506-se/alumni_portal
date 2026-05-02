'use client';
// app/(auth)/onboarding/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ArrowRight, Check, Briefcase, Star, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

const STEPS = [
  {
    icon: GraduationCap,
    title: 'Welcome to Alumni Portal!',
    subtitle: 'Your gateway to the GEC Rajkot professional network.',
    content: (
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
        {[
          { icon: Star,     label: 'Find Mentors'    },
          { icon: Briefcase, label: 'Browse Jobs'    },
          { icon: Globe,    label: 'Connect Alumni'  },
          { icon: Zap,      label: 'AI Guidance'     },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/10 border border-white/20">
            <Icon className="w-6 h-6 text-gold-400" />
            <span className="text-white text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Check,
    title: 'Account Under Review',
    subtitle: 'Your registration is pending admin approval.',
    content: (
      <div className="max-w-sm mx-auto space-y-4 text-left">
        {[
          { step: '1', label: 'Email verified', done: true  },
          { step: '2', label: 'Admin reviews your profile', done: false },
          { step: '3', label: 'Approval email sent to you', done: false },
          { step: '4', label: 'Full access unlocked!', done: false },
        ].map(({ step, label, done }) => (
          <div key={step} className="flex items-center gap-3">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
              done ? 'bg-green-500 text-white' : 'bg-white/10 text-white/60',
            )}>
              {done ? <Check className="w-4 h-4" /> : step}
            </div>
            <span className={cn('text-sm', done ? 'text-white' : 'text-white/60')}>{label}</span>
          </div>
        ))}
        <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-white/20 text-sm text-navy-200 leading-relaxed">
          You'll receive an email at your registered address once approved. This typically takes <strong className="text-white">1–24 hours</strong>.
        </div>
      </div>
    ),
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-400/10 blur-[120px]" />

      <div className="relative w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={cn('h-1.5 rounded-full transition-all duration-300', i === step ? 'w-8 bg-gold-400' : 'w-4 bg-white/20')} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-3xl p-8 text-center space-y-6"
          >
            {/* Icon */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-400/20 to-gold-500/10 border border-gold-400/30 flex items-center justify-center mx-auto">
              {(() => {
                const Icon = STEPS[step].icon;
                return <Icon className="w-10 h-10 text-gold-400" />;
              })()}
            </div>

            <div>
              <h1 className="font-display text-2xl font-bold text-white mb-2">{STEPS[step].title}</h1>
              <p className="text-navy-300">{STEPS[step].subtitle}</p>
            </div>

            {STEPS[step].content}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <button onClick={() => setStep(p => p - 1)} className="btn-outline border-white/20 text-white hover:bg-white/10 flex-1 py-3 rounded-xl text-sm">
                  Back
                </button>
              )}
              <button
                onClick={() => step < STEPS.length - 1 ? setStep(p => p + 1) : router.push('/login')}
                className="btn-gold flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                {step < STEPS.length - 1 ? <>Next <ArrowRight className="w-4 h-4" /></> : 'Go to Login'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
