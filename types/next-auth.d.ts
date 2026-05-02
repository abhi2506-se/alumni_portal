// types/next-auth.d.ts
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'STUDENT' | 'ALUMNI' | 'ADMIN';
      status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    };
  }
  interface User {
    id: string;
    role: 'STUDENT' | 'ALUMNI' | 'ADMIN';
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'STUDENT' | 'ALUMNI' | 'ADMIN';
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  }
}
