'use client';
// app/(admin)/admin/analytics/page.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, RadarChart,
  Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import {
  TrendingUp, Users, Briefcase, Star, Calendar,
  Download, RefreshCw, ArrowUp, ArrowDown, Activity,
} from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils/helpers';

const MONTHLY = [
  { month: 'Jan', users: 180, alumni: 60, students: 120, jobs: 8,  mentorships: 12, events: 2 },
  { month: 'Feb', users: 220, alumni: 75, students: 145, jobs: 12, mentorships: 18, events: 3 },
  { month: 'Mar', users: 310, alumni: 95, students: 215, jobs: 15, mentorships: 24, events: 4 },
  { month: 'Apr', users: 280, alumni: 80, students: 200, jobs: 18, mentorships: 22, events: 3 },
  { month: 'May', users: 390, alumni: 110, students: 280, jobs: 24, mentorships: 35, events: 5 },
  { month: 'Jun', users: 450, alumni: 130, students: 320, jobs: 28, mentorships: 40, events: 6 },
  { month: 'Jul', users: 420, alumni: 125, students: 295, jobs: 22, mentorships: 38, events: 4 },
  { month: 'Aug', users: 510, alumni: 145, students: 365, jobs: 30, mentorships: 48, events: 7 },
  { month: 'Sep', users: 580, alumni: 160, students: 420, jobs: 35, mentorships: 55, events: 8 },
  { month: 'Oct', users: 620, alumni: 175, students: 445, jobs: 42, mentorships: 62, events: 9 },
  { month: 'Nov', users: 700, alumni: 195, students: 505, jobs: 48, mentorships: 70, events: 10 },
  { month: 'Dec', users: 650, alumni: 180, students: 470, jobs: 38, mentorships: 58, events: 8 },
];

const DEPT_DIST = [
  { dept: 'CE',   alumni: 1820, students: 1100 },
  { dept: 'IT',   alumni: 1240, students: 780  },
  { dept: 'EC',   alumni: 780,  students: 520  },
  { dept: 'ME',   alumni: 620,  students: 380  },
  { dept: 'Civil', alumni: 420, students: 280  },
  { dept: 'EE',   alumni: 320,  students: 210  },
];

const ENGAGEMENT = [
  { name: 'Profile Completion', value: 72 },
  { name: 'Job Applications',   value: 85 },
  { name: 'Event RSVPs',        value: 60 },
  { name: 'Mentor Sessions',    value: 45 },
  { name: 'Connections Made',   value: 68 },
  { name: 'Messages Sent',      value: 55 },
];

const TOP_COMPANIES = [
  { name: 'Google',    count: 187, color: '#4285F4' },
  { name: 'Microsoft', count: 152, color: '#00A4EF' },
  { name: 'Amazon',    count: 143, color: '#FF9900' },
  { name: 'Infosys',   count: 128, color: '#007CC3' },
  { name: 'TCS',       count: 115, color: '#0055A0' },
  { name: 'Flipkart',  count: 98,  color: '#F7A600' },
  { name: 'Zomato',    count: 76,  color: '#E23744' },
  { name: 'Other',     count: 3601, color: '#94A3B8' },
];

const PLACEMENT_TREND = [
  { year: '2019', placement: 88, avgPackage: 6.2 },
  { year: '2020', placement: 91, avgPackage: 7.1 },
  { year: '2021', placement: 89, avgPackage: 8.4 },
  { year: '2022', placement: 93, avgPackage: 10.2 },
  { year: '2023', placement: 95, avgPackage: 12.8 },
  { year: '2024', placement: 96, avgPackage: 15.5 },
];

