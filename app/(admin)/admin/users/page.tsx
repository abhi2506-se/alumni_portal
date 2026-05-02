'use client';
// app/(admin)/admin/users/page.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, CheckCircle, XCircle, AlertTriangle,
  Eye, Download, UserPlus, ChevronDown, X, MoreVertical,
  Shield, Clock, Check,
} from 'lucide-react';
import { cn, getInitials, generateAvatarColor, getStatusColor, getRoleColor, formatDate } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

const ALL_USERS = [
  { id: 'u1', name: 'Arjun Mehta',   email: 'arjun@alumni.com',  role: 'ALUMNI',   status: 'APPROVED',  batch: 2019, dept: 'CE', createdAt: '2024-01-15', company: 'Google'    },
  { id: 'u2', name: 'Priya Sharma',  email: 'priya@gmail.com',   role: 'ALUMNI',   status: 'APPROVED',  batch: 2017, dept: 'IT', createdAt: '2024-02-20', company: 'EduStart' },
  { id: 'u3', name: 'Ravi Kumar',    email: 'ravi@gec.edu',      role: 'STUDENT',  status: 'PENDING',   batch: 2024, dept: 'CE', createdAt: '2024-12-10', company: '-'        },
  { id: 'u4', name: 'Meera Patel',   email: 'meera@alumni.com',  role: 'ALUMNI',   status: 'PENDING',   batch: 2020, dept: 'IT', createdAt: '2024-12-09', company: 'Infosys'  },
  { id: 'u5', name: 'Sanjay Shah',   email: 'sanjay@gmail.com',  role: 'ALUMNI',   status: 'REJECTED',  batch: 2018, dept: 'ME', createdAt: '2024-12-08', company: '-'        },
  { id: 'u6', name: 'Pooja Verma',   email: 'pooja@student.gec', role: 'STUDENT',  status: 'PENDING',   batch: 2025, dept: 'EC', createdAt: '2024-12-07', company: '-'        },
  { id: 'u7', name: 'Rohan Patel',   email: 'rohan@microsoft.com', role: 'ALUMNI', status: 'APPROVED',  batch: 2020, dept: 'CE', createdAt: '2024-03-01', company: 'Microsoft' },
  { id: 'u8', name: 'Ananya Singh',  email: 'ananya@deepmind.com', role: 'ALUMNI', status: 'APPROVED',  batch: 2018, dept: 'EC', createdAt: '2024-01-05', company: 'DeepMind' },
  { id: 'u9', name: 'Harsh Patel',   email: 'harsh@cred.com',    role: 'ALUMNI',   status: 'SUSPENDED', batch: 2021, dept: 'IT', createdAt: '2024-06-15', company: 'CRED'     },
];

type Status = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
type Role   = 'ALL' | 'STUDENT' | 'ALUMNI' | 'ADMIN';

