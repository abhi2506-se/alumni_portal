'use client';
// app/(dashboard)/dashboard/mentorship/page.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Calendar, Clock, MapPin, Users, Search, Filter,
  CheckCircle, ChevronLeft, ChevronRight, X, Send, Award,
  Linkedin, Github, ExternalLink,
} from 'lucide-react';
import { cn, getInitials, generateAvatarColor } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

const MENTORS = [
  {
    id: 'm1', name: 'Arjun Mehta', batch: 2019, department: 'Computer Engineering',
    role: 'Senior Software Engineer', company: 'Google', location: 'Bangalore',
    skills: ['System Design', 'DSA', 'Go', 'Distributed Systems'],
    bio: 'Ex-Amazon, now at Google. 5 years of experience in building large-scale distributed systems. Happy to help with interview prep and career guidance.',
    rating: 4.9, sessions: 48, openSlots: 3,
    availability: { Mon: ['10:00', '14:00'], Wed: ['10:00', '16:00'], Fri: ['11:00', '15:00'] },
    linkedin: '#', github: '#',
  },
  {
    id: 'm2', name: 'Priya Sharma', batch: 2017, department: 'Information Technology',
    role: 'Founder & CEO', company: 'EduStart', location: 'Mumbai',
    skills: ['Startups', 'Product Management', 'Fundraising', 'Growth'],
    bio: 'Built a $5M ARR EdTech startup from scratch. Expert in product strategy, growth hacking, and fundraising from VCs.',
    rating: 4.8, sessions: 62, openSlots: 2,
    availability: { Tue: ['09:00', '13:00'], Thu: ['10:00', '17:00'], Sat: ['10:00', '12:00'] },
    linkedin: '#', github: '#',
  },
  {
    id: 'm3', name: 'Rohan Patel', batch: 2020, department: 'Computer Engineering',
    role: 'Product Manager', company: 'Microsoft', location: 'Hyderabad',
    skills: ['Product Strategy', 'SQL', 'User Research', 'Agile', 'OKRs'],
    bio: 'PM at Microsoft Azure. Previously at startups. Passionate about helping engineers transition to product roles.',
    rating: 4.7, sessions: 31, openSlots: 4,
    availability: { Mon: ['16:00', '18:00'], Fri: ['09:00', '11:00', '15:00'] },
    linkedin: '#', github: '#',
  },
  {
    id: 'm4', name: 'Ananya Singh', batch: 2018, department: 'Electronics',
    role: 'ML Research Scientist', company: 'DeepMind', location: 'London',
    skills: ['Machine Learning', 'Deep Learning', 'Research', 'Python', 'PyTorch'],
    bio: 'Published 12 ML papers. Working on AI safety at DeepMind. Can mentor on ML career paths, research, and applying to top AI labs.',
    rating: 5.0, sessions: 27, openSlots: 1,
    availability: { Sat: ['14:00', '16:00', '18:00'] },
    linkedin: '#', github: '#',
  },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function MentorCard({ mentor, onBook }: { mentor: typeof MENTORS[0]; onBook: (m: typeof MENTORS[0]) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow group card-hover"
    >
      <div className="flex items-start gap-4">
        <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0', generateAvatarColor(mentor.name))}>
          {getInitials(mentor.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-navy-900 dark:text-white">{mentor.name}</h3>
              <p className="text-sm text-muted-foreground">{mentor.role} · {mentor.company}</p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {mentor.location} · Batch {mentor.batch}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                <span className="text-sm font-bold text-navy-900 dark:text-white">{mentor.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">{mentor.sessions} sessions</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-2">{mentor.bio}</p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {mentor.skills.map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-lg bg-navy-50 dark:bg-navy-700 text-navy-600 dark:text-navy-300">
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {mentor.openSlots} slot{mentor.openSlots !== 1 ? 's' : ''} available
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {mentor.sessions} mentees helped
              </span>
            </div>
            <button
              onClick={() => onBook(mentor)}
              className="btn-primary text-xs py-2 px-4 rounded-xl"
            >
              Book Session
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BookingModal({ mentor, onClose }: { mentor: typeof MENTORS[0]; onClose: () => void }) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<'schedule' | 'details' | 'confirm'>('schedule');
  const [loading, setLoading] = useState(false);

  async function confirm() {
    if (!topic.trim()) { toast.error('Please add a topic'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200)); // Simulate API
      toast.success('Mentorship session booked! Email sent to both parties.');
      onClose();
    } finally {
      setLoading(false);
    }
  }

  const availableDays = Object.keys(mentor.availability);
  const availableTimes = selectedDay ? (mentor.availability as any)[selectedDay] ?? [] : [];

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
        className="w-full max-w-xl bg-white dark:bg-navy-900 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold', generateAvatarColor(mentor.name))}>
              {getInitials(mentor.name)}
            </div>
            <div>
              <p className="font-semibold text-navy-900 dark:text-white">{mentor.name}</p>
              <p className="text-xs text-muted-foreground">{mentor.role}, {mentor.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 pt-5">
          {['Schedule', 'Details', 'Confirm'].map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                i === ['schedule', 'details', 'confirm'].indexOf(step)
                  ? 'bg-navy-700 text-white'
                  : i < ['schedule', 'details', 'confirm'].indexOf(step)
                  ? 'bg-green-500 text-white'
                  : 'bg-navy-100 dark:bg-navy-700 text-muted-foreground',
              )}>
                {i < ['schedule', 'details', 'confirm'].indexOf(step) ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn('text-xs ml-2', step === s.toLowerCase() ? 'text-navy-900 dark:text-white font-medium' : 'text-muted-foreground')}>
                {s}
              </span>
              {i < 2 && <div className="flex-1 h-px bg-border mx-3" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {step === 'schedule' && (
              <motion.div key="schedule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-navy-900 dark:text-white mb-3">Select a day</p>
                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map(day => {
                      const available = availableDays.includes(day);
                      return (
                        <button
                          key={day}
                          disabled={!available}
                          onClick={() => { setSelectedDay(day); setSelectedTime(null); }}
                          className={cn(
                            'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                            !available ? 'opacity-30 cursor-not-allowed bg-navy-50 dark:bg-navy-800 text-muted-foreground' :
                            selectedDay === day ? 'bg-navy-700 text-white shadow-md' :
                            'bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-700',
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedDay && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-sm font-medium text-navy-900 dark:text-white mb-3">Select a time slot</p>
                    <div className="flex gap-2 flex-wrap">
                      {availableTimes.map((time: string) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                            selectedTime === time
                              ? 'bg-gold-400 text-navy-950 shadow-md'
                              : 'bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-700',
                          )}
                        >
                          <Clock className="w-3.5 h-3.5" /> {time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 'details' && (
              <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-navy-900 dark:text-white block mb-1.5">Session Topic *</label>
                  <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. Google Interview Preparation"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-navy-50 dark:bg-navy-800 text-sm text-navy-900 dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-navy-900 dark:text-white block mb-1.5">Description (optional)</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Share what you'd like to discuss or any specific questions…"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-navy-50 dark:bg-navy-800 text-sm text-navy-900 dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy-300 resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="bg-navy-50 dark:bg-navy-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-navy-500" />
                    <span className="text-muted-foreground">Day:</span>
                    <span className="text-navy-900 dark:text-white font-medium">{selectedDay}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-navy-500" />
                    <span className="text-muted-foreground">Time:</span>
                    <span className="text-navy-900 dark:text-white font-medium">{selectedTime} IST</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-navy-500" />
                    <span className="text-muted-foreground">Topic:</span>
                    <span className="text-navy-900 dark:text-white font-medium">{topic}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-navy-500" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="text-navy-900 dark:text-white font-medium">60 minutes</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  A confirmation email will be sent to both you and {mentor.name}. A Google Meet link will be included.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-3">
          {step !== 'schedule' && (
            <button
              onClick={() => setStep(s => s === 'details' ? 'schedule' : 'details')}
              className="btn-outline flex items-center gap-2 py-3 px-5 rounded-xl text-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button
            onClick={() => {
              if (step === 'schedule') {
                if (!selectedDay || !selectedTime) { toast.error('Please select a day and time'); return; }
                setStep('details');
              } else if (step === 'details') {
                setStep('confirm');
              } else {
                confirm();
              }
            }}
            disabled={loading}
            className="btn-gold flex-1 justify-center py-3 rounded-xl text-sm disabled:opacity-60"
          >
            {loading ? 'Booking…' : step === 'confirm' ? 'Confirm Booking' : 'Continue'}
            {!loading && step !== 'confirm' && <ChevronRight className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MentorshipPage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<typeof MENTORS[0] | null>(null);
  const [skillFilter, setSkillFilter] = useState('');

  const filtered = MENTORS.filter(m => {
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q) ||
      m.skills.some(s => s.toLowerCase().includes(q)) ||
      m.department.toLowerCase().includes(q)
    );
  });

  const ALL_SKILLS = [...new Set(MENTORS.flatMap(m => m.skills))];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Mentorship</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Book 1:1 sessions with experienced alumni</p>
      </div>

      {/* My sessions banner */}
      <div className="bg-gradient-to-r from-navy-700 to-navy-600 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <p className="text-white font-semibold">Your upcoming sessions</p>
          <p className="text-navy-300 text-sm mt-0.5">You have 1 session scheduled</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white text-sm font-medium">Mock Interview</p>
            <p className="text-navy-300 text-xs">with Arjun Mehta · Dec 25, 10:00 AM</p>
          </div>
          <button className="bg-gold-400 text-navy-950 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gold-300 transition-colors">
            View
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search mentors by name, company, skill…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm focus:outline-none focus:ring-2 focus:ring-navy-300 text-navy-900 dark:text-white placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Skill chips */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSearch('')}
          className={cn('text-xs px-3 py-1.5 rounded-full font-medium transition-colors', !search ? 'bg-navy-700 text-white' : 'bg-navy-50 dark:bg-navy-800 text-muted-foreground hover:bg-navy-100')}
        >
          All
        </button>
        {ALL_SKILLS.slice(0, 8).map(skill => (
          <button
            key={skill}
            onClick={() => setSearch(skill)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full font-medium transition-colors',
              search === skill ? 'bg-gold-400 text-navy-950' : 'bg-navy-50 dark:bg-navy-800 text-muted-foreground hover:bg-navy-100 dark:hover:bg-navy-700',
            )}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Mentor list */}
      <div className="space-y-4">
        {filtered.map((mentor, i) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <MentorCard mentor={mentor} onBook={setSelectedMentor} />
          </motion.div>
        ))}
      </div>

      {/* Booking modal */}
      <AnimatePresence>
        {selectedMentor && (
          <BookingModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
