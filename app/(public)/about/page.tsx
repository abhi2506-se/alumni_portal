'use client';
// app/(public)/about/page.tsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  GraduationCap, Users, Star, Globe, Target, Heart,
  Award, BookOpen, TrendingUp, Shield, Zap, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils/helpers';

const TEAM = [
  { name: 'Dr. R.K. Patel',    role: 'Principal, GEC Rajkot',     dept: 'Computer Engineering', initials: 'RP', color: 'bg-navy-600'   },
  { name: 'Prof. S. Mehta',    role: 'Alumni Relations Head',       dept: 'Information Technology', initials: 'SM', color: 'bg-gold-500'   },
  { name: 'Prof. A. Trivedi',  role: 'Training & Placement Officer', dept: 'Electronics',            initials: 'AT', color: 'bg-violet-500' },
  { name: 'Prof. K. Shah',     role: 'Industry Liaison',             dept: 'Computer Engineering',  initials: 'KS', color: 'bg-green-500'  },
];

const MILESTONES = [
  { year: '2010', title: 'College Founded', desc: 'GEC Rajkot established as a premier engineering institution in Gujarat.' },
  { year: '2015', title: 'First Placement Record', desc: '100% placement achieved for Computer Engineering batch – a historic milestone.' },
  { year: '2018', title: 'Industry Partnerships', desc: 'Signed MoUs with 50+ companies for placements and research collaboration.' },
  { year: '2020', title: 'Alumni Portal Launched', desc: 'Digital platform connecting 3,000+ alumni with students for mentorship.' },
  { year: '2022', title: 'Global Reach', desc: 'Alumni network expanded to 15+ countries with 4,000+ registered members.' },
  { year: '2024', title: 'AI-Powered Platform', desc: 'Launched AI career guidance, smart recommendations, and encrypted messaging.' },
];

