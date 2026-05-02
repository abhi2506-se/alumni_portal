'use client';
// app/(dashboard)/dashboard/page.tsx
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, Calendar, Star, MessageSquare, ArrowRight,
  TrendingUp, Bell, CheckCircle, Clock, MapPin, BookOpen,
} from 'lucide-react';
import { formatDate, timeAgo, cn } from '@/lib/utils/helpers';

function QuickStatCard({ icon: Icon, label, value, trend, color, href }: {
  icon: React.ElementType; label: string; value: string; trend?: string; color: string; href: string;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link href={href} className="block p-5 rounded-2xl bg-white dark:bg-navy-800 border border-border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', color)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trend && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
              +{trend}
            </span>
          )}
        </div>
        <p className="text-2xl font-display font-bold text-navy-900 dark:text-white">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
        <div className="flex items-center gap-1 mt-3 text-xs text-navy-500 group-hover:text-navy-700">
          View all <ArrowRight className="w-3 h-3" />
        </div>
      </Link>
    </motion.div>
  );
}

function ActivityItem({ icon: Icon, text, time, iconColor }: { icon: React.ElementType; text: string; time: string; iconColor: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', iconColor)}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-navy-900 dark:text-white">{text}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isAlumni = user?.role === 'ALUMNI';
  const isAdmin  = user?.role === 'ADMIN';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-muted-foreground text-sm"
          >
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-3xl font-bold text-navy-900 dark:text-white"
          >
            Your Dashboard
          </motion.h1>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2"
        >
          {isAlumni && (
            <Link href="/dashboard/jobs/new" className="btn-gold text-sm py-2.5 px-4 rounded-xl">
              Post a Job
            </Link>
          )}
          <Link href="/dashboard/profile" className="btn-outline text-sm py-2.5 px-4 rounded-xl">
            Edit Profile
          </Link>
        </motion.div>
      </div>

      {/* Profile completeness banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-gradient-to-r from-navy-700 to-navy-600 p-6 text-white flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="flex-1">
          <p className="font-semibold text-lg">Complete your profile to get discovered</p>
          <p className="text-navy-200 text-sm mt-1">Add skills, experience, and a photo to unlock mentorship requests</p>
          <div className="mt-3 bg-navy-800/50 rounded-full h-2 max-w-xs">
            <div className="bg-gold-400 h-2 rounded-full w-3/5" />
          </div>
          <p className="text-navy-300 text-xs mt-1">60% complete</p>
        </div>
        <Link href="/dashboard/profile" className="btn-gold whitespace-nowrap text-sm px-5 py-2.5 rounded-xl flex-shrink-0">
          Complete Profile <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users,         label: 'Connections',       value: '12',     trend: '3',  color: 'bg-blue-500',   href: '/dashboard/messages'   },
          { icon: MessageSquare, label: 'Messages',          value: '4',      trend: '2',  color: 'bg-violet-500', href: '/dashboard/messages'   },
          { icon: Star,          label: 'Mentor Sessions',   value: '2',                   color: 'bg-gold-500',   href: '/dashboard/mentorship' },
          { icon: Briefcase,     label: isAlumni ? 'Jobs Posted' : 'Jobs Applied', value: isAlumni ? '3' : '7', color: 'bg-green-500', href: '/dashboard/jobs' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
          >
            <QuickStatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-navy-900 dark:text-white">Recent Activity</h2>
            <button className="text-xs text-navy-500 hover:text-navy-700 dark:hover:text-navy-300">View all</button>
          </div>
          <div className="divide-y divide-border">
            <ActivityItem icon={Users}        text="Arjun Mehta accepted your connection request" time="2 hours ago"  iconColor="bg-blue-500"   />
            <ActivityItem icon={Star}         text="Your mentorship with Priya is confirmed for Dec 20" time="1 day ago"   iconColor="bg-gold-500"   />
            <ActivityItem icon={Briefcase}    text="New internship posted by Rohan at Google"     time="2 days ago"  iconColor="bg-green-500"  />
            <ActivityItem icon={Calendar}     text="Tech Summit 2024 event starts in 3 days"      time="3 days ago"  iconColor="bg-purple-500" />
            <ActivityItem icon={Bell}         text="Your profile was viewed by 5 alumni this week" time="5 days ago"  iconColor="bg-orange-500" />
          </div>
        </div>

        {/* Upcoming */}
        <div className="space-y-4">
          {/* Upcoming events */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-navy-900 dark:text-white">Upcoming</h2>
              <Link href="/dashboard/events" className="text-xs text-navy-500 hover:text-navy-700">See all</Link>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Tech Summit 2024',      date: 'Dec 22', type: 'Event',      color: 'bg-purple-100 text-purple-700' },
                { title: 'Mock Interview Session', date: 'Dec 25', type: 'Mentorship', color: 'bg-gold-100 text-gold-700'    },
                { title: 'Alumni Reunion',         date: 'Jan 5',  type: 'Event',      color: 'bg-blue-100 text-blue-700'   },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-navy-50 dark:bg-navy-700 flex flex-col items-center justify-center text-navy-900 dark:text-white flex-shrink-0">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{item.date.split(' ')[0]}</span>
                    <span className="text-base font-bold leading-tight">{item.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{item.title}</p>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', item.color)}>{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended mentors */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-navy-900 dark:text-white">AI Picks for You</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-100 text-gold-700">AI</span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Ananya Singh',  role: 'ML Researcher, DeepMind', color: 'bg-pink-500', score: 98 },
                { name: 'Rohan Patel',   role: 'PM, Microsoft',           color: 'bg-green-500', score: 94 },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0', m.color)}>
                    {m.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.role}</p>
                  </div>
                  <span className="text-xs font-mono text-gold-600 bg-gold-50 px-2 py-0.5 rounded-lg">{m.score}%</span>
                </div>
              ))}
              <Link href="/dashboard/mentorship" className="flex items-center justify-center gap-1 mt-2 py-2.5 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-navy-700 hover:border-navy-300 transition-colors">
                Browse all mentors <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
