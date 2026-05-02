// lib/utils/helpers.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatTime(date: Date | string): string {
  return format(new Date(date), 'h:mm a');
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}

export function timeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '…';
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function generateAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500', 'bg-violet-500', 'bg-green-500',
    'bg-orange-500', 'bg-pink-500', 'bg-teal-500',
    'bg-indigo-500', 'bg-yellow-500', 'bg-red-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function jobTypeBadge(type: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    FULL_TIME:   { label: 'Full Time',   color: 'bg-green-100 text-green-800' },
    PART_TIME:   { label: 'Part Time',   color: 'bg-blue-100 text-blue-800' },
    INTERNSHIP:  { label: 'Internship',  color: 'bg-purple-100 text-purple-800' },
    CONTRACT:    { label: 'Contract',    color: 'bg-orange-100 text-orange-800' },
    FREELANCE:   { label: 'Freelance',   color: 'bg-yellow-100 text-yellow-800' },
  };
  return map[type] ?? { label: type, color: 'bg-gray-100 text-gray-800' };
}

export function getRoleColor(role: string): string {
  const map: Record<string, string> = {
    STUDENT: 'bg-blue-100 text-blue-800 border-blue-200',
    ALUMNI:  'bg-gold-100 text-gold-800 border-gold-200',
    ADMIN:   'bg-navy-100 text-navy-800 border-navy-200',
  };
  return map[role] ?? 'bg-gray-100 text-gray-800';
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING:   'bg-yellow-100 text-yellow-800',
    APPROVED:  'bg-green-100 text-green-800',
    REJECTED:  'bg-red-100 text-red-800',
    SUSPENDED: 'bg-orange-100 text-orange-800',
  };
  return map[status] ?? 'bg-gray-100 text-gray-800';
}

export function generateOTPSecret(length = 6): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

// Score calculator for leaderboard
export function calculateLeaderboardScore(
  mentorSessions: number,
  jobPosts: number,
  eventAttendance: number,
): number {
  return mentorSessions * 15 + jobPosts * 10 + eventAttendance * 5;
}
