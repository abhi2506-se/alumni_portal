'use client';
// app/(public)/alumni/page.tsx - Public Alumni Directory
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Briefcase, Filter, Star, Linkedin, Github,
  ExternalLink, UserPlus, Lock, ChevronDown, X,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn, getInitials, generateAvatarColor } from '@/lib/utils/helpers';

const ALUMNI_DATA = [
  {
    id: 'a1', name: 'Arjun Mehta', batch: 2019, dept: 'Computer Engineering',
    role: 'Senior Software Engineer', company: 'Google', city: 'Bangalore', country: 'India',
    skills: ['Go', 'Kubernetes', 'System Design', 'Python'],
    openToMentor: true, bio: 'Building distributed systems at scale.',
    linkedinUrl: '#', githubUrl: '#',
  },
  {
    id: 'a2', name: 'Priya Sharma', batch: 2017, dept: 'Information Technology',
    role: 'Founder & CEO', company: 'EduStart', city: 'Mumbai', country: 'India',
    skills: ['Startups', 'Product', 'Fundraising', 'Growth'],
    openToMentor: true, bio: 'Building the future of education in India.',
    linkedinUrl: '#', githubUrl: null,
  },
  {
    id: 'a3', name: 'Rohan Patel', batch: 2020, dept: 'Computer Engineering',
    role: 'Product Manager', company: 'Microsoft', city: 'Hyderabad', country: 'India',
    skills: ['Product Strategy', 'SQL', 'User Research', 'Agile'],
    openToMentor: true, bio: 'Shaping the future of enterprise products.',
    linkedinUrl: '#', githubUrl: '#',
  },
  {
    id: 'a4', name: 'Ananya Singh', batch: 2018, dept: 'Electronics',
    role: 'ML Research Scientist', company: 'DeepMind', city: 'London', country: 'UK',
    skills: ['Machine Learning', 'PyTorch', 'Research', 'AI Safety'],
    openToMentor: false, bio: 'Working on making AI safe and beneficial.',
    linkedinUrl: '#', githubUrl: '#',
  },
  {
    id: 'a5', name: 'Vikram Shah', batch: 2019, dept: 'Information Technology',
    role: 'Staff Engineer', company: 'Zomato', city: 'Bangalore', country: 'India',
    skills: ['Backend', 'PostgreSQL', 'Redis', 'Microservices'],
    openToMentor: false, bio: 'Scaling food delivery infrastructure.',
    linkedinUrl: '#', githubUrl: '#',
  },
  {
    id: 'a6', name: 'Kavya Reddy', batch: 2021, dept: 'Computer Engineering',
    role: 'UI/UX Designer', company: 'Razorpay', city: 'Bangalore', country: 'India',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
    openToMentor: true, bio: 'Designing delightful payment experiences.',
    linkedinUrl: '#', githubUrl: null,
  },
];