function ActionMenu({ user, onApprove, onReject, onSuspend, onView }: {
  user: typeof ALL_USERS[0];
  onApprove: () => void;
  onReject: () => void;
  onSuspend: () => void;
  onView: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(p => !p)} className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700 text-muted-foreground">
        <MoreVertical className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              className="absolute right-0 mt-1 w-44 bg-white dark:bg-navy-800 border border-border rounded-xl shadow-xl z-20 p-1.5"
            >
              <button onClick={() => { onView(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-navy-50 dark:hover:bg-navy-700 text-navy-700 dark:text-navy-200 transition-colors">
                <Eye className="w-3.5 h-3.5" /> View Profile
              </button>
              {user.status !== 'APPROVED' && (
                <button onClick={() => { onApprove(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-700 transition-colors">
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
              )}
              {user.status !== 'REJECTED' && (
                <button onClick={() => { onReject(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              )}
              {user.status === 'APPROVED' && (
                <button onClick={() => { onSuspend(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 transition-colors">
                  <AlertTriangle className="w-3.5 h-3.5" /> Suspend
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(ALL_USERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status>('ALL');
  const [roleFilter, setRoleFilter] = useState<Role>('ALL');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.company.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchRole   = roleFilter === 'ALL'   || u.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  const pendingCount = users.filter(u => u.status === 'PENDING').length;

  function updateStatus(id: string, status: string) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: status as any } : u));
    const label = status === 'APPROVED' ? '✅ Approved' : status === 'REJECTED' ? '❌ Rejected' : '⚠️ Suspended';
    toast.success(label);
  }

  function bulkApprove() {
    setUsers(prev => prev.map(u => selected.includes(u.id) && u.status === 'PENDING' ? { ...u, status: 'APPROVED' as any } : u));
    toast.success(`Approved ${selected.length} users`);
    setSelected([]);
  }

  function toggleSelect(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">User Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Approve, reject, and manage portal members</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline text-sm py-2.5 px-4 rounded-xl flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="btn-primary text-sm py-2.5 px-4 rounded-xl flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Invite User
          </button>
        </div>
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl">
          <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800 dark:text-yellow-300 flex-1">
            <strong>{pendingCount} users</strong> are waiting for approval
          </p>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className="text-xs text-yellow-700 dark:text-yellow-400 font-medium hover:underline"
          >
            Review →
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',  value: users.length,                              color: 'bg-navy-600'  },
          { label: 'Pending',      value: users.filter(u => u.status === 'PENDING').length,   color: 'bg-yellow-500' },
          { label: 'Approved',     value: users.filter(u => u.status === 'APPROVED').length,  color: 'bg-green-500'  },
          { label: 'Suspended',    value: users.filter(u => u.status === 'SUSPENDED').length, color: 'bg-red-500'    },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-navy-900 dark:text-white">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users by name, email, company…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm focus:outline-none focus:ring-2 focus:ring-navy-300 text-navy-900 dark:text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as Status)}
          className="px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none"
        >
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map(s => (
            <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value as Role)}
          className="px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none"
        >
          {['ALL', 'STUDENT', 'ALUMNI', 'ADMIN'].map(r => (
            <option key={r} value={r}>{r === 'ALL' ? 'All Roles' : r}</option>
          ))}
        </select>
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-4 py-3 bg-navy-700 rounded-2xl"
          >
            <span className="text-white text-sm font-medium">{selected.length} selected</span>
            <button onClick={bulkApprove} className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-xl bg-green-500 text-white text-xs font-medium hover:bg-green-400">
              <CheckCircle className="w-3.5 h-3.5" /> Approve All
            </button>
            <button onClick={() => setSelected([])} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3.5 px-4 text-left w-8">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.filter(u => u.status === 'PENDING').length && selected.length > 0}
                    onChange={e => {
                      if (e.target.checked) setSelected(filtered.filter(u => u.status === 'PENDING').map(u => u.id));
                      else setSelected([]);
                    }}
                    className="w-4 h-4 rounded"
                  />
                </th>
                {['User', 'Role', 'Status', 'Batch / Dept', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="py-3.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border last:border-0 hover:bg-navy-50/50 dark:hover:bg-navy-700/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      {user.status === 'PENDING' && (
                        <input
                          type="checkbox"
                          checked={selected.includes(user.id)}
                          onChange={() => toggleSelect(user.id)}
                          className="w-4 h-4 rounded"
                        />
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0', generateAvatarColor(user.name))}>
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-navy-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', getRoleColor(user.role))}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', getStatusColor(user.status))}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-sm text-muted-foreground">
                      {user.batch} · {user.dept}
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {user.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateStatus(user.id, 'APPROVED')}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => updateStatus(user.id, 'REJECTED')}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition-colors"
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <ActionMenu
                          user={user}
                          onApprove={() => updateStatus(user.id, 'APPROVED')}
                          onReject={() => updateStatus(user.id, 'REJECTED')}
                          onSuspend={() => updateStatus(user.id, 'SUSPENDED')}
                          onView={() => toast(`Viewing ${user.name}'s profile`)}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No users match your filters</p>
          </div>
        )}

        {/* Pagination hint */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {users.length} users</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
