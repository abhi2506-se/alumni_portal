'use client';
// app/(admin)/admin/events/page.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  Calendar, Plus, Edit3, Trash2, Users, MapPin, Video,
  X, Save, Check, Search, Clock,
} from 'lucide-react';
import { eventSchema, type EventInput } from '@/lib/validators';
import { cn, formatDate, formatDateTime } from '@/lib/utils/helpers';

const INIT_EVENTS = [
  {
    id: 'e1', title: 'Tech Summit 2024',       status: 'UPCOMING',   startDate: '2024-12-22T09:00', endDate: '2024-12-22T18:00',
    location: 'GEC Auditorium', isVirtual: false, rsvps: 145, capacity: 250, tags: ['AI', 'Tech'],
  },
  {
    id: 'e2', title: 'Virtual Alumni Meetup',   status: 'UPCOMING',   startDate: '2024-12-28T18:00', endDate: '2024-12-28T20:00',
    location: 'Google Meet', isVirtual: true,  rsvps: 67,  capacity: 100, tags: ['Networking'],
  },
  {
    id: 'e3', title: 'Mock Interview Workshop', status: 'UPCOMING',   startDate: '2025-01-05T10:00', endDate: '2025-01-05T13:00',
    location: 'CS Lab',      isVirtual: false, rsvps: 38,  capacity: 40,  tags: ['Career'],
  },
  {
    id: 'e4', title: 'Resume Workshop',         status: 'COMPLETED',  startDate: '2024-12-15T14:00', endDate: '2024-12-15T17:00',
    location: 'GEC Seminar Hall', isVirtual: false, rsvps: 56, capacity: 80, tags: ['Career'],
  },
  {
    id: 'e5', title: 'Startup Pitch Night',     status: 'COMPLETED',  startDate: '2024-11-28T17:00', endDate: '2024-11-28T21:00',
    location: 'Innovation Hub', isVirtual: false, rsvps: 78, capacity: 100, tags: ['Startup'],
  },
];

