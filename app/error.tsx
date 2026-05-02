'use client';
// app/error.tsx
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div className="relative text-center space-y-6 max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 rounded-3xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto"
        >
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="font-display text-3xl font-bold text-white">Something went wrong</h1>
          <p className="text-navy-400 mt-3 text-sm">An unexpected error occurred. Our team has been notified.</p>
          {error.digest && <p className="text-navy-600 text-xs mt-2 font-mono">Error ID: {error.digest}</p>}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-outline border-white/20 text-white hover:bg-white/10 px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link href="/" className="btn-gold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <Home className="w-4 h-4" /> Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
