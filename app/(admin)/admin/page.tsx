'use client';
// app/(admin)/admin/page.tsx – Admin Analytics Dashboard
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Briefcase, Calendar, Star, TrendingUp, CheckCircle,
  XCircle, Clock, AlertTriangle, Eye, Settings, Download,
  BarChart3, Activity, Globe, ArrowUp, ArrowDown,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { cn, getInitials, generateAvatarColor, getStatusColor, formatDate } from '@/lib/utils/helpers';

// Mock analytics data
const MONTHLY_SIGNUPS = [
  { month: 'Jul', students: 45, alumni: 28 },
  { month: 'Aug', students: 62, alumni: 34 },
  { month: 'Sep', students: 78, alumni: 41 },
  { month: 'Oct', students: 95, alumni: 55 },
  { month: 'Nov', students: 120, alumni: 68 },
  { month: 'Dec', students: 89, alumni: 47 },
];

const JOB_STATS = [
  { month: 'Jul', posted: 12, applied: 89 },
  { month: 'Aug', posted: 18, applied: 134 },
  { month: 'Sep', posted: 24, applied: 189 },
  { month: 'Oct', posted: 31, applied: 224 },
  { month: 'Nov', posted: 28, applied: 198 },
  { month: 'Dec', posted: 35, applied: 267 },
];

const ROLE_DIST = [
  { name: 'Students', value: 3200, color: '#3b5ff4' },
  { name: 'Alumni',   value: 1800, color: '#f59e0b' },
  { name: 'Admins',   value: 12,   color: '#1e2a85' },
];

const PENDING_USERS = [
  { id: 'u1', name: 'Ravi Kumar',    email: 'ravi@gec.edu', role: 'STUDENT', batch: 2024, dept: 'Computer Engineering',   createdAt: '2024-12-10' },
  { id: 'u2', name: 'Meera Patel',   email: 'meera@gmail.com', role: 'ALUMNI', batch: 2020, dept: 'Information Technology', createdAt: '2024-12-09' },
  { id: 'u3', name: 'Sanjay Shah',   email: 'sanjay@alumni.com', role: 'ALUMNI', batch: 2018, dept: 'Mechanical',          createdAt: '2024-12-08' },
  { id: 'u4', name: 'Pooja Verma',   email: 'pooja@student.gec', role: 'STUDENT', batch: 2025, dept: 'Electronics',        createdAt: '2024-12-07' },
];

function StatWidget({ icon: Icon, label, value, change, changeType = 'up', color }: {
  icon: React.ElementType; label: string; value: string; change?: string; changeType?: 'up' | 'down'; color: string;
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
    </motion.div>
  );
}