function EventForm({ event, onSave, onClose }: {
  event?: typeof INIT_EVENTS[0] | null;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [tags, setTags] = useState<string[]>(event?.tags ?? []);
  const [tagInput, setTagInput] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      title: event.title,
      location: event.location,
      isVirtual: event.isVirtual,
      capacity: event.capacity,
      startDate: event.startDate,
      endDate: event.endDate,
      description: 'Event description here.',
    } : { isVirtual: false },
  });

  const isVirtual = watch('isVirtual');

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags(p => [...p, t]); setTagInput(''); }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-xl bg-white dark:bg-navy-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h3 className="font-display font-bold text-navy-900 dark:text-white">{event ? 'Edit Event' : 'Create New Event'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit(d => onSave({ ...d, tags }))} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">Event Title *</label>
              <input {...register('title')} placeholder="e.g. Annual Alumni Reunion 2025" className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300" />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">Description *</label>
              <textarea {...register('description')} rows={3} placeholder="Describe the event…" className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300 resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">Start Date & Time *</label>
                <input {...register('startDate')} type="datetime-local" className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300" />
              </div>
              <div>
                <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">End Date & Time *</label>
                <input {...register('endDate')} type="datetime-local" className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300" />
              </div>
            </div>

            {/* Virtual toggle */}
            <div className="flex items-center gap-3">
              <input {...register('isVirtual')} type="checkbox" id="isVirtual" className="w-4 h-4 rounded" />
              <label htmlFor="isVirtual" className="text-sm font-medium text-navy-700 dark:text-navy-200 cursor-pointer">Virtual Event (online)</label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">
                  {isVirtual ? 'Platform' : 'Venue'} *
                </label>
                <div className="relative">
                  {isVirtual ? <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /> : <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />}
                  <input {...register('location')} placeholder={isVirtual ? 'Google Meet / Zoom' : 'GEC Auditorium'} className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">Capacity</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input {...register('capacity')} type="number" placeholder="250" className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300" />
                </div>
              </div>
            </div>

            {isVirtual && (
              <div>
                <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">Meeting Link</label>
                <input {...register('meetLink')} placeholder="https://meet.google.com/abc-defg-hij" className="w-full px-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300" />
              </div>
            )}

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-navy-700 dark:text-navy-200 block mb-1.5">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200 text-xs rounded-lg">
                    {t} <button type="button" onClick={() => setTags(p => p.filter(x => x !== t))}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="Add tag (e.g. AI, Networking)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-300"
                />
                <button type="button" onClick={addTag} className="px-4 py-2.5 rounded-xl border border-border hover:bg-navy-50 dark:hover:bg-navy-700 text-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-sm hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> {event ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState(INIT_EVENTS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<typeof INIT_EVENTS[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');

  const filtered = events.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleSave(data: any) {
    if (editing) {
      setEvents(prev => prev.map(e => e.id === editing.id ? { ...e, ...data } : e));
      toast.success('Event updated!');
    } else {
      setEvents(prev => [...prev, { id: `e${Date.now()}`, ...data, rsvps: 0, status: 'UPCOMING' }]);
      toast.success('Event created!');
    }
    setShowForm(false);
    setEditing(null);
  }

  function deleteEvent(id: string) {
    setEvents(prev => prev.filter(e => e.id !== id));
    toast.success('Event deleted');
  }

  function cancelEvent(id: string) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'CANCELLED' } : e));
    toast('Event cancelled', { icon: '⚠️' });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Event Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create, edit, and manage alumni events</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="btn-gold text-sm py-2.5 px-4 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Upcoming', value: events.filter(e => e.status === 'UPCOMING').length,  color: 'bg-blue-500'  },
          { label: 'Completed', value: events.filter(e => e.status === 'COMPLETED').length, color: 'bg-green-500' },
          { label: 'Total RSVPs', value: events.reduce((s, e) => s + e.rsvps, 0),           color: 'bg-gold-500'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', color)}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-navy-900 dark:text-white">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…" className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm focus:outline-none focus:ring-2 focus:ring-navy-300 text-navy-900 dark:text-white" />
        </div>
        <div className="flex gap-1 bg-white dark:bg-navy-800 border border-border rounded-xl p-1">
          {(['ALL', 'UPCOMING', 'COMPLETED'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all', statusFilter === s ? 'bg-navy-700 text-white' : 'text-muted-foreground hover:text-navy-900 dark:hover:text-white')}>
              {s.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Events table */}
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Event', 'Date', 'Location', 'RSVPs', 'Status', 'Actions'].map(h => (
                  <th key={h} className="py-3.5 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev, i) => (
                <motion.tr
                  key={ev.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-navy-50/50 dark:hover:bg-navy-700/30 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="text-sm font-medium text-navy-900 dark:text-white">{ev.title}</p>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {ev.tags.map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300">{t}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.startDate.split('T')[0]}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {ev.isVirtual ? <Video className="w-3 h-3 text-teal-500" /> : <MapPin className="w-3 h-3" />}
                      <span className="truncate max-w-24">{ev.location}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-navy-100 dark:bg-navy-700">
                        <div
                          className="h-1.5 rounded-full bg-navy-600"
                          style={{ width: `${Math.min((ev.rsvps / ev.capacity) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{ev.rsvps}/{ev.capacity}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      'text-xs px-2.5 py-1 rounded-full font-medium',
                      ev.status === 'UPCOMING'  ? 'bg-blue-100 text-blue-700' :
                      ev.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      ev.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700',
                    )}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditing(ev as any); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700 text-muted-foreground hover:text-navy-700 dark:hover:text-white transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {ev.status === 'UPCOMING' && (
                        <button onClick={() => cancelEvent(ev.id)} className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-muted-foreground hover:text-orange-600 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => deleteEvent(ev.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No events found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && <EventForm event={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
      </AnimatePresence>
    </div>
  );
}
