// components/ui/Badge.tsx
import { cn } from '@/lib/utils/helpers';

type BadgeVariant = 'default' | 'primary' | 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'ghost';
type BadgeSize    = 'xs' | 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200',
  primary: 'bg-navy-600 text-white',
  gold:    'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400',
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  danger:  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  info:    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  ghost:   'bg-transparent border border-border text-muted-foreground',
};

const SIZES: Record<BadgeSize, string> = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-xs px-2.5 py-0.5',
  md: 'text-sm px-3 py-1',
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  default: 'bg-navy-400',
  primary: 'bg-white',
  gold:    'bg-gold-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  ghost:   'bg-muted-foreground',
};

export function Badge({ children, variant = 'default', size = 'sm', dot, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      VARIANTS[variant],
      SIZES[size],
      className,
    )}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', DOT_COLORS[variant])} />
      )}
      {children}
    </span>
  );
}

// Role badge with predefined styling
export function RoleBadge({ role }: { role: string }) {
  const variantMap: Record<string, BadgeVariant> = {
    ADMIN:   'danger',
    ALUMNI:  'gold',
    STUDENT: 'info',
  };
  return <Badge variant={variantMap[role] ?? 'default'}>{role}</Badge>;
}

// Status badge
export function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, BadgeVariant> = {
    APPROVED:  'success',
    PENDING:   'warning',
    REJECTED:  'danger',
    SUSPENDED: 'warning',
  };
  return <Badge variant={variantMap[status] ?? 'default'} dot>{status}</Badge>;
}
