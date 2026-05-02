'use client';
// app/(public)/events/page.tsx
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Video, Lock, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn, formatDateTime } from '@/lib/utils/helpers';

const PUBLIC_EVENTS = [
  {
    id: 'e1', title: 'Tech Summit 2024 – Future of AI', tags: ['AI', 'Tech'],
    startDate: new Date('2024-12-22T09:00:00'), endDate: new Date('2024-12-22T18:00:00'),
    location: 'GEC Rajkot Auditorium', isVirtual: false,
    description: 'Full-day conference featuring keynotes from industry leaders, hands-on AI workshops, and a grand networking dinner.',
    rsvpCount: 145, capacity: 250,
    gradient: 'from-blue-600 to-violet-600',
  },
  {
    id: 'e2', title: 'Alumni Virtual Meetup – December', tags: ['Networking'],
    startDate: new Date('2024-12-28T18:00:00'), endDate: new Date('2024-12-28T20:00:00'),
    location: 'Google Meet', isVirtual: true,
    description: 'Monthly virtual meetup for all alumni worldwide. Share updates, discuss opportunities, reconnect with batchmates.',
    rsvpCount: 67, capacity: 100,
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'e3', title: 'Mock Interview Workshop', tags: ['Career', 'Workshop'],
    startDate: new Date('2025-01-05T10:00:00'), endDate: new Date('2025-01-05T13:00:00'),
    location: 'CS Department Lab', isVirtual: false,
    description: 'Hands-on mock interview session with alumni from top tech companies. Get real feedback on technical and behavioral skills.',
    rsvpCount: 38, capacity: 40,
    gradient: 'from-green-500 to-teal-500',
  },
  {
    id: 'e4', title: 'Annual Alumni Reunion', tags: ['Reunion', 'Cultural'],
    startDate: new Date('2025-01-15T17:00:00'), endDate: new Date('2025-01-15T22:00:00'),
    location: 'Hotel Regenta, Rajkot', isVirtual: false,
    description: 'The biggest event of the year – annual alumni reunion with cultural programs, dinner, and awards for outstanding alumni.',
    rsvpCount: 312, capacity: 500,
    gradient: 'from-gold-500 to-orange-500',
  },
];

export default function PublicEventsPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream-50 dark:bg-navy-950 pt-24 pb-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gold-500 font-medium text-sm uppercase tracking-widest mb-3"
            >
              Alumni Events
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-4"
            >
              Events & Gatherings
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-xl mx-auto"
            >
              Connect, learn, and grow with the alumni community through our curated events.
            </motion.p>
          </div>

          {/* Events grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {PUBLIC_EVENTS.map((event, i) => {
              const fillPct = event.capacity ? Math.round((event.rsvpCount / event.capacity) * 100) : 0;
              const isFull = fillPct >= 100;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Banner */}
                  <div className={cn('h-28 bg-gradient-to-r relative', event.gradient)}>
                    <div className="absolute inset-0 dot-pattern opacity-20" />
                    <div className="absolute bottom-3 left-4 flex gap-2 flex-wrap">
                      {event.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm font-medium">
                          {t}
                        </span>
                      ))}
                      {event.isVirtual && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-400/30 text-white backdrop-blur-sm font-medium flex items-center gap-1">
                          <Video className="w-3 h-3" /> Virtual
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display font-semibold text-xl text-navy-900 dark:text-white mb-3 leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-navy-400" />
                        {formatDateTime(event.startDate)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-navy-400" />
                        {event.location}
                      </div>
                    </div>

                    {/* Capacity */}
                    {event.capacity && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" /> {event.rsvpCount} / {event.capacity}
                          </span>
                          <span className={cn('font-medium', isFull ? 'text-red-500' : fillPct > 80 ? 'text-orange-500' : 'text-green-600')}>
                            {isFull ? 'Full' : `${fillPct}% filled`}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-navy-100 dark:bg-navy-700">
                          <div
                            className={cn('h-1.5 rounded-full', isFull ? 'bg-red-500' : fillPct > 80 ? 'bg-orange-500' : 'bg-green-500')}
                            style={{ width: `${Math.min(fillPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    {isLoggedIn ? (
                      <Link
                        href="/dashboard/events"
                        className="btn-primary w-full justify-center text-sm py-2.5 rounded-xl"
                      >
                        RSVP in Dashboard <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className="btn-outline w-full justify-center text-sm py-2.5 rounded-xl flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" /> Login to RSVP
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA banner */}
          {!isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 max-w-2xl mx-auto text-center bg-gradient-to-r from-navy-700 to-navy-600 rounded-3xl p-8 text-white"
            >
              <h2 className="font-display text-2xl font-bold mb-2">Join the Community</h2>
              <p className="text-navy-200 mb-6">Create an account to RSVP for events, connect with alumni, and access all features.</p>
              <div className="flex gap-3 justify-center">
                <Link href="/register" className="btn-gold px-6 py-3 rounded-xl text-sm">
                  Join Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="btn-outline border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl text-sm">
                  Login
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