const DEPARTMENTS = ['All', 'Computer Engineering', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
const COMPANIES = ['All', 'Google', 'Microsoft', 'Amazon', 'Flipkart', 'Zomato', 'Razorpay'];
const BATCHES = ['All', ...Array.from({ length: 10 }, (_, i) => String(2024 - i))];

function AlumniCard({ alumni, isLoggedIn }: { alumni: typeof ALUMNI_DATA[0]; isLoggedIn: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5 hover:shadow-lg transition-shadow group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0',
            generateAvatarColor(alumni.name),
          )}>
            {getInitials(alumni.name)}
          </div>
          <div>
            {isLoggedIn ? (
              <Link href={`/dashboard/alumni/${alumni.id}`} className="font-semibold text-navy-900 dark:text-white hover:text-navy-600 dark:hover:text-gold-400 transition-colors">
                {alumni.name}
              </Link>
            ) : (
              <p className="font-semibold text-navy-900 dark:text-white">{alumni.name}</p>
            )}
            <p className="text-xs text-muted-foreground">Batch {alumni.batch} · {alumni.dept}</p>
          </div>
        </div>
        {alumni.openToMentor && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-gold-100 text-gold-700 font-medium flex items-center gap-1 flex-shrink-0">
            <Star className="w-3 h-3 fill-gold-500" /> Mentor
          </span>
        )}
      </div>

      {/* Role & location */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-navy-700 dark:text-navy-200">
          <Briefcase className="w-3.5 h-3.5 text-navy-400" />
          <span className="font-medium">{alumni.role}</span>
          <span className="text-muted-foreground">@ {alumni.company}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          {alumni.city}, {alumni.country}
        </div>
      </div>

      {/* Bio - only for logged in users */}
      {isLoggedIn ? (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{alumni.bio}</p>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 py-2 px-3 rounded-xl bg-navy-50 dark:bg-navy-700">
          <Lock className="w-3.5 h-3.5" />
          <span>Login to view full profile and contact details</span>
        </div>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {alumni.skills.slice(0, isLoggedIn ? 4 : 2).map(s => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-lg bg-navy-50 dark:bg-navy-700 text-navy-600 dark:text-navy-300">
            {s}
          </span>
        ))}
        {!isLoggedIn && alumni.skills.length > 2 && (
          <span className="text-xs px-2 py-0.5 rounded-lg bg-navy-50 dark:bg-navy-700 text-muted-foreground">
            +{alumni.skills.length - 2} more
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <Link
              href={`/dashboard/messages?connect=${alumni.id}`}
              className="flex-1 btn-primary text-xs py-2 px-3 rounded-xl justify-center"
            >
              <UserPlus className="w-3.5 h-3.5" /> Connect
            </Link>
            {alumni.openToMentor && (
              <Link
                href={`/dashboard/mentorship?mentor=${alumni.id}`}
                className="btn-gold text-xs py-2 px-3 rounded-xl flex items-center gap-1"
              >
                <Star className="w-3.5 h-3.5" /> Mentor
              </Link>
            )}
            <div className="flex gap-1 ml-auto">
              {alumni.linkedinUrl && (
                <a href={alumni.linkedinUrl} className="p-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700 text-muted-foreground hover:text-blue-600 transition-colors">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {alumni.githubUrl && (
                <a href={alumni.githubUrl} className="p-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700 text-muted-foreground hover:text-navy-900 dark:hover:text-white transition-colors">
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </>
        ) : (
          <Link href="/login" className="flex-1 btn-outline text-xs py-2.5 rounded-xl justify-center flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Login to Connect
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function AlumniDirectoryPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [batch, setBatch] = useState('All');
  const [mentorOnly, setMentorOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = ALUMNI_DATA.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.company.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) || a.skills.some(s => s.toLowerCase().includes(q));
    const matchDept = dept === 'All' || a.dept === dept;
    const matchBatch = batch === 'All' || a.batch === Number(batch);
    const matchMentor = !mentorOnly || a.openToMentor;
    return matchSearch && matchDept && matchBatch && matchMentor;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream-50 dark:bg-navy-950 pt-24 pb-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-3"
            >
              Alumni Directory
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-xl mx-auto"
            >
              Connect with 5,000+ professionals from our alumni network
            </motion.p>
            {!isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 text-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <Link href="/login" className="text-navy-700 dark:text-navy-300">
                  <span className="text-navy-900 dark:text-white font-medium">Login</span> to view full profiles and connect
                </Link>
              </motion.div>
            )}
          </div>

          {/* Search + filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, company, role, skills…"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-navy-800 text-sm focus:outline-none focus:ring-2 focus:ring-navy-300 text-navy-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(p => !p)}
              className={cn('btn-outline flex items-center gap-2 text-sm py-3 px-4 rounded-xl', showFilters && 'bg-navy-50 dark:bg-navy-700')}
            >
              <Filter className="w-4 h-4" /> Filters
              {(dept !== 'All' || batch !== 'All' || mentorOnly) && (
                <span className="w-4 h-4 rounded-full bg-navy-700 text-white text-[10px] flex items-center justify-center">
                  {[dept !== 'All', batch !== 'All', mentorOnly].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-navy-800 rounded-2xl border border-border p-5 mb-4"
            >
              <div className="flex flex-wrap gap-6 items-end">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">Department</label>
                  <select
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-border bg-white dark:bg-navy-700 text-sm text-navy-900 dark:text-white focus:outline-none"
                  >
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">Batch Year</label>
                  <select
                    value={batch}
                    onChange={e => setBatch(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-border bg-white dark:bg-navy-700 text-sm text-navy-900 dark:text-white focus:outline-none"
                  >
                    {BATCHES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setMentorOnly(p => !p)}
                    className={cn('w-11 h-6 rounded-full transition-colors relative', mentorOnly ? 'bg-gold-500' : 'bg-navy-200 dark:bg-navy-600')}
                  >
                    <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-all', mentorOnly ? 'left-6' : 'left-1')} />
                  </div>
                  <span className="text-sm font-medium text-navy-700 dark:text-navy-200">Mentors only</span>
                </label>
                <button
                  onClick={() => { setDept('All'); setBatch('All'); setMentorOnly(false); }}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </motion.div>
          )}

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-5">
            Showing {filtered.length} of {ALUMNI_DATA.length} alumni
          </p>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((alumni, i) => (
              <motion.div
                key={alumni.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AlumniCard alumni={alumni} isLoggedIn={isLoggedIn} />
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-navy-800 rounded-2xl border border-border">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-navy-900 dark:text-white">No alumni found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
