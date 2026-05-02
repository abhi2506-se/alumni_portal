'use client';
// app/(public)/page.tsx – Home Landing Page
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import {
  Users, Briefcase, Calendar, Star, ArrowRight, ChevronDown,
  MapPin, Trophy, MessageSquare, GraduationCap, Sparkles, Globe,
  TrendingUp, Shield, Zap, Play,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils/helpers';

// ─── Animated particle background ────────────────────────────────────────────
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold-400/20"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, suffix = '+', delay = 0 }: {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView({ triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="stat-card group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-navy-50 dark:bg-navy-800 group-hover:bg-navy-100 dark:group-hover:bg-navy-700 transition-colors">
          <Icon className="w-6 h-6 text-navy-600 dark:text-navy-300" />
        </div>
        <div>
          <p className="text-3xl font-display font-bold text-navy-900 dark:text-white">
            {inView ? <CountUp end={value} duration={2.5} separator="," suffix={suffix} /> : '0'}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-navy-500 to-gold-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl" />
    </motion.div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, color, delay = 0 }: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  delay?: number;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative p-6 rounded-2xl bg-white dark:bg-navy-900 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-display font-semibold text-xl text-navy-900 dark:text-white mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-navy-600 dark:text-navy-300 opacity-0 group-hover:opacity-100 transition-opacity">
        Learn more <ArrowRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
}