function PendingUserRow({ user, onApprove, onReject }: {
  user: typeof PENDING_USERS[0];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-border last:border-0 hover:bg-navy-50/50 dark:hover:bg-navy-700/30 transition-colors"
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold', generateAvatarColor(user.name))}>
            {getInitials(user.name)}
          </div>
          <div>
            <p className="text-sm font-medium text-navy-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <span className={cn(
          'text-xs px-2.5 py-1 rounded-full font-medium',
          user.role === 'ALUMNI' ? 'bg-gold-100 text-gold-700' : 'bg-blue-100 text-blue-700',
        )}>
          {user.role}
        </span>
      </td>
      <td className="py-3.5 px-4 text-sm text-muted-foreground hidden md:table-cell">
        {user.dept} · {user.batch}
      </td>
      <td className="py-3.5 px-4 text-xs text-muted-foreground hidden lg:table-cell">
        {formatDate(user.createdAt)}
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onApprove(user.id)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Approve
          </button>
          <button
            onClick={() => onReject(user.id)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState(PENDING_USERS);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'events'>('overview');

  function approve(id: string) {
    setPendingUsers(prev => prev.filter(u => u.id !== id));
    // In real app: fetch('/api/admin/users/approve', ...)
  }
  function reject(id: string) {
    setPendingUsers(prev => prev.filter(u => u.id !== id));
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage users, jobs, events, and platform analytics</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline text-sm py-2.5 px-4 rounded-xl flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="btn-primary text-sm py-2.5 px-4 rounded-xl flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>
      </div>

      {/* Alert: pending approvals */}
      {pendingUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            <strong>{pendingUsers.length} users</strong> are waiting for account approval
          </p>
          <button
            onClick={() => setActiveTab('users')}
            className="ml-auto text-xs font-medium text-yellow-700 dark:text-yellow-400 hover:underline"
          >
            Review now →
          </button>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-navy-800 border border-border rounded-2xl p-1 w-fit">
        {(['overview', 'users', 'jobs', 'events'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize',
              activeTab === tab
                ? 'bg-navy-700 text-white shadow-sm'
                : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users,     label: 'Total Users',       value: '5,012', change: '12%',  changeType: 'up'  as const, color: 'bg-blue-500'   },
              { icon: Clock,     label: 'Pending Approvals', value: `${pendingUsers.length}`,  changeType: 'up'  as const, color: 'bg-yellow-500' },
              { icon: Briefcase, label: 'Active Jobs',        value: '34',    change: '8%',   changeType: 'up'  as const, color: 'bg-green-500'  },
              { icon: Star,      label: 'Mentor Sessions',    value: '348',   change: '22%',  changeType: 'up'  as const, color: 'bg-gold-500'   },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <StatWidget {...s} />
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Signup trend */}
            <div className="lg:col-span-2 bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
              <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">New Registrations</h3>
              <p className="text-sm text-muted-foreground mb-6">Students vs Alumni signups per month</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={MONTHLY_SIGNUPS}>
                  <defs>
                    <linearGradient id="gStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b5ff4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b5ff4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gAlumni" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Area type="monotone" dataKey="students" name="Students" stroke="#3b5ff4" fill="url(#gStudents)" strokeWidth={2} />
                  <Area type="monotone" dataKey="alumni"   name="Alumni"   stroke="#f59e0b" fill="url(#gAlumni)"   strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Role distribution */}
            <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
              <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">User Distribution</h3>
              <p className="text-sm text-muted-foreground mb-4">By account type</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={ROLE_DIST} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {ROLE_DIST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => v.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {ROLE_DIST.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-muted-foreground flex-1">{d.name}</span>
                    <span className="font-medium text-navy-900 dark:text-white">{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job stats */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
            <h3 className="font-display font-semibold text-navy-900 dark:text-white mb-1">Job Board Activity</h3>
            <p className="text-sm text-muted-foreground mb-6">Jobs posted vs applications received</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={JOB_STATS}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="posted"  name="Jobs Posted"  fill="#3b5ff4" radius={[6,6,0,0]} />
                <Bar dataKey="applied" name="Applications" fill="#f59e0b" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Pending approvals */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-navy-900 dark:text-white">Pending Approvals</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{pendingUsers.length} users waiting for review</p>
              </div>
              {pendingUsers.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setPendingUsers([])}
                    className="text-xs px-4 py-2 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200"
                  >
                    Approve All
                  </button>
                </div>
              )}
            </div>

            {pendingUsers.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-navy-900 dark:text-white">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No pending approvals</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Department</th>
                      <th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Applied</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(user => (
                      <PendingUserRow key={user.id} user={user} onApprove={approve} onReject={reject} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Bulk Approve',     desc: 'Approve all verified college emails',          color: 'bg-green-500', icon: CheckCircle },
              { label: 'Export User List', desc: 'Download CSV of all registered users',          color: 'bg-blue-500',  icon: Download    },
              { label: 'Send Announcement',desc: 'Broadcast message to all approved users',       color: 'bg-gold-500',  icon: Activity    },
            ].map(action => (
              <button
                key={action.label}
                className="flex items-start gap-3 p-4 bg-white dark:bg-navy-800 rounded-2xl border border-border hover:shadow-md transition-shadow text-left"
              >
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0', action.color)}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-900 dark:text-white">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
          <h3 className="font-semibold text-navy-900 dark:text-white mb-4">Job Moderation</h3>
          <div className="space-y-3">
            {[
              { title: 'SDE-2 at Flipkart',         poster: 'Ananya Singh', status: 'pending',  date: '2024-12-10' },
              { title: 'Product Intern at Meesho',   poster: 'Raj Kumar',   status: 'approved', date: '2024-12-09' },
              { title: 'Data Analyst at Ola',        poster: 'Priya M.',    status: 'approved', date: '2024-12-08' },
              { title: 'ML Intern at Razorpay',      poster: 'Vikram S.',   status: 'rejected', date: '2024-12-07' },
            ].map((job, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 dark:text-white">{job.title}</p>
                  <p className="text-xs text-muted-foreground">Posted by {job.poster} · {formatDate(job.date)}</p>
                </div>
                <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium capitalize', getStatusColor(job.status.toUpperCase()))}>
                  {job.status}
                </span>
                {job.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200">Approve</button>
                    <button className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy-900 dark:text-white">Event Management</h3>
            <button className="btn-gold text-sm py-2 px-4 rounded-xl flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Create Event
            </button>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Tech Summit 2024',       date: 'Dec 22, 2024', rsvps: 145, status: 'UPCOMING'   },
              { title: 'Alumni Reunion Night',    date: 'Jan 5, 2025',  rsvps: 89,  status: 'UPCOMING'   },
              { title: 'Resume Workshop',         date: 'Dec 15, 2024', rsvps: 56,  status: 'COMPLETED'  },
              { title: 'Startup Pitch Night',     date: 'Nov 28, 2024', rsvps: 78,  status: 'COMPLETED'  },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 dark:text-white">{ev.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <Calendar className="w-3 h-3" /> {ev.date}
                    <Users className="w-3 h-3 ml-1" /> {ev.rsvps} RSVPs
                  </p>
                </div>
                <span className={cn(
                  'text-xs px-2.5 py-1 rounded-full font-medium',
                  ev.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700',
                )}>
                  {ev.status}
                </span>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1 rounded-lg bg-navy-100 text-navy-700 hover:bg-navy-200 dark:bg-navy-700 dark:text-navy-300">Edit</button>
                  <button className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
