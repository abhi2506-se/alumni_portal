'use client';
// app/(dashboard)/dashboard/events/page.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Video, Tag, ChevronRight, Plus, Check, X } from 'lucide-react';
import { cn, formatDate, formatDateTime } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

const MOCK_EVENTS = [
  {
    id: 'e1',
    title: 'Tech Summit 2024 – Future of AI',
    description: 'Join 200+ alumni and industry leaders for a full-day conference on the future of AI and its impact on careers. Featuring keynotes, workshops, and networking sessions.',
    startDate: new Date('2024-12-22T09:00:00'),
    endDate:   new Date('2024-12-22T18:00:00'),
    location: 'GEC Rajkot Auditorium',
    isVirtual: false,
    status: 'UPCOMING',
    capacity: 250,
    tags: ['AI', 'Technology', 'Networking'],
    rsvpCount: 145,
    userRSVPd: false,
    banner: null,
  },
  {
    id: 'e2',
    title: 'Alumni Virtual Meetup – December',
    description: 'Monthly virtual meetup for all alumni worldwide. Share updates, discuss opportunities, and reconnect with batchmates.',
    startDate: new Date('2024-12-28T18:00:00'),
    endDate:   new Date('2024-12-28T20:00:00'),
    location: 'Google Meet',
    isVirtual: true,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'UPCOMING',
    capacity: 100,
    tags: ['Networking', 'Virtual'],
    rsvpCount: 67,
    userRSVPd: true,
    banner: null,
  },
  {
    id: 'e3',
    title: 'Mock Interview Workshop',
    description: 'Hands-on mock interview session with alumni from top tech companies. Get real feedback on your technical and behavioral skills.',
    startDate: new Date('2025-01-05T10:00:00'),
    endDate:   new Date('2025-01-05T13:00:00'),
    location: 'CS Department Lab',
    isVirtual: false,
    status: 'UPCOMING',
    capacity: 40,
    tags: ['Interview', 'Career', 'Workshop'],
    rsvpCount: 38,
    userRSVPd: false,
    banner: null,
  },
  {
    id: 'e4',
    title: 'Annual Alumni Reunion',
    description: 'The biggest event of the year – annual alumni reunion with cultural programs, dinner, and awards for outstanding alumni.',
    startDate: new Date('2025-01-15T17:00:00'),
    endDate:   new Date('2025-01-15T22:00:00'),
    location: 'Hotel Regenta, Rajkot',
    isVirtual: false,
    status: 'UPCOMING',
    capacity: 500,
    tags: ['Reunion', 'Annual', 'Cultural'],
    rsvpCount: 312,
    userRSVPd: true,
    banner: null,
  },
];

type FilterType = 'ALL' | 'UPCOMING' | 'VIRTUAL' | 'RSVPD';

function EventCard({ event, onRSVP }: { event: typeof MOCK_EVENTS[0]; onRSVP: (id: string) => void }) {
  const isFull = event.rsvpCount >= (event.capacity ?? Infinity);
  const fillPercent = event.capacity ? Math.round((event.rsvpCount / event.capacity) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow group"
    >
      {/* Banner / gradient header */}
      <div className={cn(
        'h-24 relative overflow-hidden',
        event.tags.includes('AI') ? 'bg-gradient-to-r from-blue-600 to-violet-600' :
        event.isVirtual ? 'bg-gradient-to-r from-teal-500 to-cyan-500' :
        event.tags.includes('Reunion') ? 'bg-gradient-to-r from-gold-500 to-orange-500' :
        'bg-gradient-to-r from-navy-600 to-navy-800',
      )}>
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute bottom-3 left-4 flex items-center gap-2 flex-wrap">
          {event.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium backdrop-blur-sm">
              {tag}
            </span>
          ))}
          {event.isVirtual && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-400/30 text-white font-medium backdrop-blur-sm flex items-center gap-1">
              <Video className="w-3 h-3" /> Virtual
            </span>
          )}
        </div>
        {event.userRSVPd && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display font-semibold text-navy-900 dark:text-white text-base mb-2 leading-tight">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>

        {/* Meta */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-navy-500" />
            <span>{formatDateTime(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-navy-500" />
            <span>{formatDateTime(event.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-navy-500" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Capacity bar */}
        {event.capacity && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-3.5 h-3.5" /> {event.rsvpCount} / {event.capacity} spots
              </span>
              <span className={cn('font-medium', isFull ? 'text-red-500' : fillPercent > 80 ? 'text-orange-500' : 'text-green-600')}>
                {isFull ? 'Full' : `${fillPercent}%`}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-navy-100 dark:bg-navy-700">
              <div
                className={cn('h-1.5 rounded-full transition-all duration-500', isFull ? 'bg-red-500' : fillPercent > 80 ? 'bg-orange-500' : 'bg-green-500')}
                style={{ width: `${Math.min(fillPercent, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onRSVP(event.id)}
            disabled={isFull && !event.userRSVPd}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2',
              event.userRSVPd
                ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 group'
                : isFull
                ? 'bg-navy-100 text-navy-400 cursor-not-allowed'
                : 'btn-primary',
            )}
          >
            {event.userRSVPd ? (
              <>
                <Check className="w-4 h-4 group-hover:hidden" />
                <X className="w-4 h-4 hidden group-hover:block" />
                <span className="group-hover:hidden">Going</span>
                <span className="hidden group-hover:block">Cancel</span>
              </>
            ) : isFull ? (
              'Event Full'
            ) : (
              'RSVP Now'
            )}
          </button>
          {event.isVirtual && event.userRSVPd && (
            <a
              href={event.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-teal-100 text-teal-700 text-sm font-medium hover:bg-teal-200 transition-colors flex items-center gap-1"
            >
              <Video className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [filter, setFilter] = useState<FilterType>('ALL');

  const filtered = events.filter(e => {
    if (filter === 'VIRTUAL')   return e.isVirtual;
    if (filter === 'RSVPD')     return e.userRSVPd;
    if (filter === 'UPCOMING')  return e.status === 'UPCOMING';
    return true;
  });

  function toggleRSVP(id: string) {
    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      const willRSVP = !e.userRSVPd;
      toast.success(willRSVP ? '🎉 RSVP confirmed!' : 'RSVP cancelled');
      return { ...e, userRSVPd: willRSVP, rsvpCount: e.rsvpCount + (willRSVP ? 1 : -1) };
    }));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Webinars, workshops, reunions & more</p>
        </div>
      </div>

      {/* My RSVPs summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Registered Events', value: events.filter(e => e.userRSVPd).length.toString(), color: 'bg-green-500' },
          { label: 'Upcoming This Month', value: events.filter(e => e.status === 'UPCOMING').length.toString(), color: 'bg-blue-500' },
          { label: 'Virtual Events', value: events.filter(e => e.isVirtual).length.toString(), color: 'bg-teal-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.color)}>
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-display font-bold text-navy-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white dark:bg-navy-800 border border-border rounded-2xl p-1 w-fit">
        {(['ALL', 'UPCOMING', 'VIRTUAL', 'RSVPD'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize',
              filter === f ? 'bg-navy-700 text-white' : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white',
            )}
          >
            {f === 'RSVPD' ? "My RSVPs" : f.toLowerCase().replace(/^\w/, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Events grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map(event => (
            <EventCard key={event.id} event={event} onRSVP={toggleRSVP} />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-navy-800 rounded-2xl border border-border">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-navy-900 dark:text-white">No events found</p>
          <p className="text-sm text-muted-foreground mt-1">Check back later for new events</p>
        </div>
      )}
    </div>
  );
}
