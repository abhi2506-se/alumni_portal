'use client';
// app/(dashboard)/dashboard/notifications/page.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, MessageSquare, Star, UserPlus, Briefcase, Calendar,
  CheckCircle, Info, Check, Trash2, Settings,
} from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils/helpers';

const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'CONNECTION_REQUEST', title: 'New Connection Request', message: 'Arjun Mehta wants to connect with you', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString(), data: {} },
  { id: 'n2', type: 'MENTOR_REQUEST',     title: 'Mentorship Session Confirmed', message: 'Your session with Priya Sharma is confirmed for Dec 25, 10:00 AM', isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString(), data: {} },
  { id: 'n3', type: 'MESSAGE',            title: 'New Message',  message: 'Rohan Patel: "Check out this job opening!"', isRead: false, createdAt: new Date(Date.now() - 10800000).toISOString(), data: {} },
  { id: 'n4', type: 'JOB_POSTED',         title: 'New Job Match', message: 'A new Software Engineer role at Google matches your skills', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString(), data: {} },
  { id: 'n5', type: 'EVENT_CREATED',      title: 'Upcoming Event', message: 'Tech Summit 2024 starts in 3 days – don\'t forget to RSVP!', isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString(), data: {} },
  { id: 'n6', type: 'APPROVAL',           title: 'Account Approved', message: 'Your account has been verified by admin. Welcome to the portal!', isRead: true, createdAt: new Date(Date.now() - 604800000).toISOString(), data: {} },
  { id: 'n7', type: 'CONNECTION_REQUEST', title: 'Connection Accepted', message: 'Kavya Reddy accepted your connection request', isRead: true, createdAt: new Date(Date.now() - 864000000).toISOString(), data: {} },
];

const TYPE_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  CONNECTION_REQUEST: { icon: UserPlus,     color: 'text-blue-600',   bg: 'bg-blue-100 dark:bg-blue-900/30'   },
  MENTOR_REQUEST:     { icon: Star,         color: 'text-gold-600',   bg: 'bg-gold-100 dark:bg-gold-900/30'   },
  MESSAGE:            { icon: MessageSquare, color: 'text-violet-600', bg: 'bg-violet-100 dark:bg-violet-900/30' },
  JOB_POSTED:         { icon: Briefcase,    color: 'text-green-600',  bg: 'bg-green-100 dark:bg-green-900/30' },
  EVENT_CREATED:      { icon: Calendar,     color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  APPROVAL:           { icon: CheckCircle,  color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  SYSTEM:             { icon: Info,         color: 'text-gray-600',   bg: 'bg-gray-100 dark:bg-gray-800'      },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifs.filter(n => !n.isRead).length;

  const displayed = filter === 'unread' ? notifs.filter(n => !n.isRead) : notifs;

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  }

  function remove(id: string) {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6" /> Notifications
            {unreadCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Stay up to date with your activity</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="btn-outline text-sm py-2 px-4 rounded-xl flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white dark:bg-navy-800 border border-border rounded-2xl p-1 w-fit">
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize',
              filter === f ? 'bg-navy-700 text-white' : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white',
            )}
          >
            {f} {f === 'unread' && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden">
        <AnimatePresence>
          {displayed.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-navy-900 dark:text-white">All caught up!</p>
              <p className="text-sm text-muted-foreground mt-1">No {filter === 'unread' ? 'unread ' : ''}notifications</p>
            </div>
          ) : (
            displayed.map((notif, i) => {
              const meta = TYPE_META[notif.type] ?? TYPE_META.SYSTEM;
              const Icon = meta.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    'flex items-start gap-4 px-5 py-4 border-b border-border last:border-0 group hover:bg-navy-50/50 dark:hover:bg-navy-700/30 transition-colors',
                    !notif.isRead && 'bg-blue-50/30 dark:bg-blue-900/10',
                  )}
                >
                  {/* Icon */}
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', meta.bg)}>
                    <Icon className={cn('w-5 h-5', meta.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm font-medium', !notif.isRead ? 'text-navy-900 dark:text-white' : 'text-navy-700 dark:text-navy-200')}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1.5">{timeAgo(notif.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!notif.isRead && (
                      <button
                        onClick={() => markRead(notif.id)}
                        className="p-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-600 text-muted-foreground hover:text-blue-600 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => remove(notif.id)}
                      className="p-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-600 text-muted-foreground hover:text-red-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
