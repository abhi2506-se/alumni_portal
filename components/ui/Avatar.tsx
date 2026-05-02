// components/ui/Avatar.tsx
import { cn, getInitials, generateAvatarColor } from '@/lib/utils/helpers';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  className?: string;
  online?: boolean;
}

const SIZES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const SHAPES = {
  circle:  'rounded-full',
  rounded: 'rounded-xl',
};

const DOT_SIZES = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};

export function Avatar({ name, src, size = 'md', shape = 'rounded', className, online }: AvatarProps) {
  return (
    <div className="relative inline-flex flex-shrink-0">
      <div
        className={cn(
          SIZES[size],
          SHAPES[shape],
          'flex items-center justify-center font-bold text-white overflow-hidden flex-shrink-0',
          generateAvatarColor(name),
          className,
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          getInitials(name)
        )}
      </div>
      {online !== undefined && (
        <div className={cn(
          'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-navy-800',
          DOT_SIZES[size],
          online ? 'bg-green-500' : 'bg-gray-400',
        )} />
      )}
    </div>
  );
}

// Avatar group (stacked)
interface AvatarGroupProps {
  users: { name: string; src?: string | null }[];
  max?: number;
  size?: 'xs' | 'sm' | 'md';
}

export function AvatarGroup({ users, max = 4, size = 'sm' }: AvatarGroupProps) {
  const shown = users.slice(0, max);
  const extra = users.length - max;

  return (
    <div className="flex items-center">
      {shown.map((user, i) => (
        <div key={i} className="-ml-2 first:ml-0 ring-2 ring-white dark:ring-navy-800 rounded-full">
          <Avatar name={user.name} src={user.src} size={size} shape="circle" />
        </div>
      ))}
      {extra > 0 && (
        <div className={cn(
          '-ml-2 ring-2 ring-white dark:ring-navy-800 rounded-full flex items-center justify-center bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300 font-bold',
          SIZES[size],
        )}>
          +{extra}
        </div>
      )}
    </div>
  );
}