function MetricCard({ icon: Icon, label, value, change, changeType = 'up', color, sub }: {
  icon: React.ElementType; label: string; value: string; change?: string;
  changeType?: 'up' | 'down'; color: string; sub?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change && (
          <div className={cn(
            'flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full',
            changeType === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
          )}>
            {changeType === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-navy-900 dark:text-white">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </motion.div>
  );
}

const CHART_COLORS = {
  navy: '#1e2a85',
  gold: '#f59e0b',
  blue: '#3b5ff4',
  green: '#10b981',
  purple: '#8b5cf6',
  orange: '#f97316',
};

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<'3m' | '6m' | '12m'>('12m');

  const sliceMap = { '3m': 9, '6m': 6, '12m': 0 };
  const data = sliceMap[period] ? MONTHLY.slice(sliceMap[period]) : MONTHLY;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Platform health and engagement metrics</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-white dark:bg-navy-800 border border-border rounded-xl p-1">
            {(['3m', '6m', '12m'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  period === p ? 'bg-navy-700 text-white' : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white',
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="btn-outline text-sm py-2 px-4 rounded-xl flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="p-2 rounded-xl border border-border hover:bg-navy-50 dark:hover:bg-navy-700 text-muted-foreground transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users,    label: 'Total Users',       value: '5,012', change: '18%', color: 'bg-navy-600',   sub: '3,200 students · 1,800 alumni' },
          { icon: Briefcase, label: 'Jobs Posted',       value: '148',  change: '24%', color: 'bg-green-500',  sub: '89% approved, 11% pending' },
          { icon: Star,      label: 'Mentor Sessions',   value: '348',  change: '31%', color: 'bg-gold-500',   sub: 'Avg rating: 4.8 / 5.0' },
          { icon: Activity,  label: 'Daily Active Users', value: '892', change: '12%', color: 'bg-violet-500', sub: '~17.8% of total users' },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <MetricCard {...m} />
          </motion.div>
        ))}
      </div>

      {/* User growth chart */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-semibold text-navy-900 dark:text-white">User Growth</h3>
            <p className="text-xs text-muted-foreground mt-0.5">New registrations by role per month</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              {['users', 'alumni', 'students'].map((key, i) => (
                <linearGradient key={key} id={`g_${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={Object.values(CHART_COLORS)[i]} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={Object.values(CHART_COLORS)[i]} stopOpacity={0}   />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,92%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 12 }} />
            <Legend />
            <Area type="monotone" dataKey="students" name="Students" stroke={CHART_COLORS.blue}  fill={`url(#g_students)`} strokeWidth={2} />
            <Area type="monotone" dataKey="alumni"   name="Alumni"   stroke={CHART_COLORS.gold}  fill={`url(#g_alumni)`}   strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Row of 2 charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Jobs & Mentorships */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">Platform Activity</h3>
          <p className="text-xs text-muted-foreground mb-5">Jobs posted and mentor sessions per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,92%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Legend />
              <Bar dataKey="jobs"        name="Jobs"        fill={CHART_COLORS.green}  radius={[4,4,0,0]} />
              <Bar dataKey="mentorships" name="Mentorships" fill={CHART_COLORS.gold}   radius={[4,4,0,0]} />
              <Bar dataKey="events"      name="Events"      fill={CHART_COLORS.purple} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Placement trend */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">Placement Trend</h3>
          <p className="text-xs text-muted-foreground mb-5">Placement % and average package (LPA) by year</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={PLACEMENT_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,92%)" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left"  tick={{ fontSize: 11 }} domain={[80, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Legend />
              <Line yAxisId="left"  type="monotone" dataKey="placement"   name="Placement %" stroke={CHART_COLORS.blue}  strokeWidth={2.5} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="avgPackage"  name="Avg Package (LPA)" stroke={CHART_COLORS.gold} strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row of 2 more charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Department distribution */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">Department Distribution</h3>
          <p className="text-xs text-muted-foreground mb-5">Alumni vs Students by department</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DEPT_DIST} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,92%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 11 }} width={35} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Legend />
              <Bar dataKey="alumni"   name="Alumni"   fill={CHART_COLORS.gold}  radius={[0,4,4,0]} />
              <Bar dataKey="students" name="Students" fill={CHART_COLORS.blue}  radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement radar */}
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
          <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">Engagement Radar</h3>
          <p className="text-xs text-muted-foreground mb-3">Feature usage rates across platform</p>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={ENGAGEMENT}>
              <PolarGrid stroke="hsl(220,13%,88%)" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
              <Radar name="Usage %" dataKey="value" stroke={CHART_COLORS.navy} fill={CHART_COLORS.navy} fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} formatter={(v: number) => `${v}%`} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top companies */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
        <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">Alumni at Top Companies</h3>
        <p className="text-xs text-muted-foreground mb-5">Where our alumni are working</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOP_COMPANIES.slice(0, 7).map(({ name, count, color }) => (
            <div key={name} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{name}</p>
                  <span className="text-xs text-muted-foreground ml-2">{count}</span>
                </div>
                <div className="h-1.5 bg-navy-100 dark:bg-navy-700 rounded-full mt-1">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${(count / TOP_COMPANIES[0].count) * 100}%`, background: color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
