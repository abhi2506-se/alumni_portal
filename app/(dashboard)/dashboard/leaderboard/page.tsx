'use client';
// app/(dashboard)/dashboard/leaderboard/page.tsx
import { motion } from 'framer-motion';
import { Trophy, Star, Briefcase, Calendar, Users, Crown, Medal, Award } from 'lucide-react';
import { cn, getInitials, generateAvatarColor } from '@/lib/utils/helpers';

const LEADERBOARD = [
  { rank: 1, name: 'Arjun Mehta',    company: 'Google',    batch: 2019, mentorScore: 180, jobScore: 80, eventScore: 45, totalScore: 305, dept: 'CE' },
  { rank: 2, name: 'Priya Sharma',   company: 'EduStart',  batch: 2017, mentorScore: 150, jobScore: 40, eventScore: 60, totalScore: 250, dept: 'IT' },
  { rank: 3, name: 'Rohan Patel',    company: 'Microsoft', batch: 2020, mentorScore: 90,  jobScore: 60, eventScore: 30, totalScore: 180, dept: 'CE' },
  { rank: 4, name: 'Ananya Singh',   company: 'DeepMind',  batch: 2018, mentorScore: 120, jobScore: 20, eventScore: 25, totalScore: 165, dept: 'EC' },
  { rank: 5, name: 'Vikram Shah',    company: 'Zomato',    batch: 2019, mentorScore: 60,  jobScore: 50, eventScore: 40, totalScore: 150, dept: 'IT' },
  { rank: 6, name: 'Kavya Reddy',    company: 'Razorpay',  batch: 2021, mentorScore: 45,  jobScore: 60, eventScore: 25, totalScore: 130, dept: 'CE' },
  { rank: 7, name: 'Raju Kumar',     company: 'Flipkart',  batch: 2020, mentorScore: 75,  jobScore: 20, eventScore: 20, totalScore: 115, dept: 'ME' },
  { rank: 8, name: 'Sneha Joshi',    company: 'PhonePe',   batch: 2022, mentorScore: 30,  jobScore: 40, eventScore: 35, totalScore: 105, dept: 'EC' },
  { rank: 9, name: 'Harsh Patel',    company: 'CRED',      batch: 2021, mentorScore: 45,  jobScore: 30, eventScore: 15, totalScore: 90,  dept: 'IT' },
  { rank: 10, name: 'Divya Trivedi', company: 'Paytm',     batch: 2022, mentorScore: 30,  jobScore: 20, eventScore: 25, totalScore: 75,  dept: 'CE' },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center shadow-lg shadow-gold-400/30">
      <Crown className="w-5 h-5 text-navy-950" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-md">
      <Medal className="w-5 h-5 text-white" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center shadow-md">
      <Award className="w-5 h-5 text-white" />
    </div>
  );
  return (
    <div className="w-10 h-10 rounded-full bg-navy-100 dark:bg-navy-700 flex items-center justify-center">
      <span className="text-sm font-bold text-navy-600 dark:text-navy-300">#{rank}</span>
    </div>
  );
}

function ScoreBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-navy-100 dark:bg-navy-700">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-1.5 rounded-full', color)}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-8 text-right">{value}</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const topThree = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);
  const maxScore = LEADERBOARD[0].totalScore;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Leaderboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Top alumni contributors this semester</p>
      </div>

      {/* Score legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        {[
          { icon: Star,     label: 'Mentor Score',  color: 'text-gold-500',   per: '15 pts/session' },
          { icon: Briefcase, label: 'Job Score',    color: 'text-green-500',  per: '10 pts/post' },
          { icon: Calendar, label: 'Event Score',   color: 'text-blue-500',   per: '5 pts/RSVP' },
        ].map(({ icon: Icon, label, color, per }) => (
          <div key={label} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-navy-800 rounded-xl border border-border text-xs">
            <Icon className={cn('w-3.5 h-3.5', color)} />
            <span className="font-medium text-navy-700 dark:text-navy-200">{label}</span>
            <span className="text-muted-foreground">· {per}</span>
          </div>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 items-end max-w-2xl mx-auto">
        {[topThree[1], topThree[0], topThree[2]].map((entry, i) => {
          const heights = ['h-28', 'h-36', 'h-24'];
          const isFirst = entry.rank === 1;
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Avatar */}
              <div className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl',
                generateAvatarColor(entry.name),
                isFirst && 'ring-4 ring-gold-400 ring-offset-2',
              )}>
                {getInitials(entry.name)}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-navy-900 dark:text-white">{entry.name.split(' ')[0]}</p>
                <p className="text-[10px] text-muted-foreground">{entry.totalScore} pts</p>
              </div>
              {/* Podium block */}
              <div className={cn(
                'w-full rounded-t-2xl flex items-center justify-center',
                heights[i],
                entry.rank === 1 ? 'bg-gradient-to-t from-gold-500 to-gold-300' :
                entry.rank === 2 ? 'bg-gradient-to-t from-gray-400 to-gray-300' :
                'bg-gradient-to-t from-orange-500 to-orange-400',
              )}>
                <span className="text-white font-display font-bold text-2xl">#{entry.rank}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-navy-900 dark:text-white">Full Rankings</h2>
        </div>
        <div className="divide-y divide-border">
          {LEADERBOARD.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                'flex items-center gap-4 px-6 py-4 hover:bg-navy-50/50 dark:hover:bg-navy-700/30 transition-colors',
                entry.rank <= 3 && 'bg-gradient-to-r from-gold-50/30 to-transparent dark:from-gold-900/10',
              )}
            >
              <RankBadge rank={entry.rank} />

              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0',
                generateAvatarColor(entry.name),
              )}>
                {getInitials(entry.name)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy-900 dark:text-white text-sm">{entry.name}</p>
                <p className="text-xs text-muted-foreground">{entry.company} · Batch {entry.batch} · {entry.dept}</p>
                <div className="mt-2 space-y-1 hidden sm:block">
                  <ScoreBar value={entry.mentorScore} max={maxScore} color="bg-gold-400" />
                  <ScoreBar value={entry.jobScore}    max={maxScore} color="bg-green-400" />
                  <ScoreBar value={entry.eventScore}  max={maxScore} color="bg-blue-400"  />
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-display font-bold text-lg text-navy-900 dark:text-white">
                  {entry.totalScore}
                </p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How to earn points */}
      <div className="bg-gradient-to-br from-navy-50 to-gold-50 dark:from-navy-800 dark:to-navy-700 rounded-2xl border border-border p-6">
        <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold-500" /> How to Earn Points
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Star,      title: 'Be a Mentor',     desc: 'Accept mentorship bookings and complete sessions', pts: '+15 pts/session', color: 'bg-gold-100 text-gold-600' },
            { icon: Briefcase, title: 'Post Jobs',       desc: 'Share job and internship opportunities with students', pts: '+10 pts/post', color: 'bg-green-100 text-green-600' },
            { icon: Users,     title: 'Attend Events',   desc: 'RSVP and attend alumni portal events', pts: '+5 pts/event', color: 'bg-blue-100 text-blue-600' },
          ].map(({ icon: Icon, title, desc, pts, color }) => (
            <div key={title} className="flex items-start gap-3">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', color)}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy-900 dark:text-white">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                <p className="text-xs font-semibold text-gold-600 mt-1">{pts}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