// ─── Alumni highlight card ────────────────────────────────────────────────────
const HIGHLIGHTS = [
  { name: 'Arjun Mehta', role: 'Senior Engineer at Google', batch: '2019', initials: 'AM', color: 'bg-blue-500', story: 'Landed at Google after mentoring 20+ juniors through the portal.' },
  { name: 'Priya Sharma', role: 'Founder at EdTech Startup', batch: '2017', initials: 'PS', color: 'bg-purple-500', story: 'Built a $5M ARR startup using the network connections made here.' },
  { name: 'Rohan Patel', role: 'Product Manager at Microsoft', batch: '2020', initials: 'RP', color: 'bg-green-500', story: 'Secured dream internship through a job posting on the portal.' },
  { name: 'Ananya Singh', role: 'ML Researcher at DeepMind', batch: '2018', initials: 'AS', color: 'bg-pink-500', story: 'Found research collaborators and got referrals through alumni network.' },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { scrollY } = useScroll();
  const heroY    = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveStory(p => (p + 1) % HIGHLIGHTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-950">
        {/* Background mesh */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <ParticleField />

        {/* Spotlight */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full bg-navy-600/20 blur-[120px] animate-pulse-slow" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-gold-300 text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            Your College's Official Alumni Network
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            Where Futures Are{' '}
            <span className="relative inline-block">
              <span className="gradient-text-gold">Built</span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gold-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              />
            </span>{' '}
            Together
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-navy-200 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12"
          >
            Connect with 5,000+ alumni worldwide. Find mentors, discover careers,
            and build the network that transforms your journey.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register" className="btn-gold text-base px-8 py-4 rounded-xl shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 hover:scale-105 transition-all duration-200">
              Join the Network <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/alumni" className="btn-outline border-white/30 text-white hover:bg-white/10 text-base px-8 py-4 rounded-xl">
              Explore Alumni
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-xs uppercase tracking-widest font-body">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="section-pad bg-cream-50 dark:bg-navy-950 relative">
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="container relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Users}       value={5200}  label="Alumni Worldwide"    delay={0}    />
            <StatCard icon={Briefcase}   value={1800}  label="Jobs Posted"         delay={0.1}  />
            <StatCard icon={GraduationCap} value={340} label="Mentor Sessions"     delay={0.2}  suffix="+" />
            <StatCard icon={Trophy}      value={95}    label="Placement Rate"      delay={0.3}  suffix="%" />
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="section-pad bg-white dark:bg-navy-900">
        <div className="container">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gold-500 font-medium text-sm uppercase tracking-widest mb-3"
            >
              Everything You Need
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-4"
            >
              One Platform, Infinite Opportunities
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              From your first internship to your next big career move — everything you need is here.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Users}         title="Alumni Directory"     desc="Search and connect with 5,200+ alumni by company, skills, batch, or location."                color="bg-navy-600"   delay={0}   />
            <FeatureCard icon={MessageSquare} title="Private Messaging"    desc="Encrypted real-time chat — only activated when both parties agree to connect."                color="bg-violet-600" delay={0.1} />
            <FeatureCard icon={Briefcase}     title="Job & Internship Board" desc="Alumni-posted opportunities with direct apply links — curated, verified, exclusive."       color="bg-green-600"  delay={0.2} />
            <FeatureCard icon={Calendar}      title="Events Hub"           desc="Webinars, workshops, reunions — RSVP and never miss an important event again."              color="bg-orange-500" delay={0.3} />
            <FeatureCard icon={Star}          title="Mentorship Booking"   desc="Calendar-based scheduling with any mentor. Book 1:1 sessions in minutes."                  color="bg-gold-500"   delay={0.4} />
            <FeatureCard icon={Globe}         title="Alumni World Map"     desc="Visualize where our alumni have spread across the globe. We're everywhere."                 color="bg-teal-500"   delay={0.5} />
            <FeatureCard icon={TrendingUp}    title="AI Career Guidance"   desc="AI-powered resume analysis and personalized career path recommendations."                   color="bg-pink-500"   delay={0.6} />
            <FeatureCard icon={Shield}        title="Verified Network"     desc="Every member is admin-approved with OTP verification — no fake profiles."                  color="bg-red-500"    delay={0.7} />
            <FeatureCard icon={Zap}           title="Real-time Everything" desc="Live notifications, instant messages, live event updates — the network that never sleeps." color="bg-blue-500"   delay={0.8} />
          </div>
        </div>
      </section>

      {/* ── Alumni Highlights ─────────────────────────────── */}
      <section className="section-pad bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
        <ParticleField />
        <div className="container relative">
          <div className="text-center mb-16">
            <p className="text-gold-400 font-medium text-sm uppercase tracking-widest mb-3">Our Alumni</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Stories That Inspire
            </h2>
            <p className="text-navy-300 text-lg max-w-xl mx-auto">
              Real people, real journeys, real success. Here's what our alumni say.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Story display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="glass rounded-3xl p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl', HIGHLIGHTS[activeStory].color)}>
                    {HIGHLIGHTS[activeStory].initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{HIGHLIGHTS[activeStory].name}</p>
                    <p className="text-gold-400 text-sm">{HIGHLIGHTS[activeStory].role}</p>
                    <p className="text-navy-400 text-sm">Batch of {HIGHLIGHTS[activeStory].batch}</p>
                  </div>
                </div>
                <p className="text-navy-200 text-lg leading-relaxed italic">
                  "{HIGHLIGHTS[activeStory].story}"
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Story list */}
            <div className="flex flex-col gap-3">
              {HIGHLIGHTS.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStory(i)}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300',
                    activeStory === i
                      ? 'bg-white/15 border border-white/20'
                      : 'hover:bg-white/8',
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0', h.color)}>
                    {h.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm">{h.name}</p>
                    <p className="text-navy-400 text-xs truncate">{h.role}</p>
                  </div>
                  {activeStory === i && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" />
                  )}
                </button>
              ))}

              <Link
                href="/alumni"
                className="mt-2 flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all text-sm font-medium"
              >
                View All Alumni Profiles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="section-pad bg-gradient-to-br from-gold-400 via-gold-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="container relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-navy-950 mb-6"
          >
            Ready to Join the Legacy?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-navy-800 text-xl mb-10 max-w-2xl mx-auto"
          >
            Sign up in minutes. Get verified by admin. Start networking with thousands of alumni.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white rounded-xl font-semibold hover:bg-navy-800 hover:scale-105 transition-all duration-200 shadow-xl text-base">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/events" className="inline-flex items-center gap-2 px-8 py-4 bg-white/30 text-navy-950 rounded-xl font-semibold hover:bg-white/50 transition-all duration-200 text-base">
              Browse Events
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