const VALUES = [
  { icon: Target, title: 'Mission',    desc: 'To bridge the gap between academia and industry by fostering meaningful connections between students and alumni.',    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
  { icon: Heart,  title: 'Vision',     desc: 'To create a thriving alumni ecosystem where every GEC graduate contributes to and benefits from the network.',          color: 'bg-red-100 dark:bg-red-900/30 text-red-600'   },
  { icon: Shield, title: 'Values',     desc: 'Integrity, inclusivity, and mutual growth. We believe in giving back and paying it forward to the next generation.',    color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
];

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-400/10 blur-[100px]" />
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-gold-300 text-sm font-medium mb-6"
          >
            <GraduationCap className="w-4 h-4" />
            Government Engineering College, Rajkot
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-bold text-white mb-6"
          >
            About the{' '}
            <span className="gradient-text-gold">Alumni Portal</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-navy-300 text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Building bridges between generations of engineers since 2020. 
            A platform where legacies are created and futures are shaped.
          </motion.p>
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-white dark:bg-navy-900 border-b border-border">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users,       value: '5,200+', label: 'Alumni Registered' },
              { icon: Globe,       value: '25+',    label: 'Countries Reached' },
              { icon: Star,        value: '340+',   label: 'Mentor Sessions'   },
              { icon: TrendingUp,  value: '95%',    label: 'Placement Rate'    },
            ].map(({ icon: Icon, value, label }, i) => (
              <FadeIn key={label} delay={i * 0.1} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-navy-100 dark:bg-navy-700 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-navy-600 dark:text-navy-300" />
                </div>
                <p className="font-display text-3xl font-bold text-navy-900 dark:text-white">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="section-pad bg-cream-50 dark:bg-navy-950">
        <div className="container">
          <FadeIn className="text-center mb-14">
            <p className="text-gold-500 font-medium text-sm uppercase tracking-widest mb-3">Our Purpose</p>
            <h2 className="font-display text-4xl font-bold text-navy-900 dark:text-white">
              Why We Built This
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6 h-full hover:shadow-lg transition-shadow">
                  <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-5', color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white mb-3">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* College section */}
      <section className="section-pad bg-white dark:bg-navy-900">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <p className="text-gold-500 font-medium text-sm uppercase tracking-widest mb-3">Our Institution</p>
              <h2 className="font-display text-4xl font-bold text-navy-900 dark:text-white mb-5">
                Government Engineering College, Rajkot
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Established in 2010 under Gujarat Technological University, GEC Rajkot has grown
                into one of Gujarat's premier engineering institutions. With state-of-the-art
                infrastructure and industry-aligned curriculum, we've produced engineers who
                are shaping the world.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our commitment to excellence goes beyond academics. We foster innovation,
                entrepreneurship, and character — producing not just engineers, but leaders.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BookOpen,      label: 'Programs',      value: '8 UG Branches' },
                  { icon: Users,         label: 'Students',      value: '3,000+ enrolled' },
                  { icon: Award,         label: 'Accreditation', value: 'NAAC A Grade' },
                  { icon: TrendingUp,    label: 'Placement',     value: '95% consistently' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-navy-600 dark:text-navy-300" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold text-navy-900 dark:text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Visual */}
            <FadeIn delay={0.2}>
              <div className="relative">
                <div className="aspect-video rounded-3xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 dot-pattern opacity-20" />
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-3xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="w-10 h-10 text-gold-400" />
                    </div>
                    <p className="text-white font-display text-2xl font-bold">GEC Rajkot</p>
                    <p className="text-navy-300 text-sm mt-1">Est. 2010 · NAAC A Grade</p>
                  </div>
                  {/* Floating badges */}
                  {[
                    { text: '5,200+ Alumni', pos: 'top-4 left-4', bg: 'bg-white/10' },
                    { text: 'GTU Affiliated',  pos: 'bottom-4 right-4', bg: 'bg-gold-400/20' },
                  ].map(({ text, pos, bg }) => (
                    <div key={text} className={cn('absolute px-3 py-1.5 rounded-xl text-xs text-white backdrop-blur-sm border border-white/20', pos, bg)}>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad bg-cream-50 dark:bg-navy-950">
        <div className="container max-w-4xl">
          <FadeIn className="text-center mb-14">
            <p className="text-gold-500 font-medium text-sm uppercase tracking-widest mb-3">Our Journey</p>
            <h2 className="font-display text-4xl font-bold text-navy-900 dark:text-white">Key Milestones</h2>
          </FadeIn>
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <FadeIn key={m.year} delay={i * 0.08}>
                  <div className={cn('flex items-center gap-6', i % 2 === 0 ? 'flex-row' : 'flex-row-reverse')}>
                    <div className={cn('flex-1', i % 2 === 0 ? 'text-right' : 'text-left')}>
                      <p className="text-gold-500 font-display font-bold text-lg">{m.year}</p>
                      <h3 className="font-semibold text-navy-900 dark:text-white mb-1">{m.title}</h3>
                      <p className="text-sm text-muted-foreground">{m.desc}</p>
                    </div>
                    {/* Dot */}
                    <div className="w-4 h-4 rounded-full bg-navy-700 border-4 border-cream-50 dark:border-navy-950 z-10 flex-shrink-0" />
                    <div className="flex-1" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad bg-white dark:bg-navy-900">
        <div className="container max-w-5xl">
          <FadeIn className="text-center mb-14">
            <p className="text-gold-500 font-medium text-sm uppercase tracking-widest mb-3">The Team</p>
            <h2 className="font-display text-4xl font-bold text-navy-900 dark:text-white">Portal Administration</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.1}>
                <div className="text-center group">
                  <div className={cn(
                    'w-20 h-20 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform',
                    member.color,
                  )}>
                    {member.initials}
                  </div>
                  <h3 className="font-semibold text-navy-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{member.role}</p>
                  <p className="text-xs text-gold-600 mt-1">{member.dept}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="container text-center relative">
          <FadeIn>
            <h2 className="font-display text-4xl font-bold text-white mb-4">Be Part of the Legacy</h2>
            <p className="text-navy-300 text-lg mb-8 max-w-xl mx-auto">
              Join 5,200+ alumni building the future together. Your journey doesn't end at graduation — it's just beginning.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="btn-gold px-8 py-4 rounded-xl text-base flex items-center gap-2 justify-center">
                Join the Network <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/alumni" className="btn-outline border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-base">
                Browse Alumni
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
