'use client';
// components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Bell, LogOut, User, Settings, LayoutDashboard,
  ChevronDown, Moon, Sun, GraduationCap,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn, getInitials } from '@/lib/utils/helpers';

const PUBLIC_NAV = [
  { label: 'Home',     href: '/' },
  { label: 'Alumni',   href: '/alumni' },
  { label: 'Events',   href: '/events' },
  { label: 'About',    href: '/about' },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const user = session?.user as any;
  const isOnDark = pathname === '/' || pathname.startsWith('/alumni-map');

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 dark:bg-navy-950/90 backdrop-blur-xl border-b border-border shadow-sm'
          : isOnDark ? 'bg-transparent' : 'bg-white dark:bg-navy-950',
      )}
    >
      <nav className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <GraduationCap className="w-5 h-5 text-gold-400" />
          </div>
          <span className={cn(
            'font-display font-bold text-xl hidden sm:block transition-colors',
            (!scrolled && isOnDark) ? 'text-white' : 'text-navy-900 dark:text-white',
          )}>
            Alumni<span className="text-gold-500">Portal</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {PUBLIC_NAV.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  pathname === href
                    ? 'bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white'
                    : (!scrolled && isOnDark)
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white hover:bg-navy-50 dark:hover:bg-navy-800',
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              (!scrolled && isOnDark)
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white hover:bg-navy-50 dark:hover:bg-navy-800',
            )}
          >
            <Sun className="w-4 h-4 hidden dark:block" />
            <Moon className="w-4 h-4 dark:hidden" />
          </button>

          {session ? (
            <>
              {/* Notifications */}
              <Link
                href="/dashboard/notifications"
                className={cn(
                  'relative p-2 rounded-lg transition-colors',
                  (!scrolled && isOnDark)
                    ? 'text-white/70 hover:bg-white/10'
                    : 'text-muted-foreground hover:bg-navy-50 dark:hover:bg-navy-800',
                )}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </Link>

              {/* Avatar menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(p => !p)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-navy-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user?.image ? (
                      <img src={user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(user?.name ?? 'User')
                    )}
                  </div>
                  <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white dark:bg-navy-900 border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-medium text-sm text-navy-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-muted-foreground" /> Dashboard
                        </Link>
                        <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors">
                          <User className="w-4 h-4 text-muted-foreground" /> Profile
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-navy-50 dark:hover:bg-navy-800 transition-colors">
                          <Settings className="w-4 h-4 text-muted-foreground" /> Settings
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                (!scrolled && isOnDark) ? 'text-white/80 hover:text-white' : 'text-navy-700 dark:text-navy-200 hover:text-navy-900',
              )}>
                Login
              </Link>
              <Link href="/register" className="btn-gold text-sm px-5 py-2.5 rounded-xl">
                Join Now
              </Link>
            </div>
          )}

          {/* Mobile menu btn */}
          <button
            className={cn('md:hidden p-2 rounded-lg', (!scrolled && isOnDark) ? 'text-white' : 'text-navy-900 dark:text-white')}
            onClick={() => setOpen(p => !p)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-navy-950 border-t border-border"
          >
            <div className="container py-4 flex flex-col gap-1">
              {PUBLIC_NAV.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium',
                    pathname === href ? 'bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </Link>
              ))}
              <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                <Link href="/login" className="flex-1 btn-outline text-center text-sm py-2.5 rounded-xl">Login</Link>
                <Link href="/register" className="flex-1 btn-gold text-center text-sm py-2.5 rounded-xl">Join Now</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
