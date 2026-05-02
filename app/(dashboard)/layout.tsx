'use client';
// app/(dashboard)/layout.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Briefcase, Calendar, MessageSquare,
  Star, Bell, Settings, LogOut, ChevronRight, Menu, X,
  GraduationCap, Map, Trophy, BookOpen, Shield,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn, getInitials } from '@/lib/utils/helpers';

const NAV = [
  { href: '/dashboard',              icon: LayoutDashboard, label: 'Overview'      },
  { href: '/dashboard/profile',      icon: Users,           label: 'Profile'       },
  { href: '/dashboard/messages',     icon: MessageSquare,   label: 'Messages'      },
  { href: '/dashboard/jobs',         icon: Briefcase,       label: 'Jobs'          },
  { href: '/dashboard/events',       icon: Calendar,        label: 'Events'        },
  { href: '/dashboard/mentorship',   icon: Star,            label: 'Mentorship'    },
  { href: '/dashboard/alumni-map',   icon: Map,             label: 'Alumni Map'    },
  { href: '/dashboard/leaderboard',  icon: Trophy,          label: 'Leaderboard'   },
  { href: '/dashboard/notifications', icon: Bell,           label: 'Notifications' },
  { href: '/dashboard/settings',     icon: Settings,        label: 'Settings'      },
];

const ADMIN_NAV = [
  { href: '/admin',              icon: Shield,        label: 'Admin Panel'   },
  { href: '/admin/users',        icon: Users,         label: 'Users'         },
  { href: '/admin/jobs',         icon: Briefcase,     label: 'Job Moderation' },
  { href: '/admin/events',       icon: Calendar,      label: 'Events'        },
  { href: '/admin/analytics',    icon: LayoutDashboard, label: 'Analytics'   },
  { href: '/admin/courses',      icon: BookOpen,      label: 'Courses'       },
];

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
        active
          ? 'bg-navy-100 dark:bg-navy-700 text-navy-900 dark:text-white'
          : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white hover:bg-navy-50 dark:hover:bg-navy-800/50',
      )}
    >
      <Icon className={cn('w-4.5 h-4.5', active ? 'text-navy-700 dark:text-gold-400' : '')} />
      {label}
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = session?.user as any;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-2 border-navy-200 border-t-navy-600 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const isAdmin = user?.role === 'ADMIN';

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-gold-400" />
        </div>
        <span className="font-display font-bold text-lg text-navy-900 dark:text-white">
          Alumni<span className="text-gold-500">Portal</span>
        </span>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-navy-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0">
            {user?.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : getInitials(user?.name ?? 'U')}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy-900 dark:text-white truncate">{user?.name}</p>
            <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', isAdmin ? 'bg-red-100 text-red-700' : user?.role === 'ALUMNI' ? 'bg-gold-100 text-gold-700' : 'bg-blue-100 text-blue-700')}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar space-y-1">
        {isAdmin && (
          <>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-2 mt-1">Admin</p>
            {ADMIN_NAV.map(item => (
              <NavItem key={item.href} {...item} active={pathname === item.href} />
            ))}
            <div className="my-3 border-t border-border" />
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-2">My Account</p>
          </>
        )}
        {NAV.slice(0, isAdmin ? undefined : undefined).map(item => (
          <NavItem key={item.href} {...item} active={pathname === item.href || pathname.startsWith(item.href + '/')} />
        ))}
      </div>

      {/* Sign out */}
      <div className="px-3 pb-4 border-t border-border pt-4">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white dark:bg-navy-950 border-r border-border flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-white dark:bg-navy-950 border-r border-border z-50 lg:hidden"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-white dark:bg-navy-950">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-bold text-navy-900 dark:text-white">
            Alumni<span className="text-gold-500">Portal</span>
          </span>
          <Link href="/dashboard/notifications" className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-cream-50 dark:bg-navy-900 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
