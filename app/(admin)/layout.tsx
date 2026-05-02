'use client';
// app/(admin)/layout.tsx
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, user, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-navy-200 border-t-navy-600 animate-spin" />
      </div>
    );
  }

  if (user?.role !== 'ADMIN') return null;

  return <>{children}</>;
}
