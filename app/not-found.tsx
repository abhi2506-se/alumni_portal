'use client';
// app/not-found.tsx
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-navy-600/10 blur-[120px]" />
      </div>

      <div className="relative text-center space-y-6 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-navy-700 to-navy-800 border border-navy-600 flex items-center justify-center mx-auto"
        >
          <GraduationCap className="w-12 h-12 text-gold-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="font-display text-8xl font-bold text-white/10 leading-none select-none">404</p>
          <h1 className="font-display text-3xl font-bold text-white -mt-6">Page Not Found</h1>
          <p className="text-navy-400 mt-3">The page you're looking for doesn't exist or has been moved.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 justify-center"
        >
          <button onClick={() => history.back()} className="btn-outline border-white/20 text-white hover:bg-white/10 px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link href="/" className="btn-gold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
            <Home className="w-4 h-4" /> Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
